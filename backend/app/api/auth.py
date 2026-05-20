from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.schemas.auth import AuthResponse, LoginRequest, SignupResponse, Token
from app.schemas.user import UserCreate, UserResponse
from app.services.auth_service import authenticate_user, register_user
from app.utils.auth import get_current_user
from app.utils.security import create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])


def _require_db(db: Session) -> Session:
    if db is None:
        raise HTTPException(status_code=503, detail="Database not configured")
    return db


def _token_for(user: User) -> str:
    """Build JWT payload including role for downstream RBAC checks."""
    return create_access_token({"sub": user.id, "email": user.email, "role": user.role})


@router.post("/signup", response_model=AuthResponse, status_code=201)
async def signup(payload: UserCreate, db: Session = Depends(get_db)):
    db = _require_db(db)
    user = register_user(db, payload)
    return AuthResponse(
        message="Account created successfully",
        data=SignupResponse(
            access_token=_token_for(user),
            user_id=user.id,
            email=user.email,
            name=user.name,
            role=user.role,
        ),
    )


@router.post("/login", response_model=AuthResponse)
async def login(payload: LoginRequest, db: Session = Depends(get_db)):
    db = _require_db(db)
    user = authenticate_user(db, payload.email, payload.password)
    return AuthResponse(
        message="Login successful",
        data=Token(access_token=_token_for(user)),
    )


@router.get("/me", response_model=UserResponse)
async def me(current_user: User = Depends(get_current_user)):
    return current_user
