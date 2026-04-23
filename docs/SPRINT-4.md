# Sprint 4 — Teacher and Club

**Goal:** Class codes work end-to-end, lesson locking is teacher-controlled, engagement tracking is visible in the teacher dashboard, and the class leaderboard is live.

---

## Scope

### Backend (backend-engineer)
- [ ] Class data model: confirm `classes`, `class_memberships`, `class_lesson_locks` tables are applied (already in Sprint 1 migration)
- [ ] `PATCH /api/teacher/lessons/:id/lock` — locks a lesson for the whole class
- [ ] `PATCH /api/teacher/lessons/:id/unlock` — unlocks a lesson for the whole class
- [ ] `GET /api/teacher/class` — returns student list with lesson progress and quiz scores (engagement data)
- [ ] `GET /api/class/leaderboard` — returns class members sorted by simulator profit %, usernames only
- [ ] `PATCH /api/teacher/simulator/unlock` — teacher manually unlocks simulator for the class before all lessons are complete
- [ ] Class code validation on student registration: confirm code exists and links the student to the correct class

### Frontend (frontend-engineer + simulator-engineer)
- [ ] Account → Start a Club tab (teacher view):
  - Class code displayed large and copyable
  - Student list with engagement (lessons completed, quiz scores per student)
  - Lesson lock/unlock controls (one toggle per lesson, applies to whole class)
  - Class leaderboard view (username + simulator profit %)
  - Simulator early-unlock control
- [ ] Account → Start a Club tab (student view): prompt with link to public `/start-a-club` page
- [ ] Account → Stats tab: add leaderboard position for club students
- [ ] Simulator `/play` page: respect teacher early-unlock — if teacher has unlocked simulator for the class, show it even if student has not completed all 5 lessons

---

## Not In Sprint 4

- Final polish, mobile pass, meta tags (Sprint 5)
- `/start-a-club` public page final content (Sprint 5)

---

## Definition of Done

- Teacher registers (or uses existing teacher account), gets class code
- Student joins with class code and is linked to the correct class
- Teacher locks Lesson 2 — club student cannot access Lesson 2 even after completing Lesson 1
- Teacher unlocks Lesson 2 — club student can now access it
- Teacher engagement view shows correct lesson completion and quiz scores for each student
- Class leaderboard shows correct ranking after simulator sessions (sorted by profit %)
- Teacher can manually unlock the simulator — club student can access `/play` before completing all 5 lessons
- `npm run build` passes with no errors
