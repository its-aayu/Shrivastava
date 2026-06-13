"""
Order service layer.
DB-first with mock-data fallback (same pattern as product_service).
"""

import json
import uuid
from pathlib import Path
from typing import Optional

_MOCK_FILE = Path(__file__).parent.parent.parent.parent / "frontend" / "src" / "mock-data" / "orders.json"


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
            status=order_data.pop("status", "pending"),
            created_at=date.today().isoformat(),
            **order_data,
        )
        db.add(order)
        db.commit()
        db.refresh(order)
        return order

    # Mock: return the dict as-if saved (no persistence)
    return {"order_id": f"ord_{uuid.uuid4().hex[:6]}", "status": "pending", **order_data}


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


def create_multi_order(payload: dict, user_id: str, db=None) -> dict:
    """
    Create one Order + multiple OrderItem rows from a cart payload.

    payload keys: items (list), customer_name, customer_email,
                  customer_phone, customer_city, notes
    Each item: product_id, product_title, quantity, unit_price, finish, size
    """
    from datetime import date

    items = payload.get("items", [])
    subtotal = sum(i["unit_price"] * i["quantity"] for i in items)
    gst = round(subtotal * 0.18)
    total = subtotal + gst
    order_id = f"ORD-{uuid.uuid4().hex[:8].upper()}"

    if db is not None:
        from app.models.order import Order
        from app.models.order_item import OrderItem

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
        db.flush()  # get order_id in DB without committing yet

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

    # Mock mode — return a dict
    order_items = [
        {
            "id": uuid.uuid4().hex,
            "order_id": order_id,
            "product_id": str(i["product_id"]),
            "product_title": i["product_title"],
            "quantity": i["quantity"],
            "unit_price": i["unit_price"],
            "total_price": i["unit_price"] * i["quantity"],
            "finish": i.get("finish"),
            "size": i.get("size"),
        }
        for i in items
    ]
    return {
        "order": {
            "order_id": order_id,
            "user_id": user_id,
            "status": "pending",
            "subtotal": subtotal,
            "gst": gst,
            "total_price": total,
            "customer_name": payload.get("customer_name"),
            "customer_email": payload.get("customer_email"),
            "customer_phone": payload.get("customer_phone"),
            "customer_city": payload.get("customer_city"),
            "payment_status": "unpaid",
            "created_at": date.today().isoformat(),
        },
        "items": order_items,
    }
