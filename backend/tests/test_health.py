"""Health endpoint smoke tests — no database or ChromaDB required."""


def test_health_returns_200(client):
    r = client.get("/health")
    assert r.status_code == 200


def test_health_shape(client):
    body = client.get("/health").json()
    assert body["service"] == "velora-studio-api"
    assert body["version"] == "1.0.0"
    assert body["status"] in ("healthy", "degraded")
    assert "database" in body
    assert "vector_store" in body


def test_root_returns_200(client):
    r = client.get("/")
    assert r.status_code == 200
    assert r.json()["service"] == "VELORA STUDIO API"
