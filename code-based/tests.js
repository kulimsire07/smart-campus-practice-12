import assert from "node:assert/strict";
import { FICTIONAL_BOOKINGS, checkAvailability } from "./rulesEngine.js";

const snapshotBefore = JSON.stringify(FICTIONAL_BOOKINGS);

const suite = [
  ["T1", { startTime: "2026-12-01T11:30", durationMinutes: 60, isBlocked: false }, true, "AVAILABLE"],
  ["T2", { startTime: "2026-12-01T10:30", durationMinutes: 60, isBlocked: false }, false, "BOOKING_OVERLAP"],
  ["T3", { startTime: "2026-12-01T11:30", durationMinutes: 60, isBlocked: true }, false, "ROOM_BLOCKED"],
  ["T4", { startTime: "2026-12-01T11:30", durationMinutes: 0, isBlocked: false }, false, "DURATION_TOO_SHORT"],
  ["T5", { startTime: "2026-12-01T11:30", durationMinutes: 121, isBlocked: false }, false, "DURATION_TOO_LONG"],
  ["T6", { startTime: "2026-12-01T08:30", durationMinutes: 60, isBlocked: false }, false, "START_TIME_IN_PAST"],
  ["T7", { startTime: "2026-12-01T11:00", durationMinutes: 60, isBlocked: false }, true, "AVAILABLE"]
];

for (const [id, input, expAvail, expCode] of suite) {
  const res = checkAvailability(input);
  assert.equal(res.available, expAvail, `${id} available mismatch`);
  assert.equal(res.reasonCode, expCode, `${id} reasonCode mismatch`);
  console.log(`${id}: PASS -> ${res.status} | ${res.reasonCode} | ${res.message}`);
}

assert.equal(JSON.stringify(FICTIONAL_BOOKINGS), snapshotBefore, "T8 failed: bookings mutated!");
console.log("T8: PASS -> Fictional booking dataset unchanged (3 records).");
