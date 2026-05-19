from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, SignupResponse, Token
from app.schemas.user import UserCreate, UserResponse
from app.services.auth_service import authenticate_user, register_user
from app.utils.auth import create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])


def _require_db(db: Session) -> Session:
    if db is None:
        raise HTTPException(status_code=503, detail="Database not configured")
    return db


@router.post("/signup", response_model=SignupResponse, status_code=201)
async def signup(payload: UserCreate, db: Session = Depends(get_db)):
    db = _require_db(db)
    user = register_user(db, payload)
    token = create_access_token({"sub": user.id, "email": user.email})
    return SignupResponse(
        access_token=token,
        user_id=user.id,
        email=user.email,
        name=user.name,
    )


@router.post("/login", response_model=Token)
async def login(payload: LoginRequest, db: Session = Depends(get_db)):
    db = _require_db(db)
    user = authenticate_user(db, payload.email, payload.password)
    token = create_access_token({"sub": user.id, "email": user.email})
    return Token(access_token=token)


@router.get("/me", response_model=UserResponse)
async def me(current_user: User = Depends(get_current_user)):
    return current_user
