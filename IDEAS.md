# IDEAS.md — Future Feature Backlog

This file captures features that are out of scope for v1 but worth building later. Entries are tagged with a target version.

---

## v2 Features

### Persistent Virtual Portfolio
Allow students to build and track a virtual portfolio over real time — prices move over real days and weeks, not just within a single session. Requires a richer backend with scheduled price updates and per-user portfolio state persisted between visits.

### Parent Dashboard
Parents can view their child's activity: which companies they screened, what they got right and wrong, and how their understanding is developing over time.

### Donation / Buy Me a Coffee (in Start a Club page)
Two options noted:
- **(a) Simple BMAC link/button** — no dev required, just a link/button pointing to a Buy Me a Coffee page
- **(b) Embedded Stripe donation widget** — small setup required, allows in-app donations without leaving the site

### Zoya / Islamicly API Integration
Replace the static halal screening dataset with live data from Zoya or Islamicly's API. This gives real-time, authoritative halal screening results rather than manually curated seed data.

### Enhanced Teacher Analytics
Time-on-page and section-level engagement data visible in the teacher dashboard. Helps teachers see where students are spending time and where they are struggling.

### News Event System in Simulator
Random news events trigger price shocks in the GBM simulation. Students see how real-world events affect stock prices and learn to distinguish noise from signal. Builds on the Lesson 3 interactive.

---

## v3 Features

### School / Masjid Licensing Tier
Institutional accounts for schools and mosques. Bulk student management, branded experience, reporting for administrators. Requires a proper multi-tenancy layer and billing.

---

## Completed / In v1

- Halal screening simulator (gamified, with teaching-moment wrong-answer flows, lesson callback links, ~50 company dataset, GBM price simulation)
- 5-lesson structured curriculum (sections, quizzes with explanatory feedback, progress saved to DB)
- Lesson locking: individual completion lock + teacher lock for club students
- Two sign-up flows: student flow at `/auth/register` (solo or club via class code), teacher flow at `/start-a-club`
- Three user roles: solo student, club student, teacher
- Teacher class management: class code, student engagement view, lesson unlock controls, class leaderboard
- Hard simulator gate: locked until all 5 lessons complete (teacher can unlock early for club)
- Account tabs: Stats (progress + leaderboard position), Profile, Start a Club
- `/start-a-club` public page: session format guide, printable halal ground rules, teacher registration
- Basic user auth (username/email, password, age range — minimal data, COPPA/GDPR-K compliant)
- Legal disclaimer banners on `/learn` and `/play`
