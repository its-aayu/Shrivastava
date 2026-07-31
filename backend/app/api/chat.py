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
import time
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.limiter import limiter
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

MAX_MESSAGE_LENGTH = 1000
_MAX_WIDGET_HISTORY = 6  # max prior turns accepted from the public widget (prevents prompt-stuffing)

log = logging.getLogger("velora.chat")

router = APIRouter(prefix="/chat", tags=["Chat / AI"])


class ChatMessage(BaseModel):
    role: str = Field(..., pattern="^(user|assistant)$")
    content: str = Field(..., max_length=MAX_MESSAGE_LENGTH)


class ChatRequest(BaseModel):
    message: str
    session_id: str | None = None
    history: list[ChatMessage] = []  # prior turns — used by widget; ignored in authenticated endpoint


class ChatResponse(BaseModel):
    success: bool = True
    message: str = "Response generated"
    data: dict


@router.post("", response_model=ChatResponse)
@limiter.limit("20/minute")
async def chat(
    request: Request,
    payload: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    msg = payload.message.strip()
    if not msg:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    if len(msg) > MAX_MESSAGE_LENGTH:
        raise HTTPException(status_code=400, detail=f"Message too long (max {MAX_MESSAGE_LENGTH} characters).")

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

    # 2 — Load recent conversation turns for multi-turn memory
    _MAX_HISTORY = 6  # last 6 user+assistant exchanges = 12 rows
    history: list[dict] = []
    if db is not None:
        hist_rows = (
            db.query(ChatHistory)
            .filter(
                ChatHistory.session_id == session_id,
                ChatHistory.user_id == str(user_id),
            )
            .order_by(ChatHistory.created_at.desc())
            .limit(_MAX_HISTORY * 2)
            .all()
        )
        history = [{"role": r.role, "content": r.content} for r in reversed(hist_rows)]

    # 3 — Generate response (Groq with history, or context-based fallback)
    response_text, model_used, tokens_used = _generate(msg, chunks, history)

    latency = round(time.perf_counter() - t0, 3)
    log.info(
        "[chat] model=%s  tokens=%s  latency=%ss  session=%s",
        model_used, tokens_used, latency, session_id,
    )

    # 4 — Collect unique source filenames from retrieved chunks
    sources = list({
        c.get("source", c.get("doc_id", ""))
        for c in chunks
        if c.get("source") or c.get("doc_id")
    })

    # 5 — Persist conversation turns
    _save_turns(db, session_id, user_id, msg, response_text)

    return ChatResponse(data={
        "response": response_text,
        "session_id": session_id,
        "sources": sources,
        "confidence": top_score,
    })


# ── Generation helpers ─────────────────────────────────────────────────────────

def _generate(
    user_message: str,
    chunks: list[dict],
    history: list[dict] | None = None,
) -> tuple[str, str, int | None]:
    """Try Groq with conversation history; fall back to context-only response."""
    api_key = settings.GROQ_API_KEY.strip()
    if api_key:
        try:
            return _groq_response(user_message, chunks, api_key, history or [])
        except Exception as exc:
            log.warning("[chat] Groq call failed — falling back. Error: %s", exc)
    text = _context_response(user_message, chunks)
    return text, "context-fallback", None


def _groq_response(
    user_message: str,
    chunks: list[dict],
    api_key: str,
    history: list[dict] | None = None,
) -> tuple[str, str, int]:
    from groq import Groq
    client = Groq(api_key=api_key)
    model = "llama-3.3-70b-versatile"
    system = get_system_prompt()
    prompt = build_prompt_with_context(user_message, chunks)

    # Build multi-turn message list: system → prior turns → current user message
    messages: list[dict] = [{"role": "system", "content": system}]
    if history:
        messages.extend(history)
    messages.append({"role": "user", "content": prompt})

    resp = client.chat.completions.create(
        model=model,
        messages=messages,
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
        "admin@velorastudio.in — Monday to Saturday, 9 AM to 7 PM IST."
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
@limiter.limit("10/minute")
async def chat_widget(request: Request, payload: ChatRequest):
    """
    Public chat endpoint for the homepage widget.
    No authentication required. Does not persist to DB.
    Uses the same RAG + Groq pipeline as the authenticated endpoint.
    """
    msg = payload.message.strip()
    if not msg:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    if len(msg) > MAX_MESSAGE_LENGTH:
        raise HTTPException(status_code=400, detail=f"Message too long (max {MAX_MESSAGE_LENGTH} characters).")

    session_id = payload.session_id or str(uuid.uuid4())
    t0 = time.perf_counter()

    rag_config = load_chat_config().get("rag_config", {})
    min_score = rag_config.get("min_similarity_score", 0.35)
    top_k = rag_config.get("top_k", 4)

    raw_chunks = retrieve_context(msg, db=None, top_k=top_k)
    chunks = [c for c in raw_chunks if c.get("score", 0) >= min_score]
    top_score = round(chunks[0]["score"], 3) if chunks else None
    log.info("[widget] raw=%d  filtered=%d  top_score=%s  query=%r", len(raw_chunks), len(chunks), top_score, msg[:80])

    # Accept only the most recent N turns from the public widget to prevent prompt-stuffing
    recent_history = payload.history[-_MAX_WIDGET_HISTORY:]
    history = [{"role": h.role, "content": h.content[:MAX_MESSAGE_LENGTH]} for h in recent_history]
    response_text, model_used, tokens_used = _generate(msg, chunks, history)

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
