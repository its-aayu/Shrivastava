"""
Payment Service — Razorpay Integration (Architecture Placeholder)

Flow planned:
    checkout form submit
        → POST /payments/create-order  (creates Razorpay order, returns order_id + amount)
        → Frontend opens Razorpay popup (razorpay_order_id, amount, key_id)
        → Customer pays via UPI / card / net banking
        → Frontend receives payment callback (razorpay_payment_id, razorpay_signature)
        → POST /payments/verify  (HMAC-SHA256 signature check)
        → On success: mark order paid in DB → trigger production

Environment variables needed (add to .env):
    RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
    RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx

Install when ready:
    pip install razorpay

Razorpay dashboard: https://dashboard.razorpay.com
Test mode keys available immediately on signup — no KYC required for testing.
"""

import hashlib
import hmac
import os


# ── Razorpay client ────────────────────────────────────────────────────────────

def _get_client():
    """Lazy-load Razorpay client. Raises ImportError if package not installed."""
    import razorpay
    key_id = os.getenv("RAZORPAY_KEY_ID", "")
    key_secret = os.getenv("RAZORPAY_KEY_SECRET", "")
    if not key_id or not key_secret:
        raise EnvironmentError(
            "RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in .env"
        )
    return razorpay.Client(auth=(key_id, key_secret))


# ── Payment order creation ────────────────────────────────────────────────────

def create_payment_order(amount_inr: int, order_id: str, currency: str = "INR") -> dict:
    """
    Create a Razorpay payment order.

    Args:
        amount_inr: Amount in INR (e.g. 1500 for ₹1500)
        order_id:   Our internal order ID (stored as receipt)
        currency:   Currency code (default INR)

    Returns:
        {
            "razorpay_order_id": "order_xxx",
            "amount": 150000,           # paise
            "currency": "INR",
            "key_id": "rzp_test_xxx",   # safe to expose to frontend
        }

    Implementation (uncomment when ready):
        client = _get_client()
        rz_order = client.order.create({
            "amount": amount_inr * 100,   # Razorpay uses paise
            "currency": currency,
            "receipt": order_id,
            "payment_capture": 1,         # auto-capture
        })
        return {
            "razorpay_order_id": rz_order["id"],
            "amount": rz_order["amount"],
            "currency": rz_order["currency"],
            "key_id": os.getenv("RAZORPAY_KEY_ID"),
        }
    """
    raise NotImplementedError(
        "Razorpay not yet configured. "
        "Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env, "
        "install razorpay package, and uncomment the implementation above."
    )


# ── Payment verification ──────────────────────────────────────────────────────

def verify_payment(
    razorpay_order_id: str,
    razorpay_payment_id: str,
    razorpay_signature: str,
) -> bool:
    """
    Verify the Razorpay payment signature using HMAC-SHA256.
    Must be called server-side — never trust the frontend alone.

    Returns True if the signature is valid, False otherwise.

    Implementation (uncomment when ready):
        key_secret = os.getenv("RAZORPAY_KEY_SECRET", "").encode()
        message = f"{razorpay_order_id}|{razorpay_payment_id}".encode()
        expected = hmac.new(key_secret, message, hashlib.sha256).hexdigest()
        return hmac.compare_digest(expected, razorpay_signature)
    """
    raise NotImplementedError(
        "Razorpay payment verification not yet configured. "
        "Set RAZORPAY_KEY_SECRET in .env and uncomment the implementation above."
    )


# ── Refund (for future use) ───────────────────────────────────────────────────

def create_refund(payment_id: str, amount_inr: int | None = None) -> dict:
    """
    Initiate a full or partial refund.

    Args:
        payment_id:  Razorpay payment ID (razorpay_payment_id)
        amount_inr:  Amount to refund in INR. None = full refund.

    Implementation:
        client = _get_client()
        data = {}
        if amount_inr is not None:
            data["amount"] = amount_inr * 100
        return client.payment.refund(payment_id, data)
    """
    raise NotImplementedError("Refund not yet implemented.")
