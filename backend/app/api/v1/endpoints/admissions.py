from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timedelta, timezone
from app.db.session import get_db
from app.services.email_service import notify_admission_enquiry
from app.db.models.admission import AdmissionInquiry
from app.schemas.admission import AdmissionCreate, AdmissionResponse
from app.core.config import get_settings

router = APIRouter()
settings = get_settings()


@router.post("/", response_model=AdmissionResponse, status_code=status.HTTP_201_CREATED)
async def create_admission(payload: AdmissionCreate, db: AsyncSession = Depends(get_db)):
    retain_until = datetime.now(timezone.utc) + timedelta(days=settings.data_retention_days)
    inquiry = AdmissionInquiry(**payload.model_dump(), retain_until=retain_until)
    db.add(inquiry)
    await db.flush()
    await db.refresh(inquiry)
    return inquiry


@router.get("/", response_model=list[AdmissionResponse])
async def list_admissions(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(AdmissionInquiry).order_by(AdmissionInquiry.created_at.desc()).limit(100)
    )
    return result.scalars().all()
