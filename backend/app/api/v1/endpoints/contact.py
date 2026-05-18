from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.db.models.contact import ContactMessage
from app.schemas.contact import ContactCreate, ContactResponse

router = APIRouter()


@router.post("/", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
async def send_message(payload: ContactCreate, db: AsyncSession = Depends(get_db)):
    msg = ContactMessage(**payload.model_dump())
    db.add(msg)
    await db.flush()
    await db.refresh(msg)
    return msg
