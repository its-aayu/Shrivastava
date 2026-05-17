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
