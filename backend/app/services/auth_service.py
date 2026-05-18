"""Auth service — foundation only. DB integration activates in Phase 2B."""

from app.utils.auth import (
    create_access_token,
    create_refresh_token,
    hash_password,
    verify_password,
)


def register_user(email: str, password: str, name: str) -> dict:
    """Hash password and return user dict. DB write wired in Phase 2B."""
    hashed = hash_password(password)
    return {"email": email, "name": name, "hashed_password": hashed}


def authenticate_user(email: str, password: str) -> dict | None:
    """Verify credentials and return token pair. DB query wired in Phase 2B."""
    # user = db.query(User).filter(User.email == email).first()
    # if not user or not verify_password(password, user.hashed_password):
    #     return None
    # return {
    #     "access_token": create_access_token({"sub": str(user.id), "email": user.email}),
    #     "refresh_token": create_refresh_token(str(user.id)),
    # }
    raise NotImplementedError("Phase 2B — wire to database")
