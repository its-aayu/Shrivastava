"""
RAG Service.

Ingestion:  file → extract_text → chunk_document → chroma_service.add_chunks
Retrieval:  query → chroma_service.search  (ChromaDB embeds the query internally)
Generation: chunks + user_message → LLM prompt
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


# ── Text extraction ────────────────────────────────────────────────────────────

def extract_text(file_path: str) -> str:
    from app.services.document_processor import extract_text_from_file
    return extract_text_from_file(file_path)


# ── Chunking ───────────────────────────────────────────────────────────────────

def chunk_document(text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:
    """
    Token-based overlapping chunks via tiktoken.
    Falls back to character splitting if tiktoken is unavailable.
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


# ── Ingestion pipeline ─────────────────────────────────────────────────────────

def ingest_document(
    doc_id: str,
    file_path: str,
    metadata: dict | None = None,
    db=None,
) -> dict:
    """
    Full pipeline: extract → chunk → store in ChromaDB.
    ChromaDB handles embedding automatically — no separate embed step needed.
    Returns a status dict safe to log or return in an API response.
    """
    text = extract_text(file_path)
    if not text.strip():
        return {"doc_id": doc_id, "status": "error", "message": "No text extracted", "chunks": 0}

    chunks = chunk_document(text)
    if not chunks:
        return {"doc_id": doc_id, "status": "error", "message": "Chunking produced no output", "chunks": 0}

    from app.services.chroma_service import add_chunks
    stored = add_chunks(doc_id, chunks, metadata)

    return {
        "doc_id": doc_id,
        "status": "success",
        "chunks": stored,
        "text_length": len(text),
    }


# ── Retrieval ──────────────────────────────────────────────────────────────────

def retrieve_context(query: str, db=None, top_k: int = 4) -> list[dict]:
    """Semantic search via ChromaDB. Returns top-k chunks with scores + source info."""
    try:
        from app.services.chroma_service import search
        return search(query, top_k=top_k)
    except Exception:
        return []


# ── Prompt building ────────────────────────────────────────────────────────────

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
