"""Auth routes — foundation only. Full implementation activates in Phase 2B."""

from fastapi import APIRouter

from app.schemas.auth import LoginRequest, Token
from app.schemas.user import UserCreate

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/signup", status_code=201)
async def signup(payload: UserCreate):
    """Register a new user. Phase 2B wires this to the database."""
    return {
        "message": "Signup foundation ready — DB integration in Phase 2B",
        "email": payload.email,
    }


@router.post("/login")
async def login(payload: LoginRequest):
    """Authenticate and return JWT tokens. Phase 2B wires this to the database."""
    return {
        "message": "Login foundation ready — DB integration in Phase 2B",
        "email": payload.email,
    }
