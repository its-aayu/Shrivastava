"""
Product service layer — PostgreSQL backed via SQLAlchemy.
All functions require a live db session; raises RuntimeError if None is passed.
"""

from typing import Optional

from fastapi import HTTPException


def _require_db(db):
    if db is None:
        raise HTTPException(status_code=503, detail="Database not available")
    return db


def get_all_products(
    db=None,
    category_id: Optional[str] = None,
    featured_only: bool = False,
    in_stock_only: bool = False,
    skip: int = 0,
    limit: int = 50,
) -> list:
    db = _require_db(db)
    from app.models.product import Product
    q = db.query(Product)
    if category_id:
        q = q.filter(Product.category_id == category_id)
    if featured_only:
        q = q.filter(Product.is_featured == True)  # noqa: E712
    if in_stock_only:
        q = q.filter(Product.in_stock == True)     # noqa: E712
    return q.offset(skip).limit(limit).all()


def get_product_by_id(product_id: str, db=None) -> Optional[object]:
    db = _require_db(db)
    from app.models.product import Product
    return (
        db.query(Product)
        .filter((Product.id == product_id) | (Product.slug == product_id))
        .first()
    )


def get_featured_products(db=None) -> list:
    return get_all_products(db=db, featured_only=True)


def get_products_by_category(category_id: str, db=None) -> list:
    return get_all_products(db=db, category_id=category_id)


def count_products(db=None) -> int:
    db = _require_db(db)
    from app.models.product import Product
    return db.query(Product).count()
