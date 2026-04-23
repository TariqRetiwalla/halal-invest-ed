# Module: Frontend

**Owner agent:** frontend-engineer
**Status:** Planning

---

## Module Purpose

All user-facing pages, components, and visual interactions. Built with Next.js App Router and Tailwind CSS.

---

## Pages in Scope

| Route | Priority | Notes |
|-------|----------|-------|
| `/` | P0 | Landing page |
| `/simulator` | P0 | Simulator shell (game logic owned by simulator module) |
| `/learn` | P1 | Educational content |
| `/start-a-club` | P1 | Info page + email sign-up form |
| `/auth/register` | P0 | Registration form |
| `/auth/login` | P0 | Login form |

---

## Key Components

- `Navbar` — site navigation, auth state aware
- `Footer` — links, disclaimer
- `HeroSection` — landing page hero
- `ScreenerCard` — wrapper for simulator questions (layout/chrome)
- `ClubSignupForm` — email sign-up form on Start a Club page
- `AuthForm` — shared form shell for register/login
- `DisclaimerBanner` — "educational only, no real money" — required on simulator page
- `PrintableGroundRules` — printable-friendly layout for the MarketWatch halal ground rules

---

## Design Tokens (Tailwind)

To be defined in `tailwind.config.ts`. Suggested palette:
- Primary: deep green (Islamic association, finance/growth)
- Secondary: warm gold/amber
- Background: off-white / light grey
- Text: near-black for readability
- Error/warning: red-orange (used in wrong-answer feedback)
- Success: green (used in correct-answer feedback)

---

## v1 Deliverables

- [ ] All 6 pages scaffolded with correct routing
- [ ] Navbar with auth state (logged in / logged out)
- [ ] ClubSignupForm wired to `/api/club-signups`
- [ ] AuthForm (register + login)
- [ ] Disclaimer banner on simulator page
- [ ] Responsive layout verified on mobile (375px) and desktop (1280px)
- [ ] Basic accessibility audit complete (keyboard nav, colour contrast, labels)

---

## Dependencies

- Backend module: auth API must be live for login/register forms to work
- Simulator module: simulator page shell can be built before game logic is ready
