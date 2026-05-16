from typing import List, Optional

from pydantic import BaseModel, Field


class ProductBase(BaseModel):
    title: str
    category_id: str
    category: str
    description: Optional[str] = None

    price: int = Field(..., gt=0, description="Price in INR")
    price_unit: str = "per set"
    currency: str = "INR"

    material: Optional[str] = None
    finish: Optional[str] = None
    size: Optional[str] = None
    delivery_time: Optional[str] = None
    min_quantity: int = 1

    features: List[str] = []
    images: List[str] = []
    tags: List[str] = []

    is_featured: bool = False
    in_stock: bool = True


class ProductCreate(ProductBase):
    id: str
    slug: str


class ProductUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[int] = Field(None, gt=0)
    is_featured: Optional[bool] = None
    in_stock: Optional[bool] = None
    finish: Optional[str] = None
    material: Optional[str] = None


class ProductResponse(ProductBase):
    id: str
    slug: str
    rating: float = 0.0
    review_count: int = 0

    model_config = {"from_attributes": True}


class ProductListResponse(BaseModel):
    data: List[ProductResponse]
    count: int
