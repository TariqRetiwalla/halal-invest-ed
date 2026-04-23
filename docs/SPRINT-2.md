# Sprint 2 — 5 Lessons

**Goal:** All 5 lessons work end-to-end — sections, quizzes, progress saved, completion-based unlocking, teacher lock respected.

---

## Scope

### Backend (backend-engineer)
- [ ] Lesson data model: `lesson_progress` and `quiz_attempts` tables (already in schema from Sprint 1 migration — confirm applied)
- [ ] `GET /api/lessons` — returns which lessons are accessible for this user (respects individual completion lock + teacher lock for club students)
- [ ] `POST /api/lessons/:id/complete` — marks a section or lesson complete, saves to `lesson_progress`
- [ ] `POST /api/lessons/:id/quiz` — submits quiz answers, returns score + explanatory per-question feedback

### Frontend + Content (frontend-engineer)
- [ ] `/learn` page — lesson list with progress indicators, locked/unlocked states clearly shown
- [ ] All 5 lesson content pages:
  - **Lesson 1:** What is wealth and how does it grow? — value, inflation, opportunity cost, profit vs interest
  - **Lesson 2:** Owning a piece of a real business (Musharakah) — stocks as ownership. Include animated compound profit visual: years invested slider → growth curve
  - **Lesson 3:** The market: why prices move — supply/demand, news events, why shorting is haram. Include interactive news-to-price-movement chart (click news event → see price react)
  - **Lesson 4:** Halal screening: what can you invest in? — riba, gharar, maysir, sector screening, financial ratios
  - **Lesson 5:** Building a portfolio: diversification and patience — long-term thinking, the halal investor's edge
- [ ] Quiz engine component — renders questions, captures answers, shows explanatory feedback per wrong answer (not just "wrong — try again")
- [ ] Lesson unlock logic enforced in UI: Lesson N+1 only shown as accessible if Lesson N complete AND (if club student) teacher has unlocked it
- [ ] Account → Stats tab: lesson completion progress, quiz scores per lesson

---

## Not In Sprint 2

- Simulator (Sprint 3)
- Teacher unlock controls (Sprint 4)
- Class leaderboard (Sprint 4)

---

## Definition of Done

- A logged-in user completes Lesson 1 quiz, logs out, logs back in, sees Lesson 1 marked complete and Lesson 2 unlocked
- Teacher can lock Lesson 2 (via direct DB/API call for now) and a club student cannot access it even after completing Lesson 1
- Quiz feedback is explanatory, per-question — not a single "try again"
- Progress is persisted to the database and survives page reload
- All 5 lesson content pages render with no console errors
- `npm run build` passes with no errors
