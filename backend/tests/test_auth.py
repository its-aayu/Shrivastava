"""Auth endpoint integration tests: signup, login, /me."""
import pytest
from tests.conftest import auth_headers, signup_user


USER_A = {"email": "alice@test.com", "name": "Alice", "password": "Alice@1234"}


def test_signup_creates_user(client):
    resp = signup_user(client, USER_A["email"], USER_A["name"], USER_A["password"])
    data = resp["data"]
    assert data["email"] == USER_A["email"]
    assert data["name"] == USER_A["name"]
    assert "access_token" in data
    assert data["role"] == "customer"


def test_signup_duplicate_email_rejected(client):
    signup_user(client, USER_A["email"], USER_A["name"], USER_A["password"])
    r = client.post(
        "/api/v1/auth/signup",
        json={"name": USER_A["name"], "email": USER_A["email"], "password": USER_A["password"]},
    )
    assert r.status_code == 409


def test_signup_weak_password_rejected(client):
    r = client.post(
        "/api/v1/auth/signup",
        json={"name": "Bob", "email": "bob@test.com", "password": "short"},
    )
    assert r.status_code == 422


def test_login_success(client):
    signup_user(client, USER_A["email"], USER_A["name"], USER_A["password"])
    r = client.post(
        "/api/v1/auth/login",
        json={"email": USER_A["email"], "password": USER_A["password"]},
    )
    assert r.status_code == 200
    assert "access_token" in r.json()["data"]


def test_login_wrong_password(client):
    signup_user(client, USER_A["email"], USER_A["name"], USER_A["password"])
    r = client.post(
        "/api/v1/auth/login",
        json={"email": USER_A["email"], "password": "WrongPass@99"},
    )
    assert r.status_code == 401


def test_login_unknown_email(client):
    r = client.post(
        "/api/v1/auth/login",
        json={"email": "nobody@test.com", "password": "anything"},
    )
    assert r.status_code == 401


def test_me_returns_current_user(client):
    signup_user(client, USER_A["email"], USER_A["name"], USER_A["password"])
    headers = auth_headers(client, USER_A["email"], USER_A["password"])
    r = client.get("/api/v1/auth/me", headers=headers)
    assert r.status_code == 200
    assert r.json()["email"] == USER_A["email"]


def test_me_without_token_rejected(client):
    r = client.get("/api/v1/auth/me")
    assert r.status_code == 401


def test_me_invalid_token_rejected(client):
    r = client.get("/api/v1/auth/me", headers={"Authorization": "Bearer bad.token.here"})
    assert r.status_code == 401
