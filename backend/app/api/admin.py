"""
Admin API — protected routes accessible only to users with role == 'admin'.

GET /api/v1/admin/users   — all registered users
GET /api/v1/admin/stats   — platform-wide aggregates
PUT /api/v1/admin/users/{user_id}/role  — promote/demote a user
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.order import Order
from app.models.user import User
from app.schemas.user import UserListResponse, UserResponse
from app.utils.auth import get_current_admin

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/users", response_model=UserListResponse)
async def list_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    """Return users, newest first. Paginated via skip/limit."""
    total = db.query(User).count()
    users = db.query(User).order_by(User.created_at.desc()).offset(skip).limit(limit).all()
    return UserListResponse(data=users, count=total)


@router.get("/stats")
async def admin_stats(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    """Platform-wide aggregates for the admin overview cards."""
    total_users = db.query(User).count()
    total_orders = db.query(Order).count()
    total_revenue = db.query(func.sum(Order.total_price)).scalar() or 0
    pending_orders = db.query(Order).filter(Order.status == "pending").count()

    return {
        "total_users": total_users,
        "total_orders": total_orders,
        "total_revenue": total_revenue,
        "pending_orders": pending_orders,
    }


@router.put("/users/{user_id}/role", response_model=UserResponse)
async def set_user_role(
    user_id: str,
    role: str,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    """Promote or demote a user. role must be 'admin' or 'customer'."""
    if role not in ("admin", "customer"):
        raise HTTPException(status_code=400, detail="role must be 'admin' or 'customer'")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.role = role
    db.commit()
    db.refresh(user)
    return user
