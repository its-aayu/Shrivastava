"""
Payments API — Razorpay integration.

POST /payments/create-order   →  Create Razorpay order for a given internal order
POST /payments/verify         →  Verify signature, mark order as paid
"""

import logging

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.services import payment_service
from app.utils.auth import get_current_user

log = logging.getLogger("aayu.payments")

router = APIRouter(prefix="/payments", tags=["Payments"])


class CreateOrderRequest(BaseModel):
    order_id: str    # internal order ID (e.g. "ORD-ABC123")
    amount_inr: int  # total amount in INR


class VerifyPaymentRequest(BaseModel):
    order_id: str              # internal order ID
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


@router.post("/create-order")
def create_payment_order(
    payload: CreateOrderRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Creates a Razorpay order for the given internal order ID.
    Returns the razorpay_order_id, amount (paise), currency, and key_id.
    The frontend uses these to open the Razorpay checkout popup.
    """
    if payload.amount_inr <= 0:
        raise HTTPException(status_code=400, detail="Amount must be greater than zero.")

    try:
        rz = payment_service.create_payment_order(payload.amount_inr, payload.order_id)
    except EnvironmentError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    except Exception as exc:
        log.error("[payments] Razorpay create-order failed: %s", exc)
        raise HTTPException(status_code=502, detail="Payment gateway error. Please try again.")

    # Store razorpay_order_id against the internal order
    if db:
        from app.models.order import Order
        order = db.query(Order).filter(Order.order_id == payload.order_id).first()
        if order:
            order.razorpay_order_id = rz["razorpay_order_id"]
            db.commit()

    log.info("[payments] Created Razorpay order %s for %s", rz["razorpay_order_id"], payload.order_id)
    return {"success": True, "data": rz}


@router.post("/verify")
def verify_payment(
    payload: VerifyPaymentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Verifies the Razorpay payment signature.
    On success, marks the order as paid in DB.
    """
    try:
        valid = payment_service.verify_payment(
            payload.razorpay_order_id,
            payload.razorpay_payment_id,
            payload.razorpay_signature,
        )
    except EnvironmentError as exc:
        raise HTTPException(status_code=503, detail=str(exc))

    if not valid:
        log.warning("[payments] Invalid signature for order %s", payload.order_id)
        raise HTTPException(status_code=400, detail="Payment signature verification failed.")

    # Mark order as paid
    if db:
        from app.models.order import Order
        order = db.query(Order).filter(Order.order_id == payload.order_id).first()
        if order:
            order.payment_status = "paid"
            order.razorpay_payment_id = payload.razorpay_payment_id
            order.status = "proof_review"  # advance to next step in workflow
            db.commit()

    log.info("[payments] Payment verified for order %s", payload.order_id)
    return {"success": True, "message": "Payment verified. Your order is now in review."}
