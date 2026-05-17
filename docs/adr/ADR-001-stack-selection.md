# ADR-001: Technology Stack Selection
**Date:** 2025-07-01  
**Status:** Accepted  
**Author:** Principal Engineer

## Context
Horizon Hope Academy requires a production-grade web presence. The school is a small private 
institution in Shamata, Nyandarua County. Constraints: zero budget, Ubuntu Linux machine.

## Decision
| Layer       | Technology          | Rationale                                              |
|-------------|---------------------|--------------------------------------------------------|
| Frontend    | Next.js 14 (App Router) + TypeScript | SSR/SSG = fast on low bandwidth Kenya connections |
| Styling     | Tailwind CSS        | Utility-first, no runtime overhead                     |
| Animation   | Framer Motion       | Production-grade declarative animations                |
| Backend     | FastAPI (Python)    | Async, auto-docs, type-safe, fastest Python framework  |
| Database    | PostgreSQL (local)  | ACID-compliant, free, scales to production             |
| Cache       | Redis (local)       | Session store, rate limiting, query caching            |
| DevOps      | Docker Compose      | Reproducible local environment                         |
| IaC         | Terraform + LocalStack | Simulate cloud infra locally before free deploy    |
| CI/CD       | GitHub Actions      | Free tier, 2000 min/month                              |
| Deploy      | Vercel (frontend) + Render (backend) | Both have permanent free tiers         |
| Compliance  | Kenya Data Protection Act 2019 | Student data handled under KE DPA          |

## Consequences
- Zero cloud bill during development
- Production-identical local environment via Docker
- Deployable to free tiers without architecture changes
