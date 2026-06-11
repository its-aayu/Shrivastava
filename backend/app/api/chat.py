"""
Chat / AI endpoint.

POST /api/v1/chat
  - Requires bearer token
  - Embeds the user message, searches the vector store
  - If GROQ_API_KEY is set: calls llama-3.3-70b-versatile with RAG context
  - Otherwise: returns the most relevant chunk as a plain-text answer
  - Persists both turns to chat_history table
"""

import logging
import os
import time
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.chat_history import ChatHistory
from app.models.user import User
from app.services.rag_service import (
    build_prompt_with_context,
    get_fallback_response,
    get_system_prompt,
    load_chat_config,
    retrieve_context,
)
from app.utils.auth import get_current_user

log = logging.getLogger("aayu.chat")

router = APIRouter(prefix="/chat", tags=["Chat / AI"])


class ChatRequest(BaseModel):
    message: str
    session_id: str | None = None


class ChatResponse(BaseModel):
    success: bool = True
    message: str = "Response generated"
    data: dict


@router.post("", response_model=ChatResponse)
async def chat(
    payload: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    msg = payload.message.strip()
    if not msg:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    session_id = payload.session_id or str(uuid.uuid4())
    user_id = getattr(current_user, "id", None)
    t0 = time.perf_counter()

    # 1 — Retrieve relevant chunks from vector store
    rag_config = load_chat_config().get("rag_config", {})
    min_score = rag_config.get("min_similarity_score", 0.35)
    top_k = rag_config.get("top_k", 4)

    raw_chunks = retrieve_context(msg, db=db, top_k=top_k)
    chunks = [c for c in raw_chunks if c.get("score", 0) >= min_score]
    top_score = round(chunks[0]["score"], 3) if chunks else None

    log.info(
        "[chat] user=%s  raw=%d  filtered=%d  top_score=%s  query=%r",
        user_id, len(raw_chunks), len(chunks), top_score, msg[:80],
    )

    # 2 — Generate response (Groq or context-based fallback)
    response_text, model_used, tokens_used = _generate(msg, chunks)

    latency = round(time.perf_counter() - t0, 3)
    log.info(
        "[chat] model=%s  tokens=%s  latency=%ss  session=%s",
        model_used, tokens_used, latency, session_id,
    )

    # 3 — Collect unique source filenames from retrieved chunks
    sources = list({
        c.get("source", c.get("doc_id", ""))
        for c in chunks
        if c.get("source") or c.get("doc_id")
    })

    # 4 — Persist conversation turns
    _save_turns(db, session_id, user_id, msg, response_text)

    return ChatResponse(data={
        "response": response_text,
        "session_id": session_id,
        "sources": sources,
        "confidence": top_score,
    })


# ── Generation helpers ─────────────────────────────────────────────────────────

def _generate(user_message: str, chunks: list[dict]) -> tuple[str, str, int | None]:
    """Try Groq; fall back to context-only response. Returns (text, model, tokens)."""
    api_key = os.getenv("GROQ_API_KEY", "").strip()
    if api_key:
        try:
            return _groq_response(user_message, chunks, api_key)
        except Exception as exc:
            log.warning("[chat] Groq call failed — falling back. Error: %s", exc)
    text = _context_response(user_message, chunks)
    return text, "context-fallback", None


def _groq_response(user_message: str, chunks: list[dict], api_key: str) -> tuple[str, str, int]:
    from groq import Groq
    client = Groq(api_key=api_key)
    model = "llama-3.3-70b-versatile"
    system = get_system_prompt()
    prompt = build_prompt_with_context(user_message, chunks)
    resp = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": prompt},
        ],
        max_tokens=500,
        temperature=0.7,
    )
    tokens = getattr(resp.usage, "total_tokens", None)
    return resp.choices[0].message.content, model, tokens


def _context_response(user_message: str, chunks: list[dict]) -> str:
    """Fallback when no Groq key — synthesise from the top retrieved chunk."""
    if not chunks:
        return get_fallback_response()
    top_text = chunks[0].get("text", "")
    if len(top_text) > 600:
        top_text = top_text[:597] + "…"
    return (
        f"Based on our printing guides:\n\n{top_text}\n\n"
        "For a formal quote or specific details, the studio team is available at "
        "admin@aayuprinting.in — Monday to Saturday, 9 AM to 7 PM IST."
    )


