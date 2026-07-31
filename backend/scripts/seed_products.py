"""
Index the Velora product catalog into ChromaDB so the AI assistant
can answer questions about specific products, prices, and sizes.

Run from the backend/ directory:
    python scripts/seed_products.py

Re-running replaces old product chunks cleanly (same doc_id).
"""

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

PRODUCTS_FILE = (
    Path(__file__).parent.parent.parent / "frontend" / "src" / "mock-data" / "products.json"
)
DOC_ID = "velora_product_catalog"


def product_to_text(p: dict) -> str:
    """Convert a product dict to a natural-language description for embedding."""
    lines = [
        f"Product: {p['title']}",
        f"Category: {p['category']} — {p['subcategory']}",
        f"Price: ₹{p['price']} {p['price_unit']}",
    ]
    if p.get("material"):
        lines.append(f"Material: {p['material']}")
    if p.get("size"):
        lines.append(f"Available sizes: {p['size']}")
    if p.get("description"):
        lines.append(f"About: {p['description']}")
    if p.get("features"):
        lines.append("Features: " + " · ".join(p["features"]))
    if p.get("delivery_time"):
        lines.append(f"Delivery: {p['delivery_time']}")
    if p.get("min_quantity"):
        lines.append(f"Minimum order: {p['min_quantity']} piece(s)")
    tags = ", ".join(p.get("tags", []))
    if tags:
        lines.append(f"Tags: {tags}")
    return "\n".join(lines)


def main():
    if not PRODUCTS_FILE.exists():
        print(f"ERROR: products.json not found at {PRODUCTS_FILE}")
        sys.exit(1)

    print(f"Reading products from {PRODUCTS_FILE} ...")
    products = json.loads(PRODUCTS_FILE.read_text(encoding="utf-8"))
    print(f"  {len(products)} products loaded.")

    chunks = [product_to_text(p) for p in products]
    print(f"  {len(chunks)} product chunks created.")

    from app.services.chroma_service import add_chunks

    metadata = {
        "source": "velora_product_catalog",
        "uploaded_by": "system",
        "doc_type": "product_catalog",
    }
    stored = add_chunks(DOC_ID, chunks, metadata)
    print(f"  {stored} product chunks stored in ChromaDB under doc_id='{DOC_ID}'.")
    print("Done. The assistant can now answer questions about products, prices, and sizes.")


if __name__ == "__main__":
    main()
