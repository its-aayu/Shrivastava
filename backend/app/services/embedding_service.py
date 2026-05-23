"""
Embedding Service — local sentence-transformers embeddings.

Model: all-MiniLM-L6-v2  (384-dim, ~90 MB, no API key required)
First call downloads the model to ~/.cache/huggingface/hub/
Subsequent calls load from cache.
"""

from __future__ import annotations

_MODEL_NAME = "all-MiniLM-L6-v2"
_model = None


def _get_model():
    global _model
    if _model is None:
        from sentence_transformers import SentenceTransformer
        _model = SentenceTransformer(_MODEL_NAME)
    return _model


def embed_texts(texts: list[str]) -> list[list[float]]:
    """
    Generate 384-dim embeddings for a list of strings.
    Returns a list of float lists (JSON-serialisable).
    """
    if not texts:
        return []
    model = _get_model()
    embeddings = model.encode(
        texts,
        convert_to_numpy=True,
        show_progress_bar=False,
        batch_size=32,
    )
    return embeddings.tolist()


def embed_query(query: str) -> list[float]:
    """Convenience wrapper — embed a single query string."""
    return embed_texts([query])[0]
