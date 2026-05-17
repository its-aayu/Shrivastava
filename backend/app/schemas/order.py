from typing import List, Optional

from pydantic import BaseModel, Field


ORDER_STATUSES = {"proof_review", "processing", "production", "dispatched", "delivered", "cancelled"}


class OrderBase(BaseModel):
    user_id: str
    product_id: str
    product_title: str
    quantity: int = Field(..., gt=0)
    unit_price: int = Field(..., gt=0, description="INR")
    total_price: int = Field(..., gt=0, description="INR")
    finish: Optional[str] = None
    size: Optional[str] = None
    notes: Optional[str] = None
    artwork_approved: bool = False


class OrderCreate(OrderBase):
    pass


class OrderUpdate(BaseModel):
    status: Optional[str] = None
    artwork_approved: Optional[bool] = None
    notes: Optional[str] = None
    dispatched_at: Optional[str] = None
    delivered_at: Optional[str] = None


class OrderResponse(OrderBase):
    order_id: str
    status: str
    created_at: Optional[str] = None
    dispatched_at: Optional[str] = None
    delivered_at: Optional[str] = None

    model_config = {"from_attributes": True}


class OrderListResponse(BaseModel):
    data: List[OrderResponse]
    count: int
