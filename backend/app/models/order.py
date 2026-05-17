from sqlalchemy import Boolean, Column, Integer, String, Text

from app.db.database import Base


class Order(Base):
    __tablename__ = "orders"

    order_id = Column(String, primary_key=True)    # e.g. "ord_001"
    user_id = Column(String, nullable=False, index=True)    # FK → users.id
    product_id = Column(String, nullable=False, index=True) # FK → products.id
    product_title = Column(String, nullable=False)

    # Status flow: proof_review → processing → production → dispatched → delivered
    # Escape: cancelled
    status = Column(String, nullable=False, default="processing", index=True)

    quantity = Column(Integer, nullable=False, default=1)
    unit_price = Column(Integer, nullable=False)   # INR
    total_price = Column(Integer, nullable=False)  # INR

    finish = Column(String)
    size = Column(String)
    notes = Column(Text)
    artwork_approved = Column(Boolean, default=False)

    created_at = Column(String)                    # ISO date string
    dispatched_at = Column(String)                 # nullable
    delivered_at = Column(String)                  # nullable

    # Uncomment after auth is in place:
    # user = relationship("User", back_populates="orders")
