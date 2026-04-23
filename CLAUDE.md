# CLAUDE.md — Halal Invest Ed

## Project Overview

Halal Invest Ed is an educational platform teaching young Muslims how to evaluate stocks through an Islamic finance lens. It uses a structured 5-lesson curriculum and a gamified halal screening simulator to walk students through the criteria that make an investment permissible or impermissible under Shariah.

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
| simulator-engineer | `simulator-engineer.md` | Halal screening simulator logic, wrong-answer flows, scoring, hard gate |
| backend-engineer | `backend-engineer.md` | API routes, database schema, auth, class management, lesson progress |

## Key Architectural Decisions

- **All halal screening decisions are enforced server-side** — the simulator must never allow a haram company through. The verdict is never sent to the client before the student answers.
- **Lesson locking has two layers:** (1) individual completion — Lesson N+1 locked until Lesson N is complete, applies to all users; (2) teacher lock — teacher controls which lessons are visible for the whole class, club students cannot access a lesson even if they completed the prior one unless the teacher has unlocked it.
- **Hard simulator gate** — `/play` is locked until the student has completed all 5 lessons. For club students, the teacher can unlock the simulator early. Locked state shows a progress bar with lesson completion count.
- **Two sign-up flows** — students register at `/auth/register` (class code optional: blank = solo student, valid code = club student). Teachers register at `/start-a-club` (separate flow, generates a class code on completion).
- **Three user roles** — `solo student`, `club student`, `teacher`. Role stored on the `users` table. Teacher role unlocks class management features in Account → Start a Club tab.
- **Child/minor users** — COPPA/GDPR-K compliance required. Minimal data collection. No DOB stored — age range only.
- **Simulator is educational only** — no real financial data, no real money, no live market feeds.

## Files Map

```
CLAUDE.md                        — this file
IDEAS.md                         — future feature backlog
docs/
  001-tech-stack.md              — tech stack decision + trade-offs
  ARCHITECTURE.md                — system architecture, user types, DB schema
  security.md                    — security policy
  SPRINT-1.md                    — Foundation: auth, DB, Railway deployment
  SPRINT-2.md                    — 5 Lessons: content, quizzes, progress
  SPRINT-3.md                    — Simulator: hard gate, screening, feedback
  SPRINT-4.md                    — Teacher and Club: class codes, locking, leaderboard
  SPRINT-5.md                    — Polish and Launch: final pages, mobile, go-live
.claude/
  agents/
    frontend-engineer.md
    simulator-engineer.md
    backend-engineer.md
```
