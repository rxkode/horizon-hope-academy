"""
Horizon Hope Academy — FastAPI Application Entry Point
OWASP Top 10 hardening applied at middleware level.
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from app.core.config import get_settings
from app.api.v1.router import api_router

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: DB tables are created via Alembic migrations, not here
    print(f"🚀 {settings.app_name} starting — env: {settings.app_env}")
    yield
    print("🛑 Shutting down gracefully")


app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    docs_url="/api/docs" if settings.debug else None,   # hide docs in prod
    redoc_url="/api/redoc" if settings.debug else None,
    lifespan=lifespan,
)

# ── Security Middleware ───────────────────────────────────────
# OWASP A05 — Security Misconfiguration: restrict allowed hosts
app.add_middleware(TrustedHostMiddleware, allowed_hosts=["localhost", "127.0.0.1", "*.vercel.app"])

# CORS — only allow our frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

# ── Routes ────────────────────────────────────────────────────
app.include_router(api_router, prefix="/api/v1")

@app.get("/", include_in_schema=False)
async def root():
    return {"message": "Horizon Hope Academy API", "docs": "/api/docs"}
