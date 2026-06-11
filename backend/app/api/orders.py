from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.schemas.order import (
    MultiOrderCreate, MultiOrderResponse, OrderItemResponse,
    OrderCreate, OrderListResponse, OrderResponse, OrderUpdate, ORDER_STATUSES,
)
from app.services import order_service
from app.utils.auth import get_current_admin, get_current_user

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.get("/", response_model=OrderListResponse, summary="List orders")
def list_orders(
    status: Optional[str] = Query(None, description="Filter by status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Admins see all orders; customers see only their own — user_id is never client-supplied
    uid = None if getattr(current_user, "role", "") == "admin" else str(current_user.id)
    orders = order_service.get_all_orders(
        db=db, user_id=uid, status=status, skip=skip, limit=limit
    )
    return {"data": orders, "count": len(orders)}


@router.get("/{order_id}", response_model=OrderResponse, summary="Get single order")
def get_order(
    order_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    order = order_service.get_order_by_id(order_id, db)
    if not order:
        raise HTTPException(status_code=404, detail=f"Order '{order_id}' not found")
    return order


@router.post("/", response_model=OrderResponse, status_code=201, summary="Create order")
def create_order(
    order: OrderCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return order_service.create_order(order.model_dump(), db)


@router.post("/create", response_model=MultiOrderResponse, status_code=201, summary="Create multi-item order")
def create_multi_order(
    payload: MultiOrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create one parent order + order items from a full cart. Returns the order with items attached."""
    user_id = str(getattr(current_user, "id", "guest"))
    result = order_service.create_multi_order(payload.model_dump(), user_id, db)

    order = result["order"]
    items = result["items"]

    # Build response — handle both ORM objects and plain dicts
    def _val(obj, key):
        return getattr(obj, key, None) if hasattr(obj, "__tablename__") else obj.get(key)

    return MultiOrderResponse(
        order_id=_val(order, "order_id"),
        status=_val(order, "status"),
        subtotal=_val(order, "subtotal"),
        gst=_val(order, "gst"),
        total_price=_val(order, "total_price"),
        customer_name=_val(order, "customer_name"),
        customer_email=_val(order, "customer_email"),
        customer_phone=_val(order, "customer_phone"),
        customer_city=_val(order, "customer_city"),
        payment_status=_val(order, "payment_status") or "unpaid",
        created_at=_val(order, "created_at"),
        items=[
            OrderItemResponse(
                id=_val(i, "id"),
                order_id=_val(i, "order_id"),
                product_id=_val(i, "product_id"),
                product_title=_val(i, "product_title"),
                quantity=_val(i, "quantity"),
                unit_price=_val(i, "unit_price"),
                total_price=_val(i, "total_price"),
                finish=_val(i, "finish"),
                size=_val(i, "size"),
            )
            for i in items
        ],
    )


@router.patch("/{order_id}/status", response_model=OrderResponse, summary="Update order status")
def update_status(
    order_id: str,
    status: str = Query(..., description="New status value"),
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    if status not in ORDER_STATUSES:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid status '{status}'. Valid: {sorted(ORDER_STATUSES)}",
        )
    order = order_service.update_order_status(order_id, status, db)
    if not order:
        raise HTTPException(status_code=404, detail=f"Order '{order_id}' not found")
    return order
