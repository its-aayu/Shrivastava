"""
Semantic Search endpoint.

GET  /api/v1/search?q=<query>&top_k=5   — search knowledge base
GET  /api/v1/search/stats               — vector store stats (admin)
"""

import logging

from fastapi import APIRouter, Depends, Query

from app.utils.auth import get_current_admin, get_current_user

log = logging.getLogger("aayu.search")

router = APIRouter(prefix="/search", tags=["Semantic Search"])


@router.get("")
async def semantic_search(
    q: str = Query(..., min_length=1, description="Natural-language search query"),
    top_k: int = Query(5, ge=1, le=20),
    _=Depends(get_current_user),
):
    """
    Search the ingested document knowledge base using semantic similarity.
    Returns ranked chunks with source document names and similarity scores.
    """
    from app.services.chroma_service import search

    query = q.strip()
    if not query:
        return {"results": [], "query": q, "count": 0}

    results = search(query, top_k=top_k)
    log.info("[search] query=%r  results=%d", query[:60], len(results))

    return {"results": results, "query": query, "count": len(results)}


@router.get("/stats")
async def vector_stats(_=Depends(get_current_admin)):
    """Admin-only — ChromaDB collection stats."""
    from app.services.chroma_service import collection_stats
    return collection_stats()
