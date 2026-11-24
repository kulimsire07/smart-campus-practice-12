
/**
 * Smart Campus Room Availability Checker — Deterministic Rule Engine
 * Pure validation and availability logic strictly separated from UI presentation.
 * Zero external dependencies; zero mutation of bookings (AC5 / T8).
 */

export const ROOM_NAME = "Room 304 (Smart Lab)";
export const REFERENCE_NOW = "2026-12-01T09:00";

export const FICTIONAL_BOOKINGS = Object.freeze([
  Object.freeze({
    id: "BK-101",
    room: ROOM_NAME,
    start: "2026-12-01T10:00",
    end: "2026-12-01T11:00",
    title: "Software Engineering Lecture"
  }),
  Object.freeze({
    id: "BK-102",
    room: ROOM_NAME,
    start: "2026-12-01T13:00",
    end: "2026-12-01T14:30",
    title: "Algorithms Seminar"
  }),
  Object.freeze({
    id: "BK-103",
    room: ROOM_NAME,
    start: "2026-12-01T16:00",
    end: "2026-12-01T17:00",
    title: "Robotics Club Meeting"
  })
]);

const ISO_LOCAL_PATTERN = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})$/;

export function parseLocalDateTimeMs(dateTimeStr) {
  if (typeof dateTimeStr !== "string") return null;
  const match = ISO_LOCAL_PATTERN.exec(dateTimeStr.trim());
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);

  const ms = Date.UTC(year, month - 1, day, hour, minute, 0, 0);
  const check = new Date(ms);

  if (
    check.getUTCFullYear() !== year ||
    check.getUTCMonth() !== month - 1 ||
    check.getUTCDate() !== day ||
    check.getUTCHours() !== hour ||
    check.getUTCMinutes() !== minute
  ) {
    return null;
  }
  return ms;
}

export function formatUtcMs(ms) {
  const d = new Date(ms);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
}

export function formatTimeOnlyMs(ms) {
  const d = new Date(ms);
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
}

export function validateInput(startTimeStr, durationRaw, referenceNowStr = REFERENCE_NOW) {
  const startMs = parseLocalDateTimeMs(startTimeStr);
  if (startMs === null) {
    return {
      valid: false,
      reasonCode: "INVALID_START_TIME",
      message: "Please provide a valid start date and time in YYYY-MM-DD HH:MM format (AC6)."
    };
  }

  const nowMs = parseLocalDateTimeMs(referenceNowStr);
  if (nowMs === null) {
    return {
      valid: false,
      reasonCode: "INVALID_START_TIME",
      message: "Reference clock configuration is invalid."
    };
  }

  if (
    durationRaw === null ||
    durationRaw === undefined ||
    typeof durationRaw === "boolean" ||
    String(durationRaw).trim() === ""
  ) {
    return {
      valid: false,
      reasonCode: "INVALID_DURATION",
      message: "Duration must be a valid number of minutes between 1 and 120 (AC2, AC6)."
    };
  }

  const duration = Number(durationRaw);
  if (!Number.isFinite(duration)) {
    return {
      valid: false,
      reasonCode: "INVALID_DURATION",
      message: "Duration must be a finite numeric value (AC2, AC6)."
    };
  }

  if (duration <= 0) {
    return {
      valid: false,
      reasonCode: "DURATION_TOO_SHORT",
      message: "Duration must be greater than 0 minutes (AC2)."
    };
  }

  if (duration > 120) {
    return {
      valid: false,
      reasonCode: "DURATION_TOO_LONG",
      message: "Duration cannot exceed 120 minutes (AC2)."
    };
  }

  if (startMs <= nowMs) {
    return {
      valid: false,
      reasonCode: "START_TIME_IN_PAST",
      message: `Start time must be in the future (after ${formatUtcMs(nowMs)}) (AC1).`
    };
  }

  return {
    valid: true,
    startMs,
    duration
  };
}

export function checkAvailability({
  startTime,
  durationMinutes,
  isBlocked = false,
  bookings = FICTIONAL_BOOKINGS,
  referenceNow = REFERENCE_NOW
}) {
  const validation = validateInput(startTime, durationMinutes, referenceNow);
  if (!validation.valid) {
    return {
      available: false,
      status: "Validation Error",
      reasonCode: validation.reasonCode,
      message: validation.message
    };
  }

  if (Boolean(isBlocked)) {
    return {
      available: false,
      status: "Unavailable",
      reasonCode: "ROOM_BLOCKED",
      message: `${ROOM_NAME} is currently blocked for maintenance or administrative hold (AC4).`
    };
  }

  const reqStartMs = validation.startMs;
  const reqEndMs = reqStartMs + validation.duration * 60 * 1000;

  for (const bk of bookings) {
    const bkStartMs = parseLocalDateTimeMs(bk.start);
    const bkEndMs = parseLocalDateTimeMs(bk.end);
    if (bkStartMs === null || bkEndMs === null) continue;

    if (reqStartMs < bkEndMs && reqEndMs > bkStartMs) {
      return {
        available: false,
        status: "Unavailable",
        reasonCode: "BOOKING_OVERLAP",
        message: `Requested slot overlaps with existing booking ${bk.id} (${formatTimeOnlyMs(bkStartMs)}–${formatTimeOnlyMs(bkEndMs)}) (AC3).`
      };
    }
  }

  return {
    available: true,
    status: "Available",
    reasonCode: "AVAILABLE",
    message: `${ROOM_NAME} is available from ${formatUtcMs(reqStartMs)} to ${formatTimeOnlyMs(reqEndMs)} (${validation.duration} min).`
  };
}
