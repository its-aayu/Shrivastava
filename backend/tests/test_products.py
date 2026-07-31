"""
Product endpoint tests.

Products are public (no auth). Tests cover: list shape, 404 on unknown id,
and that the category filter parameter is accepted without error.
"""


def test_products_list_returns_200(client):
    r = client.get("/api/v1/products/")
    assert r.status_code == 200


def test_products_list_returns_list_shape(client):
    r = client.get("/api/v1/products/")
    body = r.json()
    # Response must be a list or an object with a "data" key containing a list
    assert isinstance(body, (list, dict))
    if isinstance(body, dict):
        assert "data" in body or isinstance(next(iter(body.values()), None), list)


def test_products_filter_by_category_accepted(client):
    """Category filter must not crash; returns 200 regardless of whether rows exist."""
    r = client.get("/api/v1/products/", params={"category": "Men"})
    assert r.status_code == 200


def test_products_filter_by_featured(client):
    r = client.get("/api/v1/products/", params={"featured": "true"})
    assert r.status_code == 200


def test_product_not_found_returns_404(client):
    r = client.get("/api/v1/products/nonexistent-slug-xyz-999")
    assert r.status_code == 404


def test_products_no_auth_required(client):
    """Products must be accessible without a token (public catalog)."""
    r = client.get("/api/v1/products/")
    assert r.status_code != 401 and r.status_code != 403
