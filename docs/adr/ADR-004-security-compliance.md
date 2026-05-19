# ADR-004 — Security & Compliance Architecture

**Date:** 2026-05-19
**Status:** Accepted
**Deciders:** Nexus-9 (Security Specialist + Architect)

---

## Context

Horizon Hope Academy handles PII for minors (students aged 4–15) and
financial transaction data (M-Pesa payments). Kenya Data Protection Act
2019 (DPA) and OWASP Top 10 compliance are mandatory.

---

## STRIDE Threat Model

| Threat | Vector | Mitigation |
|--------|--------|------------|
| **S**poofing | Fake M-Pesa callbacks | Daraja IP allowlist + shared secret |
| **T**ampering | Offline queue replay | UNIQUE(device_id, payload_type, client_ts) |
| **R**epudiation | Payment disputes | fee_payments.trans_id UNIQUE + audit log |
| **I**nformation Disclosure | IDOR — parent reads other child data | JWT parent_id claim + WHERE student.parent_id = jwt.parent_id |
| **D**enial of Service | Sync flush flooding | Max 200 items/request + rate limit at proxy |
| **E**levation of Privilege | JWT forgery | python-jose HS256 + bcrypt password hash |

---

## OWASP Top 10 Mapping

| OWASP | Risk | Control |
|-------|------|---------|
| A01 Broken Access Control | Parent reads another child | JWT scope enforcement in /balance/:id |
| A02 Cryptographic Failures | Plaintext passwords | passlib bcrypt rounds=12 |
| A03 Injection | SQL injection via form fields | Pydantic schema validation + SQLAlchemy parameterised queries |
| A04 Insecure Design | M-Pesa double-spend | UNIQUE(trans_id) database constraint |
| A05 Security Misconfiguration | Wildcard CORS | Explicit allowed_origins whitelist in Settings |
| A07 Auth Failures | Brute force login | Rate limiting (Phase 6) + bcrypt cost |
| A09 Logging Failures | No audit trail | payment insert logs TransID + timestamp |

---

## Kenya Data Protection Act 2019 Compliance

| Requirement | Implementation |
|-------------|----------------|
| Lawful basis for processing | Contractual necessity (school enrolment) |
| Data minimisation | Only name, email, phone collected on forms |
| Retention limits | admission_inquiries.retain_until field; cron deletes expired rows |
| Right to erasure | DELETE endpoint (Phase 6 admin panel) |
| Cross-border transfers | Supabase EU region selected for backup |
| PII tagging | All PII columns carry [PII] comment in ORM models |

---

## Security Headers

Enforced via vercel.json (frontend) and TrustedHostMiddleware (backend):X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()

---

## Decisions

1. **JWT algorithm: HS256** — symmetric, sufficient for single-server deployment.
   Migrate to RS256 when multi-service auth is introduced (Phase 6+).

2. **CORS whitelist stored in .env** — never hardcoded. New origin = env var change,
   no code deploy required.

3. **Swagger UI disabled in production** — `docs_url=None` when `DEBUG=false`.

4. **M-Pesa callbacks not JWT-authenticated** — Daraja does not send JWTs.
   Security via: IP allowlist + ResultCode validation + UNIQUE trans_id.

5. **Student data never returned to unauthenticated callers** — /balance/:id
   will require JWT in Phase 4. Current TODO is explicitly marked in code.
