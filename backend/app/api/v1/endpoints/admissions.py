"""
Admissions Endpoint.

Flow:
  1. Save enquiry to admission_inquiries (main DB) — Kenya DPA compliant
  2. Create pre-application in RosarioSIS (SIS DB) — pending admin approval
  3. Send email notification to school admin
  4. Return 201 Created

The student record in RosarioSIS has no username/password until admin
activates it. Admin can see pending applications in the portal.
"""
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timedelta, timezone
import asyncio
import logging

from app.db.session import get_db
from app.services.email_service import notify_admission_enquiry
from app.services.rosario_service import create_sis_pre_application
from app.db.models.admission import AdmissionInquiry
from app.schemas.admission import AdmissionCreate, AdmissionResponse
from app.core.config import get_settings

logger = logging.getLogger(__name__)
router = APIRouter()
settings = get_settings()


@router.post("/", response_model=AdmissionResponse, status_code=status.HTTP_201_CREATED)
async def create_admission(payload: AdmissionCreate, db: AsyncSession = Depends(get_db)):
    """
    Submit an admission enquiry.
    Saves to local DB, creates SIS pre-application, notifies admin.
    """
    # 1. Save to main DB (Kenya DPA — retain_until field)
    retain_until = datetime.now(timezone.utc) + timedelta(days=settings.data_retention_days)
    inquiry = AdmissionInquiry(**payload.model_dump(), retain_until=retain_until)
    db.add(inquiry)
    await db.flush()
    await db.refresh(inquiry)
    await db.commit()

    # 2. Create pre-application in RosarioSIS (non-blocking)
    loop = asyncio.get_event_loop()
    try:
        sis_result = await loop.run_in_executor(None, lambda: create_sis_pre_application(
            child_name=payload.child_name,
            child_dob=payload.child_dob,
            grade_applying=payload.grade_applying,
            guardian_name=payload.guardian_name,
            guardian_phone=payload.guardian_phone,
            guardian_email=payload.guardian_email,
            message=payload.message or "",
        ))
        logger.info("SIS pre-application result: %s", sis_result)
    except Exception as exc:
        logger.warning("SIS pre-application failed (non-fatal): %s", exc)

    # 3. Email notification to school admin (non-blocking)
    try:
        await loop.run_in_executor(None, lambda: notify_admission_enquiry(
            guardian_name=payload.guardian_name,
            guardian_phone=payload.guardian_phone,
            guardian_email=payload.guardian_email,
            child_name=payload.child_name,
            grade_applying=payload.grade_applying,
            child_dob=payload.child_dob or "",
        ))
    except Exception as exc:
        logger.warning("Admission email failed (non-fatal): %s", exc)

    return inquiry


@router.get("/", response_model=list[AdmissionResponse])
async def list_admissions(db: AsyncSession = Depends(get_db)):
    """List recent admission enquiries (admin use)."""
    result = await db.execute(
        select(AdmissionInquiry).order_by(AdmissionInquiry.created_at.desc()).limit(100)
    )
    return result.scalars().all()


@router.get("/pending-sis")
async def list_pending_sis():
    """
    List students in RosarioSIS awaiting admin activation.
    These are pre-applications from the website form.
    """
    loop = asyncio.get_event_loop()
    from app.services.rosario_service import get_sis_pending_applications
    pending = await loop.run_in_executor(None, get_sis_pending_applications)
    return {"pending": pending, "count": len(pending)}
