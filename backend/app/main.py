from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.products import router as products_router
from app.api.orders import router as orders_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create all DB tables (no-op when DATABASE_URL is empty)
    from app.db.database import create_tables
    create_tables()
    yield
    # Shutdown: SQLAlchemy connection pool closes automatically


app = FastAPI(
    title="Aayu Printing Studio API",
    description="Backend API for Aayu Printing Studio — AI-powered print SaaS platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(products_router, prefix="/api/v1")
app.include_router(orders_router, prefix="/api/v1")


# ── Root routes ───────────────────────────────────────────────────────────────
@app.get("/", tags=["Root"])
async def root():
    return {
        "service": "Aayu Printing Studio API",
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

    return {
        "status": "healthy",
        "service": "aayu-printing-api",
        "version": "1.0.0",
        "database": db_status,
    }
