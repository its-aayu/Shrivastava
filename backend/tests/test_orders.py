"""
Order endpoint tests — focused on IDOR protection.

Verifies that users can only access their own orders, not other users'.
"""
from tests.conftest import auth_headers, signup_user

_ORDER_PAYLOAD = {
    "product_id": "prod_001",
    "product_title": "Business Cards",
    "quantity": 100,
    "unit_price": 500,
    "total_price": 50000,
    "finish": "matte",
    "size": "standard",
}


def _create_order(client, headers: dict) -> str:
    r = client.post("/api/v1/orders/", json=_ORDER_PAYLOAD, headers=headers)
    assert r.status_code == 201, r.text
    return r.json()["order_id"]


def test_user_can_see_own_order(client):
    signup_user(client, "owner@test.com", "Owner")
    headers = auth_headers(client, "owner@test.com")
    order_id = _create_order(client, headers)

    r = client.get(f"/api/v1/orders/{order_id}", headers=headers)
    assert r.status_code == 200
    assert r.json()["order_id"] == order_id


def test_other_user_cannot_see_order(client):
    """IDOR: user B must not access user A's order."""
    signup_user(client, "user_a@test.com", "User A")
    signup_user(client, "user_b@test.com", "User B")

    headers_a = auth_headers(client, "user_a@test.com")
    headers_b = auth_headers(client, "user_b@test.com")

    order_id = _create_order(client, headers_a)

    r = client.get(f"/api/v1/orders/{order_id}", headers=headers_b)
    assert r.status_code == 403


def test_unauthenticated_cannot_list_orders(client):
    r = client.get("/api/v1/orders/")
    assert r.status_code == 401


def test_user_list_orders_only_own(client):
    """Listing orders returns only the authenticated user's orders."""
    signup_user(client, "alice@test.com", "Alice")
    signup_user(client, "bob@test.com", "Bob")

    headers_alice = auth_headers(client, "alice@test.com")
    headers_bob = auth_headers(client, "bob@test.com")

    _create_order(client, headers_alice)
    _create_order(client, headers_bob)

    r = client.get("/api/v1/orders/", headers=headers_alice)
    assert r.status_code == 200
    data = r.json()["data"]
    user_ids = {o["user_id"] for o in data}
    # Alice should only see her own orders — no Bob's user_id in the list
    assert len(user_ids) == 1


def test_nonexistent_order_returns_404(client):
    signup_user(client, "charlie@test.com", "Charlie")
    headers = auth_headers(client, "charlie@test.com")
    r = client.get("/api/v1/orders/nonexistent-id-999", headers=headers)
    assert r.status_code == 404
