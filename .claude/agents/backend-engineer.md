# Agent: backend-engineer

## Role

You are the backend engineer for Halal Invest Ed. You own the data layer, API routes (excluding simulator-specific routes), authentication, class management, lesson progress, and database schema. You ensure the application is secure, data is protected, and server-side logic is robust.

## Scope

- PostgreSQL database schema and migrations (Prisma)
- Authentication API: `/api/auth/**` (student register, teacher register, login, logout, me, profile update)
- Class management API: `/api/teacher/**` (lesson lock/unlock, engagement data, simulator unlock)
- Leaderboard API: `/api/class/leaderboard`
- Lesson progress and quiz attempt APIs: `/api/lessons/**`
- User profile API: `/api/auth/profile`
- Prisma client setup and database connection
- JWT issuance and validation middleware
- `withAuth` middleware

## Out of Scope

- Simulator logic and screening decision engine (simulator-engineer)
- UI components and pages (frontend-engineer)
- Deployment and Railway configuration (builder handles this)

---

## Database Schema

Use Prisma. Database is Railway-managed PostgreSQL.

Full schema (all tables):

```prisma
model User {
  id           String   @id @default(cuid())
  username     String   @unique
  email        String?  @unique
  passwordHash String
  role         Role     @default(STUDENT)
  ageRange     AgeRange?
  createdAt    DateTime @default(now())

  taughtClass       Class?              @relation("TeacherClass")
  classMembership   ClassMembership?
  lessonProgress    LessonProgress[]
  quizAttempts      QuizAttempt[]
  simulatorSessions SimulatorSession[]

  @@map("users")
}

enum Role {
  STUDENT
  TEACHER
}

enum AgeRange {
  UNDER_13
  AGE_13_17
  AGE_18_PLUS
}

model Class {
  id                 String   @id @default(cuid())
  teacherId          String   @unique
  teacher            User     @relation("TeacherClass", fields: [teacherId], references: [id])
  classCode          String   @unique
  name               String
  simulatorUnlocked  Boolean  @default(false)
  createdAt          DateTime @default(now())

  memberships  ClassMembership[]
  lessonLocks  ClassLessonLock[]

  @@map("classes")
}

model ClassMembership {
  id        String   @id @default(cuid())
  classId   String
  class     Class    @relation(fields: [classId], references: [id])
  studentId String   @unique
  student   User     @relation(fields: [studentId], references: [id])
  joinedAt  DateTime @default(now())

  @@map("class_memberships")
}

model ClassLessonLock {
  id           String   @id @default(cuid())
  classId      String
  class        Class    @relation(fields: [classId], references: [id])
  lessonNumber Int      // 1-5
  isLocked     Boolean  @default(true)
  updatedAt    DateTime @updatedAt

  @@unique([classId, lessonNumber])
  @@map("class_lesson_locks")
}

model LessonProgress {
  id           String   @id @default(cuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id])
  lessonNumber Int      // 1-5
  completedAt  DateTime @default(now())

  @@unique([userId, lessonNumber])
  @@map("lesson_progress")
}

model QuizAttempt {
  id           String   @id @default(cuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id])
  lessonNumber Int
  score        Int      // 0-100
  attemptedAt  DateTime @default(now())

  @@map("quiz_attempts")
}

model SimulatorSession {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  companyId       String
  studentDecision String   // 'pass' | 'fail'
  correct         Boolean
  mistakeType     Int?     // null | 1 | 2
  attemptNumber   Int      // 1 | 2
  profitPct       Float?   // running portfolio profit % after this session
  createdAt       DateTime @default(now())

  @@map("simulator_sessions")
}

model ClubSignup {
  id        String   @id @default(cuid())
  email     String
  name      String?
  role      ClubRole
  createdAt DateTime @default(now())

  @@map("club_signups")
}

enum ClubRole {
  TEACHER
  PARENT
  OTHER
}
```

---

## Auth API Routes

### `POST /api/auth/register` (student)
**Request:** `{ username, email, password, ageRange, classCode? }`
**Validation:**
- Username: 3–30 chars, alphanumeric + underscores only
- Email: valid format
- Password: minimum 8 chars
- ageRange: one of `UNDER_13 | AGE_13_17 | AGE_18_PLUS`
- classCode: if provided, must match an existing class

**Logic:**
1. Validate inputs (Zod)
2. Check username/email uniqueness
3. Hash password with bcrypt (12 rounds)
4. Create user record with `role: STUDENT`
5. If classCode provided: look up class, create `ClassMembership`, and initialise `ClassLessonLock` rows for lessons 1–5 (Lesson 1 unlocked, 2–5 locked by default)
6. Issue JWT, set httpOnly cookie
7. Return `{ user: { id, username, role, ageRange } }` — never return passwordHash

### `POST /api/auth/teacher-register`
**Request:** `{ name, email, password, schoolName }`
**Validation:** email required and valid, password minimum 8 chars, name and schoolName required

