from sqlalchemy import Column, Integer, String, Text

from app.db.database import Base


class FAQ(Base):
    __tablename__ = "faqs"

    id = Column(String, primary_key=True)          # e.g. "faq_001"
    question = Column(String, nullable=False)
    answer = Column(Text, nullable=False)
    category = Column(String, nullable=False, index=True)
    sort_order = Column(Integer, default=0)
