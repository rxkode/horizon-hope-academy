"""
M-Pesa Daraja API Service — C2B Payment Integration.
Tower Sacco Paybill: 506900
Account number = student admission number (parent enters this when paying)

Flow:
  1. get_access_token()     — OAuth2 token from Safaricom
  2. register_c2b_urls()    — Register validation + confirmation URLs with Safaricom
  3. Safaricom calls POST /api/v1/payments/validation   — before processing
  4. Safaricom calls POST /api/v1/payments/confirmation — after processing

Sandbox vs Production:
  MPESA_ENV=sandbox    → sandbox.safaricom.co.ke
  MPESA_ENV=production → api.safaricom.co.ke
"""
import base64
import logging
from datetime import datetime, timezone
from functools import lru_cache
import httpx
from app.core.config import get_settings

logger = logging.getLogger(__name__)


def _base_url() -> str:
    settings = get_settings()
    if settings.mpesa_env == "production":
        return "https://api.safaricom.co.ke"
    return "https://sandbox.safaricom.co.ke"


def get_access_token() -> str | None:
    """
    Fetch OAuth2 access token from Safaricom.
    Token is valid for 3599 seconds (~1 hour).
    In production, cache this token and refresh only when expired.
    """
    settings = get_settings()
    credentials = base64.b64encode(
        f"{settings.mpesa_consumer_key}:{settings.mpesa_consumer_secret}".encode()
    ).decode()

    try:
        resp = httpx.get(
            f"{_base_url()}/oauth/v1/generate?grant_type=client_credentials",
            headers={"Authorization": f"Basic {credentials}"},
            timeout=15.0,
        )
        resp.raise_for_status()
        token = resp.json().get("access_token")
        logger.info("mpesa_service: access token obtained (len=%d)", len(token or ""))
        return token
    except Exception as exc:
        logger.error("mpesa_service: failed to get token: %s", exc)
        return None


def register_c2b_urls() -> dict:
    """
    Register validation and confirmation URLs with Safaricom.
    Must be called once when going live (or when callback URL changes).
    Safaricom will POST to these URLs when a payment is made to our shortcode.
    """
    settings = get_settings()
    token = get_access_token()
    if not token:
        return {"error": "Could not obtain access token"}

    payload = {
        "ShortCode":       settings.mpesa_shortcode,
        "ResponseType":    "Completed",
        "ConfirmationURL": f"{settings.mpesa_callback_url.rstrip('/')}/confirmation",
        "ValidationURL":   f"{settings.mpesa_callback_url.rstrip('/')}/validation",
    }

    # Fix callback URL to point to backend, not frontend
    backend_url = "https://horizon-hope-academy-api.onrender.com"
    payload["ConfirmationURL"] = f"{backend_url}/api/v1/payments/confirmation"
    payload["ValidationURL"]   = f"{backend_url}/api/v1/payments/validation"

    try:
        resp = httpx.post(
            f"{_base_url()}/mpesa/c2b/v1/registerurl",
            json=payload,
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type":  "application/json",
            },
            timeout=15.0,
        )
        data = resp.json()
        logger.info("mpesa_service: C2B URL registration: %s", data)
        return data
    except Exception as exc:
        logger.error("mpesa_service: C2B registration failed: %s", exc)
        return {"error": str(exc)}


def simulate_c2b_payment(
    amount: float,
    msisdn: str,
    bill_ref: str,
) -> dict:
    """
    Sandbox only: simulate a C2B payment to test the confirmation flow.
    In production, real payments come from Safaricom automatically.

    bill_ref = student admission number (e.g. HHA/2025/001)
    """
    settings = get_settings()
    if settings.mpesa_env == "production":
        return {"error": "Simulation not allowed in production"}

    token = get_access_token()
    if not token:
        return {"error": "Could not obtain access token"}

    payload = {
        "ShortCode":     settings.mpesa_shortcode,
        "CommandID":     "CustomerPayBillOnline",
        "Amount":        str(int(amount)),
        "Msisdn":        msisdn,
        "BillRefNumber": bill_ref,
    }

    try:
        resp = httpx.post(
            f"{_base_url()}/mpesa/c2b/v1/simulate",
            json=payload,
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type":  "application/json",
            },
            timeout=15.0,
        )
        data = resp.json()
        logger.info("mpesa_service: simulation result: %s", data)
        return data
    except Exception as exc:
        logger.error("mpesa_service: simulation failed: %s", exc)
        return {"error": str(exc)}


def get_transaction_status(transaction_id: str) -> dict:
    """Query the status of a specific M-Pesa transaction."""
    token = get_access_token()
    if not token:
        return {"error": "Could not obtain access token"}

    settings = get_settings()
    payload = {
        "Initiator":          "testapi",
        "SecurityCredential": "",
        "CommandID":          "TransactionStatusQuery",
        "TransactionID":      transaction_id,
        "PartyA":             settings.mpesa_shortcode,
        "IdentifierType":     "4",
        "ResultURL":          f"{_base_url()}/api/v1/payments/status-result",
        "QueueTimeOutURL":    f"{_base_url()}/api/v1/payments/status-timeout",
        "Remarks":            "Status query",
        "Occasion":           "",
    }

    try:
        resp = httpx.post(
            f"{_base_url()}/mpesa/transactionstatus/v1/query",
            json=payload,
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type":  "application/json",
            },
            timeout=15.0,
        )
        return resp.json()
    except Exception as exc:
        return {"error": str(exc)}
