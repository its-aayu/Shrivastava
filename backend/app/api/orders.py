from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.schemas.order import OrderCreate, OrderListResponse, OrderResponse, OrderUpdate, ORDER_STATUSES
from app.services import order_service
from app.utils.auth import get_current_user

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.get("/", response_model=OrderListResponse, summary="List orders")
def list_orders(
    user_id: Optional[str] = Query(None, description="Filter by user_id"),
    status: Optional[str] = Query(None, description="Filter by status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    orders = order_service.get_all_orders(
        db=db, user_id=user_id, status=status, skip=skip, limit=limit
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


@router.patch("/{order_id}/status", response_model=OrderResponse, summary="Update order status")
def update_status(
    order_id: str,
    status: str = Query(..., description="New status value"),
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
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
