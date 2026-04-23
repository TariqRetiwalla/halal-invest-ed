# Start a Club — Content Spec

This document defines the content for the "Start a Club" page (v1). The page is information-only — no teacher dashboard, no class codes. Those are v2 features (see IDEAS.md).

---

## Page Purpose

Help teachers, parents, and youth group leaders run a halal investing club session using the simulator and the MarketWatch paper trading game.

---

## Page Sections

### 1. What is a Halal Investing Club?

Brief intro: a structured session where students learn to evaluate investments through an Islamic finance lens. Uses the Halal Invest Ed simulator alongside the free MarketWatch paper trading game.

Suitable for:
- Islamic school classes (secondary level)
- Masjid youth groups
- Home education co-ops
- Parent-led sessions at home

---

### 2. Session Format Guide

A suggested structure for a 60-minute session:

| Time | Activity |
|------|----------|
| 0–10 min | Intro: what is halal investing and why does it matter? |
| 10–25 min | Walk through the halal screening criteria together (use the /learn page) |
| 25–45 min | Students use the Halal Invest Ed simulator — screen 3–5 companies |
| 45–55 min | Group discussion: which companies passed? Which failed? Why? |
| 55–60 min | Wrap-up: what will you look for when you invest in the future? |

For a shorter session (30 minutes): skip the group discussion or reduce simulator time to 2–3 companies.

---

### 3. Printable: Halal Ground Rules for the MarketWatch Trading Game

**What is MarketWatch?**
MarketWatch Virtual Stock Exchange (vsm.marketwatch.com) is a free paper trading simulator that uses real stock prices. Students can practice buying and selling with virtual money.

**The halal ground rules (printable version):**

> **Halal Investing Rules for Our Trading Game**
>
> Before you buy any stock, you must check:
>
> 1. **What does this company do?**
>    No alcohol, tobacco, weapons, gambling, adult content, or pork businesses.
>
> 2. **How much debt does it carry?**
>    Total debt should be less than 33% of total assets.
>    (Find this on the company's balance sheet or a finance site.)
>
> 3. **Does it earn money from interest?**
>    Interest income should be less than 5% of total revenue.
>
> If a company fails any of these tests — you cannot buy it in our game.
> If you're not sure — use the Halal Invest Ed simulator to check first!
>
> Remember: we are practicing being responsible, ethical investors — not just chasing profit.

*This checklist is a simplified educational guide. For certified Shariah-compliant investing, consult a qualified Islamic finance scholar.*

---

### 4. What Students Need

- A device with a browser (phone, tablet, or computer)
- A free account on Halal Invest Ed (or can use the simulator without an account)
- For the trading game: a free account on MarketWatch Virtual Stock Exchange
- No prior knowledge needed — everything is explained in the simulator

---

### 5. Email Sign-Up Form

**Heading:** "Stay updated"

**Body text:** "We're building more resources for educators and club leaders. Leave your email and we'll let you know when new materials are available — no spam, unsubscribe any time."

**Form fields:**
- Name (optional)
- Email (required)
- I am a: Teacher / Parent / Other (required — select)

**Submit button:** "Keep me posted"

**After submission:** "Thank you! We'll be in touch when new resources are available."

---

## Implementation Notes for Frontend

- The printable ground rules section should use a print-friendly layout. Wrap in a `<section>` with a "Print this page" button that triggers `window.print()`. Use `@media print` CSS to hide navbar, footer, and other sections.
- The email form submits to `POST /api/club-signups` — no auth required.
- No teacher dashboard, class codes, or progress tracking in v1. These are v2 features captured in IDEAS.md.
