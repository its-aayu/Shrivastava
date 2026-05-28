from sqlalchemy import Boolean, Column, Integer, String, Text

from app.db.database import Base


class Order(Base):
    __tablename__ = "orders"

    order_id = Column(String, primary_key=True)                # e.g. "ORD-abc123"
    user_id = Column(String, nullable=False, index=True)

    # Status flow: pending → proof_review → processing → production → dispatched → delivered
    # Escape: cancelled
    status = Column(String, nullable=False, default="pending", index=True)

    # ── Totals ─────────────────────────────────────────────────────────────────
    subtotal = Column(Integer, nullable=True)       # pre-GST total (INR)
    gst = Column(Integer, nullable=True)            # GST amount (INR)
    total_price = Column(Integer, nullable=False)   # grand total (INR)

    # ── Customer contact (captured at checkout) ────────────────────────────────
    customer_name = Column(String, nullable=True)
    customer_email = Column(String, nullable=True)
    customer_phone = Column(String, nullable=True)
    customer_city = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    artwork_approved = Column(Boolean, default=False)

    # ── Payment (Razorpay) ─────────────────────────────────────────────────────
    razorpay_order_id = Column(String, nullable=True)
    razorpay_payment_id = Column(String, nullable=True)
    payment_status = Column(String, nullable=False, default="unpaid")  # unpaid/paid/failed

    # ── Timestamps ─────────────────────────────────────────────────────────────
    created_at = Column(String, nullable=True)
    dispatched_at = Column(String, nullable=True)
    delivered_at = Column(String, nullable=True)

    # ── Legacy single-item fields (kept for backward compat) ───────────────────
    product_id = Column(String, nullable=True, index=True)
    product_title = Column(String, nullable=True)
    quantity = Column(Integer, nullable=True)
    unit_price = Column(Integer, nullable=True)
