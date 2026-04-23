# 001 — Tech Stack Decision

## Decision

**Next.js (App Router) on Railway**, serving as both the frontend and backend in a single deployment.

---

## Options Considered

### Option A: Next.js (Recommended)

Full-stack React framework. Frontend pages, API routes, and server-side logic all live in one codebase and deploy as one Railway service.

**Pros:**
- Single deployment unit — one Railway web service, no separate backend service to manage
- API routes (`/app/api/...`) give a clean backend layer without needing a separate Express server
- Built-in server-side rendering and static generation — fast page loads, good for SEO on the marketing/club pages
- Strong ecosystem: easy auth (NextAuth or custom JWT), easy database access (Prisma + PostgreSQL)
- Railway has first-class Next.js support — deployment is a single `railway up`
- Less infrastructure surface area = less to go wrong in a solo/small-team project

**Cons:**
- API routes are not as ergonomic as a dedicated Express API for very complex backends
- Slightly more opinionated routing than bare React — learning curve if unfamiliar with App Router

---

### Option B: React + Express (Not chosen)

Separate React frontend (Vite or CRA) deployed as a static site, plus a standalone Express API deployed as a second Railway service.

**Pros:**
- Clear separation of concerns between frontend and backend
- Express gives full flexibility for backend middleware, routing, websockets

**Cons:**
- Two Railway services to manage (frontend + backend) — more deployment complexity
- CORS configuration required between services
- Two separate codebases or a monorepo setup needed
- No SSR out of the box — requires extra setup for marketing pages
- More overhead for a project at this scale

---

## Recommendation: Next.js

For a project of this size, deploying on Railway as a single service is a significant operational simplification. Next.js API routes cover all the backend needs (auth, halal screening logic, email sign-up, future portfolio endpoints) without the overhead of running and connecting a separate Express server.

**If complexity grows significantly** (e.g., real-time features, a separate mobile app that needs a standalone API), the API routes can be extracted into a dedicated service at that point.

---

## Stack Summary

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL (Railway managed) |
| ORM | Prisma |
| Auth | Custom JWT (stored in httpOnly cookies) |
| Deployment | Railway (single web service) |
| Repo | https://github.com/TariqRetiwalla/halal-invest-ed |
