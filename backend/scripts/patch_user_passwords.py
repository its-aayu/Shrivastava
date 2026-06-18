"""
One-shot script — fixes the broken placeholder hashes in the users table.

Run once from backend/ directory:
    python patch_user_passwords.py

Sets every user whose hash starts with "$2b$12$placeholder" to a real
bcrypt hash of "Velora@2024". Users who registered via the signup API are
NOT touched (their hashes are already valid bcrypt).
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from app.db.database import SessionLocal
from app.models.user import User
from app.utils.security import hash_password

BROKEN_PREFIX = "$2b$12$placeholder"
DEFAULT_PASSWORD = "Velora@2024"


def main():
    db = SessionLocal()
    try:
        broken = (
            db.query(User)
            .filter(User.hashed_password.like(f"{BROKEN_PREFIX}%"))
            .all()
        )

        if not broken:
            print("No broken hashes found — all users look healthy.")
            return

        real_hash = hash_password(DEFAULT_PASSWORD)
        for user in broken:
            print(f"  Patching {user.email}")
            user.hashed_password = real_hash

        db.commit()
        print(f"\nDone — patched {len(broken)} user(s).")
        print(f"Default password for all patched users: {DEFAULT_PASSWORD}")
    except Exception as e:
        db.rollback()
        print(f"ERROR: {e}")
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    main()
