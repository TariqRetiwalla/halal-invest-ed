# Sprint 1 — Foundation

**Goal:** Get the project scaffold, database, and auth working end-to-end. By the end of Sprint 1, a user can register, log in, and see their username displayed. The project is deployed on Railway.

---

## Scope

### Backend (backend-engineer)
- [ ] Initialise Next.js project with TypeScript and Tailwind
- [ ] Set up Prisma with Railway PostgreSQL
- [ ] Write and run initial migration (users, simulator_sessions, simulator_answers, club_signups tables)
- [ ] Implement `lib/prisma.ts` singleton
- [ ] Implement `lib/auth.ts` (JWT issue, verify, cookie helpers)
- [ ] `POST /api/auth/register` — with Zod validation, bcrypt, JWT cookie
- [ ] `POST /api/auth/login` — with rate limiting
- [ ] `POST /api/auth/logout`
- [ ] `GET /api/auth/me`
- [ ] `withAuth` middleware

### Frontend (frontend-engineer)
- [ ] Navbar component (auth-state aware: show login/register or username + logout)
- [ ] Footer component with disclaimer
- [ ] `/auth/register` page — wired to register API
- [ ] `/auth/login` page — wired to login API
- [ ] Landing page scaffold (hero section, CTAs — not final content)

### Infrastructure
- [ ] Project initialised and pushed to https://github.com/TariqRetiwalla/halal-invest-ed
- [ ] Railway web service created and connected to GitHub repo
- [ ] Railway PostgreSQL database provisioned
- [ ] Environment variables set in Railway: DATABASE_URL, JWT_SECRET, NEXT_PUBLIC_APP_URL
- [ ] First successful deployment to Railway

---

## Not In Sprint 1

- Simulator (Sprint 2)
- Company dataset (Sprint 2)
- Start a Club page (Sprint 3)
- Learn page (Sprint 3)

---

## Definition of Done

- User can register with username, email, password, age range
- User can log in and see their username in the navbar
- User can log out
- App is live on Railway at a public URL
- No secrets in the repository
- `npm run build` passes with no errors
