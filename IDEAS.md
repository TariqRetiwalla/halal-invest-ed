# IDEAS.md — Future Feature Backlog

This file captures features that are out of scope for v1 but worth building later. Entries are tagged with a target version.

---

## v2 Features

### Virtual Portfolio — Persistent Tracking
Allow students to build and track a virtual portfolio over real time, not just within a single session. Requires a richer backend with scheduled data fetching and per-user portfolio state.

### Parent Dashboard
Parents can view their child's activity: which companies they screened, what they got right and wrong, and how their understanding is developing over time.

### Teacher Dashboard / Class Codes (v2 of "Start a Club")
Teachers create a class, students join with a code. Teacher sees group progress, common mistakes, and can set which companies to screen. This is the v2 evolution of the "Start a Club" information page.

### Zoya / Islamicly API Integration
Replace the static halal screening dataset with live data from Zoya or Islamicly's API. This gives real-time, authoritative halal screening results rather than manually curated data.

### Donation / Buy Me a Coffee Integration (in "Start a Club" section)
Two options noted:
- **(a) Simple BMAC link/button** — no dev required, just a link/button pointing to a Buy Me a Coffee page
- **(b) Embedded Stripe donation widget** — small setup required, allows in-app donations without leaving the site

---

## v3 Features

### School / Masjid Licensing Tier
Institutional accounts for schools and mosques. Bulk student management, branded experience, reporting for administrators. Requires a proper multi-tenancy layer and billing.

---

## Completed / In v1

- Halal screening simulator (gamified, with teaching-moment wrong-answer flows)
- "Start a Club" information page (session format guide, printable ground rules, email sign-up)
- Basic user auth (username/email, password, age range — minimal data)
