from sqlalchemy import Boolean, Column, Float, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB

from app.db.database import Base


class Product(Base):
    __tablename__ = "products"

    # Identity
    id = Column(String, primary_key=True)          # e.g. "prod_001"
    slug = Column(String, unique=True, index=True, nullable=False)

    # Core info
    title = Column(String, nullable=False)
    category_id = Column(String, nullable=False, index=True)
    category = Column(String, nullable=False)
    description = Column(Text)

    # Pricing (INR, stored as integer paise-free — just rupees)
    price = Column(Integer, nullable=False)
    price_unit = Column(String, default="per set")
    currency = Column(String, default="INR")

    # Print specs
    material = Column(String)
    finish = Column(String)
    size = Column(String)
    delivery_time = Column(String)
    min_quantity = Column(Integer, default=1)

    # JSON arrays stored in JSONB (PostgreSQL) columns
    features = Column(JSONB, default=list)
    images = Column(JSONB, default=list)
    tags = Column(JSONB, default=list)

    # Metrics
    rating = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)

    # Flags
    is_featured = Column(Boolean, default=False, index=True)
    in_stock = Column(Boolean, default=True, index=True)
