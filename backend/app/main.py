import logging
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.core.config import settings
from app.core.limiter import limiter

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
    datefmt="%H:%M:%S",
)
from app.api.auth import router as auth_router
from app.api.products import router as products_router
from app.api.orders import router as orders_router
from app.api.uploads import router as uploads_router
from app.api.chat import router as chat_router
from app.api.admin import router as admin_router
from app.api.search import router as search_router
from app.api.payments import router as payments_router


log = logging.getLogger("velora")

_DEV_SECRET = "dev-only-secret-change-before-deploy"


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Import all models before create_tables() so SQLAlchemy sees them
    import app.models.order_item  # noqa: F401
    from app.db.database import create_tables
    create_tables()

    if not settings.DEBUG and settings.SECRET_KEY == _DEV_SECRET:
        raise RuntimeError(
            "SECRET_KEY is set to the dev default — set a real secret in .env before deploying."
        )
    if settings.SECRET_KEY == _DEV_SECRET:
        log.warning("⚠  Using dev SECRET_KEY — change before deploying to production")

    # Pre-warm ChromaDB: loads the SentenceTransformer model once at startup
    # so the first user request is fast instead of waiting ~18s for model loading.
    try:
        from app.services.chroma_service import _get_collection
        _get_collection()
        log.info("ChromaDB ready — embedding model pre-warmed")
    except Exception as exc:
        log.warning("ChromaDB warm-up failed (non-fatal): %s", exc)

    yield


app = FastAPI(
    title="VELORA STUDIO API",
    description="Backend API for VELORA STUDIO — AI-powered print SaaS platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ── Rate limiting ──────────────────────────────────────────────────────────────
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ── CORS ───────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)


# ── Request logging + security headers ────────────────────────────────────────
_access_log = logging.getLogger("velora.access")

# Paths too noisy to log every hit
_SKIP_LOG = {"/", "/health", "/docs", "/redoc", "/openapi.json"}

@app.middleware("http")
async def request_middleware(request: Request, call_next):
    t0 = time.perf_counter()
    response = await call_next(request)
    latency_ms = round((time.perf_counter() - t0) * 1000)

    if request.url.path not in _SKIP_LOG:
        _access_log.info(
            "%s %s %s  %dms",
            request.method,
            request.url.path,
            response.status_code,
            latency_ms,
        )

    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth_router, prefix="/api/v1")
app.include_router(products_router, prefix="/api/v1")
app.include_router(orders_router, prefix="/api/v1")
app.include_router(uploads_router, prefix="/api/v1")
app.include_router(chat_router, prefix="/api/v1")
app.include_router(admin_router, prefix="/api/v1")
app.include_router(search_router, prefix="/api/v1")
app.include_router(payments_router, prefix="/api/v1")


# ── Root routes ───────────────────────────────────────────────────────────────
@app.get("/", tags=["Root"])
async def root():
    return {
        "service": "VELORA STUDIO API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
    }


@app.get("/health", tags=["Root"])
async def health_check():
    from app.db.database import ping_db

    if not settings.DATABASE_URL:
        db_status = "not configured — using mock data"
    elif ping_db():
        db_status = "connected"
    else:
        db_status = "error — could not reach database"

    try:
        from app.services.chroma_service import chunk_count
        chroma_status = f"ready — {chunk_count()} chunks"
    except Exception as exc:
        chroma_status = f"error — {exc}"

    overall = "healthy" if "error" not in db_status and "error" not in chroma_status else "degraded"

    return {
        "status": overall,
        "service": "velora-studio-api",
        "version": "1.0.0",
        "database": db_status,
        "vector_store": chroma_status,
    }
