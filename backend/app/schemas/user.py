from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    company: Optional[str] = Field(None, max_length=120)
    city: Optional[str] = Field(None, max_length=80)


class UserCreate(UserBase):
    password: str = Field(..., min_length=10, max_length=128, description="Plain-text password — hashed before storage")
    # role is intentionally absent — always assigned server-side as "customer"


class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    city: Optional[str] = None
    is_active: Optional[bool] = None


class UserResponse(UserBase):
    id: str
    role: str = "customer"
    total_orders: int = 0
    total_spend: int = 0
    preferred_products: List[str] = []
    is_active: bool = True
    created_at: Optional[str] = None

    model_config = {"from_attributes": True}


class UserListResponse(BaseModel):
    data: List[UserResponse]
    count: int
