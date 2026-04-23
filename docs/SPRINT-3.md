# Sprint 3 — Learn & Start a Club

**Goal:** Complete the informational content pages. The app now has a full v1 feature set: simulator, auth, educational content, and club resources.

---

## Scope

### Frontend (frontend-engineer)
- [ ] `/learn` page — Islamic finance principles, screening criteria explained
  - Plain language, age 12+ appropriate
  - Visual breakdown of the three screening criteria
  - No jargon without explanation
- [ ] `/start-a-club` page (per `docs/START-A-CLUB.md` content spec)
  - Session format guide
  - Printable halal ground rules (print-friendly layout, `window.print()` button)
  - What students need section
  - Email sign-up form

### Backend (backend-engineer)
- [ ] `POST /api/club-signups` endpoint
  - Validation: email required, role required
  - Returns 201 on success
- [ ] Confirm club_signups table migration is applied

### Content
- [ ] Landing page — final copy and CTAs (not just scaffold)
- [ ] Meta titles and descriptions for all pages (Next.js metadata API)
- [ ] Disclaimer: "educational only, no real financial data, not certified Shariah advice" — visible on simulator and learn pages

---

## Polish Tasks (if time allows)

- [ ] 404 page
- [ ] Loading states for API-dependent forms (register, login, club sign-up)
- [ ] Success/error toast notifications for form submissions
- [ ] `robots.txt` and `sitemap.xml`

---

## Definition of Done

- All 6 routes return correct pages with no console errors
- Club sign-up form submits successfully and data appears in database
- Printable ground rules print correctly (navbar/footer hidden in print view)
- Learn page reviewed for reading level and accuracy
- `npm run build` passes
- Full app deployed to Railway and smoke-tested at the live URL
