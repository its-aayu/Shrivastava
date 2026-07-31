"""
Reset a user's password to a proper bcrypt hash.

Usage:
    python reset_password.py <email>

You will be prompted for the new password (hidden input).
"""

import sys
import getpass
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.db.database import SessionLocal
from app.models.user import User
from app.utils.security import hash_password


def main():
    if len(sys.argv) < 2:
        print("Usage: python reset_password.py <email>")
        sys.exit(1)

    email = sys.argv[1]
    password = getpass.getpass(f"New password for {email}: ")

    if len(password) < 6:
        print("ERROR: Password must be at least 6 characters.")
        sys.exit(1)

    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            print(f"ERROR: No user found with email '{email}'")
            sys.exit(1)

        user.hashed_password = hash_password(password)
        db.commit()
        print(f"OK    Password updated for {email} (role: {user.role})")
    except Exception as e:
        db.rollback()
        print(f"ERROR: {e}")
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    main()
