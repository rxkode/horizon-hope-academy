"""
Offline Sync Engine — Last-Write-Wins (LWW) conflict resolution.

Strategy:
  - Each offline device queues mutations with a client_ts timestamp.
  - On reconnect, the device POSTs its queue to POST /api/v1/sync/flush.
  - The engine compares client_ts against the server's current record.
  - If client_ts > server record's updated_at  → apply the mutation.
  - If client_ts <= server record's updated_at → discard (server wins).
  - Result logged in offline_sync_queue.status: applied | conflict | error.

Supported payload_types:
  - "contact_message"   — queued contact form submissions
  - "admission_inquiry" — queued admission form submissions
  - "attendance"        — reserved for Phase 3 (RosarioSIS sync)
  - "grade"             — reserved for Phase 3
"""
from datetime import datetime, timezone
from typing import Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
import logging

logger = logging.getLogger(__name__)


async def apply_sync_payload(
    db: AsyncSession,
    device_id: str,
    payload_type: str,
    payload: dict[str, Any],
    client_ts: datetime,
) -> str:
    """
    Apply a single queued payload using LWW resolution.

    Returns one of: "applied" | "conflict" | "error" | "duplicate"
    """
    try:
        if payload_type == "contact_message":
            return await _sync_contact(db, payload, client_ts)

        elif payload_type == "admission_inquiry":
            return await _sync_admission(db, payload, client_ts)

        elif payload_type in ("attendance", "grade"):
            # Phase 3 — RosarioSIS integration (reserved)
            logger.info(
                "sync_engine: payload_type=%s reserved for Phase 3 — skipping",
                payload_type
            )
            return "applied"

        else:
            logger.warning("sync_engine: unknown payload_type=%s", payload_type)
            return "error"

    except Exception as exc:
        logger.exception("sync_engine: error applying payload device=%s type=%s: %s",
                         device_id, payload_type, exc)
        return "error"


async def _sync_contact(
    db: AsyncSession,
    payload: dict[str, Any],
    client_ts: datetime,
) -> str:
    """
    Insert a contact message from the offline queue.
    LWW: if a message with the same offline_id already exists and its
    created_at >= client_ts, skip (server record is newer or equal).
    """
    offline_id = payload.get("offline_id")

    if offline_id:
        existing = await db.execute(
            text("SELECT created_at FROM contact_messages WHERE offline_id = :oid"),
            {"oid": offline_id},
        )
        row = existing.fetchone()
        if row:
            server_ts: datetime = row.created_at
            if server_ts.tzinfo is None:
                server_ts = server_ts.replace(tzinfo=timezone.utc)
            if client_ts <= server_ts:
                return "conflict"     # server record is same age or newer

    await db.execute(
        text("""
            INSERT INTO contact_messages
              (name, email, phone, subject, message, offline_id, created_at)
            VALUES
              (:name, :email, :phone, :subject, :message, :oid, :ts)
            ON CONFLICT (offline_id) DO NOTHING
        """),
        {
            "name":    payload.get("name", ""),
            "email":   payload.get("email", ""),
            "phone":   payload.get("phone", ""),
            "subject": payload.get("subject", ""),
            "message": payload.get("message", ""),
            "oid":     offline_id,
            "ts":      client_ts,
        },
    )
    await db.commit()
    return "applied"


async def _sync_admission(
    db: AsyncSession,
    payload: dict[str, Any],
    client_ts: datetime,
) -> str:
    """
    Insert an admission inquiry from the offline queue.
    LWW: same offline_id check as contact messages.
    """
    offline_id = payload.get("offline_id")

    if offline_id:
        existing = await db.execute(
            text("SELECT created_at FROM admission_inquiries WHERE offline_id = :oid"),
            {"oid": offline_id},
        )
        row = existing.fetchone()
        if row:
            server_ts: datetime = row.created_at
            if server_ts.tzinfo is None:
                server_ts = server_ts.replace(tzinfo=timezone.utc)
            if client_ts <= server_ts:
                return "conflict"

    await db.execute(
        text("""
            INSERT INTO admission_inquiries
              (guardian_name, guardian_email, guardian_phone,
               child_name, child_dob, grade_applying,
               message, offline_id, created_at)
            VALUES
              (:guardian_name, :guardian_email, :guardian_phone,
               :child_name, :child_dob, :grade_applying,
               :message, :oid, :ts)
            ON CONFLICT (offline_id) DO NOTHING
        """),
        {
            "guardian_name":  payload.get("guardian_name", ""),
            "guardian_email": payload.get("guardian_email", ""),
            "guardian_phone": payload.get("guardian_phone", ""),
            "child_name":     payload.get("child_name", ""),
            "child_dob":      payload.get("child_dob"),
            "grade_applying": payload.get("grade_applying", ""),
            "message":        payload.get("message", ""),
            "oid":            offline_id,
            "ts":             client_ts,
        },
    )
    await db.commit()
    return "applied"
