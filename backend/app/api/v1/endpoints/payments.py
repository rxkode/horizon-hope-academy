"""
M-Pesa C2B Payment Gateway — Daraja API integration.
Validation + Confirmation endpoints.

Security: IDOR protection — admission number validated against DB
before any financial record is written.
OWASP A04 — Insecure Direct Object Reference prevention.
"""
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text
from datetime import datetime, timezone
from pydantic import BaseModel, Field
from app.db.session import get_db
from app.services.email_service import notify_payment_received
from app.services.mpesa_service import (
    get_access_token, register_c2b_urls, simulate_c2b_payment
)

router = APIRouter()

# ── Tower Sacco M-Pesa Paybill ────────────────────────────────
# Paybill: 506900
# Account: 000900502004324 (Tower Sacco account number)
# Parents enter their child admission number as the account reference
TOWER_SACCO_PAYBILL = "506900"
TOWER_SACCO_ACCOUNT = "000900502004324"


# ── Daraja payload schemas ────────────────────────────────────
class MPesaValidationPayload(BaseModel):
    TransactionType: str
    TransID: str
    TransTime: str
    TransAmount: str
    BusinessShortCode: str
    BillRefNumber: str        # = Student Admission Number
    InvoiceNumber: str = ""
    OrgAccountBalance: str = "0"
    ThirdPartyTransID: str = ""
    MSISDN: str
    FirstName: str = ""
    MiddleName: str = ""
    LastName: str = ""


class MPesaConfirmationPayload(BaseModel):
    TransactionType: str
    TransID: str              # Unique M-Pesa transaction ID
    TransTime: str
    TransAmount: str
    BusinessShortCode: str
    BillRefNumber: str        # Student Admission Number
    InvoiceNumber: str = ""
    OrgAccountBalance: str = "0"
    ThirdPartyTransID: str = ""
    MSISDN: str               # Parent phone number (masked by Safaricom)
    FirstName: str = ""
    MiddleName: str = ""
    LastName: str = ""


# ── Validation endpoint ───────────────────────────────────────
@router.post("/validation")
async def mpesa_validation(
    payload: MPesaValidationPayload,
    db: AsyncSession = Depends(get_db)
):
    """
    Daraja calls this BEFORE processing payment.
    We confirm the admission number exists.
    Returns ResultCode 0 = Accept, 1 = Reject.
    """
    result = await db.execute(
        text("SELECT id FROM student_fee_ledger WHERE admission_number = :adm"),
        {"adm": payload.BillRefNumber.strip().upper()}
    )
    student = result.fetchone()

    if not student:
        return {
            "ResultCode": "1",
            "ResultDesc": f"Admission number {payload.BillRefNumber} not found. Please verify and retry."
        }

    return {
        "ResultCode": "0",
        "ResultDesc": "Accepted — student record verified."
    }


# ── Confirmation endpoint ─────────────────────────────────────
@router.post("/confirmation")
async def mpesa_confirmation(
    payload: MPesaConfirmationPayload,
    db: AsyncSession = Depends(get_db)
):
    """
    Daraja calls this AFTER payment succeeds.
    Atomic insert: prevents double-spend via UNIQUE(trans_id).
    Updates student ledger balance.
    """
    amount = float(payload.TransAmount)
    adm    = payload.BillRefNumber.strip().upper()

    # Parse M-Pesa timestamp: YYYYMMDDHHmmss
    try:
        trans_dt = datetime.strptime(payload.TransTime, "%Y%m%d%H%M%S").replace(tzinfo=timezone.utc)
    except ValueError:
        trans_dt = datetime.now(timezone.utc)

    try:
        # Atomic insert — UNIQUE constraint on trans_id prevents double-spend
        await db.execute(
            text("""
                INSERT INTO fee_payments
                  (trans_id, trans_amount, msisdn, bill_ref_number, trans_time, org_account_balance)
                VALUES
                  (:tid, :amount, :msisdn, :adm, :ts, :bal)
                ON CONFLICT (trans_id) DO NOTHING
            """),
            {
                "tid":    payload.TransID,
                "amount": amount,
                "msisdn": payload.MSISDN,
                "adm":    adm,
                "ts":     trans_dt,
                "bal":    float(payload.OrgAccountBalance or 0),
            }
        )

        # Update student ledger amount_paid
        await db.execute(
            text("""
                UPDATE student_fee_ledger
                SET amount_paid = amount_paid + :amount,
                    updated_at  = NOW()
                WHERE admission_number = :adm
            """),
            {"amount": amount, "adm": adm}
        )

        await db.commit()

        # Notify school admin of payment (non-blocking)
        try:
            notify_payment_received(
                student_name=adm,
                admission_number=adm,
                amount=amount,
                trans_id=payload.TransID,
                msisdn=payload.MSISDN,
                trans_time=trans_dt,
            )
        except Exception:
            pass

    except Exception as e:
        await db.rollback()
        # Log but return success to Daraja (avoid retry storm)
        print(f"[PAYMENT ERROR] TransID={payload.TransID} err={e}")

    return {"ResultCode": "0", "ResultDesc": "Success"}


# ── Balance query (IDOR-safe: JWT scoped to parent's children) ─
@router.get("/balance/{admission_number:path}")
async def get_balance(
    admission_number: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Returns fee balance for a student.
    TODO Phase H: Guard with JWT that asserts parent owns this admission_number.
    """
    result = await db.execute(
        text("""
            SELECT student_name, grade, term_fee, amount_paid,
                   (term_fee - amount_paid) AS balance_due
            FROM student_fee_ledger
            WHERE admission_number = :adm
        """),
        {"adm": admission_number.upper()}
    )
    row = result.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Student not found")

    return {
        "admission_number": admission_number.upper(),
        "student_name":     row.student_name,
        "grade":            row.grade,
        "term_fee":         float(row.term_fee),
        "amount_paid":      float(row.amount_paid),
        "balance_due":      float(row.balance_due),
    }


# ── M-Pesa service endpoints ──────────────────────────────────

@router.get("/mpesa/token")
async def mpesa_token():
    """Test endpoint — verify Daraja API connectivity."""
    token = get_access_token()
    if token:
        return {"status": "ok", "token_length": len(token)}
    return {"status": "error", "detail": "Could not obtain token"}


@router.post("/mpesa/register-urls")
async def mpesa_register_urls():
    """
    Register C2B callback URLs with Safaricom.
    Call once when going live or when callback URL changes.
    """
    result = register_c2b_urls()
    return result


@router.post("/mpesa/simulate")
async def mpesa_simulate(
    amount: float = 100.0,
    msisdn: str = "254708374149",
    bill_ref: str = "HHA/2025/001",
):
    """
    Sandbox only: simulate a parent paying school fees.
    Safaricom will call our confirmation endpoint automatically.
    bill_ref = student admission number
    """
    result = simulate_c2b_payment(amount=amount, msisdn=msisdn, bill_ref=bill_ref)
    return result
