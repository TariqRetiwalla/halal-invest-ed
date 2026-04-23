# ARCHITECTURE.md — Halal Invest Ed

## System Overview

Halal Invest Ed is a Next.js full-stack application deployed on Railway. The frontend, API layer, and server-side logic all live in one codebase. A Railway-managed PostgreSQL database persists user accounts, lesson progress, quiz attempts, and simulator sessions.

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
│                          │  - Lesson locking  │ │
│                          │  - Class management│ │
│                          └─────────┬──────────┘ │
└────────────────────────────────────│────────────┘
                                     │
                         ┌───────────▼───────────┐
                         │  Railway PostgreSQL    │
                         │  - users              │
                         │  - classes            │
                         │  - class_memberships  │
                         │  - class_lesson_locks │
                         │  - lesson_progress    │
                         │  - quiz_attempts      │
                         │  - simulator_sessions │
                         │  - club_signups       │
                         └───────────────────────┘
```

---

## User Types

### Solo Student
- Registers at `/auth/register` with no class code
- Self-paced through lessons — individual completion lock only
- No class leaderboard
- Simulator unlocks when all 5 lessons are complete

### Club Student
- Registers at `/auth/register` and enters a class code
- Teacher controls which lessons are visible for the class
- Must satisfy both individual completion AND teacher unlock to access a lesson
- Sees class leaderboard on Account → Stats tab
- Simulator unlocks when all 5 lessons complete, or earlier if teacher manually unlocks

### Teacher
- Registers via the public `/start-a-club` page (separate flow from students)
- Receives a class code on registration
- Manages their class from Account → Start a Club tab
- Can lock/unlock lessons for the whole class
- Can manually unlock the simulator before all lessons are complete

---

## Page Structure

| Route | Auth required | Description |
|-------|--------------|-------------|
| `/` | No | Landing page — hero, CTAs, what is halal investing |
| `/learn` | Yes | 5-lesson structured curriculum with quizzes |
| `/play` | Yes | Halal screening simulator (hard-gated until 5 lessons complete) |
| `/account` | Yes | Stats, Profile, Start a Club tabs |
| `/auth/register` | No | Student sign-up (solo or club, class code optional) |
| `/auth/login` | No | Log in |
| `/start-a-club` | No | Public teacher/club information page + teacher registration |

---

## Navigation

Three top-level sections visible in the navbar for authenticated users:

- **Learn** — lesson list with progress indicators
- **Play** — simulator (locked state shown until gate passes)
- **Account** — three tabs:
  - **Stats** — lesson progress, quiz scores, leaderboard position (club students only)
  - **Profile** — name, email, change password
  - **Start a Club** — teachers see class management hub; students see a prompt linking to the public `/start-a-club` page

Unauthenticated users see login/register CTAs in the navbar.

---

## 5-Lesson Structure

All 5 lessons ship in v1. Each lesson contains multiple sections (5–15 min each) and a quiz at the end with explanatory per-question feedback.

| # | Title | Key topics |
|---|-------|------------|
| 1 | What is wealth and how does it grow? | Value, inflation, opportunity cost, profit vs interest |
| 2 | Owning a piece of a real business (Musharakah) | Stocks as ownership, compound profit simulator visual |
| 3 | The market: why prices move | Supply/demand, news events, why shorting is haram |
| 4 | Halal screening: what can you invest in? | Riba, gharar, maysir, sector screening, financial ratios |
| 5 | Building a portfolio: diversification and patience | Long-term thinking, the halal investor's edge |

Progress is saved to the database. Lesson content includes:
- Lesson 2: animated compound profit visual (years invested → growth curve slider)
- Lesson 3: interactive news-to-price-movement chart (click event → see price react)
- Other lessons: text sections with simple diagrams

Quiz feedback is explanatory — not just "wrong — try again" — each incorrect answer gets a tailored explanation.

---

## Lesson Locking — Two Layers

Lesson access is governed by two independent locks, both of which must be satisfied:

### Layer 1 — Individual Completion Lock
Lesson N+1 is inaccessible until Lesson N is marked complete. Applies to all users.

### Layer 2 — Teacher Lock (club students only)
The teacher controls which lessons are visible for the whole class. By default, only Lesson 1 is unlocked. The teacher unlocks each subsequent lesson when the class is ready. A club student cannot access a lesson even if they completed the prior one, if the teacher has not yet unlocked it.

Solo students are subject to Layer 1 only.

---

## Halal Screening Simulator

### Hard Gate

The simulator is locked until the student has completed all 5 lessons. While locked, `/play` shows a progress bar: "X of 5 lessons complete — complete all 5 to unlock."

For club students, the teacher can manually unlock the simulator before all lessons are complete.

### Company Dataset
- ~50 companies: mix of clearly halal, clearly haram, and edge cases
- Stored as seed data
- Each company shows 4 data points: what the company does, main income source, interest income level (Low/Medium/High), debt level (Low/Medium/High)

### Screening Flow

```
Present company card (4 data points)
         │
         ▼
