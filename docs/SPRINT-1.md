# Sprint 1 — Foundation

**Goal:** Both auth flows work, database is set up, app is live on Railway. By the end of Sprint 1, a student can register (with or without a class code), a teacher can register and receive a class code, both can log in and see their name in the navbar. The project is deployed on Railway.

---

## Scope

### Backend (backend-engineer)
- [ ] Initialise Next.js project with TypeScript and Tailwind
- [ ] Set up Prisma with Railway PostgreSQL
- [ ] Write and run initial migration (full schema: users, classes, class_memberships, class_lesson_locks, lesson_progress, quiz_attempts, simulator_sessions, club_signups)
- [ ] `lib/prisma.ts` singleton
- [ ] `lib/auth.ts` JWT helpers (issue, verify, cookie helpers)
- [ ] `POST /api/auth/register` (student) — username, email, password, age range, optional class code. If code is valid → club student linked to class. If blank → solo student.
- [ ] `POST /api/auth/teacher-register` — name, email, password, school/club name. Generates class code. Creates teacher record and class.
- [ ] `POST /api/auth/login`
- [ ] `POST /api/auth/logout`
- [ ] `GET /api/auth/me`
- [ ] `withAuth` middleware

### Frontend (frontend-engineer)
- [ ] Navbar component (Learn / Play / Account — auth-state aware: show login/register or username + logout)
- [ ] Footer component with disclaimer
- [ ] `/auth/register` page — student sign-up form wired to register API. Class code field is optional, labelled "Have a class code? Enter it here"
- [ ] `/auth/login` page — wired to login API
- [ ] Landing page scaffold (hero section, CTAs — not final copy)

### Infrastructure
- [ ] Project initialised and pushed to https://github.com/TariqRetiwalla/halal-invest-ed
- [ ] Railway web service created and connected to GitHub repo
- [ ] Railway PostgreSQL database provisioned
- [ ] Environment variables set in Railway: `DATABASE_URL`, `JWT_SECRET`, `NEXT_PUBLIC_APP_URL`
- [ ] First successful deployment to Railway

---

## Not In Sprint 1

- Lessons (Sprint 2)
- Simulator (Sprint 3)
- Teacher/club features (Sprint 4)
- `/start-a-club` final content (Sprint 5)

---

## Definition of Done

- Student can register with username, email, password, age range (with or without a class code)
- Teacher can register via the teacher-register endpoint and receives a class code
- Both can log in and see their name in the navbar
- Both can log out
- App is live on Railway at a public URL
- No secrets in the repository
- `npm run build` passes with no errors
