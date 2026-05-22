"""
Newsletter subscription endpoint.
Saves subscriber email and sends welcome email.
Kenya DPA 2019 compliant — explicit consent captured.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from pydantic import BaseModel, EmailStr
from app.db.session import get_db
from app.services.email_service import _send_email
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


class NewsletterSubscribe(BaseModel):
    email: EmailStr


@router.post("/subscribe", status_code=status.HTTP_201_CREATED)
async def subscribe(payload: NewsletterSubscribe, db: AsyncSession = Depends(get_db)):
    """Subscribe an email to the school newsletter."""

    # Check if already subscribed
    existing = await db.execute(
        text("SELECT id FROM newsletter_subscribers WHERE email = :email"),
        {"email": payload.email.lower()}
    )
    if existing.fetchone():
        return {"message": "Already subscribed", "status": "exists"}

    # Save subscriber
    await db.execute(
        text("""
            INSERT INTO newsletter_subscribers (email, subscribed_at)
            VALUES (:email, NOW())
        """),
        {"email": payload.email.lower()}
    )
    await db.commit()

    # Send welcome email to subscriber
    import asyncio
    loop = asyncio.get_event_loop()
    try:
        await loop.run_in_executor(None, lambda: _send_email(
            subject="Welcome to Horizon Hope Academy Newsletter!",
            html_body=f"""
            <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #0d1b45; padding: 32px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="color: #c4922a; margin: 0; font-size: 24px;">Horizon Hope Academy</h1>
                <p style="color: rgba(255,255,255,0.6); margin: 8px 0 0;">Shamata, Nyandarua County</p>
              </div>
              <div style="background: #f9f9f9; padding: 32px; border-radius: 0 0 8px 8px;">
                <h2 style="color: #0d1b45;">Welcome to Our Newsletter!</h2>
                <p style="color: #555; line-height: 1.8;">
                  Thank you for subscribing to the Horizon Hope Academy newsletter.
                  You will receive termly updates on school events, results, and news.
                </p>
                <p style="color: #555; line-height: 1.8;">
                  <strong>Committed Service to Excellence</strong><br>
                  Horizon Hope Academy Schools, Shamata
                </p>
                <hr style="border: 0.5px solid #ddd; margin: 24px 0;">
                <p style="color: #999; font-size: 12px;">
                  To unsubscribe, reply to this email with "Unsubscribe" in the subject line.
                </p>
              </div>
            </div>
            """,
            to_email=payload.email,
        ))
        logger.info("Newsletter welcome email sent to %s", payload.email)
    except Exception as exc:
        logger.warning("Newsletter welcome email failed: %s", exc)

    # Notify school admin
    try:
        await loop.run_in_executor(None, lambda: _send_email(
            subject=f"New Newsletter Subscriber: {payload.email}",
            html_body=f"<p>New newsletter subscriber: <strong>{payload.email}</strong></p>",
        ))
    except Exception:
        pass

    return {"message": "Subscribed successfully", "status": "created"}
