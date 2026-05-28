"""
Payment Service — Razorpay Integration

Flow:
    1. POST /payments/create-order  →  creates Razorpay order, returns {razorpay_order_id, amount, key_id}
    2. Frontend opens Razorpay checkout popup
    3. Customer pays (UPI / card / net banking)
    4. Frontend gets callback {razorpay_payment_id, razorpay_signature}
    5. POST /payments/verify  →  HMAC-SHA256 check, marks order paid in DB

Env vars (backend/.env):
    RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
    RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx

Install:
    pip install razorpay  (already in requirements.txt)
"""

import hashlib
import hmac
import os


def _get_client():
    """Lazy-load Razorpay client. Raises EnvironmentError if keys missing."""
    import razorpay
    key_id = os.getenv("RAZORPAY_KEY_ID", "")
    key_secret = os.getenv("RAZORPAY_KEY_SECRET", "")
    if not key_id or not key_secret:
        raise EnvironmentError(
            "RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in backend/.env"
        )
    return razorpay.Client(auth=(key_id, key_secret))


def create_payment_order(amount_inr: int, order_id: str, currency: str = "INR") -> dict:
    """
    Create a Razorpay payment order.

    Args:
        amount_inr: Amount in INR (e.g. 1500 for ₹1500)
        order_id:   Internal order ID — stored as the Razorpay receipt
        currency:   Default "INR"

    Returns:
        {
            "razorpay_order_id": "order_xxx",
            "amount": 150000,       # paise
            "currency": "INR",
            "key_id": "rzp_test_xxx"   # safe to send to frontend
        }
    """
    client = _get_client()
    rz_order = client.order.create({
        "amount": amount_inr * 100,   # Razorpay uses paise (1 INR = 100 paise)
        "currency": currency,
        "receipt": order_id,
        "payment_capture": 1,         # auto-capture on payment
    })
    return {
        "razorpay_order_id": rz_order["id"],
        "amount": rz_order["amount"],
        "currency": rz_order["currency"],
        "key_id": os.getenv("RAZORPAY_KEY_ID"),
    }


def verify_payment(
    razorpay_order_id: str,
    razorpay_payment_id: str,
    razorpay_signature: str,
) -> bool:
    """
    Verify Razorpay payment signature using HMAC-SHA256.
    Must be called server-side — never trust the frontend alone.

    Returns True if the signature is valid, False otherwise.
    """
    key_secret = os.getenv("RAZORPAY_KEY_SECRET", "").encode()
    message = f"{razorpay_order_id}|{razorpay_payment_id}".encode()
    expected = hmac.new(key_secret, message, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, razorpay_signature)


def create_refund(payment_id: str, amount_inr: int | None = None) -> dict:
    """
    Initiate a full or partial refund.

    Args:
        payment_id:  Razorpay payment ID
        amount_inr:  Amount in INR. None = full refund.
    """
    client = _get_client()
    data = {}
    if amount_inr is not None:
        data["amount"] = amount_inr * 100
    return client.payment.refund(payment_id, data)
