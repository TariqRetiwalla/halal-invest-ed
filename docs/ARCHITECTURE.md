# ARCHITECTURE.md — Halal Invest Ed

## System Overview

Halal Invest Ed is a Next.js full-stack application deployed on Railway. The frontend, API layer, and server-side logic all live in one codebase. A Railway-managed PostgreSQL database persists user accounts and session data.

```
┌─────────────────────────────────────────────────┐
│                 Railway Web Service              │
│                                                 │
│   ┌─────────────────┐   ┌─────────────────────┐ │
│   │  Next.js Pages  │   │  Next.js API Routes │ │
│   │  (App Router)   │◄──►  /app/api/**        │ │
│   └─────────────────┘   └──────────┬──────────┘ │
│                                    │            │
│                          ┌─────────▼──────────┐ │
│                          │  Business Logic    │ │
│                          │  - Halal screener  │ │
│                          │  - Auth (JWT)      │ │
│                          │  - Email sign-up   │ │
│                          └─────────┬──────────┘ │
└────────────────────────────────────│────────────┘
                                     │
                         ┌───────────▼───────────┐
                         │  Railway PostgreSQL    │
                         │  - users              │
                         │  - simulator_sessions │
                         │  - club_signups       │
                         └───────────────────────┘
```

---

## Page Structure

| Route | Description |
|-------|-------------|
| `/` | Landing page — what is halal investing, how the simulator works |
| `/simulator` | The halal screening simulator game |
| `/learn` | Educational content — Islamic finance principles |
| `/start-a-club` | Information page: session format, ground rules, email sign-up |
| `/auth/register` | Sign up (minimal fields: username/email, password, age range) |
| `/auth/login` | Log in |

---

## Halal Screening Simulator

### Purpose
Students are presented with a company and asked to screen it against Islamic finance criteria. The simulator teaches through guided practice, not passive reading.

### Screening Criteria
A company fails halal screening if it:
- Derives significant revenue from haram sectors (alcohol, tobacco, weapons, gambling, adult content, pork)
- Has excessive debt (debt-to-asset ratio above a defined threshold)
- Earns significant interest income (riba)

### Question Flow

```
Present company + financial snapshot
         │
         ▼
Student makes screening decision
         │
    ┌────┴────┐
   PASS      FAIL
    │          │
    ▼          ▼
Is it      Is it
actually   actually
halal?     haram?
    │          │
  ┌─┴─┐      ┌─┴─┐
 YES  NO    YES   NO
  │    │     │     │
  ▼    ▼     ▼     ▼
Correct  Mistake  Correct  Mistake
         Type 2            Type 1
```

### Wrong-Answer Behaviour (Critical — never allow a haram company through)

**Mistake Type 1 — Student tries to pass a haram company:**

1. Response: "Hold on — let's look at this again."
2. Highlight the specific data point they missed (e.g., the debt ratio figure, the revenue breakdown).
3. One sentence Islamic principle explanation (e.g., "Riba — interest — is prohibited in Islamic finance because it creates unfair obligations.").
4. Re-ask the question.
5. If wrong again: show the correct answer + full explanation + block the investment + suggest finding another company.

The system must never allow a haram company through under any circumstances. The block is enforced server-side.

**Mistake Type 2 — Student blocks a halal company:**

1. Response: "Good instinct to be careful — but this one actually passes. Here's why."
2. Brief explanation of which criteria it meets and why.
3. Allow the student to reconsider and try again.

**Tone throughout:** Teaching moment, not punishment. "Let's figure this out together." The simulator is a guide, not a judge.

---

## "Start a Club" Page (v1)

An information-only page. No backend complexity required in v1.

Contents:
- Session format guide (how to run a halal investing club session)
- Printable halal ground rules for the MarketWatch trading game
- What students need to participate
- Simple email sign-up form (stored in `club_signups` table)

Teacher dashboard (class codes, progress visibility) is a v2 feature — see IDEAS.md.

---

## Database Schema (Outline)

```sql
-- Users (minimal data — child safety compliance)
users (
  id, username, email, password_hash,
  age_range,         -- 'under-13' | '13-17' | '18+'
  created_at
)

-- Simulator sessions
simulator_sessions (
  id, user_id, company_id,
  student_decision,  -- 'pass' | 'fail'
  correct,           -- boolean
  mistake_type,      -- null | 1 | 2
  attempt_number,    -- 1 or 2 (second attempt after hint)
  created_at
)

-- "Start a Club" email sign-ups
club_signups (
  id, email, name, role,  -- 'teacher' | 'parent' | 'other'
  created_at
)
```

---

## Auth Flow

- Registration: collect username/email, password (bcrypt hashed), age range. No DOB stored.
- Login: validate credentials, issue JWT stored in httpOnly cookie.
- Protected routes: middleware checks JWT on server side.
- No third-party OAuth in v1 (keeps data footprint minimal for minors).

---

## Environment Variables

```
DATABASE_URL=          # Railway PostgreSQL connection string
JWT_SECRET=            # Random 256-bit secret
NEXT_PUBLIC_APP_URL=   # Public app URL (Railway-provided)
```

Secrets are never committed to the repository. See `docs/security.md`.
