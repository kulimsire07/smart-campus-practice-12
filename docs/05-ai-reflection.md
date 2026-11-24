# Short AI-Use Reflection

- **AI Tool / Version / Model:** Google Gemini
- **Workflow & Prompts:** Guided by the instructor's implementation prompt (*implement the shared contract with all six acceptance criteria unchanged, fictional data only, separated rules and UI, no invented test results*) and comparison/review prompt (*assess correctness, maintainability, portability, cost, and security; identify unsupported assumptions; do not treat low-code as secure by default*).

## Value Added by AI
AI accelerated drafting the formal input/output contract, structuring the modular JavaScript rule engine (`rulesEngine.js`) cleanly away from DOM rendering (`app.js`), translating the identical contract into valid Appsmith `JSObject` syntax, and mapping security checks to Lecture #12 (SAST/DAST/SCA) and the OWASP Low-Code/No-Code Top 10.

## Unsupported Assumptions Caught & Corrected During Verification
1. **Timezone Offset & Date Format Pitfall:** In Appsmith, entering a naive ISO string into the DatePicker `Default Date` triggered a validation error until formatted with timezone/moment syntax, and comparing raw timestamps against local booking strings could shift times in Almaty (UTC+5). Standardizing on `YYYY-MM-DD HH:mm` (`formattedDate`) parsed via `Date.UTC` components eliminated timezone drift.
2. **UI Masking vs. Contract Verification:** Enabling widget-level `Min = 1` / `Max = 120` bounds in Appsmith or native HTML5 form blocking would intercept `T4 (0)` and `T5 (121)` before reaching our structured reason codes (`DURATION_TOO_SHORT`, `DURATION_TOO_LONG`). Leaving UI bounds open with `novalidate` ensured identical, inspectable validation errors on both tracks.
3. **Low-Code Security Nuances:** Reviewing Appsmith's security model confirmed that low-code does not eliminate client-side security responsibilities: `JSObject` code is visible in browser DevTools, and `storeValue()` persists to `localStorage` unless `persist = false` is explicitly specified.
4. **Evidence Discipline:** AI output was never treated as proof of passing tests; all 8 test cases (`T1–T8`), live public URLs, and build times were executed and verified manually.
