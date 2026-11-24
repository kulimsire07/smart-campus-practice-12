# Identical Eight-Case Acceptance Test Table (Task #05)

- **Room:** Room 304 (Smart Lab) | **Simulated Reference Now:** `2026-12-01 09:00`
- **Fixed Bookings:** `BK-101` (`10:00–11:00`), `BK-102` (`13:00–14:30`), `BK-103` (`16:00–17:00`)

| Test ID | Input (`startTime`, `duration`, `isBlocked`) | Linked AC | Expected Output (`available`, `reasonCode`) | Code-Based Observed Outcome | Low-Code (Appsmith) Observed Outcome | Match? |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **T1** | `2026-12-01 11:30`, `60` min, `false` | AC1, AC2, AC5 | `true`, `Available` (`AVAILABLE`) | `PASS` — `true`, `Available (AVAILABLE)` | `PASS` — `Available (AVAILABLE)` | Yes |
| **T2** | `2026-12-01 10:30`, `60` min, `false` | AC3, AC5 | `false`, `Unavailable` (`BOOKING_OVERLAP`) | `PASS` — `false`, `Unavailable (BOOKING_OVERLAP)` — overlaps `BK-101 (10:00–11:00)` | `PASS` — `Unavailable (BOOKING_OVERLAP)` — overlaps `BK-101 (10:00–11:00)` | Yes |
| **T3** | `2026-12-01 11:30`, `60` min, `true` | AC4, AC5 | `false`, `Unavailable` (`ROOM_BLOCKED`) | `PASS` — `false`, `Unavailable (ROOM_BLOCKED)` | `PASS` — `Unavailable (ROOM_BLOCKED)` — maintenance/administrative hold | Yes |
| **T4** | `2026-12-01 11:30`, `0` min, `false` | AC2, AC6 | `false`, `Validation Error` (`DURATION_TOO_SHORT`) | `PASS` — `false`, `Validation Error (DURATION_TOO_SHORT)` | `PASS` — `Validation Error (DURATION_TOO_SHORT)` | Yes |
| **T5** | `2026-12-01 11:30`, `121` min, `false` | AC2, AC6 | `false`, `Validation Error` (`DURATION_TOO_LONG`) | `PASS` — `false`, `Validation Error (DURATION_TOO_LONG)` | `PASS` — `Validation Error (DURATION_TOO_LONG)` | Yes |
| **T6** | `2026-12-01 08:30` (or `00:00`), `60` min, `false` | AC1, AC6 | `false`, `Validation Error` (`START_TIME_IN_PAST`) | `PASS` — `false`, `Validation Error (START_TIME_IN_PAST)` | `PASS` — `Validation Error (START_TIME_IN_PAST)` — must be after `2026-12-01 09:00` | Yes |
| **T7** | `2026-12-01 11:00`, `60` min, `false` (adjacent to `BK-101`) | AC3, AC5 | `true`, `Available` (`AVAILABLE`) | `PASS` — `true`, `Available (AVAILABLE)` | `PASS` — `Available (AVAILABLE)` | Yes |
| **T8** | Booking dataset state after running `T1–T7` | AC5 | Unchanged: exact 3 records (`BK-101`, `BK-102`, `BK-103`) | `PASS` — 3 identical immutable records (`Object.freeze`) | `PASS` — Table displays identical 3 records (`BK-101`, `BK-102`, `BK-103`) | Yes |
