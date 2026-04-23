# Module: Backend

**Owner agent:** backend-engineer
**Status:** Planning

---

## Module Purpose

Data persistence, authentication, and API infrastructure. Provides the server-side foundation that all other modules depend on.

---

## Responsibilities

- PostgreSQL schema and Prisma migrations
- Auth API (register, login, logout, /me)
- Club sign-up API
- JWT middleware
- Prisma client singleton
- Input validation with Zod
- Database connection management (Railway PostgreSQL)

---

## Database Tables

| Table | Owner | Description |
|-------|-------|-------------|
| `users` | backend | User accounts, minimal fields |
| `simulator_sessions` | backend (schema) / simulator (logic) | Session records |
| `simulator_answers` | backend (schema) / simulator (logic) | Per-question answers |
| `club_signups` | backend | "Start a Club" email sign-ups |

---

## API Routes

| Method | Route | Auth required | Description |
|--------|-------|--------------|-------------|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Login, issue JWT |
| POST | `/api/auth/logout` | No | Clear auth cookie |
| GET | `/api/auth/me` | Yes | Get current user |
| POST | `/api/club-signups` | No | Submit club interest form |

---

## Key Files

| File | Description |
|------|-------------|
| `prisma/schema.prisma` | Full database schema |
| `lib/prisma.ts` | Prisma client singleton |
| `lib/auth.ts` | JWT issue, verify, cookie helpers |
| `middleware/withAuth.ts` | Auth middleware for protected routes |
| `app/api/auth/register/route.ts` | Register endpoint |
| `app/api/auth/login/route.ts` | Login endpoint |
| `app/api/auth/logout/route.ts` | Logout endpoint |
| `app/api/auth/me/route.ts` | Current user endpoint |
| `app/api/club-signups/route.ts` | Club sign-up endpoint |

---

## Security Requirements (Summary)

- Passwords: bcrypt, 12 rounds — never stored or returned in plaintext
- JWT: httpOnly cookies, 7-day expiry, signed with `JWT_SECRET` env var
- Rate limiting: 5 failed login attempts → 15-minute IP block
- All inputs validated with Zod before database operations
- Prisma parameterised queries only — no raw SQL with user input
- Age range field triggers child safety handling — no PII beyond username/email

Full security policy: `docs/security.md`

---

## v1 Deliverables

- [ ] `prisma/schema.prisma` with all 4 models
- [ ] Initial migration applied to Railway PostgreSQL
- [ ] `lib/prisma.ts` singleton
- [ ] `lib/auth.ts` (JWT issue + verify + cookie set/clear)
- [ ] `withAuth` middleware
- [ ] Register endpoint with Zod validation
- [ ] Login endpoint with rate limiting
- [ ] Logout endpoint
- [ ] `/me` endpoint
- [ ] Club sign-up endpoint
- [ ] All endpoints return correct HTTP status codes (200, 201, 400, 401, 403, 409, 500)

---

## Environment Variables

```
DATABASE_URL=           # From Railway dashboard (PostgreSQL)
JWT_SECRET=             # openssl rand -hex 32
NEXT_PUBLIC_APP_URL=    # Railway-assigned URL
```

All must be set in Railway environment before first deployment. Never committed to the repository.

---

## Dependencies

- None — backend is the foundation. Other modules depend on this one.
- Must be deployed and database migrated before simulator or frontend API calls will work.
