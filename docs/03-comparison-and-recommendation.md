# Engineering Effort, Comparison Matrix & Platform Recommendation (Task #06)

## 1. Engineering Effort Breakdown (Measured Separately)

| Phase | Code-Based (HTML/CSS/JS + GitHub Pages) | Low-Code (Appsmith Cloud Free) | Activity Scope |
| :--- | :--- | :--- | :--- |
| **Setup** | 4 min | 7 min | Repo & GitHub Pages setup vs. Appsmith account & workspace setup |
| **Implementation** | 10 min | 14 min | Modular JS/CSS files vs. drag-and-drop widgets + `JSObject` |
| **Debugging / Repair** | 5 min | 7 min | Deployment path & empty-file check vs. DatePicker format & default date fix |
| **Testing (`T1–T8`)** | 3 min | 5 min | Automated in-browser suite (`Run T1–T8 Suite`) vs. manual UI input across `T1–T8` |
| **Total Build & Repair Time** | **22 min** | **33 min** | Directly measured during implementation |
| **Acceptance Tests Passed** | **8/8** | **8/8** | Identical contract verification (`docs/02-test-results.md`) |
| **Unresolved Defects** | **0** | **0** | Free-tier responsive canvas limitation noted separately |

### Measured Results vs. Personal Impressions
- **Measured Results (Observed Facts):** Both implementations passed `8/8` contract cases. The code-based build has zero third-party runtime dependencies, supports one-click automated regression testing (`Run T1–T8 Suite` and `node tests.js`), and diffs line-by-line in Git. Appsmith required writing a ~140-line `JSObject` for overlap and validation rules, manual UI entry per test case, and exports an Appsmith-specific JSON bundle.
- **Personal Impressions (Subjective Experience):** Visual widget placement in Appsmith was convenient for quickly rendering a table and form without writing CSS, but configuring DatePicker default formats and manually re-entering inputs for every test case felt slower and less transparent than running an automated JavaScript test suite.

## 2. Completed Comparison Matrix (Evidence-Based)

| Criterion | Code-Based (HTML / CSS / JS + GitHub Pages) | Low-Code (Appsmith Cloud Free) |
| :--- | :--- | :--- |
| **Functional tests** | 8 / 8 (Automated browser + CLI verification; `Object.freeze` immutability) | 8 / 8 (Manual UI verification; deterministic logic in `JSObject`) |
| **Build and repair time** | 22 min (Setup 4, Impl 10, Debug 5, Test 3) | 33 min (Setup 7, Impl 14, Debug 7, Test 5) |
| **Customization** | **High:** Full control over responsive CSS Grid/Media Queries (desktop + narrow mobile screens), arbitrary domain rules, custom test harness, zero branding. | **Moderate:** Fast drag-and-drop UI and JS expressions, but fixed-grid responsiveness on Free plan; "Powered by Appsmith" branding remains on Free tier. |
| **Security controls** | **Developer-owned:** Strict `textContent` DOM XSS mitigation, zero runtime npm dependencies (`0` external packages), full control over CSP/headers. Any future auth or DB security must be engineered by the team. | **Shared responsibility:** Platform provides TLS, AES-256 datasource encryption, prepared SQL statements, and sandboxed iframes by default; however, `JSObject` executes client-side (inspectable in DevTools) and Public App mode removes authentication. |
| **Versioning / portability** | **High portability:** Standard open web files (`HTML/CSS/JS`); granular line-by-line Git diffs, standard PR reviews, portable across any static host with zero vendor lock-in. | **Medium portability:** Supports Git sync (up to 3 repos on Free tier) and JSON export/import across Appsmith instances, but JSON app format is tied to the Appsmith runtime. |
| **Ongoing cost** | **$0/month** on GitHub Pages for public repositories. Low flat cost on static CDNs at campus scale. | **$0/month** on Cloud Free (strict cap: up to 5 cloud users, 5 workspaces, 3 Git repos). Scaling past 5 internal cloud users requires Business ($15/user/month) or Enterprise ($2,500/month), or self-hosting Community Edition. |

## 3. Evidence-Based Platform Recommendation

**Recommended Approach for a Student-Facing Smart Campus Room Checker: Code-Based Web Application.**

1. **Campus Scale vs. Seat-Based Pricing:** A student-facing room checker serves hundreds or thousands of students. Appsmith's seat-based pricing ($15/user/month on Business) targets internal employee tooling, whereas GitHub Pages serves public static web apps at $0/month.
2. **Logic Complexity & Automated Testing:** Expressing `AC1–AC6` in Appsmith still required ~140 lines of custom JavaScript inside a `JSObject`. Maintaining that same JavaScript in a standalone `rulesEngine.js` module unlocked automated regression tests (`tests.js`), line-level Git diffs, and cleaner narrow-screen responsiveness.
3. **When Low-Code Would Be Preferable:** Appsmith would be the stronger choice for a **small internal campus administration panel** (3–5 staff members managing room maintenance blocks and editing bookings directly in an existing PostgreSQL database), where pre-built tables and encrypted datasource connectors outweigh per-seat cost.
