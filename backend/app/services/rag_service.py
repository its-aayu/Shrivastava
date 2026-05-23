"""
RAG Service — real implementation.

Flow
────
Ingest:   file → extract_text → chunk_document → generate_embeddings → store_vectors
Retrieve: query → embed_query → cosine search → top-k chunks
Generate: chunks + user_message → LLM (OpenAI) or context-only fallback
"""

import json
from pathlib import Path

_CHAT_PROMPTS_FILE = (
    Path(__file__).parent.parent.parent.parent / "src" / "mock-data" / "chat-prompts.json"
)


# ── Config helpers ─────────────────────────────────────────────────────────────

def load_chat_config() -> dict:
    with open(_CHAT_PROMPTS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def get_system_prompt() -> str:
    return load_chat_config().get("system_prompt", "")


def get_fallback_response() -> str:
    import random
    responses = load_chat_config().get(
        "fallback_responses",
        ["I'm not sure about that. Please contact the studio."],
    )
    return random.choice(responses)


# ── Ingestion pipeline ─────────────────────────────────────────────────────────

def extract_text(file_path: str) -> str:
    """Extract plain text from a PDF or image file."""
    from app.services.document_processor import extract_text_from_file
    return extract_text_from_file(file_path)


def chunk_document(text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:
    """
    Split text into overlapping token windows.
    Uses tiktoken (cl100k_base); falls back to character-based splitting.
    """
    if not text.strip():
        return []
    try:
        import tiktoken
        enc = tiktoken.get_encoding("cl100k_base")
        tokens = enc.encode(text)
        if not tokens:
            return []
        step = max(1, chunk_size - overlap)
        return [enc.decode(tokens[i: i + chunk_size]) for i in range(0, len(tokens), step)]
    except ImportError:
        char_size = chunk_size * 4
        char_step = max(1, char_size - overlap * 4)
        return [text[i: i + char_size] for i in range(0, len(text), char_step)]


def generate_embeddings(chunks: list[str]) -> list[list[float]]:
    """Embed chunks using the local sentence-transformers model."""
    if not chunks:
        return []
    from app.services.embedding_service import embed_texts
    return embed_texts(chunks)


def store_vectors(
    doc_id: str,
    chunks: list[str],
    embeddings: list[list[float]],
    metadata: dict | None = None,
) -> int:
    """Persist chunks + embeddings to the JSON vector store."""
    from app.services.vector_store import add_chunks
    return add_chunks(doc_id, chunks, embeddings, metadata)


def ingest_document(
    doc_id: str,
    file_path: str,
    metadata: dict | None = None,
    db=None,
) -> dict:
    """
    Full ingestion pipeline: extract → chunk → embed → store.
    Returns a status dict safe to log or return in an API response.
    """
    text = extract_text(file_path)
    if not text.strip():
        return {"doc_id": doc_id, "status": "error", "message": "No text extracted", "chunks": 0}

    chunks = chunk_document(text)
    if not chunks:
        return {"doc_id": doc_id, "status": "error", "message": "Chunking produced no output", "chunks": 0}

    embeddings = generate_embeddings(chunks)
    stored = store_vectors(doc_id, chunks, embeddings, metadata)

    return {
        "doc_id": doc_id,
        "status": "success",
        "chunks": stored,
        "text_length": len(text),
    }


# ── Retrieval ──────────────────────────────────────────────────────────────────

def retrieve_context(query: str, db=None, top_k: int = 4) -> list[dict]:
    """Embed the query, run cosine similarity search, return top-k chunks."""
    try:
        from app.services.embedding_service import embed_query
        from app.services.vector_store import search
        return search(embed_query(query), top_k=top_k)
    except Exception:
        return []


def build_prompt_with_context(user_message: str, context_chunks: list[dict]) -> str:
    """Inject retrieved chunks into the prompt template from chat-prompts.json."""
    config = load_chat_config()
    template = config.get("context_injection_template", "{user_message}")

    if not context_chunks:
        return template.replace("{retrieved_context}", "").replace("{user_message}", user_message)

    context_text = "\n\n".join(c.get("text", "") for c in context_chunks)
    return (
        template
        .replace("{retrieved_context}", context_text)
        .replace("{user_message}", user_message)
    )
