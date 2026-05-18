"""
Admission inquiry model.
Kenya DPA 2019 — personal data of minors.
Fields tagged [PII] must never appear in logs.
"""
import sqlalchemy as sa
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime, timezone
from app.db.base import Base


class AdmissionInquiry(Base):
    __tablename__ = "admission_inquiries"

    id: Mapped[int] = mapped_column(sa.Integer, primary_key=True, index=True)

    # [PII] Parent/Guardian details — Kenya DPA protected
    guardian_name: Mapped[str] = mapped_column(sa.String(100), nullable=False)
    guardian_email: Mapped[str] = mapped_column(sa.String(255), nullable=False, index=True)
    guardian_phone: Mapped[str] = mapped_column(sa.String(20), nullable=False)

    # [PII] Child details — minor data, extra sensitivity
    child_name: Mapped[str] = mapped_column(sa.String(100), nullable=False)
    child_age: Mapped[int] = mapped_column(sa.Integer, nullable=False)
    grade_applying: Mapped[str] = mapped_column(sa.String(20), nullable=False)

    # Metadata
    message: Mapped[str | None] = mapped_column(sa.Text, nullable=True)
    status: Mapped[str] = mapped_column(sa.String(20), default="pending", nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        sa.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    # Kenya DPA: data must be deleted after retention period
    retain_until: Mapped[datetime | None] = mapped_column(sa.DateTime(timezone=True), nullable=True)
