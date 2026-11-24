
/**
 * UI Presentation Layer — Strictly decoupled from rulesEngine.js
 * Security note: Uses textContent exclusively (never innerHTML) to prevent DOM XSS.
 */
import {
  FICTIONAL_BOOKINGS,
  REFERENCE_NOW,
  checkAvailability
} from "./rulesEngine.js";

const refClockDisplay = document.getElementById("refClockDisplay");
const bookingsTableBody = document.getElementById("bookingsTableBody");
const form = document.getElementById("availabilityForm");
const startTimeInput = document.getElementById("startTimeInput");
const durationInput = document.getElementById("durationInput");
const blockedCheckbox = document.getElementById("blockedCheckbox");
const resultBox = document.getElementById("resultBox");
const resultStatus = document.getElementById("resultStatus");
const resultCode = document.getElementById("resultCode");
const resultMessage = document.getElementById("resultMessage");
const runTestsBtn = document.getElementById("runTestsBtn");
const testResultsSection = document.getElementById("testResultsSection");
const testSummary = document.getElementById("testSummary");
const testResultsBody = document.getElementById("testResultsBody");

function renderBookings(bookings) {
  bookingsTableBody.textContent = "";
  for (const bk of bookings) {
    const tr = document.createElement("tr");
    const tdId = document.createElement("td");
    const tdSlot = document.createElement("td");
    const tdTitle = document.createElement("td");

    tdId.textContent = bk.id;
    tdSlot.textContent = `${bk.start.replace("T", " ")} – ${bk.end.slice(11)}`;
    tdTitle.textContent = bk.title;

    tr.append(tdId, tdSlot, tdTitle);
    bookingsTableBody.appendChild(tr);
  }
}

function renderResult(decision) {
  resultBox.className = "result-box";
  if (decision.status === "Available") {
    resultBox.classList.add("result-available");
  } else if (decision.status === "Unavailable") {
    resultBox.classList.add("result-unavailable");
  } else {
    resultBox.classList.add("result-error");
  }

  resultStatus.textContent = decision.status;
  resultCode.textContent = decision.reasonCode;
  resultMessage.textContent = decision.message;
}

function runAutomatedSuiteInBrowser() {
  const beforeSnapshot = JSON.stringify(FICTIONAL_BOOKINGS);
  const cases = [
    { id: "T1", label: "2026-12-01 11:30, 60m, unblocked", input: { startTime: "2026-12-01T11:30", durationMinutes: 60, isBlocked: false }, expAvail: true, expCode: "AVAILABLE" },
    { id: "T2", label: "2026-12-01 10:30, 60m, overlap BK-101", input: { startTime: "2026-12-01T10:30", durationMinutes: 60, isBlocked: false }, expAvail: false, expCode: "BOOKING_OVERLAP" },
    { id: "T3", label: "2026-12-01 11:30, 60m, blocked=true", input: { startTime: "2026-12-01T11:30", durationMinutes: 60, isBlocked: true }, expAvail: false, expCode: "ROOM_BLOCKED" },
    { id: "T4", label: "2026-12-01 11:30, duration=0", input: { startTime: "2026-12-01T11:30", durationMinutes: 0, isBlocked: false }, expAvail: false, expCode: "DURATION_TOO_SHORT" },
    { id: "T5", label: "2026-12-01 11:30, duration=121", input: { startTime: "2026-12-01T11:30", durationMinutes: 121, isBlocked: false }, expAvail: false, expCode: "DURATION_TOO_LONG" },
    { id: "T6", label: "2026-12-01 08:30 (past), 60m", input: { startTime: "2026-12-01T08:30", durationMinutes: 60, isBlocked: false }, expAvail: false, expCode: "START_TIME_IN_PAST" },
    { id: "T7", label: "2026-12-01 11:00 (adjacent), 60m", input: { startTime: "2026-12-01T11:00", durationMinutes: 60, isBlocked: false }, expAvail: true, expCode: "AVAILABLE" }
  ];

  testResultsBody.textContent = "";
  let passed = 0;

  for (const tc of cases) {
    const res = checkAvailability(tc.input);
    const ok = res.available === tc.expAvail && res.reasonCode === tc.expCode;
    if (ok) passed += 1;

    const tr = document.createElement("tr");
    const cells = [
      tc.id,
      tc.label,
      `${tc.expAvail} (${tc.expCode})`,
      `${res.available} (${res.reasonCode})`,
      ok ? "PASS" : "FAIL"
    ];
    cells.forEach((text, idx) => {
      const td = document.createElement("td");
      td.textContent = text;
      if (idx === 4) td.className = ok ? "pass-pill" : "fail-pill";
      tr.appendChild(td);
    });
    testResultsBody.appendChild(tr);
  }

  const unchanged = JSON.stringify(FICTIONAL_BOOKINGS) === beforeSnapshot;
  if (unchanged) passed += 1;

  const tr8 = document.createElement("tr");
  [
    "T8",
    "Bookings dataset unchanged after checks",
    "3 immutable records",
    unchanged ? "3 identical records" : "MUTATED",
    unchanged ? "PASS" : "FAIL"
  ].forEach((text, idx) => {
    const td = document.createElement("td");
    td.textContent = text;
    if (idx === 4) td.className = unchanged ? "pass-pill" : "fail-pill";
    tr8.appendChild(td);
  });
  testResultsBody.appendChild(tr8);

  testSummary.textContent = `Executed 8 acceptance test cases: ${passed}/8 PASSED.`;
  testResultsSection.classList.remove("hidden");
}

refClockDisplay.textContent = REFERENCE_NOW.replace("T", " ");
renderBookings(FICTIONAL_BOOKINGS);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const decision = checkAvailability({
    startTime: startTimeInput.value,
    durationMinutes: durationInput.value,
    isBlocked: blockedCheckbox.checked
  });
  renderResult(decision);
});

runTestsBtn.addEventListener("click", runAutomatedSuiteInBrowser);
