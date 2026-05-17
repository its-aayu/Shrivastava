"""
Order service layer.
DB-first with mock-data fallback (same pattern as product_service).
"""

import json
import uuid
from pathlib import Path
from typing import Optional

_MOCK_FILE = Path(__file__).parent.parent.parent.parent / "src" / "mock-data" / "orders.json"


def _load_mock() -> list[dict]:
    with open(_MOCK_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def get_all_orders(
    db=None,
    user_id: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
) -> list:
    if db is not None:
        from app.models.order import Order
        q = db.query(Order)
        if user_id:
            q = q.filter(Order.user_id == user_id)
        if status:
            q = q.filter(Order.status == status)
        return q.order_by(Order.created_at.desc()).offset(skip).limit(limit).all()

    orders = _load_mock()
    if user_id:
        orders = [o for o in orders if o.get("user_id") == user_id]
    if status:
        orders = [o for o in orders if o.get("status") == status]
    return orders[skip: skip + limit]


def get_order_by_id(order_id: str, db=None) -> Optional[object]:
    if db is not None:
        from app.models.order import Order
        return db.query(Order).filter(Order.order_id == order_id).first()

    orders = _load_mock()
    return next((o for o in orders if o["order_id"] == order_id), None)


def create_order(order_data: dict, db=None) -> object:
    if db is not None:
        from app.models.order import Order
        from datetime import date
        order = Order(
            order_id=f"ord_{uuid.uuid4().hex[:6]}",
            created_at=date.today().isoformat(),
            **order_data,
        )
        db.add(order)
        db.commit()
        db.refresh(order)
        return order

    # Mock: return the dict as-if saved (no persistence)
    return {"order_id": f"ord_{uuid.uuid4().hex[:6]}", "status": "processing", **order_data}


def update_order_status(order_id: str, status: str, db=None) -> Optional[object]:
    if db is not None:
        from app.models.order import Order
        order = db.query(Order).filter(Order.order_id == order_id).first()
        if not order:
            return None
        order.status = status
        db.commit()
        db.refresh(order)
        return order

    return None  # mock mode doesn't support updates


def count_orders(db=None) -> int:
    if db is not None:
        from app.models.order import Order
        return db.query(Order).count()
    return len(_load_mock())
