# ADR-003: Expanded Ecosystem — RosarioSIS Portal + M-Pesa + PDF Engine
**Date:** 2025-07-01
**Status:** Accepted

## Context
Horizon Hope Academy requires more than a public website.
Operational needs include: school management portal, fee collection,
document printing, and offline capability for the Shamata location
(intermittent connectivity in the Aberdares).

## Decisions

| Concern | Decision | Reason |
|---------|----------|--------|
| School management portal | RosarioSIS (white-labeled) in Docker | Free, open-source, PHP/PostgreSQL, RBAC built-in |
| Fee payments | M-Pesa C2B via Daraja API (Safaricom) | Kenya's dominant mobile money platform |
| PDF generation | WeasyPrint + ReportLab | Free, Python-native, A4-accurate output |
| Offline-first | Next.js PWA + Workbox + IndexedDB | Zero-cost, works on Shamata school Wi-Fi |
| Payroll | Custom FastAPI ledger + KRA P9 export | No ERP license fees |
| Compliance | Kenya DPA 2019 + IDOR-safe JWT scoping | Legal requirement for minor data |

## Port Map (no conflicts)
| Service | Internal | External |
|---------|----------|----------|
| Next.js frontend | 3000 | 3000 |
| FastAPI backend | 8000 | 8000 |
| RosarioSIS portal | 80 | 8080 |
| PostgreSQL (main) | 5432 | 5433 |
| PostgreSQL (SIS) | 5432 | 5434 |
| Redis | 6379 | 6380 |
