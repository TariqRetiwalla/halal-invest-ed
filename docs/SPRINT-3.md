# Sprint 3 — Simulator

**Goal:** Full screening simulator playable, hard-gated on lesson completion, with lesson callback links in feedback.

---

## Scope

### Simulator (simulator-engineer)
- [ ] Company dataset: minimum 40 companies (mix of clearly halal, clearly haram, and edge cases — varied failure reasons), stored as seed data
- [ ] GBM price engine (client-side JavaScript)
- [ ] Screening decision engine (server-side — the halal verdict is never exposed to the client before the student answers)
- [ ] `GET /api/simulator/companies` — returns company list without verdict or failure reasons
- [ ] `POST /api/simulator/session` — creates a simulator session for the authenticated user
- [ ] `POST /api/simulator/answer` — evaluates answer server-side, returns Type 1/Type 2 feedback or correct response. Includes lesson callback link in feedback (e.g., "This ties back to Lesson 4, Section 2 — want to review it?")
- [ ] `GET /api/simulator/access` — returns whether the user has completed all 5 lessons (and, for club students, whether the teacher has unlocked the simulator)
- [ ] Server-side invariant: haram company can never be marked passing — tested and enforced at the API layer

### Frontend (simulator-engineer + frontend-engineer)
- [ ] `/play` page — shows locked state (progress bar: "X of 5 lessons complete — complete all 5 lessons to unlock") until gate passes
- [ ] CompanyCard component — displays company name, what it does, main income source, interest income level (Low/Medium/High), debt level (Low/Medium/High)
- [ ] AnswerButtons component — 3 yes/no screening questions + submit
- [ ] FeedbackPanel component — handles 4 states:
  - **Correct** — brief celebration + next company
  - **Mistake Type 1** (passing haram): "Hold on — let's look at this again" → highlight missed data point → Islamic principle (1 sentence) → re-ask → if wrong again: show answer + block + suggest new company
  - **Mistake Type 2** (blocking halal): "Good instinct — but this one passes. Here's why." → brief explanation → let reconsider
  - **Blocked** — company blocked after second Type 1 failure; move to next company
- [ ] Lesson callback link in feedback panel — links to the exact lesson section relevant to the mistake
- [ ] Screening history: list of companies screened with pass/fail result
- [ ] Session results saved to `simulator_sessions` table
- [ ] Legal disclaimer banner on `/play`
- [ ] Works on mobile (375px viewport)

---

## Not In Sprint 3

- Teacher simulator early-unlock (Sprint 4)
- Class leaderboard (Sprint 4)

---

## Definition of Done

- Student with all 5 lessons complete can access the simulator and screen companies
- Student without all lessons complete sees the locked state with correct progress count
- Both wrong-answer feedback types work correctly and display the lesson callback link
- Student can click the lesson callback link and be taken to the exact lesson section
- Haram company can never be passed regardless of what the student submits (verified manually and by API test)
- Screening history shows past results
- Session data persisted to the database
- Works on mobile at 375px viewport
- `npm run build` passes with no errors
