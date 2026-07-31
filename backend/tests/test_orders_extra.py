"""
Extended order tests: admin visibility, status-update authorization, status validation.
"""
from tests.conftest import auth_headers, signup_user

_ORDER_PAYLOAD = {
    "product_id": "prod_001",
    "product_title": "Custom Hoodie",
    "quantity": 1,
    "unit_price": 799,
    "total_price": 799,
}


def _make_admin(db_session, email: str) -> None:
    from app.models.user import User
    user = db_session.query(User).filter(User.email == email).first()
    assert user is not None
    user.role = "admin"
    db_session.flush()


def _create_order(client, headers: dict) -> str:
    r = client.post("/api/v1/orders/", json=_ORDER_PAYLOAD, headers=headers)
    assert r.status_code == 201, r.text
    return r.json()["order_id"]


# ── Admin visibility (IDOR complement) ────────────────────────────────────────

def test_admin_can_see_any_order(client, db_session):
    """Admin must be able to read any user's order — no IDOR restriction for admins."""
    signup_user(client, "owner_x@test.com")
    signup_user(client, "admin_x@test.com")

    owner_headers = auth_headers(client, "owner_x@test.com")
    order_id = _create_order(client, owner_headers)

    _make_admin(db_session, "admin_x@test.com")
    admin_h = auth_headers(client, "admin_x@test.com")

    r = client.get(f"/api/v1/orders/{order_id}", headers=admin_h)
    assert r.status_code == 200
    assert r.json()["order_id"] == order_id


def test_admin_list_orders_sees_all(client, db_session):
    """Admin /orders/ list must not filter by user_id — returns all orders."""
    signup_user(client, "alice_o@test.com")
    signup_user(client, "bob_o@test.com")
    signup_user(client, "admin_o@test.com")

    _create_order(client, auth_headers(client, "alice_o@test.com"))
    _create_order(client, auth_headers(client, "bob_o@test.com"))

    _make_admin(db_session, "admin_o@test.com")
    admin_h = auth_headers(client, "admin_o@test.com")

    r = client.get("/api/v1/orders/", headers=admin_h)
    assert r.status_code == 200
    # At least 2 orders from different users must appear
    assert r.json()["count"] >= 2


# ── PATCH /orders/{id}/status — admin only ─────────────────────────────────────

def test_status_update_requires_admin(client):
    """Customer token must not be allowed to update order status."""
    signup_user(client, "cust_s@test.com")
    h = auth_headers(client, "cust_s@test.com")
    order_id = _create_order(client, h)
    r = client.patch(
        f"/api/v1/orders/{order_id}/status",
        params={"status": "dispatched"},
        headers=h,
    )
    assert r.status_code == 403


def test_status_update_unauthenticated_blocked(client):
    signup_user(client, "anon_s@test.com")
    h = auth_headers(client, "anon_s@test.com")
    order_id = _create_order(client, h)
    r = client.patch(f"/api/v1/orders/{order_id}/status", params={"status": "dispatched"})
    assert r.status_code == 401


def test_admin_can_update_status(client, db_session):
    signup_user(client, "owner_s@test.com")
    signup_user(client, "admin_s@test.com")

    owner_h = auth_headers(client, "owner_s@test.com")
    order_id = _create_order(client, owner_h)

    _make_admin(db_session, "admin_s@test.com")
    admin_h = auth_headers(client, "admin_s@test.com")

    r = client.patch(
        f"/api/v1/orders/{order_id}/status",
        params={"status": "proof_review"},
        headers=admin_h,
    )
    assert r.status_code == 200
    assert r.json()["status"] == "proof_review"


def test_invalid_status_value_rejected(client, db_session):
    """An invalid status string must return 4xx, not silently update."""
    signup_user(client, "owner_iv@test.com")
    signup_user(client, "admin_iv@test.com")

    owner_h = auth_headers(client, "owner_iv@test.com")
    order_id = _create_order(client, owner_h)

    _make_admin(db_session, "admin_iv@test.com")
    admin_h = auth_headers(client, "admin_iv@test.com")

    r = client.patch(
        f"/api/v1/orders/{order_id}/status",
        params={"status": "shipped_to_moon"},
        headers=admin_h,
    )
    assert r.status_code in (400, 422)
