# Sprint 2 — Simulator Core

**Goal:** The halal screening simulator is playable end-to-end. Students can screen companies, receive correct feedback on right and wrong answers, and complete a session.

---

## Scope

### Simulator (simulator-engineer)
- [ ] Company dataset — minimum 10 companies (mix of halal/haram, varied failure reasons)
- [ ] Server-side screening decision engine
- [ ] `GET /api/simulator/companies` — returns company list without verdict
- [ ] `POST /api/simulator/session` — creates session
- [ ] `POST /api/simulator/answer` — evaluates answer, returns feedback
  - Mistake Type 1 flow (passing haram): hint + re-ask + block on second failure
  - Mistake Type 2 flow (blocking halal): gentle correction + re-ask
- [ ] `PATCH /api/simulator/session/:id` — records answer
- [ ] Simulator invariant verified: haram company can never be marked as passing (server-side test)

### Frontend (simulator-engineer + frontend-engineer)
- [ ] `/simulator` page with disclaimer banner
- [ ] CompanyCard component (displays company info, revenue breakdown, ratios)
- [ ] AnswerButtons component ("Passes" / "Does not pass")
- [ ] FeedbackPanel component:
  - Correct answer state
  - Mistake Type 1 state (highlight + hint + Islamic principle)
  - Mistake Type 2 state (gentle correction)
  - Blocked state (second Mistake Type 1 failure)
- [ ] Session end / summary screen

---

## Not In Sprint 2

- Start a Club page (Sprint 3)
- Learn page (Sprint 3)
- Virtual portfolio (v2 — IDEAS.md)

---

## Definition of Done

- Student can complete a full simulator session (screen 5+ companies)
- Wrong-answer flows work correctly for both mistake types
- No haram company can be passed regardless of what the student submits (verified manually and by API test)
- Feedback tone is teaching-moment, not punitive
- Session results are stored in the database
- Works on mobile (375px viewport)
