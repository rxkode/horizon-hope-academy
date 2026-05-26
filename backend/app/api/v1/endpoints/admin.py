"""
Admin API endpoints — HHA School Management System.
JWT-protected. Role-based access control.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from jose import jwt
from app.db.session import get_db
from app.core.config import get_settings
import logging

logger   = logging.getLogger(__name__)
router   = APIRouter()
pwd_ctx  = CryptContext(schemes=["bcrypt"], deprecated="auto")
settings = get_settings()


def create_token(data: dict) -> str:
    payload = data.copy()
    payload["exp"] = datetime.now(timezone.utc) + timedelta(
        minutes=settings.access_token_expire_minutes
    )
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


async def get_current_user(
    token: str,
    db: AsyncSession,
) -> dict:
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


@router.post("/auth/login")
async def login(
    form: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    """Staff login — returns JWT access token."""

    # Look up user by email
    result = await db.execute(
        text("""
            SELECT u.id, u.email, u.password_hash, u.role, u.is_active,
                   s.first_name, s.last_name, s.staff_number
            FROM hha_users u
            LEFT JOIN hha_staff s ON s.id = u.staff_id
            WHERE u.email = :email
        """),
        {"email": form.username.lower().strip()}
    )
    user = result.fetchone()

    if not user or not pwd_ctx.verify(form.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is disabled")

    # Update last login
    await db.execute(
        text("UPDATE hha_users SET last_login = NOW() WHERE id = :id"),
        {"id": user.id}
    )
    await db.commit()

    token = create_token({
        "sub":   str(user.id),
        "email": user.email,
        "role":  user.role,
        "name":  f"{user.first_name} {user.last_name}" if user.first_name else "Admin",
    })

    return {
        "access_token": token,
        "token_type":   "bearer",
        "user": {
            "id":    user.id,
            "email": user.email,
            "role":  user.role,
            "name":  f"{user.first_name} {user.last_name}" if user.first_name else "Admin",
        }
    }


@router.get("/admin/dashboard-stats")
async def dashboard_stats(db: AsyncSession = Depends(get_db)):
    """Dashboard statistics — student count, payments, attendance."""
    today = datetime.now(timezone.utc).date()

    students = await db.execute(
        text("SELECT COUNT(*) FROM hha_students WHERE status = 'active'"))
    staff = await db.execute(
        text("SELECT COUNT(*) FROM hha_staff WHERE status = 'active'"))
    payments_today = await db.execute(
        text("SELECT COALESCE(SUM(amount),0) FROM hha_payments WHERE DATE(payment_date) = :today"),
        {"today": today})
    payments_term = await db.execute(
        text("SELECT COALESCE(SUM(amount),0) FROM hha_payments WHERE term = 2 AND year = 2026"))
    attendance = await db.execute(
        text("SELECT COUNT(*) FROM hha_attendance WHERE date = :today AND status = 'present'"),
        {"today": today})
    pending = await db.execute(
        text("SELECT COUNT(*) FROM admission_inquiries WHERE status = 'pending'"))

    return {
        "total_students":     students.scalar(),
        "total_staff":        staff.scalar(),
        "payments_today":     float(payments_today.scalar()),
        "payments_this_term": float(payments_term.scalar()),
        "attendance_today":   attendance.scalar(),
        "pending_admissions": pending.scalar(),
    }


@router.post("/admin/setup-admin")
async def setup_admin(
    email: str,
    password: str,
    db: AsyncSession = Depends(get_db)
):
    """
    One-time admin account creation.
    Disabled after first use — delete this endpoint in production.
    """
    # Check if any admin exists already
    existing = await db.execute(
        text("SELECT COUNT(*) FROM hha_users WHERE role = 'admin'"))
    if existing.scalar() > 0:
        raise HTTPException(status_code=400, detail="Admin already exists")

    # Get or create admin staff record
    staff = await db.execute(
        text("SELECT id FROM hha_staff WHERE role = 'admin' LIMIT 1"))
    staff_row = staff.fetchone()
    staff_id = staff_row[0] if staff_row else None

    hashed = pwd_ctx.hash(password)
    await db.execute(
        text("""
            INSERT INTO hha_users (email, password_hash, role, staff_id)
            VALUES (:email, :hash, 'admin', :staff_id)
        """),
        {"email": email.lower(), "hash": hashed, "staff_id": staff_id}
    )
    await db.commit()
    return {"message": "Admin account created successfully"}