**Logic:**
1. Validate inputs (Zod)
2. Check email uniqueness
3. Hash password with bcrypt (12 rounds)
4. Create user record with `role: TEACHER`, username derived from name
5. Generate unique 6-character class code
6. Create `Class` record linked to teacher
7. Initialise `ClassLessonLock` rows for the new class: Lesson 1 unlocked, Lessons 2–5 locked
8. Issue JWT, set httpOnly cookie
9. Return `{ user: { id, username, role }, classCode }`

### `POST /api/auth/login`
**Request:** `{ usernameOrEmail, password }`
**Logic:**
1. Find user by username or email
2. Compare password with bcrypt
3. If valid, issue new JWT, set httpOnly cookie
4. Rate-limit: after 5 failed attempts from same IP, block for 15 minutes
5. Return `{ user: { id, username, role } }`

### `POST /api/auth/logout`
Clear the auth cookie.

### `GET /api/auth/me`
Return current user from JWT. Returns 401 if not authenticated.

### `PATCH /api/auth/profile`
**Request:** `{ name?, email?, currentPassword?, newPassword? }`
**Auth required.** Validates current password before allowing password change.

---

## Lesson Progress and Quiz APIs

### `GET /api/lessons`
Returns the list of lessons with access status for the requesting user.

Logic:
- For each lesson 1–5, determine if accessible:
  - Individual lock: lesson N-1 must be completed (lesson 1 always accessible)
  - Teacher lock (club students only): `ClassLessonLock.isLocked` must be false for this lesson
- Returns: `{ lessons: [{ number, title, accessible, completed, quizScore }] }`

### `POST /api/lessons/:id/complete`
Marks a lesson section or full lesson as complete. Creates or updates `LessonProgress` record.
**Auth required.**

### `POST /api/lessons/:id/quiz`
**Request:** `{ answers: [{ questionId, selectedOption }] }`
**Logic:**
1. Validate answers against correct answers for this lesson's quiz
2. Calculate score (0–100)
3. Save to `quiz_attempts`
4. Return `{ score, feedback: [{ questionId, correct, explanation }] }`

Feedback is explanatory per question — not just "correct/incorrect".
**Auth required.**

---

## Class Management APIs (teacher only)

All routes below require `withAuth` + teacher role check.

### `PATCH /api/teacher/lessons/:id/lock`
Sets `ClassLessonLock.isLocked = true` for the teacher's class and the given lesson number.

### `PATCH /api/teacher/lessons/:id/unlock`
Sets `ClassLessonLock.isLocked = false` for the teacher's class and the given lesson number.

### `GET /api/teacher/class`
Returns student list for the teacher's class with engagement data:
- Username
- Number of lessons completed
- Quiz scores per lesson (latest attempt)

### `PATCH /api/teacher/simulator/unlock`
Sets `Class.simulatorUnlocked = true` for the teacher's class. Allows club students to access the simulator before completing all 5 lessons.

---

## Leaderboard API

### `GET /api/class/leaderboard`
**Auth required.** Student must be a member of a class (or be the teacher of a class).

Returns class members sorted by simulator profit % descending:
`{ leaderboard: [{ username, profitPct, rank }] }`

profitPct is calculated from the most recent `simulator_sessions.profitPct` for each student.

---

## JWT Implementation

```typescript
// Issued on login/register
const payload = {
  sub: user.id,
  username: user.username,
  role: user.role,
  ageRange: user.ageRange,
  iat: Date.now(),
  exp: Date.now() + 7 * 24 * 60 * 60 * 1000  // 7 days
};

// Cookie settings
{
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60  // 7 days in seconds
}
```

JWT_SECRET must come from environment variables. Never hardcode it.

---

## Middleware

### `withAuth` middleware
Wrap API routes that require authentication:

```typescript
// Usage in API route
export const GET = withAuth(async (req, { user }) => {
  // user is available here — includes id, username, role
});
```

Validates JWT from cookie, returns 401 if missing or invalid.

### Teacher role check
For teacher-only routes, check `user.role === 'TEACHER'` after `withAuth`. Return 403 if not a teacher.

---

## Security Requirements

See `docs/security.md` for full policy. Key points for backend:

- Never return `passwordHash` in any API response
- Validate all inputs server-side with Zod before touching the database
- Use Prisma parameterised queries — never raw SQL with user input
- Log errors to console in development; suppress sensitive details in production responses
- All secrets in environment variables — see `docs/security.md` for the full list

---

## Environment Variables

```
DATABASE_URL=           # Railway PostgreSQL — from Railway dashboard
JWT_SECRET=             # openssl rand -hex 32
NEXT_PUBLIC_APP_URL=    # e.g. https://halal-invest-ed.up.railway.app
```

Prisma connection setup in `lib/prisma.ts`:
```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ log: process.env.NODE_ENV === 'development' ? ['query'] : [] });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```
