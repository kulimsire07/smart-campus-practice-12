# Smart Campus Room Availability Checker — Shared Contract & Baseline Specification

## 1. Baseline Freeze Record (Task #01)
- **Baseline Source:** Smart Campus Room Availability Checker (Code-Based Web Prototype, preserving the prior course scope: one fictional room, fixed fictional bookings, fixed current time, availability decision only).
- **Frozen Version Tag:** `v1.0-baseline` (evidence recorded in `screenshots/01-code-desktop.png`).
- **Scope Boundaries:**
  - Single fictional campus room: **Room 304 (Smart Lab)**.
  - Fixed fictional schedule of 3 immutable bookings (no real personal data, no user login/authentication, no payment flow, no production database).
  - Optional explanation feature from Practice #11 is explicitly excluded.
  - Booking rules were frozen before parallel implementation and were NOT modified to favor either track.
- **Explicit Disclosure of Simulated Behavior:** To ensure 100% deterministic evaluation of `AC1` ("Start time must be in the future") and test suite `T1–T8` regardless of grading date, both implementations use a visibly labeled fixed reference clock: **`2026-12-01T09:00`** (`Simulated Campus Clock`).

## 2. User Story (Task #02)
> **As a** university student,  
> **I want to** check whether a specific Smart Campus room is available for a chosen future start time and duration,  
> **So that** I can select a valid, conflict-free time slot without altering existing room bookings.

## 3. Shared Acceptance Criteria (AC1–AC6)

| ID | Acceptance Criterion | Deterministic Verification Rule |
| :--- | :--- | :--- |
| **AC1** | Start time must be in the future. | Parsed `startTime` must be strictly greater than `referenceNow` (`2026-12-01T09:00`). Equal or past timestamps return a validation error (`START_TIME_IN_PAST`). |
| **AC2** | Duration must be greater than zero and at most 120 minutes. | `durationMinutes` must be a finite numeric value satisfying `0 < durationMinutes <= 120`. Values `<= 0` return `DURATION_TOO_SHORT`; values `> 120` return `DURATION_TOO_LONG`; empty or non-numeric values return `INVALID_DURATION`. |
| **AC3** | Overlapping bookings are unavailable. | Let `reqStart = startTime` and `reqEnd = startTime + durationMinutes`. An overlap exists if and only if `reqStart < booking.end && reqEnd > booking.start`. Adjacent intervals (e.g., `11:00–12:00` right after `10:00–11:00`) do NOT overlap and remain Available. |
| **AC4** | Blocked room is unavailable. | When input validation succeeds and `isBlocked === true`, return `available: false`, status `Unavailable`, reason code `ROOM_BLOCKED`. |
| **AC5** | Display a clear decision without changing existing bookings. | Render structured output (`available`, `status`, `reasonCode`, `message`) clearly in the UI while keeping `fictionalBookings` strictly immutable before and after every check. |
| **AC6** | Invalid input receives understandable feedback. | Malformed dates, past start times, or out-of-range durations display plain-language validation messages referencing the violated rule without crashing or leaking raw stack traces. |

## 4. Formal Input / Output Contract

### 4.1. Fixed Fictional Bookings (`fictionalBookings`)

| Booking ID | Room | Start (Local Format) | End (Local Format) | Fictional Event Title |
| :--- | :--- | :--- | :--- | :--- |
| `BK-101` | Room 304 (Smart Lab) | `2026-12-01T10:00` | `2026-12-01T11:00` | Software Engineering Lecture |
| `BK-102` | Room 304 (Smart Lab) | `2026-12-01T13:00` | `2026-12-01T14:30` | Algorithms Seminar |
| `BK-103` | Room 304 (Smart Lab) | `2026-12-01T16:00` | `2026-12-01T17:00` | Robotics Club Meeting |

### 4.2. Input Schema
- `startTime`: string (`YYYY-MM-DDTHH:mm` or `YYYY-MM-DD HH:mm`)
- `durationMinutes`: finite number (`1..120`)
- `isBlocked`: boolean (`true` = maintenance/administrative hold, `false` = open)
- `bookings`: immutable array of booking objects
- `referenceNow`: fixed string (`2026-12-01T09:00`)

### 4.3. Output Schema
- `available`: boolean (`true` only when valid, unblocked, and non-overlapping)
- `status`: `'Available' | 'Unavailable' | 'Validation Error'`
- `reasonCode`: `'AVAILABLE' | 'BOOKING_OVERLAP' | 'ROOM_BLOCKED' | 'INVALID_START_TIME' | 'START_TIME_IN_PAST' | 'INVALID_DURATION' | 'DURATION_TOO_SHORT' | 'DURATION_TOO_LONG'`
- `message`: human-readable plain text explanation
