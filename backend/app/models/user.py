from sqlalchemy import Boolean, Column, Integer, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from app.db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)          # e.g. "user_001"
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=True)  # null until auth is activated
    phone = Column(String)
    role = Column(String, default="customer")        # "customer" | "admin"
    company = Column(String)
    city = Column(String)
    notes = Column(String)

    total_orders = Column(Integer, default=0)
    total_spend = Column(Integer, default=0)        # INR
    preferred_products = Column(JSONB, default=list)

    is_active = Column(Boolean, default=True)
    created_at = Column(String)                     # ISO date string, e.g. "2026-01-12"

    # Relationships (uncomment when Orders table FK is confirmed)
    # orders = relationship("Order", back_populates="user", lazy="select")
