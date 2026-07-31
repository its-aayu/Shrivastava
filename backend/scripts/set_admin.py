"""
Promote a user to admin.

Usage (run from backend/ directory):
    python set_admin.py your@email.com
    python set_admin.py your@email.com --demote   # back to customer
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.db.database import SessionLocal
from app.models.user import User


def main():
    if len(sys.argv) < 2:
        print("Usage: python set_admin.py <email> [--demote]")
        sys.exit(1)

    email = sys.argv[1]
    new_role = "customer" if "--demote" in sys.argv else "admin"

    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            print(f"ERROR: No user found with email '{email}'")
            print("Tip: Sign up first via the frontend, then run this script.")
            sys.exit(1)

        old_role = user.role
        user.role = new_role
        db.commit()
        print(f"OK    {email}  →  {old_role} → {new_role}")
    except Exception as e:
        db.rollback()
        print(f"ERROR: {e}")
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    main()
