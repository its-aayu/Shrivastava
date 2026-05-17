"""
JWT Authentication utilities — Phase 2B.

Architecture is defined here. Full implementation activates once:
  1. pip install python-jose[cryptography] passlib[bcrypt]  (already in requirements.txt)
  2. SECRET_KEY is set in backend/.env
  3. /api/v1/auth/signup and /api/v1/auth/login routes are wired in main.py

─────────────────────────────────────────────────────────────────────────────
PLANNED AUTH FLOW

  Signup:   POST /auth/signup   → hash password → create User → return tokens
  Login:    POST /auth/login    → verify password → return access + refresh tokens
  Refresh:  POST /auth/refresh  → verify refresh token → return new access token
  Me:       GET  /auth/me       → decode access token → return current user

TOKEN DESIGN
  Access token:   short-lived (30 min), carried in Authorization: Bearer header
  Refresh token:  long-lived (7 days),  stored in httpOnly cookie
  Algorithm:      HS256

PROTECTED ROUTES
  Use `current_user: User = Depends(get_current_user)` on any route that
  requires authentication. Role check: `if current_user.role != "admin": raise 403`
─────────────────────────────────────────────────────────────────────────────
"""

from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.config import settings

# Activate these imports once Phase 2B begins:
# from jose import JWTError, jwt
# from passlib.context import CryptContext

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
bearer_scheme = HTTPBearer(auto_error=False)


def hash_password(plain: str) -> str:
    """Hash a plain-text password with bcrypt."""
    # return pwd_context.hash(plain)
    raise NotImplementedError("Auth Phase 2B — uncomment passlib import to activate")


def verify_password(plain: str, hashed: str) -> bool:
    """Verify a plain password against its bcrypt hash."""
    # return pwd_context.verify(plain, hashed)
    raise NotImplementedError("Auth Phase 2B — uncomment passlib import to activate")


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a signed JWT access token."""
    # to_encode = data.copy()
    # expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    # to_encode.update({"exp": expire, "type": "access"})
    # return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    raise NotImplementedError("Auth Phase 2B")


def create_refresh_token(user_id: str) -> str:
    """Create a long-lived refresh token."""
    # return create_access_token(
    #     {"sub": user_id}, expires_delta=timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    # )
    raise NotImplementedError("Auth Phase 2B")


def decode_token(token: str) -> dict:
    """Decode and validate a JWT. Raises 401 on failure."""
    # try:
    #     return jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
    # except JWTError:
    #     raise HTTPException(status_code=401, detail="Invalid or expired token")
    raise NotImplementedError("Auth Phase 2B")


def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
    db=None,
):
    """
    FastAPI dependency — resolves the current authenticated user from the Bearer token.
    Usage:  current_user: User = Depends(get_current_user)
    """
    # if not credentials:
    #     raise HTTPException(status_code=401, detail="Not authenticated")
    # payload = decode_token(credentials.credentials)
    # user_id = payload.get("sub")
    # user = db.query(User).filter(User.id == user_id).first()
    # if not user or not user.is_active:
    #     raise HTTPException(status_code=401, detail="User not found or inactive")
    # return user
    raise NotImplementedError("Auth Phase 2B")
