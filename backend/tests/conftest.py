"""
Shared pytest fixtures.

Uses an in-memory SQLite database so tests run without a real PostgreSQL
connection. JSONB columns are downgraded to JSON before table creation so
SQLite can handle them.
"""
import pytest
import sqlalchemy as sa
from sqlalchemy import create_engine
from sqlalchemy.dialects import postgresql
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

TEST_DB_URL = "sqlite:///:memory:"


@pytest.fixture(autouse=True)
def reset_rate_limits():
    """Reset slowapi in-memory counters before every test to prevent bleed-over."""
    from app.core.limiter import limiter
    limiter._storage.reset()
    yield
    limiter._storage.reset()


@pytest.fixture(scope="session")
def db_engine():
    engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False})

    import app.models  # noqa: F401 — registers all ORM models
    from app.db.database import Base

    # SQLite doesn't support JSONB — swap to JSON before DDL
    for table in Base.metadata.tables.values():
        for col in table.columns:
            if isinstance(col.type, postgresql.JSONB):
                col.type = sa.JSON()

    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def db_session(db_engine):
    """Each test gets a fresh transaction that's rolled back on teardown."""
    conn = db_engine.connect()
    txn = conn.begin()
    Session = sessionmaker(bind=conn)
    session = Session()
    yield session
    session.close()
    txn.rollback()
    conn.close()


@pytest.fixture()
def client(db_session):
    """TestClient wired to the in-memory test database."""
    from app.db.database import get_db
    from app.main import app

    def _override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = _override_get_db
    with TestClient(app, raise_server_exceptions=True) as c:
        yield c
    app.dependency_overrides.pop(get_db, None)


# ── Helpers ────────────────────────────────────────────────────────────────────

def signup_user(client: TestClient, email: str, name: str = "Test User", password: str = "Test@12345") -> dict:
    """Sign up a new user and return the full response JSON."""
    r = client.post(
        "/api/v1/auth/signup",
        json={"name": name, "email": email, "password": password},
    )
    assert r.status_code == 201, r.text
    return r.json()


def auth_headers(client: TestClient, email: str, password: str = "Test@12345") -> dict:
    """Log in and return Authorization header dict."""
    r = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": password},
    )
    assert r.status_code == 200, r.text
    token = r.json()["data"]["access_token"]
    return {"Authorization": f"Bearer {token}"}
