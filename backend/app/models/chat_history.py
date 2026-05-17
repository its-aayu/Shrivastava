import uuid

from sqlalchemy import Column, String, Text
from sqlalchemy.dialects.postgresql import UUID

from app.db.database import Base


class ChatHistory(Base):
    """
    Stores per-session AI assistant conversation turns.
    user_id is nullable — guests can chat without an account.
    """
    __tablename__ = "chat_history"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(String, nullable=False, index=True)  # browser-generated UUID
    user_id = Column(String, nullable=True, index=True)      # FK → users.id (optional)

    role = Column(String, nullable=False)                    # "user" | "assistant"
    content = Column(Text, nullable=False)

    created_at = Column(String, nullable=False)              # ISO datetime string
