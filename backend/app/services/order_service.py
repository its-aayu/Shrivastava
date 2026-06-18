"""
Order service layer — PostgreSQL backed via SQLAlchemy.
All functions require a live db session; raises 503 if None is passed.
"""

import uuid
from datetime import date
from typing import Optional

from fastapi import HTTPException


def _require_db(db):
    if db is None:
        raise HTTPException(status_code=503, detail="Database not available")
    return db


def get_all_orders(
    db=None,
    user_id: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
) -> list:
    db = _require_db(db)
    from app.models.order import Order
    q = db.query(Order)
    if user_id:
        q = q.filter(Order.user_id == user_id)
    if status:
        q = q.filter(Order.status == status)
    return q.order_by(Order.created_at.desc()).offset(skip).limit(limit).all()


def get_order_by_id(order_id: str, db=None) -> Optional[object]:
    db = _require_db(db)
    from app.models.order import Order
    return db.query(Order).filter(Order.order_id == order_id).first()


def create_order(order_data: dict, db=None) -> object:
    db = _require_db(db)
    from app.models.order import Order
    order = Order(
        order_id=f"ord_{uuid.uuid4().hex[:6]}",
        status=order_data.pop("status", "pending"),
        created_at=date.today().isoformat(),
        **order_data,
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


def update_order_status(order_id: str, status: str, db=None) -> Optional[object]:
    db = _require_db(db)
    from app.models.order import Order
    order = db.query(Order).filter(Order.order_id == order_id).first()
    if not order:
        return None
    order.status = status
    db.commit()
    db.refresh(order)
    return order


def count_orders(db=None) -> int:
    db = _require_db(db)
    from app.models.order import Order
    return db.query(Order).count()


def create_multi_order(payload: dict, user_id: str, db=None) -> dict:
    """
    Create one Order + multiple OrderItem rows from a cart payload.

    payload keys: items (list), customer_name, customer_email,
                  customer_phone, customer_city, notes
    Each item: product_id, product_title, quantity, unit_price, finish, size
    """
    db = _require_db(db)
    from app.models.order import Order
    from app.models.order_item import OrderItem

    items = payload.get("items", [])
    subtotal = sum(i["unit_price"] * i["quantity"] for i in items)
    gst = round(subtotal * 0.18)
    total = subtotal + gst
    order_id = f"ORD-{uuid.uuid4().hex[:8].upper()}"

    order = Order(
        order_id=order_id,
        user_id=user_id,
        status="pending",
        subtotal=subtotal,
        gst=gst,
        total_price=total,
        customer_name=payload.get("customer_name"),
        customer_email=payload.get("customer_email"),
        customer_phone=payload.get("customer_phone"),
        customer_city=payload.get("customer_city"),
        notes=payload.get("notes"),
        payment_status="unpaid",
        created_at=date.today().isoformat(),
    )
    db.add(order)
    db.flush()

    order_items = []
    for item in items:
        oi = OrderItem(
            id=uuid.uuid4().hex,
            order_id=order_id,
            product_id=str(item["product_id"]),
            product_title=item["product_title"],
            quantity=item["quantity"],
            unit_price=item["unit_price"],
            total_price=item["unit_price"] * item["quantity"],
            finish=item.get("finish"),
            size=item.get("size"),
        )
        db.add(oi)
        order_items.append(oi)

    db.commit()
    db.refresh(order)
    return {"order": order, "items": order_items}