# ── Persistence ────────────────────────────────────────────────────────────────

def _save_turns(db, session_id: str, user_id, user_msg: str, ai_msg: str) -> None:
    if db is None:
        return
    now = datetime.now(timezone.utc).isoformat()
    try:
        db.add(ChatHistory(session_id=session_id, user_id=user_id, role="user",      content=user_msg, created_at=now))
        db.add(ChatHistory(session_id=session_id, user_id=user_id, role="assistant", content=ai_msg,   created_at=now))
        db.commit()
    except Exception as exc:
        log.error("[chat] DB save failed for session=%s  error=%s", session_id, exc)
        db.rollback()


# ── Public widget endpoint (no auth) ──────────────────────────────────────────

@router.post("/widget")
async def chat_widget(payload: ChatRequest):
    """
    Public chat endpoint for the homepage widget.
    No authentication required. Does not persist to DB.
    Uses the same RAG + Groq pipeline as the authenticated endpoint.
    """
    msg = payload.message.strip()
    if not msg:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    session_id = payload.session_id or str(uuid.uuid4())
    t0 = time.perf_counter()

    rag_config = load_chat_config().get("rag_config", {})
    min_score = rag_config.get("min_similarity_score", 0.35)
    top_k = rag_config.get("top_k", 4)

    raw_chunks = retrieve_context(msg, db=None, top_k=top_k)
    chunks = [c for c in raw_chunks if c.get("score", 0) >= min_score]
    top_score = round(chunks[0]["score"], 3) if chunks else None
    log.info("[widget] raw=%d  filtered=%d  top_score=%s  query=%r", len(raw_chunks), len(chunks), top_score, msg[:80])

    response_text, model_used, tokens_used = _generate(msg, chunks)

    latency = round(time.perf_counter() - t0, 3)
    log.info("[widget] model=%s  tokens=%s  latency=%ss", model_used, tokens_used, latency)

    sources = list({
        c.get("source", c.get("doc_id", ""))
        for c in chunks
        if c.get("source") or c.get("doc_id")
    })

    return ChatResponse(data={
        "response": response_text,
        "session_id": session_id,
        "sources": sources,
        "confidence": top_score,
    })


# ── History endpoint ───────────────────────────────────────────────────────────

@router.get("/history/{session_id}")
async def get_history(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if db is None:
        return {"data": []}
    user_id = getattr(current_user, "id", None)
    rows = (
        db.query(ChatHistory)
        .filter(
            ChatHistory.session_id == session_id,
            ChatHistory.user_id == str(user_id),    # only return the requesting user's session
        )
        .order_by(ChatHistory.created_at)
        .all()
    )
    return {"data": [{"role": r.role, "content": r.content, "created_at": r.created_at} for r in rows]}


# ── Sessions list (for sidebar) ────────────────────────────────────────────────

@router.get("/sessions")
async def list_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return a list of distinct sessions for the current user, most recent first."""
    if db is None:
        return {"data": []}
    user_id = getattr(current_user, "id", None)
    rows = (
        db.query(ChatHistory)
        .filter(ChatHistory.user_id == str(user_id))
        .order_by(ChatHistory.created_at.desc())
        .all()
    )
    # Build one entry per session_id — use the first user message as preview
    seen: dict[str, dict] = {}
    for r in rows:
        if r.session_id not in seen:
            seen[r.session_id] = {
                "session_id": r.session_id,
                "preview": "",
                "created_at": r.created_at,
            }
        if r.role == "user" and not seen[r.session_id]["preview"]:
            preview = r.content[:80]
            seen[r.session_id]["preview"] = preview + ("…" if len(r.content) > 80 else "")
    sessions = sorted(seen.values(), key=lambda s: s["created_at"], reverse=True)
    return {"data": sessions}


@router.delete("/sessions/{session_id}", status_code=204)
async def delete_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete all chat history rows for a session. Only the owning user can delete."""
    if db is None:
        return
    user_id = getattr(current_user, "id", None)
    db.query(ChatHistory).filter(
        ChatHistory.session_id == session_id,
        ChatHistory.user_id == str(user_id),
    ).delete(synchronize_session=False)
    db.commit()
