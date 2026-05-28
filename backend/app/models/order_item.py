from sqlalchemy import Column, Integer, String

from app.db.database import Base


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(String, primary_key=True)          # uuid hex
    order_id = Column(String, nullable=False, index=True)  # FK → orders.order_id
    product_id = Column(String, nullable=False)
    product_title = Column(String, nullable=False)

    quantity = Column(Integer, nullable=False, default=1)
    unit_price = Column(Integer, nullable=False)   # INR
    total_price = Column(Integer, nullable=False)  # INR

    finish = Column(String, nullable=True)
    size = Column(String, nullable=True)
