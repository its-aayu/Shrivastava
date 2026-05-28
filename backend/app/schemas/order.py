from typing import List, Optional

from pydantic import BaseModel, Field


ORDER_STATUSES = {"pending", "proof_review", "processing", "production", "dispatched", "delivered", "cancelled"}


# ── Legacy single-item order (keep for backward compat) ───────────────────────

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


class OrderResponse(BaseModel):
    order_id: str
    user_id: str
    status: str
    total_price: int
    subtotal: Optional[int] = None
    gst: Optional[int] = None
    customer_name: Optional[str] = None
    customer_email: Optional[str] = None
    customer_phone: Optional[str] = None
    customer_city: Optional[str] = None
    notes: Optional[str] = None
    payment_status: Optional[str] = "unpaid"
    razorpay_order_id: Optional[str] = None
    # Legacy fields
    product_id: Optional[str] = None
    product_title: Optional[str] = None
    quantity: Optional[int] = None
    unit_price: Optional[int] = None
    created_at: Optional[str] = None
    dispatched_at: Optional[str] = None
    delivered_at: Optional[str] = None

    model_config = {"from_attributes": True}


class OrderListResponse(BaseModel):
    data: List[OrderResponse]
    count: int


# ── Multi-item order creation ──────────────────────────────────────────────────

class OrderItemCreate(BaseModel):
    product_id: str
    product_title: str
    quantity: int = Field(..., gt=0)
    unit_price: int = Field(..., gt=0, description="INR")
    finish: Optional[str] = None
    size: Optional[str] = None


class MultiOrderCreate(BaseModel):
    items: List[OrderItemCreate] = Field(..., min_length=1)
    customer_name: str
    customer_email: str
    customer_phone: Optional[str] = None
    customer_city: Optional[str] = None
    notes: Optional[str] = None


class OrderItemResponse(BaseModel):
    id: str
    order_id: str
    product_id: str
    product_title: str
    quantity: int
    unit_price: int
    total_price: int
    finish: Optional[str] = None
    size: Optional[str] = None

    model_config = {"from_attributes": True}


class MultiOrderResponse(BaseModel):
    order_id: str
    status: str
    subtotal: int
    gst: int
    total_price: int
    customer_name: str
    customer_email: str
    customer_phone: Optional[str] = None
    customer_city: Optional[str] = None
    payment_status: str
    created_at: Optional[str] = None
    items: List[OrderItemResponse] = []

    model_config = {"from_attributes": True}
