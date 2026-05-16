from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query

from app.db.database import get_db
from app.schemas.product import ProductListResponse, ProductResponse
from app.services import product_service

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("/", response_model=ProductListResponse, summary="List all products")
def list_products(
    category: Optional[str] = Query(None, description="Filter by category_id (e.g. cat_001)"),
    featured: bool = Query(False, description="Return only featured products"),
    in_stock: bool = Query(False, description="Return only in-stock products"),
    skip: int = Query(0, ge=0, description="Pagination offset"),
    limit: int = Query(50, ge=1, le=100, description="Max results"),
    db=Depends(get_db),
):
    products = product_service.get_all_products(
        db=db,
        category_id=category,
        featured_only=featured,
        in_stock_only=in_stock,
        skip=skip,
        limit=limit,
    )
    return {"data": products, "count": len(products)}


# NOTE: /featured must be declared BEFORE /{product_id} to avoid FastAPI
# treating "featured" as a path parameter value.
@router.get("/featured", response_model=list[ProductResponse], summary="Get featured products")
def get_featured(db=Depends(get_db)):
    return product_service.get_featured_products(db=db)


@router.get("/{product_id}", response_model=ProductResponse, summary="Get single product by id or slug")
def get_product(product_id: str, db=Depends(get_db)):
    product = product_service.get_product_by_id(product_id, db)
    if not product:
        raise HTTPException(status_code=404, detail=f"Product '{product_id}' not found")
    return product
