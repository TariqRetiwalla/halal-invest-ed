# Sprint 5 — Polish and Launch

**Goal:** Full navigation, all pages complete, mobile-tested, live at a public URL with both user journeys working end-to-end.

---

## Scope

### Backend (backend-engineer)
- [ ] `PATCH /api/auth/profile` — update name, email, change password (with current password verification)

### Frontend (frontend-engineer)
- [ ] `/start-a-club` public page — final content:
  - What a halal investing club looks like
  - Session format guide (how to run a session)
  - Printable halal ground rules — print-friendly CSS, `window.print()` button (navbar/footer hidden in print view)
  - What students need to participate
  - Teacher registration CTA and form wired to `POST /api/auth/teacher-register`
- [ ] Landing page — final copy and CTAs (not just scaffold)
- [ ] Account → Profile tab — name, email, change password form wired to `PATCH /api/auth/profile`
- [ ] Play page locked state — progress bar, lesson completion count, "Complete all 5 lessons to unlock" message
- [ ] Legal disclaimer banners on `/learn` and `/play`
- [ ] Meta titles and descriptions for all pages (Next.js metadata API)
- [ ] Mobile responsiveness pass (all pages, 375px viewport)
- [ ] Loading states on all forms (register, login, quiz submit, teacher sign-up)
- [ ] Error handling — friendly messages on all forms, no raw API errors shown to users
- [ ] 404 page
- [ ] `robots.txt` and `sitemap.xml`

### Infrastructure
- [ ] Railway custom domain configured + SSL verified
- [ ] Smoke test: full student journey (register → lessons → simulator → leaderboard)
- [ ] Smoke test: full teacher journey (register → get code → student joins → lock/unlock lesson → view engagement)
- [ ] Confirm `npm run build` passes with no errors before launch

---

## Definition of Done

- Full app live at public URL
- Both sign-up flows work end-to-end (student at `/auth/register`, teacher at `/start-a-club`)
- Teacher and student journeys complete end-to-end
- Printable ground rules print correctly (no navbar/footer in print view)
- Legal disclaimers visible on `/learn` and `/play`
- All pages have correct meta titles and descriptions
- App is fully responsive at 375px
- All forms show loading states and friendly error messages
- `npm run build` passes with no errors
