from datetime import date

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate
from app.utils.security import hash_password, verify_password


def _next_user_id(db: Session) -> str:
    count = db.query(User).count()
    return f"user_{count + 1:04d}"


def register_user(db: Session, payload: UserCreate) -> User:
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        id=_next_user_id(db),
        email=payload.email,
        name=payload.name,
        hashed_password=hash_password(payload.password),
        phone=payload.phone,
        role=payload.role,
        company=payload.company,
        city=payload.city,
        created_at=date.today().isoformat(),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str) -> User:
    user = db.query(User).filter(User.email == email).first()
    if not user or not user.hashed_password:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is deactivated")
    return user
