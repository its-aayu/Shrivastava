from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    role: str = "customer"
    company: Optional[str] = None
    city: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, description="Plain-text password — hashed before storage")


class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    city: Optional[str] = None
    is_active: Optional[bool] = None


class UserResponse(UserBase):
    id: str
    total_orders: int = 0
    total_spend: int = 0
    preferred_products: List[str] = []
    is_active: bool = True
    created_at: Optional[str] = None

    model_config = {"from_attributes": True}


class UserListResponse(BaseModel):
    data: List[UserResponse]
    count: int
