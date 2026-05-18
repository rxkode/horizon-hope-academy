# ADR-002: Backend Architecture — FastAPI + PostgreSQL + Redis
**Date:** 2025-07-01  
**Status:** Accepted

## Decision
FastAPI (async) over Django or Flask.

## Rationale
| Concern              | Decision                  | Reason                                        |
|----------------------|---------------------------|-----------------------------------------------|
| Async I/O            | asyncpg + SQLAlchemy 2.0  | Non-blocking DB queries under slow connections |
| Data validation      | Pydantic v2               | OWASP A03 injection prevention at schema level |
| Kenya DPA 2019       | retain_until field        | Automated data expiry per s.25 of the Act      |
| Minor data (PII)     | [PII] tagged fields       | Audit trail, no logging of child data          |
| Containerisation     | Multi-stage Dockerfile    | Builder + minimal runtime = small attack surface|
| Local dev parity     | Docker Compose            | Identical topology to production              |

## Security Notes
- Passwords: bcrypt via passlib (cost factor 12)
- Tokens: HS256 JWT, 30 min expiry
- CORS: whitelist only — no wildcard origins
- Trusted hosts: explicit allowlist
