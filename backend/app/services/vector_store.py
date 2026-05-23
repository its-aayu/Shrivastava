"""
Vector Store — lightweight JSON file backend.

Stores chunks + 384-dim embeddings in backend/app/data/vector_store.json.
Cosine similarity search via numpy.

Replace with pgvector or ChromaDB in Phase 4.
"""

from __future__ import annotations

import json
import uuid
from pathlib import Path

import numpy as np

STORE_FILE = Path(__file__).parent.parent / "data" / "vector_store.json"


# ── I/O helpers ────────────────────────────────────────────────────────────────

def _load() -> list[dict]:
    if STORE_FILE.exists():
        try:
            return json.loads(STORE_FILE.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            return []
    return []


def _save(chunks: list[dict]) -> None:
    STORE_FILE.parent.mkdir(parents=True, exist_ok=True)
    STORE_FILE.write_text(
        json.dumps(chunks, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )


# ── Public API ─────────────────────────────────────────────────────────────────

def add_chunks(
    doc_id: str,
    chunks: list[str],
    embeddings: list[list[float]],
    metadata: dict | None = None,
) -> int:
    """Append chunks + embeddings to the store. Returns count added."""
    store = _load()
    for i, (text, embedding) in enumerate(zip(chunks, embeddings)):
        store.append({
            "id": str(uuid.uuid4()),
            "doc_id": doc_id,
            "text": text,
            "embedding": embedding,
            "metadata": {**(metadata or {}), "chunk_index": i},
        })
    _save(store)
    return len(chunks)


def search(
    query_embedding: list[float],
    top_k: int = 4,
    threshold: float = 0.25,
) -> list[dict]:
    """Return top-k chunks with cosine similarity ≥ threshold."""
    store = _load()
    if not store:
        return []

    q = np.array(query_embedding, dtype=np.float32)
    q_norm = float(np.linalg.norm(q))
    if q_norm == 0:
        return []

    scored: list[dict] = []
    for chunk in store:
        e = np.array(chunk["embedding"], dtype=np.float32)
        e_norm = float(np.linalg.norm(e))
        if e_norm == 0:
            continue
        score = float(np.dot(q, e) / (q_norm * e_norm))
        if score >= threshold:
            scored.append({**chunk, "score": score})

    return sorted(scored, key=lambda x: x["score"], reverse=True)[:top_k]


def delete_doc(doc_id: str) -> int:
    """Remove all chunks for a doc. Returns number deleted."""
    store = _load()
    before = len(store)
    store = [c for c in store if c["doc_id"] != doc_id]
    _save(store)
    return before - len(store)


def chunk_count() -> int:
    return len(_load())


def doc_ids() -> list[str]:
    return list({c["doc_id"] for c in _load()})
