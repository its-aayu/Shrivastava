from sqlalchemy import Column, String, Text
from sqlalchemy.dialects.postgresql import JSONB

from app.db.database import Base


class Document(Base):
    """
    Knowledge-base documents used for RAG (Retrieval-Augmented Generation).
    Seeded from src/mock-data/documents.json.
    Phase 3 will add an embedding vector column (pgvector).
    """
    __tablename__ = "documents"

    doc_id = Column(String, primary_key=True)       # e.g. "doc_001"
    title = Column(String, nullable=False)
    category = Column(String, nullable=False, index=True)
    content = Column(Text, nullable=False)
    tags = Column(JSONB, default=list)
    source = Column(String)                         # "internal" | "guide" | etc.

    # Phase 3: add pgvector embedding column
    # embedding = Column(Vector(1536))              # OpenAI text-embedding-3-small dimension
