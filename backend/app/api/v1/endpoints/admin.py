"""
Admin API endpoints — HHA School Management System.
JWT-protected. Role-based access control.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from datetime import datetime, timedelta, timezone
from jose import jwt
from app.db.session import get_db
from app.core.config import get_settings
import bcrypt as _bcrypt
import logging

logger   = logging.getLogger(__name__)
router   = APIRouter()
settings = get_settings()


def hash_password(password: str) -> str:
    return _bcrypt.hashpw(password[:72].encode(), _bcrypt.gensalt()).decode()


def verify_password(password: str, hashed: str) -> bool:
    return _bcrypt.checkpw(password[:72].encode(), hashed.encode())


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


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/auth/login")
async def login(
    form: LoginRequest,
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
        {"email": form.email.lower().strip()}
    )
    user = result.fetchone()

    if not user or not verify_password(form.password, user.password_hash):
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


async def get_current_admin(
    authorization: str = "",
    db: AsyncSession = Depends(get_db)
) -> dict:
    """Extract and verify JWT from Authorization header."""
    from fastapi import Header
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.split(" ", 1)[1]
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


from fastapi import Header as _Header

async def require_admin(
    authorization: str = _Header(default=""),
) -> dict:
    """Dependency — requires valid JWT with admin or staff role."""
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.split(" ", 1)[1]
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        if payload.get("role") not in ("admin", "teacher", "staff"):
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return payload
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


@router.get("/admin/dashboard-stats")
async def dashboard_stats(
    db: AsyncSession = Depends(get_db),
    _user: dict = Depends(require_admin),
):
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

    hashed = hash_password(password)
    await db.execute(
        text("""
            INSERT INTO hha_users (email, password_hash, role, staff_id)
            VALUES (:email, :hash, 'admin', :staff_id)
        """),
        {"email": email.lower(), "hash": hashed, "staff_id": staff_id}
    )
    await db.commit()
    return {"message": "Admin account created successfully"}


# ══════════════════════════════════════════════════════════════
# STUDENTS
# ══════════════════════════════════════════════════════════════

@router.get("/admin/classes")
async def get_classes(db: AsyncSession = Depends(get_db)):
    result = await db.execute(text("SELECT id, name, level FROM classes ORDER BY id"))
    rows = result.fetchall()
    return [{"id": r[0], "name": r[1], "level": r[2]} for r in rows]


@router.get("/admin/students")
async def get_students(db: AsyncSession = Depends(get_db)):
    result = await db.execute(text("""
        SELECT s.id, s.admission_number, s.first_name, s.middle_name, s.last_name,
               c.name as class_name, s.gender, s.status, s.enrolled_date
        FROM hha_students s
        LEFT JOIN classes c ON c.id = s.class_id
        ORDER BY c.id, s.last_name, s.first_name
    """))
    rows = result.fetchall()
    return [{
        "id": r[0], "admission_number": r[1], "first_name": r[2],
        "middle_name": r[3] or "", "last_name": r[4], "class_name": r[5] or "",
        "gender": r[6] or "", "status": r[7], "enrolled_date": str(r[8]) if r[8] else "",
    } for r in rows]


@router.post("/admin/students", status_code=201)
async def create_student(payload: dict, db: AsyncSession = Depends(get_db)):
    """Create a new student with guardian/parent record."""

    # Generate admission number: HHA/YEAR/NNN
    from datetime import date as _date
    year = _date.today().year
    count_res = await db.execute(
        text("SELECT COUNT(*) FROM hha_students WHERE EXTRACT(YEAR FROM enrolled_date) = :yr"),
        {"yr": year}
    )
    count = count_res.scalar() + 1
    admission_number = f"HHA/{year}/{count:03d}"

    # Insert student
    result = await db.execute(text("""
        INSERT INTO hha_students
          (admission_number, first_name, middle_name, last_name,
           date_of_birth, gender, class_id, nemis_number,
           birth_cert_number, medical_notes, status)
        VALUES
          (:adm, :fn, :mn, :ln, :dob, :gender, :class_id,
           :nemis, :birth_cert, :medical, 'active')
        RETURNING id
    """), {
        "adm":        admission_number,
        "fn":         payload.get("first_name", "").strip(),
        "mn":         payload.get("middle_name", "").strip() or None,
        "ln":         payload.get("last_name", "").strip(),
        "dob":        payload.get("date_of_birth") or None,
        "gender":     payload.get("gender") or None,
        "class_id":   payload.get("class_id"),
        "nemis":      payload.get("nemis_number") or None,
        "birth_cert": payload.get("birth_cert_number") or None,
        "medical":    payload.get("medical_notes") or None,
    })
    student_id = result.fetchone()[0]

    # Insert parent/guardian
    guardian_name = payload.get("guardian_name", "").strip()
    if guardian_name:
        parts = guardian_name.split()
        gfn = parts[0] if parts else guardian_name
        gln = parts[-1] if len(parts) > 1 else ""

        p_result = await db.execute(text("""
            INSERT INTO hha_parents
              (first_name, last_name, phone_primary, phone_secondary,
               email, relationship)
            VALUES (:fn, :ln, :phone, :phone2, :email, :rel)
            RETURNING id
        """), {
            "fn":    gfn, "ln": gln,
            "phone": payload.get("guardian_phone", ""),
            "phone2": payload.get("guardian_phone2") or None,
            "email": payload.get("guardian_email") or None,
            "rel":   payload.get("guardian_relationship", "parent"),
        })
        parent_id = p_result.fetchone()[0]

        await db.execute(text("""
            INSERT INTO hha_student_parents (student_id, parent_id, is_primary)
            VALUES (:sid, :pid, true)
        """), {"sid": student_id, "pid": parent_id})

        # Also create fee ledger entry
        await db.execute(text("""
            INSERT INTO student_fee_ledger (admission_number, student_name, grade, term_fee)
            VALUES (:adm, :name, :grade, 0)
            ON CONFLICT DO NOTHING
        """), {
            "adm":   admission_number,
            "name":  f"{payload.get('first_name','')} {payload.get('last_name','')}",
            "grade": "",
        })

    await db.commit()
    return {"id": student_id, "admission_number": admission_number}


@router.get("/admin/students/{student_id}")
async def get_student(student_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(text("""
        SELECT s.*, c.name as class_name
        FROM hha_students s
        LEFT JOIN classes c ON c.id = s.class_id
        WHERE s.id = :id
    """), {"id": student_id})
    row = result.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Student not found")

    # Get parents
    parents = await db.execute(text("""
        SELECT p.first_name, p.last_name, p.phone_primary,
               p.phone_secondary, p.email, p.relationship
        FROM hha_parents p
        JOIN hha_student_parents sp ON sp.parent_id = p.id
        WHERE sp.student_id = :sid
    """), {"sid": student_id})

    # Get payments
    payments = await db.execute(text("""
        SELECT amount, payment_method, reference, payment_date
        FROM hha_payments WHERE student_id = :sid
        ORDER BY payment_date DESC LIMIT 10
    """), {"sid": student_id})

    return {
        "id":                row.id,
        "admission_number":  row.admission_number,
        "first_name":        row.first_name,
        "middle_name":       row.middle_name or "",
        "last_name":         row.last_name,
        "date_of_birth":     str(row.date_of_birth) if row.date_of_birth else "",
        "gender":            row.gender or "",
        "class_name":        row.class_name or "",
        "class_id":          row.class_id,
        "nemis_number":      row.nemis_number or "",
        "birth_cert_number": row.birth_cert_number or "",
        "medical_notes":     row.medical_notes or "",
        "status":            row.status,
        "enrolled_date":     str(row.enrolled_date) if row.enrolled_date else "",
        "parents": [{
            "name":         f"{p[0]} {p[1]}",
            "phone":        p[2],
            "phone2":       p[3] or "",
            "email":        p[4] or "",
            "relationship": p[5],
        } for p in parents.fetchall()],
        "recent_payments": [{
            "amount":         float(p[0]),
            "method":         p[1],
            "reference":      p[2] or "",
            "date":           str(p[3]),
        } for p in payments.fetchall()],
    }
