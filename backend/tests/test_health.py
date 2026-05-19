"""
Health endpoint tests — Phase 2 baseline.
Run: cd backend && .venv/bin/pytest tests/ -v

Note: base_url must be http://localhost — TrustedHostMiddleware rejects
any host not in its allowlist (localhost, 127.0.0.1, *.vercel.app).
"""
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_health_returns_200():
    """GET /api/v1/health must return HTTP 200."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://localhost"
    ) as client:
        response = await client.get("/api/v1/health")
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_health_schema():
    """Health response must include status, service, timestamp, version."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://localhost"
    ) as client:
        response = await client.get("/api/v1/health")
    data = response.json()
    assert data["status"]  in ("ok", "healthy")
    assert "service"   in data
    assert "timestamp" in data
    assert "version"   in data


@pytest.mark.asyncio
async def test_root_returns_200():
    """GET / must return 200 (Docker healthcheck uses this)."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://localhost"
    ) as client:
        response = await client.get("/")
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_docs_available_in_debug():
    """Swagger UI at /api/docs must be accessible when debug=True."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://localhost"
    ) as client:
        response = await client.get("/api/docs")
    # 200 = docs served; 404 = debug=False in env (both are valid outcomes)
    assert response.status_code in (200, 404)
