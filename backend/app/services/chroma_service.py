"""
ChromaDB vector store — replaces vector_store.json.

Persists to backend/app/data/chroma_db/ (survives server restarts).
Uses all-MiniLM-L6-v2 via sentence-transformers (same model as before).
ChromaDB handles embedding internally — no manual embed_texts() call needed.
"""

from __future__ import annotations

import logging
from pathlib import Path

log = logging.getLogger("velora.chroma")

CHROMA_DIR = Path(__file__).parent.parent / "data" / "chroma_db"
COLLECTION_NAME = "velora_docs"
MODEL_NAME = "all-MiniLM-L6-v2"

_collection = None


def _get_collection():
    global _collection
    if _collection is None:
        import chromadb
        from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction

        CHROMA_DIR.mkdir(parents=True, exist_ok=True)
        client = chromadb.PersistentClient(path=str(CHROMA_DIR))
        ef = SentenceTransformerEmbeddingFunction(model_name=MODEL_NAME)
        _collection = client.get_or_create_collection(
            name=COLLECTION_NAME,
            embedding_function=ef,
            metadata={"hnsw:space": "cosine"},
        )
        log.info("[chroma] collection ready — %d chunks", _collection.count())
    return _collection


# ── Write ──────────────────────────────────────────────────────────────────────

def add_chunks(doc_id: str, chunks: list[str], metadata: dict | None = None) -> int:
    """Store chunks for a document. Re-ingesting the same doc_id replaces old chunks."""
    if not chunks:
        return 0

    collection = _get_collection()

    # Remove stale chunks for this document before re-adding
    _delete_by_doc(collection, doc_id)

    ids = [f"{doc_id}_chunk_{i}" for i in range(len(chunks))]
    metas = [
        {**(metadata or {}), "doc_id": doc_id, "chunk_index": i}
        for i in range(len(chunks))
    ]

    collection.add(documents=chunks, ids=ids, metadatas=metas)
    log.info("[chroma] stored %d chunks for doc=%s", len(chunks), doc_id)
    return len(chunks)


# ── Read ───────────────────────────────────────────────────────────────────────

def search(query: str, top_k: int = 4, filters: dict | None = None) -> list[dict]:
    """
    Semantic search. Returns top-k chunks sorted by cosine similarity.
    Each result: {text, score, doc_id, source, metadata}
    """
    collection = _get_collection()
    total = collection.count()
    if total == 0:
        return []

    n = min(top_k, total)
    kwargs: dict = {
        "query_texts": [query],
        "n_results": n,
        "include": ["documents", "metadatas", "distances"],
    }
    if filters:
        kwargs["where"] = filters

    try:
        results = collection.query(**kwargs)
    except Exception as exc:
        log.warning("[chroma] search error: %s", exc)
        return []

    output = []
    for text, meta, dist in zip(
        results["documents"][0],
        results["metadatas"][0],
        results["distances"][0],
    ):
        output.append({
            "text": text,
            # cosine distance = 1 - similarity, so similarity = 1 - distance
            "score": round(max(0.0, 1.0 - float(dist)), 4),
            "doc_id": meta.get("doc_id", ""),
            "source": meta.get("original_filename", meta.get("doc_id", "unknown")),
            "metadata": meta,
        })

    return sorted(output, key=lambda x: x["score"], reverse=True)


# ── Delete ─────────────────────────────────────────────────────────────────────

def delete_doc(doc_id: str) -> int:
    """Remove all chunks for a document. Returns count deleted."""
    return _delete_by_doc(_get_collection(), doc_id)


def _delete_by_doc(collection, doc_id: str) -> int:
    try:
        existing = collection.get(where={"doc_id": doc_id})
        if existing["ids"]:
            collection.delete(ids=existing["ids"])
            return len(existing["ids"])
    except Exception:
        pass
    return 0


# ── Stats ──────────────────────────────────────────────────────────────────────

def chunk_count() -> int:
    return _get_collection().count()


def doc_ids() -> list[str]:
    try:
        results = _get_collection().get(include=["metadatas"])
        return list({m.get("doc_id", "") for m in results["metadatas"] if m.get("doc_id")})
    except Exception:
        return []


def collection_stats() -> dict:
    collection = _get_collection()
    total = collection.count()
    ids = doc_ids()

    # Gather per-document info
    docs = []
    try:
        raw = collection.get(include=["metadatas"])
        seen: dict[str, dict] = {}
        for meta in raw["metadatas"]:
            did = meta.get("doc_id", "")
            if did and did not in seen:
                seen[did] = {
                    "doc_id": did,
                    "source": meta.get("original_filename", did),
                    "uploaded_by": meta.get("uploaded_by", "—"),
                }
        docs = list(seen.values())
    except Exception:
        pass

    return {
        "total_chunks": total,
        "total_documents": len(ids),
        "documents": docs,
    }
