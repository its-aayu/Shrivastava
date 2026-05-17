"""
Database seeding script — loads all mock JSON data into PostgreSQL.

Run from backend/ directory:
    python seed.py           # seed (skips tables that already have rows)
    python seed.py --force   # drop all data and re-seed

Prerequisites:
    - DATABASE_URL set in backend/.env
    - pip install -r requirements.txt
"""

import json
import sys
from pathlib import Path

# ── Ensure app package is importable from backend/ ───────────────────────────
sys.path.insert(0, str(Path(__file__).parent))

from app.core.config import settings

if not settings.DATABASE_URL:
    print("ERROR: DATABASE_URL is empty in backend/.env")
    print("Add your Neon connection string and run again.")
    sys.exit(1)

from app.db.database import SessionLocal, create_tables
import app.models  # registers all models with Base.metadata  # noqa: F401
from app.models.product import Product
from app.models.user import User
from app.models.order import Order
from app.models.document import Document
from app.models.faq import FAQ

# Path to the shared mock-data directory
DATA_DIR = Path(__file__).parent.parent / "src" / "mock-data"

FORCE = "--force" in sys.argv


def load_json(filename: str) -> list[dict]:
    with open(DATA_DIR / filename, "r", encoding="utf-8") as f:
        return json.load(f)


def already_seeded(db, model, label: str) -> bool:
    count = db.query(model).count()
    if count > 0 and not FORCE:
        print(f"  SKIP  {label} — {count} rows exist (use --force to re-seed)")
        return True
    return False


def clear(db, model):
    db.query(model).delete()
    db.commit()


# ── Seeding functions ─────────────────────────────────────────────────────────

def seed_products(db):
    label = "products"
    if already_seeded(db, Product, label):
        return
    if FORCE:
        clear(db, Product)

    rows = load_json("products.json")
    for row in rows:
        db.add(Product(
            id=row["id"],
            slug=row["slug"],
            title=row["title"],
            category_id=row["category_id"],
            category=row["category"],
            description=row.get("description"),
            price=row["price"],
            price_unit=row.get("price_unit", "per set"),
            currency=row.get("currency", "INR"),
            material=row.get("material"),
            finish=row.get("finish"),
            size=row.get("size"),
            delivery_time=row.get("delivery_time"),
            min_quantity=row.get("min_quantity", 1),
            features=row.get("features", []),
            images=row.get("images", []),
            tags=row.get("tags", []),
            rating=row.get("rating", 0.0),
            review_count=row.get("review_count", 0),
            is_featured=row.get("is_featured", False),
            in_stock=row.get("in_stock", True),
        ))
    db.commit()
    print(f"  OK    {label} — {len(rows)} rows inserted")


def seed_users(db):
    label = "users"
    if already_seeded(db, User, label):
        return
    if FORCE:
        clear(db, User)

    rows = load_json("users.json")
    # Placeholder password hash — real auth hash assigned during signup flow
    placeholder_hash = "$2b$12$placeholder.hash.not.real.changeme"

    for row in rows:
        db.add(User(
            id=row["id"],
            name=row["name"],
            email=row["email"],
            hashed_password=placeholder_hash,
            phone=row.get("phone"),
            role=row.get("role", "customer"),
            company=row.get("company"),
            city=row.get("city"),
            notes=row.get("notes"),
            total_orders=row.get("total_orders", 0),
            total_spend=row.get("total_spend", 0),
            preferred_products=row.get("preferred_products", []),
            created_at=row.get("created_at"),
        ))
    db.commit()
    print(f"  OK    {label} — {len(rows)} rows inserted")


def seed_orders(db):
    label = "orders"
    if already_seeded(db, Order, label):
        return
    if FORCE:
        clear(db, Order)

    rows = load_json("orders.json")
    for row in rows:
        db.add(Order(
            order_id=row["order_id"],
            user_id=row["user_id"],
            product_id=row["product_id"],
            product_title=row["product_title"],
            status=row["status"],
            quantity=row["quantity"],
            unit_price=row["unit_price"],
            total_price=row["total_price"],
            finish=row.get("finish"),
            size=row.get("size"),
            notes=row.get("notes"),
            artwork_approved=row.get("artwork_approved", False),
            created_at=row.get("created_at"),
            dispatched_at=row.get("dispatched_at"),
            delivered_at=row.get("delivered_at"),
        ))
    db.commit()
    print(f"  OK    {label} — {len(rows)} rows inserted")


def seed_documents(db):
    label = "documents"
    if already_seeded(db, Document, label):
        return
    if FORCE:
        clear(db, Document)

    rows = load_json("documents.json")
    for row in rows:
        db.add(Document(
            doc_id=row["doc_id"],
            title=row["title"],
            category=row["category"],
            content=row["content"],
            tags=row.get("tags", []),
            source=row.get("source"),
        ))
    db.commit()
    print(f"  OK    {label} — {len(rows)} rows inserted")


def seed_faqs(db):
    label = "faqs"
    if already_seeded(db, FAQ, label):
        return
    if FORCE:
        clear(db, FAQ)

    rows = load_json("faq.json")
    for i, row in enumerate(rows):
        db.add(FAQ(
            id=row["id"],
            question=row["question"],
            answer=row["answer"],
            category=row["category"],
            sort_order=i,
        ))
    db.commit()
    print(f"  OK    {label} — {len(rows)} rows inserted")


# ── Main ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("Aayu Printing Studio — database seeder")
    print(f"Mode: {'FORCE (clear + re-seed)' if FORCE else 'safe (skip existing)'}")
    print()

    print("Creating tables...")
    create_tables()
    print("  OK    tables ready")
    print()

    db = SessionLocal()
    try:
        print("Seeding data...")
        seed_products(db)
        seed_users(db)
        seed_orders(db)       # depends on users + products existing
        seed_documents(db)
        seed_faqs(db)
    except Exception as e:
        db.rollback()
        print(f"\nERROR: {e}")
        print("Transaction rolled back. Fix the error and run again.")
        sys.exit(1)
    finally:
        db.close()

    print()
    print("Seeding complete.")
