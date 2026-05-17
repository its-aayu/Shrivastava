"""
Product service layer.

Data source priority:
  1. PostgreSQL (when DATABASE_URL is set and db session is provided)
  2. Mock JSON fallback (when no DB is configured — development default)
"""

import json
from pathlib import Path
from typing import Optional

_MOCK_FILE = Path(__file__).parent.parent.parent.parent / "src" / "mock-data" / "products.json"


def _load_mock() -> list[dict]:
    with open(_MOCK_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


# ── Public service functions ──────────────────────────────────────────────────

def get_all_products(
    db=None,
    category_id: Optional[str] = None,
    featured_only: bool = False,
    in_stock_only: bool = False,
    skip: int = 0,
    limit: int = 50,
) -> list:
    if db is not None:
        from app.models.product import Product
        q = db.query(Product)
        if category_id:
            q = q.filter(Product.category_id == category_id)
        if featured_only:
            q = q.filter(Product.is_featured == True)  # noqa: E712
        if in_stock_only:
            q = q.filter(Product.in_stock == True)     # noqa: E712
        return q.offset(skip).limit(limit).all()

    # ── Mock fallback ──
    products = _load_mock()
    if category_id:
        products = [p for p in products if p.get("category_id") == category_id]
    if featured_only:
        products = [p for p in products if p.get("is_featured")]
    if in_stock_only:
        products = [p for p in products if p.get("in_stock", True)]
    return products[skip: skip + limit]


def get_product_by_id(product_id: str, db=None) -> Optional[object]:
    if db is not None:
        from app.models.product import Product
        return (
            db.query(Product)
            .filter((Product.id == product_id) | (Product.slug == product_id))
            .first()
        )

    products = _load_mock()
    return next(
        (p for p in products if p["id"] == product_id or p["slug"] == product_id),
        None,
    )


def get_featured_products(db=None) -> list:
    return get_all_products(db=db, featured_only=True)


def get_products_by_category(category_id: str, db=None) -> list:
    return get_all_products(db=db, category_id=category_id)


def count_products(db=None) -> int:
    if db is not None:
        from app.models.product import Product
        return db.query(Product).count()
    return len(_load_mock())
