from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.core.config import settings


class Base(DeclarativeBase):
    pass


# Engine and session are only created when DATABASE_URL is configured.
# Until then, the service layer falls back to mock JSON data.
engine = None
SessionLocal = None

if settings.DATABASE_URL:
    engine = create_engine(
        settings.DATABASE_URL,
        pool_pre_ping=True,      # auto-reconnect on stale connections
        pool_size=5,
        max_overflow=10,
    )
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """FastAPI dependency — yields a DB session, or None when DB is not configured."""
    if SessionLocal is None:
        yield None
        return

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    """Create all tables defined via Base subclasses. Call on startup once DB is configured."""
    if engine:
        Base.metadata.create_all(bind=engine)


def ping_db() -> bool:
    """Returns True if the DB connection is alive."""
    if engine is None:
        return False
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception:
        return False
