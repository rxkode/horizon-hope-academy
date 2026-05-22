from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.services.email_service import notify_contact_message
from app.db.models.contact import ContactMessage
from app.schemas.contact import ContactCreate, ContactResponse
from asyncio import get_event_loop
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
async def send_message(payload: ContactCreate, db: AsyncSession = Depends(get_db)):
    """Save contact message and notify school admin via email."""
    msg = ContactMessage(**payload.model_dump())
    db.add(msg)
    await db.flush()
    await db.refresh(msg)
    await db.commit()

    # Run synchronous email in thread so it never blocks the async loop
    import asyncio
    loop = asyncio.get_event_loop()
    try:
        await loop.run_in_executor(None, lambda: notify_contact_message(
            name=payload.name,
            email=payload.email,
            phone=payload.phone or "",
            subject=payload.subject,
            message=payload.message,
        ))
        logger.info("Contact email sent for: %s", payload.name)
    except Exception as exc:
        logger.warning("Contact email failed: %s", exc)

    return msg
