from fastapi import APIRouter
from datetime import datetime, timezone

router = APIRouter()

@router.get("/health", tags=["System"])
async def health_check():
    return {
        "status": "healthy",
        "service": "Horizon Hope Academy API",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "version": "1.0.0",
    }
