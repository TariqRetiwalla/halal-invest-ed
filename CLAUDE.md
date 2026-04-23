# CLAUDE.md — Halal Invest Ed

## Project Overview

Halal Invest Ed is an educational platform teaching young Muslims how to evaluate stocks through an Islamic finance lens. It uses a gamified halal screening simulator to walk students through the criteria that make an investment permissible or impermissible under Shariah.

## Builder Mode

builder_mode: enterprise

## GitHub Repository

https://github.com/TariqRetiwalla/halal-invest-ed

The local git remote is already set. To push:
```
git push origin main
```

## Tech Stack

- **Framework**: Next.js (App Router) — full stack: frontend + API routes in one deployment
- **Deployment**: Railway (web service + PostgreSQL database)
- **Database**: PostgreSQL via Railway managed database
- **Auth**: JWT-based authentication, HTTPS only
- **Styling**: Tailwind CSS

See `docs/001-tech-stack.md` for the full Next.js vs React+Express trade-off analysis.

## Deployment

Platform: Railway
- Web service: Next.js app
- Database: Railway managed PostgreSQL

Railway CLI login: `railway login`
Builder handles deployments themselves — do not auto-deploy.

## Module Agents

Three specialised sub-agents are defined in `.claude/agents/`:

| Agent | File | Responsibility |
|-------|------|----------------|
| frontend-engineer | `frontend-engineer.md` | UI components, pages, Tailwind, accessibility |
| simulator-engineer | `simulator-engineer.md` | Halal screening simulator logic, wrong-answer flows, scoring |
| backend-engineer | `backend-engineer.md` | API routes, database schema, auth, email sign-up |

## Key Architectural Decisions

- All halal screening decisions must be enforced server-side — the simulator must never allow a haram company through
- Child/minor users: COPPA/GDPR-K compliance required — minimal data collection
- Simulator is educational only — no real financial data, no real money

## Files Map

```
CLAUDE.md                        — this file
IDEAS.md                         — future feature backlog
docs/
  001-tech-stack.md              — tech stack decision + trade-offs
  ARCHITECTURE.md                — system architecture
  security.md                    — security policy
.claude/
  agents/
    frontend-engineer.md
    simulator-engineer.md
    backend-engineer.md
```
