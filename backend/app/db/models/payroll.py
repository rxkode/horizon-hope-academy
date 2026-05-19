"""
Payroll Ledger Model — KRA P9 / PAYE / NSSF / SHIF compliance.
Kenya Finance Act 2023 statutory deduction rates applied.

[PII] fields: employee_name, kra_pin, nssf_number, shif_number
Kenya Data Protection Act 2019 — handle with care.
"""
from sqlalchemy import (
    Column, Integer, String, Numeric, Boolean,
    DateTime, UniqueConstraint, text
)
from sqlalchemy.sql import func
from app.db.base import Base


class PayrollLedger(Base):
    """
    One row = one employee x one pay period.
    net_pay is a GENERATED column in PostgreSQL (computed server-side).
    We mirror the logic here for ORM reads; never write net_pay directly.

    Deduction rates (Kenya Finance Act 2023):
      PAYE  — progressive KRA tax table
      NSSF  — 12% of pensionable pay (Employment Act Cap 226)
      SHIF  — 2.75% of gross (Social Health Insurance Fund)
    """
    __tablename__ = "payroll_ledger"

    id              = Column(Integer, primary_key=True, index=True)

    # ── Employee identity [PII] ──────────────────────────────
    employee_id     = Column(String(20),  nullable=False, index=True,
                             comment="Internal HR identifier")
    employee_name   = Column(String(150), nullable=False,
                             comment="[PII] Full legal name")
    kra_pin         = Column(String(15),  nullable=True,
                             comment="[PII] KRA Personal Identification Number")
    nssf_number     = Column(String(20),  nullable=True,
                             comment="[PII] NSSF membership number")
    shif_number     = Column(String(20),  nullable=True,
                             comment="[PII] SHIF (ex-NHIF) membership number")

    # ── Pay period ───────────────────────────────────────────
    pay_period      = Column(String(10),  nullable=False,
                             comment="Format: YYYY-MM e.g. 2025-01")

    # ── Earnings ─────────────────────────────────────────────
    basic_salary    = Column(Numeric(12, 2), nullable=False)
    gross_pay       = Column(Numeric(12, 2), nullable=False)

    # ── Statutory deductions ─────────────────────────────────
    paye_deduction  = Column(Numeric(12, 2), nullable=False, default=0,
                             comment="KRA PAYE — progressive tax table")
    nssf_deduction  = Column(Numeric(12, 2), nullable=False, default=0,
                             comment="NSSF 12% of pensionable pay")
    shif_deduction  = Column(Numeric(12, 2), nullable=False, default=0,
                             comment="SHIF 2.75% of gross pay")

    # ── net_pay: GENERATED ALWAYS in Postgres ────────────────
    # Read from DB; do NOT set on INSERT/UPDATE from ORM.
    # Formula: gross_pay - paye_deduction - nssf_deduction - shif_deduction
    net_pay         = Column(Numeric(12, 2), nullable=True,
                             comment="GENERATED ALWAYS AS (gross-deductions) STORED")

    # ── P9 export flag ───────────────────────────────────────
    p9_exported     = Column(Boolean, default=False, nullable=False,
                             comment="True once KRA P9 PDF has been generated")

    created_at      = Column(DateTime(timezone=True), server_default=func.now())

    # One record per employee per pay period
    __table_args__ = (
        UniqueConstraint("employee_id", "pay_period", name="uq_employee_pay_period"),
    )

    def __repr__(self) -> str:
        return (
            f"<PayrollLedger employee_id={self.employee_id!r} "
            f"period={self.pay_period!r} net={self.net_pay}>"
        )
