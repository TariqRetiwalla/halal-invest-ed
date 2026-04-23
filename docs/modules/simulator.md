# Module: Simulator

**Owner agent:** simulator-engineer
**Status:** Planning

---

## Module Purpose

The halal screening simulator is the core educational feature. Students screen companies against Islamic finance criteria. The simulator teaches through guided practice with a structured wrong-answer flow designed as a teaching moment, not a punishment.

---

## Components in Scope

- Halal screening decision engine (server-side)
- Company dataset (curated for v1)
- Question flow state machine
- Wrong-answer feedback system (Mistake Type 1 and Type 2)
- Scoring within a session
- Simulator-specific UI components
- API routes: `/api/simulator/**`

---

## Halal Screening Criteria (Summary)

1. No significant revenue from haram sectors (alcohol, tobacco, weapons, gambling, adult content, pork)
2. Debt-to-assets ratio <= 33%
3. Interest income as % of revenue <= 5%

Full criteria detail in `docs/ARCHITECTURE.md`.

---

## Wrong-Answer Flows

### Mistake Type 1 (passing a haram company)
Trigger: student submits "Passes" for a haram company

Flow:
1. "Hold on — let's look at this again" + highlight missed data point
2. One-sentence Islamic principle
3. Re-ask the question
4. If wrong again: full explanation + block investment + suggest finding another company

**System invariant: a haram company can never be marked as passing. Enforced server-side.**

### Mistake Type 2 (blocking a halal company)
Trigger: student submits "Does not pass" for a halal company

Flow:
1. "Good instinct to be careful — but this one actually passes. Here's why."
2. Brief explanation of passing criteria
3. Allow reconsideration

---

## Company Dataset Requirements (v1)

Minimum 10 companies. Mix required:
- At least 4 clearly halal companies
- At least 4 clearly haram companies (varied failure reasons: sector, debt, riba)
- At least 2 edge cases (borderline ratios, multiple criteria to check)

Each company entry must include verdict, failure reasons, hint text, Islamic principle text, and full explanation. See `simulator-engineer.md` agent spec for the full `SimulatorCompany` type.

---

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/simulator/companies` | List companies (no verdict in response) |
| POST | `/api/simulator/session` | Start a new session |
| PATCH | `/api/simulator/session/:id` | Record a question result |
| POST | `/api/simulator/answer` | Evaluate a student's answer |

---

## v1 Deliverables

- [ ] Company dataset (10 companies minimum)
- [ ] Server-side screening decision engine
- [ ] `POST /api/simulator/answer` route with full wrong-answer logic
- [ ] Session creation and answer recording
- [ ] Simulator question UI component (company card, answer buttons)
- [ ] Feedback panel (correct answer, Mistake Type 1, Mistake Type 2)
- [ ] "Blocked" state UI for Mistake Type 1 second failure
- [ ] Session summary / end screen

---

## Dependencies

- Backend module: database must be set up for `simulator_sessions` and `simulator_answers` tables
- Frontend module: simulator page shell (layout, chrome) must exist to mount components into
