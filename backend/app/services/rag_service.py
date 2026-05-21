"""
RAG Service — Phase 3 placeholder.

Retrieval-Augmented Generation pipeline for the Aayu AI print consultant.

─────────────────────────────────────────────────────────────────────────────
PLANNED FLOW

  1. Ingest
       document (from documents table)
       → chunk (split into ~400-token passages)
       → embed  (OpenAI text-embedding-3-small, 1536 dimensions)
       → store  (pgvector column on documents table OR Pinecone index)

  2. Retrieve (at query time)
       user_message
       → embed query
       → cosine similarity search, top_k = 4 (from chat-prompts.json rag_config)
       → return top matching document chunks

  3. Generate
       retrieved_chunks + user_message
       → inject into chat-prompts.json context_injection_template
       → send to OpenAI Chat Completions (gpt-4o-mini)
       → stream response back to frontend

─────────────────────────────────────────────────────────────────────────────
DEPENDENCIES (add to requirements.txt in Phase 3)
  openai>=1.0.0
  tiktoken          (for accurate token counting when chunking)
  pgvector          (PostgreSQL extension + SQLAlchemy adapter)
  # OR pinecone-client if using managed vector DB

─────────────────────────────────────────────────────────────────────────────
IMPLEMENTATION NOTES
  - Similarity threshold: 0.72 (from chat-prompts.json rag_config)
  - Fallback when no results meet threshold: use chat-prompts.json fallback_responses
  - System prompt: loaded from chat-prompts.json system_prompt field
  - Guardrails: enforced in system prompt, not in code
"""

import json
from pathlib import Path
from typing import Optional

# ── Phase 3 RAG ingestion pipeline ───────────────────────────────────────────
# These stubs define the interface. Replace the bodies in Phase 3.


def extract_text(file_path: str) -> str:
    """
    Extract plain text from an uploaded file.
    Phase 3: use pdfplumber (PDF) or Pillow+pytesseract (images).
    """
    # TODO Phase 3:
    # if file_path.endswith(".pdf"):
    #     import pdfplumber
    #     with pdfplumber.open(file_path) as pdf:
    #         return "\n".join(page.extract_text() or "" for page in pdf.pages)
    # elif file_path.lower().endswith((".png", ".jpg", ".jpeg")):
    #     from PIL import Image
    #     import pytesseract
    #     return pytesseract.image_to_string(Image.open(file_path))
    return ""  # stub


def chunk_document(text: str, chunk_size: int = 400, overlap: int = 50) -> list[str]:
    """
    Split text into overlapping token-sized chunks for embedding.
    Phase 3: use tiktoken for accurate token counting.
    """
    # TODO Phase 3:
    # import tiktoken
    # enc = tiktoken.get_encoding("cl100k_base")
    # tokens = enc.encode(text)
    # chunks = []
    # for i in range(0, len(tokens), chunk_size - overlap):
    #     chunk_tokens = tokens[i : i + chunk_size]
    #     chunks.append(enc.decode(chunk_tokens))
    # return chunks
    return []  # stub


def generate_embeddings(chunks: list[str]) -> list[list[float]]:
    """
    Embed each chunk with OpenAI text-embedding-3-small (1536 dims).
    Phase 3: requires openai>=1.0.0 and OPENAI_API_KEY env var.
    """
    # TODO Phase 3:
    # import openai
    # response = openai.embeddings.create(
    #     input=chunks,
    #     model="text-embedding-3-small",
    # )
    # return [item.embedding for item in response.data]
    return []  # stub


def store_vectors(doc_id: str, embeddings: list[list[float]], db=None) -> None:
    """
    Persist embedding vectors to the documents table (pgvector column).
    Phase 3: requires pgvector extension + Vector(1536) column on Document.
    """
    # TODO Phase 3:
    # from app.models.document import Document
    # doc = db.query(Document).filter(Document.doc_id == doc_id).first()
    # if doc:
    #     doc.embedding = embeddings[0]  # store first chunk; multi-chunk needs separate table
    #     db.commit()
    pass  # stub


def ingest_document(doc_id: str, file_path: str, db=None) -> dict:
    """
    Full ingestion pipeline: extract → chunk → embed → store.
    Returns a status dict. Phase 3: wire up real implementations above.
    """
    text = extract_text(file_path)
    chunks = chunk_document(text)
    embeddings = generate_embeddings(chunks)
    store_vectors(doc_id, embeddings, db)
    return {
        "doc_id": doc_id,
        "chunks": len(chunks),
        "embedded": len(embeddings),
        "status": "stub — Phase 3 not yet implemented",
    }

_CHAT_PROMPTS_FILE = (
    Path(__file__).parent.parent.parent.parent / "src" / "mock-data" / "chat-prompts.json"
)


def load_chat_config() -> dict:
    """Load the AI assistant configuration from chat-prompts.json."""
    with open(_CHAT_PROMPTS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def get_system_prompt() -> str:
    """Return the system prompt for the AI assistant."""
    config = load_chat_config()
    return config.get("system_prompt", "")


def get_fallback_response() -> str:
    """Return a random fallback response for out-of-scope queries."""
    import random
    config = load_chat_config()
    responses = config.get("fallback_responses", ["I'm not sure about that. Please contact the studio."])
    return random.choice(responses)


def retrieve_context(query: str, db=None, top_k: int = 4) -> list[dict]:
    """
    Retrieve relevant document chunks for a user query.
    Phase 3: replace this stub with real embedding + similarity search.
    """
    # TODO Phase 3:
    # query_embedding = openai.embeddings.create(input=query, model="text-embedding-3-small")
    # results = db.execute(
    #     "SELECT doc_id, title, content FROM documents "
    #     "ORDER BY embedding <=> :vec LIMIT :k",
    #     {"vec": query_embedding.data[0].embedding, "k": top_k}
    # )
    # return [{"title": r.title, "content": r.content} for r in results]

    return []  # stub — returns empty until Phase 3


def build_prompt_with_context(user_message: str, context_chunks: list[dict]) -> str:
    """Inject retrieved context chunks into the prompt template."""
    config = load_chat_config()
    template = config.get("context_injection_template", "{user_message}")

    if not context_chunks:
        return template.replace("{retrieved_context}", "").replace("{user_message}", user_message)

    context_text = "\n\n".join(
        f"[{c['title']}]\n{c['content']}" for c in context_chunks
    )
    return (
        template
        .replace("{retrieved_context}", context_text)
        .replace("{user_message}", user_message)
    )