3 yes/no screening questions
         │
         ▼
Student submits decision
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
6. Feedback includes a lesson callback link: "This is about riba — revisit Lesson 4, Section 2."

The system must never allow a haram company through under any circumstances. **The block is enforced server-side.** The halal verdict is never exposed to the client before the student answers.

**Mistake Type 2 — Student blocks a halal company:**

1. Response: "Good instinct — but this one passes. Here's why."
2. Brief explanation of which criteria it meets and why.
3. Allow the student to reconsider and try again.

**Tone throughout:** Teaching moment, not punishment. The simulator is a guide, not a judge.

### GBM Price Simulation
Prices are simulated using Geometric Brownian Motion (client-side JavaScript). No real financial data is used.

### Screening History
Students can view a history of companies they have screened, with pass/fail results.

---

## Teacher Features

All in v1:

- Class code generated automatically on teacher registration (unique 6-character code)
- Account → Start a Club tab (teacher view) shows:
  - Class code displayed large and copyable
  - Student list with engagement data (lessons completed, quiz scores)
  - Lesson unlock controls (unlock per lesson for the whole class)
  - Class leaderboard view (username + simulator profit %)
- Class leaderboard: visible to class members only, sorted by simulator profit %
- Teacher can manually unlock the simulator for the class before all 5 lessons are complete

---

## Two Sign-Up Flows

### Student Flow — `/auth/register`
All students (solo and club) register here.

Fields: username, email, password, age range, class code (optional, labelled "Have a class code? Enter it here").

- If a valid class code is entered → student is linked to that class as a club student
- If blank → solo student

### Teacher Flow — `/start-a-club`
Teachers register via the public `/start-a-club` page (a separate flow from student registration).

Fields: name, email, password, school/club name.

On completion: teacher receives their class code and is taken to the teacher dashboard (Account → Start a Club tab).

---

## Database Schema

```sql
users (
  id, username, email, password_hash,
  role,          -- 'student' | 'teacher'
  age_range,     -- 'under-13' | '13-17' | '18+'
  created_at
)

classes (
  id, teacher_id (→ users.id),
  class_code,    -- unique 6-char code
  name,          -- school/club name
  simulator_unlocked,  -- boolean, teacher can unlock early
  created_at
)

class_memberships (
  id, class_id (→ classes.id), student_id (→ users.id),
  joined_at
)

class_lesson_locks (
  id, class_id (→ classes.id),
  lesson_number,  -- 1-5
  is_locked,      -- boolean (teacher controls)
  updated_at
)

lesson_progress (
  id, user_id (→ users.id),
  lesson_number,  -- 1-5
  completed_at
)

quiz_attempts (
  id, user_id (→ users.id),
  lesson_number,
  score,          -- 0-100
  attempted_at
)

simulator_sessions (
  id, user_id (→ users.id),
  company_id,
  student_decision,   -- 'pass' | 'fail'
  correct,            -- boolean
  mistake_type,       -- null | 1 | 2
  attempt_number,     -- 1 | 2
  profit_pct,         -- running portfolio profit % after this session
  created_at
)

club_signups (
  id, email, name, role,  -- 'teacher' | 'parent' | 'other'
  created_at
)
```

---

## Auth Flow

- **Student registration:** username, email, password (bcrypt hashed), age range, optional class code. No DOB stored.
- **Teacher registration:** name, email, password, school/club name. Class code generated server-side.
- **Login:** validate credentials, issue JWT stored in httpOnly cookie.
- **Protected routes:** `withAuth` middleware checks JWT server-side.
- **No third-party OAuth in v1** — minimal data footprint for minors.

---

## Legal and Compliance

- Legal disclaimer displayed on `/learn` and `/play`: "Educational only, not certified Shariah advice, no real financial data."
- No real money, no real financial data, no live market feeds in v1.
- Minimal data collection — child safety (COPPA/GDPR-K) compliance.

---

## Environment Variables

```
DATABASE_URL=          # Railway PostgreSQL connection string
JWT_SECRET=            # Random 256-bit secret
NEXT_PUBLIC_APP_URL=   # Public app URL (Railway-provided)
```

Secrets are never committed to the repository. See `docs/security.md`.
