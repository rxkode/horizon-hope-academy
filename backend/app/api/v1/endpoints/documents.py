"""PDF generation endpoints — receipts, invoices."""
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from datetime import datetime, timezone
from app.db.session import get_db
from app.services.pdf_engine import generate_fee_receipt

router = APIRouter()

@router.get("/receipt/{trans_id}", response_class=Response)
async def download_receipt(trans_id: str, db: AsyncSession = Depends(get_db)):
    """Download fee receipt PDF by M-Pesa transaction ID."""
    result = await db.execute(
        text("""
            SELECT fp.trans_id, fp.trans_amount, fp.msisdn, fp.trans_time,
                   sl.student_name, sl.admission_number, sl.grade,
                   sl.term_fee, sl.amount_paid, (sl.term_fee - sl.amount_paid) AS balance_due
            FROM fee_payments fp
            JOIN student_fee_ledger sl ON sl.admission_number = fp.bill_ref_number
            WHERE fp.trans_id = :tid
        """),
        {"tid": trans_id.upper()}
    )
    row = result.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Transaction not found")

    pdf_bytes = generate_fee_receipt(
        student_name=row.student_name,
        admission_number=row.admission_number,
        grade=row.grade,
        guardian_name=f"Guardian of {row.student_name}",
        trans_id=row.trans_id,
        msisdn=row.msisdn,
        amount_paid=float(row.trans_amount),
        term_fee=float(row.term_fee),
        balance_due=float(row.balance_due),
        trans_time=row.trans_time or datetime.now(timezone.utc),
    )

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=receipt-{trans_id}.pdf"},
    )
