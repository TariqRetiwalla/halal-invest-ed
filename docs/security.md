# security.md — Halal Invest Ed Security Policy

## Overview

Halal Invest Ed serves a mixed audience that includes children and teenagers. This document defines the security and privacy requirements the application must meet.

---

## Child Safety — COPPA / GDPR-K Compliance

### Who this applies to
Any user who indicates they are under 13 (COPPA — USA) or under 16 (GDPR — EU/UK). The age range collected at registration triggers appropriate data handling.

### Requirements

**Minimal data collection**
- Collect only what is strictly necessary: username or email, password, age range.
- Do not collect full name, date of birth, phone number, or location.
- Do not collect behavioural data beyond what is needed for the educational simulator.

**No selling or sharing data**
- User data is never sold to third parties.
- No advertising SDKs or tracking pixels that profile minors.
- Analytics (if added) must be privacy-preserving (e.g., Plausible, not Google Analytics with user tracking).

**Parental consent considerations**
- For users who identify as under 13, display a clear notice that parental awareness is recommended.
- In v2, consider adding a parental consent flow before a minor's account is fully activated.
- Do not use dark patterns to encourage minors to share more data.

**Data retention**
- Inactive accounts (no login for 12 months) should be scheduled for deletion.
- Users can request account deletion at any time.

---

## Educational Simulator — No Real Financial Data

The simulator is educational only. This must be clearly stated:

- No real money is involved at any point.
- Company data used in the simulator is curated for educational purposes and may not reflect current real-world figures.
- The halal screening results are educational guidance, not certified Shariah advisory opinions.
- A clear disclaimer must appear on the simulator page and in the terms of use.

---

## Authentication

- Passwords are hashed with **bcrypt** (minimum 12 rounds). Plaintext passwords are never stored or logged.
- JWTs are signed with a strong secret (minimum 256-bit random value stored in environment variables).
- JWTs are stored in **httpOnly, Secure, SameSite=Strict cookies** — not in localStorage or sessionStorage.
- JWT expiry: 7 days for normal sessions. No refresh token in v1 (re-login required after expiry).
- Failed login attempts: rate-limit after 5 consecutive failures per IP (implement with `express-rate-limit` or equivalent Next.js middleware).
- Auth for minors: collect only username/email, password, and age range. No additional PII required.

---

## Transport Security

- **HTTPS only** — all traffic must be served over TLS. Railway provides this automatically via its managed certificates.
- HTTP requests must redirect to HTTPS.
- HSTS header should be set: `Strict-Transport-Security: max-age=31536000; includeSubDomains`.

---

## Secrets Management

- All secrets (database credentials, JWT secret, API keys) are stored as **environment variables** in Railway's environment configuration.
- Secrets are **never committed to the repository** — not in `.env` files, not in comments, not in code.
- `.env.local` and `.env` are listed in `.gitignore`.
- The `DATABASE_URL` and `JWT_SECRET` are rotated if accidentally exposed.

**Required environment variables:**
```
DATABASE_URL      — Railway PostgreSQL connection string
JWT_SECRET        — Random 256-bit string (generate with: openssl rand -hex 32)
NEXT_PUBLIC_APP_URL — Public URL of the deployed app
```

---

## Input Validation and Injection Prevention

- All user inputs are validated server-side before touching the database.
- Use Prisma's parameterised queries — never construct raw SQL with user input.
- Email addresses are validated with a strict regex or a validation library (e.g., `zod`).
- Form fields have appropriate length limits enforced both client- and server-side.

---

## Dependency Security

- Run `npm audit` regularly and address high/critical vulnerabilities.
- Keep Next.js, Prisma, and other dependencies up to date.
- Use Dependabot or equivalent automated dependency scanning on the GitHub repo.

---

## Incident Response

If a security issue is discovered:
1. Assess scope — what data could be affected?
2. If any user PII is involved, rotate credentials and notify affected users within 72 hours (GDPR requirement).
3. Patch and redeploy.
4. Document the incident and remediation steps.

For responsible disclosure, contact: raheelr@gmail.com
