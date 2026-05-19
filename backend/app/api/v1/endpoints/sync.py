"""
Offline Sync Flush Endpoint — POST /api/v1/sync/flush

Accepts a batch of queued offline mutations from the client.
Applies each payload via the LWW sync engine and records the result.

Called by:
  - useOfflineSync.ts (frontend) when navigator.onLine becomes true
  - Local cron (setup.sh schedules a curl every 5 min on school server)

Rate limit: handled at reverse-proxy level in production.
"""
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from pydantic import BaseModel, Field
from datetime import datetime, timezone
from typing import Any
from app.db.session import get_db
from app.services.sync_engine import apply_sync_payload
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


class SyncItem(BaseModel):
    """Single item from the client offline queue (IndexedDB)."""
    device_id:    str            = Field(..., min_length=1, max_length=64)
    payload_type: str            = Field(..., min_length=1, max_length=50)
    payload:      dict[str, Any] = Field(...)
    client_ts:    datetime       = Field(..., description="ISO 8601 timestamp from client")


class SyncFlushRequest(BaseModel):
    """Batch of queued items to flush."""
    items: list[SyncItem] = Field(..., max_length=200,
                                   description="Max 200 items per flush call")


class SyncFlushResponse(BaseModel):
    flushed:   int
    applied:   int
    conflicts: int
    errors:    int
    results:   list[dict[str, str]]


@router.post(
    "/flush",
    response_model=SyncFlushResponse,
    status_code=status.HTTP_200_OK,
    summary="Flush offline sync queue",
    description=(
        "Accepts batched offline mutations from the PWA client. "
        "Applies LWW (Last-Write-Wins) conflict resolution per item. "
        "Returns a per-item result summary."
    ),
)
async def flush_sync_queue(
    body: SyncFlushRequest,
    db: AsyncSession = Depends(get_db),
) -> SyncFlushResponse:
    results   = []
    applied   = 0
    conflicts = 0
    errors    = 0

    for item in body.items:
        # Ensure client_ts is timezone-aware
        client_ts = item.client_ts
        if client_ts.tzinfo is None:
            client_ts = client_ts.replace(tzinfo=timezone.utc)

        # Record in queue table before attempting apply
        try:
            await db.execute(
                text("""
                    INSERT INTO offline_sync_queue
                      (device_id, payload_type, payload, client_ts, status)
                    VALUES
                      (:did, :ptype, :payload::jsonb, :cts, 'pending')
                    ON CONFLICT (device_id, payload_type, client_ts) DO NOTHING
                """),
                {
                    "did":     item.device_id,
                    "ptype":   item.payload_type,
                    "payload": __import__('json').dumps(item.payload),
                    "cts":     client_ts,
                },
            )
            await db.commit()
        except Exception as exc:
            logger.warning("sync flush: queue insert failed: %s", exc)
            await db.rollback()

        # Apply via LWW engine
        outcome = await apply_sync_payload(
            db=db,
            device_id=item.device_id,
            payload_type=item.payload_type,
            payload=item.payload,
            client_ts=client_ts,
        )

        # Update queue row status
        try:
            await db.execute(
                text("""
                    UPDATE offline_sync_queue
                    SET status = :status
                    WHERE device_id = :did
                      AND payload_type = :ptype
                      AND client_ts = :cts
                """),
                {
                    "status": outcome,
                    "did":    item.device_id,
                    "ptype":  item.payload_type,
                    "cts":    client_ts,
                },
            )
            await db.commit()
        except Exception as exc:
            logger.warning("sync flush: status update failed: %s", exc)
            await db.rollback()

        results.append({
            "device_id":    item.device_id,
            "payload_type": item.payload_type,
            "client_ts":    client_ts.isoformat(),
            "outcome":      outcome,
        })

        if outcome == "applied":
            applied += 1
        elif outcome == "conflict":
            conflicts += 1
        else:
            errors += 1

    logger.info(
        "sync/flush: total=%d applied=%d conflicts=%d errors=%d",
        len(body.items), applied, conflicts, errors,
    )

    return SyncFlushResponse(
        flushed=len(body.items),
        applied=applied,
        conflicts=conflicts,
        errors=errors,
        results=results,
    )


@router.get(
    "/status",
    summary="Sync queue status",
    description="Returns counts of pending/applied/conflict items in the sync queue.",
)
async def sync_status(db: AsyncSession = Depends(get_db)) -> dict:
    result = await db.execute(
        text("""
            SELECT status, COUNT(*) as count
            FROM offline_sync_queue
            GROUP BY status
            ORDER BY status
        """)
    )
    rows = result.fetchall()
    return {
        "queue": {row.status: row.count for row in rows},
        "total": sum(row.count for row in rows),
    }
