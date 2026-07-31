"""
Additional auth edge-case tests.

Covers: role-escalation prevention, email validation, exact password-length boundary.
"""
from tests.conftest import signup_user


def test_signup_cannot_force_admin_role(client):
    """A body field role=admin must be silently ignored — server always creates customer."""
    r = client.post(
        "/api/v1/auth/signup",
        json={
            "name": "Hacker",
            "email": "hacker@test.com",
            "password": "Hacker@1234",
            "role": "admin",          # attacker-supplied — must be ignored
        },
    )
    assert r.status_code == 201
    assert r.json()["data"]["role"] == "customer"


def test_signup_invalid_email_rejected(client):
    r = client.post(
        "/api/v1/auth/signup",
        json={"name": "Bob", "email": "not-an-email", "password": "Bob@1234567"},
    )
    assert r.status_code == 422


def test_signup_password_nine_chars_rejected(client):
    """Exactly 9 chars — below the 10-char minimum — must be rejected."""
    r = client.post(
        "/api/v1/auth/signup",
        json={"name": "Min", "email": "min@test.com", "password": "Pass@1234"},  # 9 chars
    )
    assert r.status_code == 422


def test_signup_password_ten_chars_accepted(client):
    """Exactly 10 chars — the minimum — must be accepted."""
    r = client.post(
        "/api/v1/auth/signup",
        json={"name": "Min", "email": "min@test.com", "password": "Pass@12345"},  # 10 chars
    )
    assert r.status_code == 201


def test_signup_missing_name_rejected(client):
    r = client.post(
        "/api/v1/auth/signup",
        json={"email": "noname@test.com", "password": "Pass@12345"},
    )
    assert r.status_code == 422


def test_login_returns_jwt(client):
    """Login response must include an access_token string."""
    signup_user(client, "jwt@test.com")
    r = client.post("/api/v1/auth/login", json={"email": "jwt@test.com", "password": "Test@12345"})
    assert r.status_code == 200
    token = r.json()["data"]["access_token"]
    assert isinstance(token, str) and len(token) > 20
