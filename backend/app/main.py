from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.products import router as products_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: add DB table creation here once DATABASE_URL is set
    yield
    # Shutdown: close connections here


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
    return {
        "status": "healthy",
        "service": "aayu-printing-api",
        "version": "1.0.0",
        "database": "connected" if settings.DATABASE_URL else "not configured (using mock data)",
    }
