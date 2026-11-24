# Smart Campus Room Availability Checker — Practice Work #12

Comparison of **Code-Based** (HTML/CSS/JS) and **Low-Code** (Appsmith Cloud Free) implementations of the same **Smart Campus Room Availability Checker** contract (`AC1–AC6`, `T1–T8`).

## Live Demos
- **Code-Based Live Demo (GitHub Pages):** https://kulimsire07.github.io/smart-campus-practice-12/code-based/
- **Low-Code Live Demo (Appsmith Public App):** `[INSERT YOUR APPSMITH PUBLIC URL]`

## Scenario & Scope
- **Fictional Room:** Room 304 (Smart Lab) with 3 immutable fictional bookings (`BK-101`, `BK-102`, `BK-103`).
- **Simulated Campus Clock (Reference Now):** `2026-12-01 09:00` (fixed for deterministic verification of `AC1` and `T6`).
- **Constraints:** No real personal data, no login/authentication, no payment flow, and no production database.

## Repository Structure
- `code-based/` — Modular HTML/CSS/JavaScript implementation (`rulesEngine.js`, `app.js`, `index.html`, `styles.css`, `tests.js`).
- `low-code/` — Appsmith `JSObject` (`AvailabilityEngine.js`) and uncompressed JSON application export (`smart-campus-appsmith-export.json`).
- `docs/` — Engineering reports:
  - `01-requirements-and-contract.md` (User story, AC1–AC6, I/O contract)
  - `02-test-results.md` (Eight-case test table T1–T8)
  - `03-comparison-and-recommendation.md` (Measured effort, comparison matrix, recommendation)
  - `04-security-review.md` (Security checklist: Lecture #12 & OWASP LCNC Top 10)
  - `05-ai-reflection.md` (Short AI-use reflection)
- `screenshots/` — Visual evidence of both implementations, responsive views, T1–T8 test results, and manual security checks.

## How to Run & Test (Code-Based)
- **In Browser:** Open the [GitHub Pages Live Demo](https://kulimsire07.github.io/smart-campus-practice-12/code-based/) and click **Run T1–T8 Suite**.
- **Via CLI (Node.js):**
  ```bash
  node code-based/tests.js
