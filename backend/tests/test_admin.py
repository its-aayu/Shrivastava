"""
Admin endpoint authorization tests.

Verifies that every /admin/* route returns 401 without a token and 403 with a
customer token — and that a real admin token IS accepted.
"""
from tests.conftest import auth_headers, signup_user


def _make_admin(db_session, email: str) -> None:
    """Directly promote a user to admin within the test transaction."""
    from app.models.user import User
    user = db_session.query(User).filter(User.email == email).first()
    assert user is not None, f"User {email!r} not found"
    user.role = "admin"
    db_session.flush()


# ── Unauthenticated access ─────────────────────────────────────────────────────

def test_admin_users_requires_auth(client):
    r = client.get("/api/v1/admin/users")
    assert r.status_code == 401


def test_admin_stats_requires_auth(client):
    r = client.get("/api/v1/admin/stats")
    assert r.status_code == 401


# ── Customer token — should be 403, not admin data ────────────────────────────

def test_customer_cannot_list_users(client):
    signup_user(client, "cust@test.com")
    headers = auth_headers(client, "cust@test.com")
    r = client.get("/api/v1/admin/users", headers=headers)
    assert r.status_code == 403


def test_customer_cannot_get_stats(client):
    signup_user(client, "cust2@test.com")
    headers = auth_headers(client, "cust2@test.com")
    r = client.get("/api/v1/admin/stats", headers=headers)
    assert r.status_code == 403


def test_customer_cannot_set_role(client, db_session):
    signup_user(client, "cust3@test.com")
    headers = auth_headers(client, "cust3@test.com")
    r = client.put(
        "/api/v1/admin/users/some-user-id/role",
        params={"role": "admin"},
        headers=headers,
    )
    assert r.status_code == 403


# ── Admin token — must be accepted ────────────────────────────────────────────

def test_admin_can_list_users(client, db_session):
    signup_user(client, "admin@test.com")
    _make_admin(db_session, "admin@test.com")
    headers = auth_headers(client, "admin@test.com")
    r = client.get("/api/v1/admin/users", headers=headers)
    assert r.status_code == 200
    data = r.json()
    assert "data" in data
    assert "count" in data


def test_admin_can_get_stats(client, db_session):
    signup_user(client, "admin2@test.com")
    _make_admin(db_session, "admin2@test.com")
    headers = auth_headers(client, "admin2@test.com")
    r = client.get("/api/v1/admin/stats", headers=headers)
    assert r.status_code == 200
    body = r.json()
    for key in ("total_users", "total_orders", "total_revenue", "pending_orders"):
        assert key in body


def test_admin_invalid_role_value_rejected(client, db_session):
    """PUT /admin/users/{id}/role with an invalid role value must return 400."""
    signup_user(client, "admin3@test.com")
    _make_admin(db_session, "admin3@test.com")
    admin_headers = auth_headers(client, "admin3@test.com")
    r = client.put(
        "/api/v1/admin/users/some-id/role",
        params={"role": "superuser"},  # invalid
        headers=admin_headers,
    )
    assert r.status_code == 400
