const DEFAULT_STAFF_COUNT = 7;
const MIN_STAFF_COUNT = 6;
const MAX_STAFF_COUNT = 20;
const MAX_CONSECUTIVE_WORKDAYS = 4;
const WEEKDAY_ROLE_BALANCE_MAX_GAP = 1;
const MAX_FEASIBLE_ASSIGNMENTS_PER_DAY = 5000;
const WEEKDAY_ROLES = ["AA", "BA", "AP", "BP"];
const SATURDAY_ROLES = ["AD", "BD"];
const ALL_ROLES = [...WEEKDAY_ROLES, ...SATURDAY_ROLES];
const REPORT_ROLE_ORDER = ["AA", "AP", "BA", "BP", "AD", "BD"];
const WEEKDAY_PAIR_ROLES = [
  ["AA", "BA"],
  ["AP", "BP"],
];
const SATURDAY_PAIR_ROLES = [["AD", "BD"]];
const WEEKDAY_NAMES = ["日", "月", "火", "水", "木", "金", "土"];
const ROLE_LABELS = {
  AA: "AA（入口・午前）",
  AP: "AP（入口・午後）",
  BA: "BA（出口・午前）",
  BP: "BP（出口・午後）",
  AD: "AD（入口・土曜）",
  BD: "BD（出口・土曜）",
};
const ROLE_LEGEND = [
  { code: "AA", label: "入口・午前", time: "9:20-13:20" },
  { code: "AP", label: "入口・午後", time: "13:20-17:20" },
  { code: "BA", label: "出口・午前", time: "9:20-13:20" },
  { code: "BP", label: "出口・午後", time: "13:20-17:20" },
  { code: "AD", label: "入口・土曜", time: "8:20-12:20" },
  { code: "BD", label: "出口・土曜", time: "8:20-12:20" },
];
const POSITION_GROUPS = [
  { label: "Aポジション：入口", roles: ["AA", "AP", "AD"] },
  { label: "Bポジション：出口", roles: ["BA", "BP", "BD"] },
];
const POSITION_CODES = ["A", "B"];
const SAVE_FILE_KIND = "shift-table-smile";
const SAVE_FILE_VERSION = 1;
const DEFAULT_NAMES = ["スタッフ1", "スタッフ2", "スタッフ3", "スタッフ4", "スタッフ5", "スタッフ6", "スタッフ7"];
const AVAILABILITY_STATES = {
  OK: "OK",
  FULL: "FULL",
  AM: "AM",
  PM: "PM",
};
const AVAILABILITY_MODES = [
  { value: AVAILABILITY_STATES.FULL, label: "休み" },
  { value: AVAILABILITY_STATES.AM, label: "午前休み" },
  { value: AVAILABILITY_STATES.PM, label: "午後休み" },
  { value: AVAILABILITY_STATES.OK, label: "消す" },
];
const AVAILABILITY_MARKS = {
  [AVAILABILITY_STATES.OK]: "",
  [AVAILABILITY_STATES.FULL]: "×",
  [AVAILABILITY_STATES.AM]: "×AM",
  [AVAILABILITY_STATES.PM]: "×PM",
};
const HALF_DAY_POLICIES = {
  FORBID: "FORBID",
  AVOID: "AVOID",
  ALLOW: "ALLOW",
};
const HALF_DAY_POLICY_OPTIONS = [
  { value: HALF_DAY_POLICIES.FORBID, label: "入れない" },
  { value: HALF_DAY_POLICIES.AVOID, label: "なるべく避ける" },
  { value: HALF_DAY_POLICIES.ALLOW, label: "必要なら入れる" },
];
const REPORT_AVAILABILITY_MARKS = {
  [AVAILABILITY_STATES.OK]: "",
  [AVAILABILITY_STATES.FULL]: "×",
  [AVAILABILITY_STATES.AM]: "am×",
  [AVAILABILITY_STATES.PM]: "×pm",
};
const SAVED_SHIFT_PRESETS = {
  "2026-07": {
    year: 2026,
    month: 7,
    halfDayPolicy: HALF_DAY_POLICIES.FORBID,
    staff: [
      { name: "田口", targetCount: 15 },
      { name: "都築", targetCount: 10 },
      { name: "本田", targetCount: 15 },
      { name: "松尾", targetCount: 15 },
      { name: "野口", targetCount: 15 },
      { name: "市川", targetCount: 15 },
      { name: "加藤", targetCount: 15 },
    ],
    availability: [
      [0, 10, AVAILABILITY_STATES.FULL],
      [0, 23, AVAILABILITY_STATES.AM],
      [0, 30, AVAILABILITY_STATES.FULL],
      [1, 1, AVAILABILITY_STATES.FULL],
      [1, 2, AVAILABILITY_STATES.PM],
      [1, 3, AVAILABILITY_STATES.FULL],
      [1, 7, AVAILABILITY_STATES.PM],
      [1, 9, AVAILABILITY_STATES.PM],
      [1, 11, AVAILABILITY_STATES.FULL],
      [1, 13, AVAILABILITY_STATES.FULL],
      [1, 16, AVAILABILITY_STATES.PM],
      [1, 20, AVAILABILITY_STATES.PM],
      [1, 21, AVAILABILITY_STATES.AM],
      [1, 23, AVAILABILITY_STATES.PM],
      [1, 24, AVAILABILITY_STATES.FULL],
      [1, 30, AVAILABILITY_STATES.FULL],
      [1, 31, AVAILABILITY_STATES.FULL],
      [2, 1, AVAILABILITY_STATES.FULL],
      [2, 6, AVAILABILITY_STATES.PM],
      [2, 13, AVAILABILITY_STATES.AM],
      [2, 23, AVAILABILITY_STATES.PM],
      [2, 31, AVAILABILITY_STATES.AM],
      [3, 6, AVAILABILITY_STATES.FULL],
      [3, 8, AVAILABILITY_STATES.FULL],
      [3, 18, AVAILABILITY_STATES.FULL],
      [3, 20, AVAILABILITY_STATES.FULL],
      [3, 27, AVAILABILITY_STATES.AM],
      [4, 1, AVAILABILITY_STATES.FULL],
      [4, 4, AVAILABILITY_STATES.FULL],
      [5, 7, AVAILABILITY_STATES.FULL],
      [5, 14, AVAILABILITY_STATES.PM],
      [5, 16, AVAILABILITY_STATES.PM],
      [5, 20, AVAILABILITY_STATES.FULL],
      [5, 21, AVAILABILITY_STATES.FULL],
      [5, 28, AVAILABILITY_STATES.FULL],
      [6, 2, AVAILABILITY_STATES.PM],
      [6, 10, AVAILABILITY_STATES.PM],
      [6, 17, AVAILABILITY_STATES.PM],
    ],
    assignmentsByDate: {
      1: { AA: 6, BA: 3, AP: 0, BP: 5 },
      2: { AA: 4, BA: 2, AP: 5, BP: 0 },
      3: { AA: 3, BA: 5, AP: 2, BP: 4 },
      4: { AD: 1, BD: 2 },
      6: { AA: 0, BA: 1, AP: 4, BP: 6 },
      7: { AA: 2, BA: 4, AP: 6, BP: 3 },
      8: { AA: 1, BA: 2, AP: 5, BP: 6 },
      9: { AA: 2, BA: 0, AP: 6, BP: 5 },
      10: { AA: 3, BA: 1, AP: 4, BP: 2 },
      11: { AD: 0, BD: 3 },
      13: { AA: 5, BA: 4, AP: 3, BP: 0 },
      14: { AA: 4, BA: 6, AP: 1, BP: 3 },
      15: { AA: 6, BA: 5, AP: 0, BP: 1 },
      16: { AA: 2, BA: 0, AP: 3, BP: 4 },
      17: { AA: 1, BA: 2, AP: 5, BP: 3 },
      18: { AD: 4, BD: 5 },
      20: { AA: 0, BA: 4, AP: 2, BP: 6 },
      21: { AA: 6, BA: 2, AP: 3, BP: 0 },
      22: { AA: 0, BA: 6, AP: 4, BP: 1 },
      23: { AA: 5, BA: 3, AP: 6, BP: 4 },
      24: { AA: 3, BA: 5, AP: 2, BP: 0 },
      25: { AD: 4, BD: 6 },
      27: { AA: 5, BA: 4, AP: 0, BP: 2 },
      28: { AA: 2, BA: 0, AP: 1, BP: 3 },
      29: { AA: 3, BA: 1, AP: 6, BP: 5 },
      30: { AA: 4, BA: 6, AP: 5, BP: 2 },
      31: { AA: 6, BA: 3, AP: 0, BP: 5 },
    },
  },
};

const elements = {
  yearInput: document.getElementById("yearInput"),
  monthInput: document.getElementById("monthInput"),
  staffCountInput: document.getElementById("staffCountInput"),
  staffInputs: document.getElementById("staffInputs"),
  targetSummary: document.getElementById("targetSummary"),
  availabilityModeSelector: document.getElementById("availabilityModeSelector"),
  availabilityLegend: document.getElementById("availabilityLegend"),
  halfDayPolicySelector: document.getElementById("halfDayPolicySelector"),
  availabilityGrid: document.getElementById("availabilityGrid"),
  generateButton: document.getElementById("generateButton"),
  savedShiftButton: document.getElementById("savedShiftButton"),
  printButton: document.getElementById("printButton"),
  csvButton: document.getElementById("csvButton"),
  saveJsonButton: document.getElementById("saveJsonButton"),
  loadJsonButton: document.getElementById("loadJsonButton"),
  loadJsonInput: document.getElementById("loadJsonInput"),
  messageBox: document.getElementById("messageBox"),
  loadingOverlay: document.getElementById("loadingOverlay"),
  loadingText: document.getElementById("loadingText"),
  reportSheetHeader: document.getElementById("reportSheetHeader"),
  monthLabel: document.getElementById("monthLabel"),
  scheduleTable: document.getElementById("scheduleTable"),
  statsTable: document.getElementById("statsTable"),
  positionTable: document.getElementById("positionTable"),
  pairSummary: document.getElementById("pairSummary"),
  pairTable: document.getElementById("pairTable"),
  summaryCards: document.getElementById("summaryCards"),
  staffInputTemplate: document.getElementById("staffInputTemplate"),
};

const appState = {
  availabilityMap: new Map(),
  availabilityMode: AVAILABILITY_STATES.FULL,
  halfDayPolicy: HALF_DAY_POLICIES.FORBID,
  lastResult: null,
  isBusy: false,
};

function init() {
  const defaultDate = getNextMonthDate(new Date());
  elements.yearInput.value = String(defaultDate.getFullYear());
  elements.monthInput.value = String(defaultDate.getMonth() + 1);
  elements.staffCountInput.value = String(DEFAULT_STAFF_COUNT);

  renderStaffInputs();
  renderHalfDayPolicySelector();
  renderAvailabilityGrid();
  updateTargetSummary();
  clearResults();
  setMessage("入力が終わったら「シフト生成」を押してください。", "neutral");

  elements.yearInput.addEventListener("input", handleCalendarChange);
  elements.monthInput.addEventListener("input", handleCalendarChange);
  elements.staffCountInput.addEventListener("input", handleStaffCountChange);
  elements.staffInputs.addEventListener("input", handleStaffInputChange);
  elements.generateButton.addEventListener("click", handleGenerate);
  elements.savedShiftButton.addEventListener("click", () => loadSavedShiftPreset("2026-07"));
  elements.printButton.addEventListener("click", () => window.print());
  elements.csvButton.addEventListener("click", handleDownloadCsv);
  elements.saveJsonButton.addEventListener("click", handleSaveJson);
  elements.loadJsonButton.addEventListener("click", handleLoadJsonClick);
  elements.loadJsonInput.addEventListener("change", handleLoadJsonFile);

  const savedShiftKey = getSavedShiftKeyFromUrl();
  if (savedShiftKey) {
    loadSavedShiftPreset(savedShiftKey);
  }
}

function getNextMonthDate(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}

function renderStaffInputs(options = {}) {
  const previousStaffList = getStaffList();
  const staffCount = getSafeStaffCount();
  const defaultTargets = buildDefaultTargetCounts(getRequiredAssignmentTotal(getScheduleInfo()), staffCount);

  elements.staffInputs.innerHTML = "";

  for (let i = 0; i < staffCount; i += 1) {
    const fragment = elements.staffInputTemplate.content.cloneNode(true);
    const label = fragment.querySelector(".staff-label");
    const nameInput = fragment.querySelector(".staff-name-input");
    const targetInput = fragment.querySelector(".staff-target-input");
    const previousStaff = previousStaffList[i];

    label.textContent = `スタッフ ${i + 1}`;
    nameInput.value = previousStaff?.name ?? DEFAULT_NAMES[i] ?? `スタッフ${i + 1}`;
    nameInput.dataset.staffIndex = String(i);
    nameInput.placeholder = `スタッフ ${i + 1}`;

    const targetCount = options.recalculateTargets
      ? defaultTargets[i] ?? 0
      : previousStaff?.targetCount ?? defaultTargets[i] ?? 0;
    targetInput.value = String(targetCount);
    targetInput.dataset.staffIndex = String(i);
    targetInput.placeholder = "0";

    elements.staffInputs.appendChild(fragment);
  }
}

function getSafeStaffCount() {
  const count = parseStaffCount(elements.staffCountInput.value);
  return Number.isInteger(count) ? count : DEFAULT_STAFF_COUNT;
}

function parseStaffCount(value) {
  const number = Number(String(value).trim());
  if (!Number.isInteger(number) || number < MIN_STAFF_COUNT || number > MAX_STAFF_COUNT) {
    return NaN;
  }
  return number;
}

function buildDefaultTargetCounts(totalAssignments, count) {
  if (!Number.isInteger(totalAssignments) || totalAssignments <= 0) {
    return Array(count).fill(0);
  }

  const base = Math.floor(totalAssignments / count);
  const remainder = totalAssignments % count;
  return Array.from({ length: count }, (_, index) => base + (index < remainder ? 1 : 0));
}

function handleCalendarChange() {
  renderAvailabilityGrid();
  updateTargetSummary();
  resetGeneratedResults();
}

function handleStaffCountChange() {
  const staffCount = parseStaffCount(elements.staffCountInput.value);
  if (!Number.isInteger(staffCount)) {
    updateTargetSummary();
    resetGeneratedResults();
    return;
  }

  renderStaffInputs({ recalculateTargets: true });
  renderAvailabilityGrid();
  updateTargetSummary();
  resetGeneratedResults();
}

function handleStaffInputChange() {
  updateTargetSummary();
  renderAvailabilityGrid();
  resetGeneratedResults();
}

function resetGeneratedResults() {
  appState.lastResult = null;
  clearResults();
}

function getSavedShiftKeyFromUrl() {
  const location = window.location;
  if (!location) {
    return "";
  }

  const params = new URLSearchParams(location.search);
  const searchKey = params.get("shift") || params.get("preset");
  if (searchKey) {
    return searchKey;
  }

  const hashKey = location.hash.replace(/^#/, "");
  return SAVED_SHIFT_PRESETS[hashKey] ? hashKey : "";
}

function loadSavedShiftPreset(key) {
  const preset = SAVED_SHIFT_PRESETS[key];
  if (!preset) {
    setMessage("指定されたシフトは見つかりません。", "error");
    return;
  }

  applySavedShiftInputs(preset);
  appState.lastResult = buildSavedShiftResult(preset);
  renderResults(appState.lastResult);
  setMessage(`${preset.year}年${preset.month}月シフトを表示しています。`, "success");
}

function applySavedShiftInputs(preset) {
  elements.yearInput.value = String(preset.year);
  elements.monthInput.value = String(preset.month);
  elements.staffCountInput.value = String(preset.staff.length);
  appState.halfDayPolicy = normalizeHalfDayPolicy(preset.halfDayPolicy);

  renderStaffInputs({ recalculateTargets: true });
  renderHalfDayPolicySelector();

  const nameInputs = [...elements.staffInputs.querySelectorAll(".staff-name-input")];
  const targetInputs = [...elements.staffInputs.querySelectorAll(".staff-target-input")];
  preset.staff.forEach((staff, index) => {
    nameInputs[index].value = staff.name;
    targetInputs[index].value = String(staff.targetCount);
  });

  const scheduleInfo = getScheduleInfo();
  appState.availabilityMap = buildSavedAvailabilityMap(preset, scheduleInfo);
  renderAvailabilityGrid();
  updateTargetSummary();
}

function buildSavedAvailabilityMap(preset, scheduleInfo) {
  const daysByDate = new Map(scheduleInfo.calendarDays.map((day) => [day.date, day]));
  const availabilityMap = new Map();

  preset.availability.forEach(([staffIndex, date, state]) => {
    const day = daysByDate.get(date);
    const normalizedState = day?.type === "saturday" && isHalfDayState(state) ? AVAILABILITY_STATES.FULL : state;
    availabilityMap.set(availabilityKey(staffIndex, date), normalizedState);
  });

  return availabilityMap;
}

function buildSavedShiftResult(preset) {
  const scheduleInfo = getScheduleInfo();
  const staffList = getStaffList();
  const state = {
    assignmentsByDate: new Map(),
    totals: Array(staffList.length).fill(0),
    weeklyCounts: Array.from({ length: staffList.length }, () => Array(scheduleInfo.weekCount).fill(0)),
    workDatesByStaff: Array.from({ length: staffList.length }, () => new Set()),
    saturdayTotals: Array(staffList.length).fill(0),
    positionCounts: buildEmptyPositionCounts(staffList.length),
    positionByStaffDate: Array.from({ length: staffList.length }, () => new Map()),
    halfDayAssignmentCount: 0,
    roleCounts: Object.fromEntries(ALL_ROLES.map((role) => [role, Array(staffList.length).fill(0)])),
    pairMatrix: Array.from({ length: staffList.length }, () => Array(staffList.length).fill(0)),
  };

  scheduleInfo.workdays.forEach((day) => {
    const roles = preset.assignmentsByDate[day.date];
    if (roles) {
      applyAssignment(day, { roles }, state);
    }
  });

  return {
    ...state,
    scheduleInfo,
    staffList,
  };
}

function renderAvailabilityGrid() {
  const scheduleInfo = getScheduleInfo();
  renderAvailabilityModeSelector();

  if (!scheduleInfo.valid) {
    elements.availabilityLegend.innerHTML = "";
    elements.availabilityGrid.innerHTML = "";
    return;
  }

  const staffList = getStaffList();
  preserveAvailabilityState(scheduleInfo, staffList.length);

  elements.availabilityLegend.innerHTML = [
    '<span class="legend-pill">休み: ×</span>',
    '<span class="legend-pill">午前休み: ×AM</span>',
    '<span class="legend-pill">午後休み: ×PM</span>',
    '<span class="legend-pill">入れる日: 空欄</span>',
    '<span class="legend-pill">土曜は「休み」のみ</span>',
  ].join("");

  const table = document.createElement("table");
  table.className = "availability-table";

  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");

  const dateHeader = document.createElement("th");
  dateHeader.textContent = "日付";
  headRow.appendChild(dateHeader);

  const weekdayHeader = document.createElement("th");
  weekdayHeader.textContent = "曜日";
  headRow.appendChild(weekdayHeader);

  staffList.forEach((staff) => {
    const th = document.createElement("th");
    th.textContent = staff.name;
    headRow.appendChild(th);
  });

  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  scheduleInfo.calendarDays.forEach((day) => {
    const row = document.createElement("tr");

    if (day.type === "saturday") {
      row.classList.add("weekday-sat");
    }
    if (day.type === "sunday") {
      row.classList.add("weekday-sun");
    }

    const dateCell = document.createElement("td");
    dateCell.textContent = String(day.date);
    row.appendChild(dateCell);

    const weekdayCell = document.createElement("td");
    weekdayCell.textContent = WEEKDAY_NAMES[day.weekday];
    row.appendChild(weekdayCell);

    staffList.forEach((staff, staffIndex) => {
      const cell = document.createElement("td");

      if (day.type === "sunday") {
        cell.textContent = "休";
        cell.className = "disabled-cell";
      } else {
        const button = document.createElement("button");
        const state = getAvailabilityState(staffIndex, day.date);
        const halfModeDisabled = day.type === "saturday" && isHalfDayState(appState.availabilityMode);

        button.type = "button";
        button.className = "availability-cell-button";
        updateAvailabilityButton(button, day, state);

        if (halfModeDisabled) {
          button.disabled = true;
          button.title = "土曜は「休み」だけ選べます。";
          cell.classList.add("mode-disabled");
        } else {
          button.title = `${day.label} ${staff.name}`;
          button.addEventListener("click", () => {
            setAvailabilityState(staffIndex, day.date, appState.availabilityMode);
            updateAvailabilityButton(button, day, getAvailabilityState(staffIndex, day.date));
            resetGeneratedResults();
          });
        }

        cell.appendChild(button);
      }

      if (day.type === "saturday") {
        cell.classList.add("weekday-sat");
      }
      if (day.type === "sunday") {
        cell.classList.add("weekday-sun");
      }
      if (isWeekBoundary(day)) {
        cell.classList.add("week-start");
      }

      row.appendChild(cell);
    });

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  elements.availabilityGrid.innerHTML = "";
  elements.availabilityGrid.appendChild(table);
}

function renderAvailabilityModeSelector() {
  elements.availabilityModeSelector.innerHTML = "";

  AVAILABILITY_MODES.forEach((mode) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "mode-button";
    button.textContent = mode.label;
    if (mode.value === appState.availabilityMode) {
      button.classList.add("active");
    }
    button.addEventListener("click", () => {
      appState.availabilityMode = mode.value;
      renderAvailabilityGrid();
    });
    elements.availabilityModeSelector.appendChild(button);
  });
}

function renderHalfDayPolicySelector() {
  elements.halfDayPolicySelector.innerHTML = "";

  HALF_DAY_POLICY_OPTIONS.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "halfday-policy-button";
    button.textContent = option.label;
    button.setAttribute("aria-pressed", option.value === appState.halfDayPolicy ? "true" : "false");
    if (option.value === appState.halfDayPolicy) {
      button.classList.add("active");
    }
    button.addEventListener("click", () => {
      appState.halfDayPolicy = option.value;
      renderHalfDayPolicySelector();
      resetGeneratedResults();
    });
    elements.halfDayPolicySelector.appendChild(button);
  });
}

function normalizeHalfDayPolicy(value) {
  return Object.values(HALF_DAY_POLICIES).includes(value) ? value : HALF_DAY_POLICIES.FORBID;
}

function updateAvailabilityButton(button, day, state) {
  const normalizedState = normalizeAvailabilityStateForDay(day, state);
  const mark = getAvailabilityMarker(day, normalizedState);

  button.textContent = mark || " ";
  button.className = `availability-cell-button state-${normalizedState.toLowerCase()}`;
  button.setAttribute("aria-label", mark || "可");
}

function isWeekBoundary(day) {
  return day.weekday === 1 || day.date === 1;
}

function preserveAvailabilityState(scheduleInfo, staffCount) {
  const nextMap = new Map();

  scheduleInfo.calendarDays.forEach((day) => {
    for (let staffIndex = 0; staffIndex < staffCount; staffIndex += 1) {
      const key = availabilityKey(staffIndex, day.date);
      const currentValue = appState.availabilityMap.get(key);
      nextMap.set(key, normalizeAvailabilityStateForDay(day, currentValue));
    }
  });

  appState.availabilityMap = nextMap;
}

function availabilityKey(staffIndex, day) {
  return `${staffIndex}:${day}`;
}

function getAvailabilityState(staffIndex, day) {
  return appState.availabilityMap.get(availabilityKey(staffIndex, day)) ?? AVAILABILITY_STATES.OK;
}

function setAvailabilityState(staffIndex, day, value) {
  const scheduleInfo = getScheduleInfo();
  const dayInfo = scheduleInfo.valid ? scheduleInfo.calendarDays.find((item) => item.date === day) : null;
  const normalized = dayInfo ? normalizeAvailabilityStateForDay(dayInfo, value) : normalizeAvailabilityValue(value);
  appState.availabilityMap.set(availabilityKey(staffIndex, day), normalized);
}

function normalizeAvailabilityValue(value) {
  return Object.values(AVAILABILITY_STATES).includes(value) ? value : AVAILABILITY_STATES.OK;
}

function normalizeAvailabilityStateForDay(day, value) {
  const normalized = normalizeAvailabilityValue(value);
  if (day.type === "sunday") {
    return AVAILABILITY_STATES.OK;
  }
  if (day.type === "saturday" && isHalfDayState(normalized)) {
    return AVAILABILITY_STATES.OK;
  }
  return normalized;
}

function isHalfDayState(state) {
  return state === AVAILABILITY_STATES.AM || state === AVAILABILITY_STATES.PM;
}

function getAvailabilityMarker(day, state) {
  if (day.type === "saturday") {
    return state === AVAILABILITY_STATES.FULL ? AVAILABILITY_MARKS.FULL : "";
  }
  return AVAILABILITY_MARKS[state] ?? "";
}

function getReportAvailabilityMarker(day, state) {
  if (day.type === "saturday") {
    return state === AVAILABILITY_STATES.FULL ? REPORT_AVAILABILITY_MARKS.FULL : "";
  }
  return REPORT_AVAILABILITY_MARKS[state] ?? "";
}

function getStaffList() {
  const nameInputs = [...elements.staffInputs.querySelectorAll(".staff-name-input")];
  const targetInputs = [...elements.staffInputs.querySelectorAll(".staff-target-input")];

  return nameInputs.map((input, index) => {
    const name = input.value.trim() || `スタッフ${index + 1}`;
    const targetCount = parseTargetCount(targetInputs[index]?.value ?? "");
    return { name, targetCount };
  });
}

function parseTargetCount(value) {
  const text = String(value).trim();
  if (text === "") {
    return NaN;
  }

  const number = Number(text);
  if (!Number.isInteger(number) || number < 0) {
    return NaN;
  }
  return number;
}

function updateTargetSummary() {
  const scheduleInfo = getScheduleInfo();
  if (!scheduleInfo.valid) {
    elements.targetSummary.textContent = "年月を正しく入力してください。";
    elements.targetSummary.className = "target-summary mismatch";
    return;
  }

  const staffCount = parseStaffCount(elements.staffCountInput.value);
  if (!Number.isInteger(staffCount)) {
    elements.targetSummary.textContent = `スタッフ人数は ${MIN_STAFF_COUNT}〜${MAX_STAFF_COUNT} 人で入力してください。`;
    elements.targetSummary.className = "target-summary mismatch";
    return;
  }

  const requiredTotal = getRequiredAssignmentTotal(scheduleInfo);
  const staffList = getStaffList();
  const hasInvalid = staffList.some((staff) => !Number.isInteger(staff.targetCount) || staff.targetCount < 0);
  const targetTotal = hasInvalid ? null : staffList.reduce((sum, staff) => sum + staff.targetCount, 0);
  const diff = hasInvalid ? null : targetTotal - requiredTotal;

  elements.targetSummary.className = `target-summary${hasInvalid || diff !== 0 ? " mismatch" : ""}`;
  elements.targetSummary.textContent = hasInvalid
    ? `必要 ${requiredTotal} 枠 / 入る回数は 0 以上で入力してください。`
    : `必要 ${requiredTotal} 枠 / 入力 ${targetTotal} 枠 / 差 ${formatSignedNumber(diff)}`;
}

function getScheduleInfo() {
  const year = Number(elements.yearInput.value);
  const month = Number(elements.monthInput.value);

  return buildScheduleInfo(year, month);
}

function buildScheduleInfo(year, month) {
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return { valid: false };
  }

  const daysInMonth = new Date(year, month, 0).getDate();
  const calendarDays = [];
  const workdays = [];
  let rawWeekIndex = 0;

  for (let date = 1; date <= daysInMonth; date += 1) {
    const jsDate = new Date(year, month - 1, date);
    const weekday = jsDate.getDay();
    if (date > 1 && weekday === 1) {
      rawWeekIndex += 1;
    }
    const type = weekday === 0 ? "sunday" : weekday === 6 ? "saturday" : "weekday";
    const roles = type === "weekday" ? WEEKDAY_ROLES : type === "saturday" ? SATURDAY_ROLES : [];
    const dayInfo = {
      date,
      weekday,
      weekIndex: rawWeekIndex,
      type,
      roles,
      label: `${month}/${date}(${WEEKDAY_NAMES[weekday]})`,
    };
    calendarDays.push(dayInfo);
    if (type !== "sunday") {
      workdays.push(dayInfo);
    }
  }

  const activeWeekIndexes = [...new Set(workdays.map((day) => day.weekIndex))];
  const weekIndexMap = new Map(activeWeekIndexes.map((weekIndex, index) => [weekIndex, index]));
  calendarDays.forEach((day) => {
    day.weekIndex = weekIndexMap.has(day.weekIndex) ? weekIndexMap.get(day.weekIndex) : -1;
  });

  return { valid: true, year, month, daysInMonth, weekCount: activeWeekIndexes.length, calendarDays, workdays };
}

function getRequiredAssignmentTotal(scheduleInfo) {
  if (!scheduleInfo.valid) {
    return 0;
  }
  return scheduleInfo.workdays.reduce((sum, day) => sum + day.roles.length, 0);
}

async function handleGenerate() {
  if (appState.isBusy) {
    return;
  }

  const scheduleInfo = getScheduleInfo();
  const staffList = getStaffList();

  if (!scheduleInfo.valid) {
    setMessage("年または月の入力が正しくありません。", "error");
    return;
  }

  const staffCount = parseStaffCount(elements.staffCountInput.value);
  if (!Number.isInteger(staffCount)) {
    setMessage(`スタッフ人数は ${MIN_STAFF_COUNT}〜${MAX_STAFF_COUNT} 人で入力してください。`, "error");
    return;
  }

  if (staffList.length !== staffCount) {
    setMessage("スタッフ人数をもう一度入力してください。", "error");
    return;
  }

  if (new Set(staffList.map((staff) => staff.name)).size !== staffList.length) {
    setMessage("同じ名前があります。名前を変えてください。", "error");
    return;
  }

  const invalidTargetStaff = staffList.find((staff) => !Number.isInteger(staff.targetCount) || staff.targetCount < 0);
  if (invalidTargetStaff) {
    setMessage("入る回数は 0 以上の数字で入力してください。", "error");
    return;
  }

  const requiredTotal = getRequiredAssignmentTotal(scheduleInfo);
  const targetTotal = staffList.reduce((sum, staff) => sum + staff.targetCount, 0);
  if (targetTotal !== requiredTotal) {
    setMessage(`入る回数の合計が合いません。必要 ${requiredTotal} 枠、入力 ${targetTotal} 枠です。`, "error");
    return;
  }

  const dayQueue = buildPreparedWorkdays(scheduleInfo, staffList.length);
  const impossibleDay = dayQueue.find((day) => day.feasibleAssignments.length === 0);
  if (impossibleDay) {
    setMessage(`${impossibleDay.label} は休みが多く、人数が足りません。`, "error");
    return;
  }

  setBusy(true, "条件に合うシフトを探しています。画面を閉じずにお待ちください。");
  setMessage("探索中です。終わるまで少しお待ちください。", "neutral");

  try {
    await waitForPaint();
    const result = generateSchedule(scheduleInfo, staffList, dayQueue);
    if (!result) {
      setMessage("作れませんでした。休みの日や入る回数を少し変えてください。", "error");
      clearResults();
      return;
    }

    appState.lastResult = { ...result, scheduleInfo, staffList };
    renderResults(appState.lastResult);
    setMessage("シフトができました。印刷、CSV出力、シフト保存ができます。", "success");
  } catch (error) {
    console.error(error);
    setMessage("シフト作成中に問題が起きました。入力内容を確認してください。", "error");
  } finally {
    setBusy(false);
  }
}

function buildPreparedWorkdays(scheduleInfo, staffCount) {
  return scheduleInfo.workdays
    .map((day) => {
      const feasibleAssignments = buildDayFeasibleAssignments(day, staffCount);
      return {
        ...day,
        feasibleAssignments,
      };
    })
    .sort((a, b) => a.date - b.date);
}

function buildDayFeasibleAssignments(day, staffCount) {
  if (day.type === "saturday") {
    const assignable = [];
    for (let staffIndex = 0; staffIndex < staffCount; staffIndex += 1) {
      if (canAssign(staffIndex, day, "AD")) {
        assignable.push(staffIndex);
      }
    }

    if (assignable.length < SATURDAY_ROLES.length) {
      return [];
    }

    const assignmentCount = assignable.length * (assignable.length - 1);
    if (assignmentCount > MAX_FEASIBLE_ASSIGNMENTS_PER_DAY) {
      return sampleUniqueAssignments(
        () => {
          const staffA = randomItem(assignable);
          let staffB = randomItem(assignable);
          let attempts = 0;
          while (staffB === staffA && attempts < assignable.length * 2) {
            staffB = randomItem(assignable);
            attempts += 1;
          }
          return staffA === staffB ? null : { AD: staffA, BD: staffB };
        },
        MAX_FEASIBLE_ASSIGNMENTS_PER_DAY,
        saturdayAssignmentKey,
      );
    }

    return enumerateSaturdayAssignments(assignable);
  }

  const assignableByRole = Object.fromEntries(
    WEEKDAY_ROLES.map((role) => [
      role,
      Array.from({ length: staffCount }, (_, staffIndex) => staffIndex).filter((staffIndex) => canAssign(staffIndex, day, role)),
    ]),
  );

  if (WEEKDAY_ROLES.some((role) => assignableByRole[role].length === 0)) {
    return [];
  }

  const approximateAssignmentCount = WEEKDAY_ROLES.reduce((product, role) => product * assignableByRole[role].length, 1);
  if (approximateAssignmentCount > MAX_FEASIBLE_ASSIGNMENTS_PER_DAY) {
    const sampled = sampleUniqueAssignments(
      () => sampleWeekdayAssignment(assignableByRole),
      MAX_FEASIBLE_ASSIGNMENTS_PER_DAY,
      weekdayAssignmentKey,
    );
    return sampled.length ? sampled : enumerateWeekdayAssignments(assignableByRole);
  }

  return enumerateWeekdayAssignments(assignableByRole);
}

function enumerateSaturdayAssignments(assignable) {
  const results = [];
  for (const staffA of assignable) {
    for (const staffB of assignable) {
      if (staffA === staffB) {
        continue;
      }
      results.push({ AD: staffA, BD: staffB });
    }
  }
  return results;
}

function enumerateWeekdayAssignments(assignableByRole) {
  const results = [];
  for (const aa of assignableByRole.AA) {
    for (const ba of assignableByRole.BA) {
      if (ba === aa) {
        continue;
      }
      for (const ap of assignableByRole.AP) {
        if (ap === aa || ap === ba) {
          continue;
        }
        for (const bp of assignableByRole.BP) {
          if (bp === aa || bp === ba || bp === ap) {
            continue;
          }
          results.push({ AA: aa, BA: ba, AP: ap, BP: bp });
        }
      }
    }
  }

  return results;
}

function sampleWeekdayAssignment(assignableByRole) {
  const aa = randomItem(assignableByRole.AA);
  const ba = randomDistinctItem(assignableByRole.BA, [aa]);
  if (!Number.isInteger(ba)) {
    return null;
  }

  const ap = randomDistinctItem(assignableByRole.AP, [aa, ba]);
  if (!Number.isInteger(ap)) {
    return null;
  }

  const bp = randomDistinctItem(assignableByRole.BP, [aa, ba, ap]);
  if (!Number.isInteger(bp)) {
    return null;
  }

  return { AA: aa, BA: ba, AP: ap, BP: bp };
}

function sampleUniqueAssignments(factory, limit, keyFactory) {
  const results = [];
  const seen = new Set();
  let attempts = 0;
  const maxAttempts = limit * 20;

  while (results.length < limit && attempts < maxAttempts) {
    const assignment = factory();
    attempts += 1;

    if (!assignment) {
      continue;
    }

    const key = keyFactory(assignment);
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    results.push(assignment);
  }

  return results;
}

function weekdayAssignmentKey(assignment) {
  return `${assignment.AA}:${assignment.BA}:${assignment.AP}:${assignment.BP}`;
}

function saturdayAssignmentKey(assignment) {
  return `${assignment.AD}:${assignment.BD}`;
}

function randomDistinctItem(items, excludedItems) {
  const excluded = new Set(excludedItems);
  const candidates = items.filter((item) => !excluded.has(item));
  return candidates.length ? randomItem(candidates) : null;
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function canAssign(staffIndex, day, role) {
  if (day.type === "sunday") {
    return false;
  }

  const state = getAvailabilityState(staffIndex, day.date);
  if (state === AVAILABILITY_STATES.FULL) {
    return false;
  }
  if (appState.halfDayPolicy === HALF_DAY_POLICIES.FORBID && isHalfDayState(state)) {
    return false;
  }

  if (day.type === "saturday") {
    return true;
  }

  const period = getRolePeriod(day, role);
  if (period === "AM" && state === AVAILABILITY_STATES.AM) {
    return false;
  }
  if (period === "PM" && state === AVAILABILITY_STATES.PM) {
    return false;
  }

  return true;
}

function getRolePeriod(day, role) {
  if (day.type === "weekday") {
    if (role === "AA" || role === "BA") {
      return "AM";
    }
    if (role === "AP" || role === "BP") {
      return "PM";
    }
  }
  return "FULL";
}

function generateSchedule(scheduleInfo, staffList, dayQueue) {
  const totalTargets = staffList.map((staff) => staff.targetCount);
  const saturdayAssignments = scheduleInfo.workdays
    .filter((day) => day.type === "saturday")
    .reduce((sum, day) => sum + day.roles.length, 0);
  const targetSaturday = saturdayAssignments / staffList.length;
  const roleTargets = buildRoleTargets(scheduleInfo, totalTargets);
  const weeklyTargets = buildWeeklyTargets(scheduleInfo, totalTargets);

  const state = {
    assignmentsByDate: new Map(),
    totals: Array(staffList.length).fill(0),
    weeklyCounts: Array.from({ length: staffList.length }, () => Array(scheduleInfo.weekCount).fill(0)),
    workDatesByStaff: Array.from({ length: staffList.length }, () => new Set()),
    saturdayTotals: Array(staffList.length).fill(0),
    positionCounts: buildEmptyPositionCounts(staffList.length),
    positionByStaffDate: Array.from({ length: staffList.length }, () => new Map()),
    halfDayAssignmentCount: 0,
    roleCounts: Object.fromEntries(ALL_ROLES.map((role) => [role, Array(staffList.length).fill(0)])),
    pairMatrix: Array.from({ length: staffList.length }, () => Array(staffList.length).fill(0)),
  };

  const deadline = Date.now() + 3500;
  let bestResult = null;
  let bestScore = null;

  const greedySeed = buildGreedySolution(dayQueue, state, totalTargets, targetSaturday, roleTargets, weeklyTargets);
  if (greedySeed && isCompleteStateAcceptable(greedySeed.state, staffList.length)) {
    bestResult = cloneSolution(greedySeed.assignmentsByDate, greedySeed.state);
    bestScore = evaluateState(greedySeed.state, totalTargets, targetSaturday, roleTargets, weeklyTargets);
  }

  function search(dayIndex) {
    if (Date.now() > deadline) {
      return;
    }

    if (dayIndex >= dayQueue.length) {
      if (!isCompleteStateAcceptable(state, staffList.length)) {
        return;
      }
      const score = evaluateState(state, totalTargets, targetSaturday, roleTargets, weeklyTargets);
      if (!bestScore || compareScore(score, bestScore) < 0) {
        bestScore = score;
        bestResult = cloneSolution(state.assignmentsByDate, state);
      }
      return;
    }

    const day = dayQueue[dayIndex];
    const candidateLimit = getCandidateLimit(day, staffList.length);
    const candidates = buildDayCandidates(day, state, totalTargets, targetSaturday, roleTargets, weeklyTargets).slice(0, candidateLimit);

    for (const candidate of candidates) {
      applyAssignment(day, candidate, state);

      if (!bestScore || partialScorePromising(state, bestScore, totalTargets)) {
        search(dayIndex + 1);
      }

      rollbackAssignment(day, candidate, state);
    }
  }

  search(0);
  return bestResult;
}

function getCandidateLimit(day, staffCount) {
  if (day.type === "saturday") {
    return staffCount <= 6 ? 48 : 32;
  }
  if (staffCount <= 5) {
    return 120;
  }
  if (staffCount <= 6) {
    return 80;
  }
  return 30;
}

function buildRoleTargets(scheduleInfo, totalTargets) {
  const totalTargetAssignments = totalTargets.reduce((sum, value) => sum + value, 0);
  const requiredCountByRole = Object.fromEntries(
    ALL_ROLES.map((role) => [
      role,
      scheduleInfo.workdays.filter((day) => day.roles.includes(role)).length,
    ]),
  );

  if (totalTargetAssignments === 0) {
    return Object.fromEntries(
      ALL_ROLES.map((role) => [role, totalTargets.map(() => 0)]),
    );
  }

  return Object.fromEntries(
    ALL_ROLES.map((role) => [
      role,
      totalTargets.map((targetCount) => (requiredCountByRole[role] * targetCount) / totalTargetAssignments),
    ]),
  );
}

function buildWeeklyTargets(scheduleInfo, totalTargets) {
  const totalTargetAssignments = totalTargets.reduce((sum, value) => sum + value, 0);
  const requiredAssignmentsByWeek = Array(scheduleInfo.weekCount).fill(0);

  scheduleInfo.workdays.forEach((day) => {
    requiredAssignmentsByWeek[day.weekIndex] += day.roles.length;
  });

  if (totalTargetAssignments === 0) {
    return totalTargets.map(() => Array(scheduleInfo.weekCount).fill(0));
  }

  return totalTargets.map((targetCount) =>
    requiredAssignmentsByWeek.map((weekAssignments) => (weekAssignments * targetCount) / totalTargetAssignments),
  );
}

function buildGreedySolution(dayQueue, initialState, totalTargets, targetSaturday, roleTargets, weeklyTargets) {
  const state = cloneState(initialState);

  for (const day of dayQueue) {
    const candidates = buildDayCandidates(day, state, totalTargets, targetSaturday, roleTargets, weeklyTargets);
    if (!candidates.length) {
      return null;
    }
    applyAssignment(day, candidates[0], state);
  }

  return {
    assignmentsByDate: state.assignmentsByDate,
    state,
  };
}

function buildDayCandidates(day, state, totalTargets, targetSaturday, roleTargets, weeklyTargets) {
  return day.feasibleAssignments
    .filter((roles) => canApplyAssignment(day, roles, state, totalTargets))
    .map((roles) => ({
      roles,
      incrementScore: estimateAssignmentImpact(day, roles, state, totalTargets, targetSaturday, roleTargets, weeklyTargets),
      tieBreaker: Math.random(),
    }))
    .sort((left, right) => compareScore(left.incrementScore, right.incrementScore) || left.tieBreaker - right.tieBreaker);
}

function canApplyAssignment(day, roles, state, totalTargets) {
  const touchedStaffIndexes = new Set(Object.values(roles));

  for (const staffIndex of touchedStaffIndexes) {
    if (state.totals[staffIndex] + 1 > totalTargets[staffIndex]) {
      return false;
    }
    if (wouldExceedMaxConsecutiveWorkdays(state.workDatesByStaff[staffIndex], day.date)) {
      return false;
    }
  }

  for (const [role, staffIndex] of Object.entries(roles)) {
    if (WEEKDAY_ROLES.includes(role)) {
      const weekdayRoleLimit = Math.ceil(totalTargets[staffIndex] / WEEKDAY_ROLES.length);
      if (state.roleCounts[role][staffIndex] + 1 > weekdayRoleLimit) {
        return false;
      }
    }

    const position = getRolePosition(role);
    const positionLimit = Math.ceil(totalTargets[staffIndex] / 2);
    if (state.positionCounts[position][staffIndex] + 1 > positionLimit) {
      return false;
    }
    if (wouldRepeatAdjacentPosition(state.positionByStaffDate[staffIndex], day.date, position)) {
      return false;
    }
  }

  return true;
}

function getRolePosition(role) {
  return role === "AA" || role === "AP" || role === "AD" ? "A" : "B";
}

function isCompleteStateAcceptable(state, staffCount) {
  return maxWeekdayRoleGapFromRoleCounts(state.roleCounts, staffCount) <= WEEKDAY_ROLE_BALANCE_MAX_GAP;
}

function wouldRepeatAdjacentPosition(positionByDate, date, position) {
  let previousDate = null;
  let nextDate = null;

  positionByDate.forEach((_, assignedDate) => {
    if (assignedDate < date && (previousDate === null || assignedDate > previousDate)) {
      previousDate = assignedDate;
    }
    if (assignedDate > date && (nextDate === null || assignedDate < nextDate)) {
      nextDate = assignedDate;
    }
  });

  return (
    (previousDate !== null && positionByDate.get(previousDate) === position) ||
    (nextDate !== null && positionByDate.get(nextDate) === position)
  );
}

function wouldExceedMaxConsecutiveWorkdays(workDates, date) {
  let consecutiveCount = 1;

  for (let currentDate = date - 1; workDates.has(currentDate); currentDate -= 1) {
    consecutiveCount += 1;
  }

  for (let currentDate = date + 1; workDates.has(currentDate); currentDate += 1) {
    consecutiveCount += 1;
  }

  return consecutiveCount > MAX_CONSECUTIVE_WORKDAYS;
}

function estimateAssignmentImpact(day, roles, state, totalTargets, targetSaturday, roleTargets, weeklyTargets) {
  const touched = new Set(Object.values(roles));
  const totalsAfter = [...state.totals];
  const weeklyAfter = state.weeklyCounts.map((row) => [...row]);
  const saturdayAfter = [...state.saturdayTotals];
  const positionAfter = clonePositionCounts(state.positionCounts);
  const halfDayAssignmentCountAfter = state.halfDayAssignmentCount + countHalfDayAssignments(day, roles);
  const roleAfter = Object.fromEntries(ALL_ROLES.map((role) => [role, [...state.roleCounts[role]]]));
  const pairAfter = state.pairMatrix.map((row) => [...row]);

  touched.forEach((staffIndex) => {
    totalsAfter[staffIndex] += 1;
    weeklyAfter[staffIndex][day.weekIndex] += 1;
  });

  Object.entries(roles).forEach(([role, staffIndex]) => {
    positionAfter[getRolePosition(role)][staffIndex] += 1;
    roleAfter[role][staffIndex] += 1;
  });

  if (day.type === "saturday") {
    touched.forEach((staffIndex) => {
      saturdayAfter[staffIndex] += 1;
    });
    addPair(pairAfter, roles.AD, roles.BD);
  } else {
    WEEKDAY_PAIR_ROLES.forEach(([roleA, roleB]) => {
      addPair(pairAfter, roles[roleA], roles[roleB]);
    });
  }

  return evaluateVectors(
    totalsAfter,
    weeklyAfter,
    saturdayAfter,
    positionAfter,
    roleAfter,
    pairAfter,
    getHalfDayAssignmentPenalty(halfDayAssignmentCountAfter),
    totalTargets,
    targetSaturday,
    roleTargets,
    weeklyTargets,
  );
}

function partialScorePromising(state, bestScore, totalTargets) {
  const totalAbsLowerBound = state.totals.reduce(
    (sum, value, index) => sum + Math.max(0, value - totalTargets[index]),
    0,
  );
  if (totalAbsLowerBound > bestScore[0]) {
    return false;
  }

  const totalSqLowerBound = state.totals.reduce(
    (sum, value, index) => sum + Math.max(0, value - totalTargets[index]) ** 2,
    0,
  );
  if (totalAbsLowerBound === bestScore[0] && totalSqLowerBound > bestScore[1]) {
    return false;
  }

  return true;
}

function applyAssignment(day, candidate, state) {
  state.assignmentsByDate.set(day.date, candidate.roles);
  state.halfDayAssignmentCount += countHalfDayAssignments(day, candidate.roles);

  Object.values(candidate.roles).forEach((staffIndex) => {
    state.totals[staffIndex] += 1;
  });

  new Set(Object.values(candidate.roles)).forEach((staffIndex) => {
    state.weeklyCounts[staffIndex][day.weekIndex] += 1;
    state.workDatesByStaff[staffIndex].add(day.date);
  });

  if (day.type === "saturday") {
    Object.values(candidate.roles).forEach((staffIndex) => {
      state.saturdayTotals[staffIndex] += 1;
    });
    SATURDAY_PAIR_ROLES.forEach(([roleA, roleB]) => {
      addPair(state.pairMatrix, candidate.roles[roleA], candidate.roles[roleB]);
    });
  } else {
    WEEKDAY_PAIR_ROLES.forEach(([roleA, roleB]) => {
      addPair(state.pairMatrix, candidate.roles[roleA], candidate.roles[roleB]);
    });
  }

  day.roles.forEach((role) => {
    const staffIndex = candidate.roles[role];
    const position = getRolePosition(role);
    state.positionCounts[position][staffIndex] += 1;
    state.positionByStaffDate[staffIndex].set(day.date, position);
    state.roleCounts[role][candidate.roles[role]] += 1;
  });
}

function rollbackAssignment(day, candidate, state) {
  state.assignmentsByDate.delete(day.date);
  state.halfDayAssignmentCount -= countHalfDayAssignments(day, candidate.roles);

  Object.values(candidate.roles).forEach((staffIndex) => {
    state.totals[staffIndex] -= 1;
  });

  new Set(Object.values(candidate.roles)).forEach((staffIndex) => {
    state.weeklyCounts[staffIndex][day.weekIndex] -= 1;
    state.workDatesByStaff[staffIndex].delete(day.date);
  });

  if (day.type === "saturday") {
    Object.values(candidate.roles).forEach((staffIndex) => {
      state.saturdayTotals[staffIndex] -= 1;
    });
    SATURDAY_PAIR_ROLES.forEach(([roleA, roleB]) => {
      addPair(state.pairMatrix, candidate.roles[roleA], candidate.roles[roleB], -1);
    });
  } else {
    WEEKDAY_PAIR_ROLES.forEach(([roleA, roleB]) => {
      addPair(state.pairMatrix, candidate.roles[roleA], candidate.roles[roleB], -1);
    });
  }

  day.roles.forEach((role) => {
    const staffIndex = candidate.roles[role];
    const position = getRolePosition(role);
    state.positionCounts[position][staffIndex] -= 1;
    state.positionByStaffDate[staffIndex].delete(day.date);
    state.roleCounts[role][candidate.roles[role]] -= 1;
  });
}

function addPair(pairMatrix, staffA, staffB, delta = 1) {
  pairMatrix[staffA][staffB] += delta;
  pairMatrix[staffB][staffA] += delta;
}

function countHalfDayAssignments(day, roles) {
  if (day.type !== "weekday") {
    return 0;
  }

  return Object.entries(roles).reduce((count, [role, staffIndex]) => {
    const state = getAvailabilityState(staffIndex, day.date);
    return count + (isHalfDayCompatibleAssignment(day, role, state) ? 1 : 0);
  }, 0);
}

function getHalfDayAssignmentPenalty(count) {
  return appState.halfDayPolicy === HALF_DAY_POLICIES.AVOID ? count : 0;
}

function evaluateState(state, totalTargets, targetSaturday, roleTargets, weeklyTargets) {
  return evaluateVectors(
    state.totals,
    state.weeklyCounts,
    state.saturdayTotals,
    state.positionCounts,
    state.roleCounts,
    state.pairMatrix,
    getHalfDayAssignmentPenalty(state.halfDayAssignmentCount),
    totalTargets,
    targetSaturday,
    roleTargets,
    weeklyTargets,
  );
}

function evaluateVectors(totals, weeklyCounts, saturdayTotals, positionCounts, roleCounts, pairMatrix, halfDayAssignmentPenalty, totalTargets, targetSaturday, roleTargets, weeklyTargets) {
  const weeklyMaxOverCap = Math.max(
    0,
    ...weeklyCounts.flatMap((counts, staffIndex) =>
      counts.map((count, weekIndex) => Math.max(0, count - Math.ceil(weeklyTargets[staffIndex][weekIndex]))),
    ),
  );
  const weeklyOverCapScore = weeklyCounts.reduce(
    (sum, counts, staffIndex) =>
      sum + counts.reduce((weekSum, count, weekIndex) => {
        const overCap = Math.max(0, count - Math.ceil(weeklyTargets[staffIndex][weekIndex]));
        return weekSum + overCap ** 2;
      }, 0),
    0,
  );
  const weeklyMaxDeviation = Math.max(
    0,
    ...weeklyCounts.flatMap((counts, staffIndex) =>
      counts.map((count, weekIndex) => Math.abs(count - weeklyTargets[staffIndex][weekIndex])),
    ),
  );
  const weeklyDeviationScore = weeklyCounts.reduce(
    (sum, counts, staffIndex) => sum + squaredDeviationFromTargets(counts, weeklyTargets[staffIndex]),
    0,
  );
  const weeklyRangeScore = weeklyCounts.reduce((sum, counts) => sum + rangeOf(counts), 0);
  const positionMaxGap = Math.max(
    0,
    ...totalTargets.map((_, staffIndex) =>
      Math.abs(positionCounts.A[staffIndex] - positionCounts.B[staffIndex]),
    ),
  );
  const positionGapScore = totalTargets.reduce(
    (sum, _, staffIndex) => sum + (positionCounts.A[staffIndex] - positionCounts.B[staffIndex]) ** 2,
    0,
  );
  const weekdayRoleGaps = totalTargets.map((_, staffIndex) =>
    rangeOf(WEEKDAY_ROLES.map((role) => roleCounts[role][staffIndex])),
  );
  const weekdayRoleMaxGap = Math.max(0, ...weekdayRoleGaps);
  const weekdayRoleGapScore = weekdayRoleGaps.reduce((sum, gap) => sum + gap ** 2, 0);
  const roleMaxDeviation = Math.max(
    ...ALL_ROLES.flatMap((role) =>
      roleCounts[role].map((value, index) => Math.abs(value - roleTargets[role][index])),
    ),
  );
  const roleDeviationScore = WEEKDAY_ROLES.reduce(
    (sum, role) => sum + squaredDeviationFromTargets(roleCounts[role], roleTargets[role]),
    0,
  ) + SATURDAY_ROLES.reduce((sum, role) => sum + squaredDeviationFromTargets(roleCounts[role], roleTargets[role]), 0);

  return [
    absoluteDeviationFromTargets(totals, totalTargets),
    squaredDeviationFromTargets(totals, totalTargets),
    halfDayAssignmentPenalty,
    weekdayRoleMaxGap,
    weekdayRoleGapScore,
    positionMaxGap,
    positionGapScore,
    weeklyMaxOverCap,
    weeklyOverCapScore,
    weeklyMaxDeviation,
    weeklyDeviationScore,
    weeklyRangeScore,
    rangeOf(saturdayTotals),
    squaredDeviationFromConstant(saturdayTotals, targetSaturday),
    roleMaxDeviation,
    roleDeviationScore,
    pairSpread(pairMatrix),
    maxPairCount(pairMatrix),
    zeroPairCount(pairMatrix),
  ];
}

function absoluteDeviationFromTargets(values, targets) {
  return values.reduce((sum, value, index) => sum + Math.abs(value - targets[index]), 0);
}

function squaredDeviationFromTargets(values, targets) {
  return values.reduce((sum, value, index) => sum + (value - targets[index]) ** 2, 0);
}

function squaredDeviationFromConstant(values, target) {
  return values.reduce((sum, value) => sum + (value - target) ** 2, 0);
}

function zeroPairCount(pairMatrix) {
  let count = 0;
  for (let i = 0; i < pairMatrix.length; i += 1) {
    for (let j = i + 1; j < pairMatrix.length; j += 1) {
      if (pairMatrix[i][j] === 0) {
        count += 1;
      }
    }
  }
  return count;
}

function rangeOf(values) {
  if (!values.length) {
    return 0;
  }
  return Math.max(...values) - Math.min(...values);
}

function maxPairCount(pairMatrix) {
  let max = 0;
  for (let i = 0; i < pairMatrix.length; i += 1) {
    for (let j = i + 1; j < pairMatrix.length; j += 1) {
      if (pairMatrix[i][j] > max) {
        max = pairMatrix[i][j];
      }
    }
  }
  return max;
}

function pairSpread(pairMatrix) {
  const values = [];
  for (let i = 0; i < pairMatrix.length; i += 1) {
    for (let j = i + 1; j < pairMatrix.length; j += 1) {
      values.push(pairMatrix[i][j]);
    }
  }
  return values.length ? rangeOf(values) : 0;
}

function compareScore(left, right) {
  for (let i = 0; i < Math.max(left.length, right.length); i += 1) {
    const diff = (left[i] ?? 0) - (right[i] ?? 0);
    if (diff !== 0) {
      return diff;
    }
  }
  return 0;
}

function buildEmptyPositionCounts(staffCount) {
  return Object.fromEntries(POSITION_CODES.map((position) => [position, Array(staffCount).fill(0)]));
}

function clonePositionCounts(positionCounts) {
  return Object.fromEntries(POSITION_CODES.map((position) => [position, [...positionCounts[position]]]));
}

function cloneState(state) {
  return {
    assignmentsByDate: new Map(state.assignmentsByDate),
    totals: [...state.totals],
    weeklyCounts: state.weeklyCounts.map((row) => [...row]),
    workDatesByStaff: state.workDatesByStaff.map((dates) => new Set(dates)),
    saturdayTotals: [...state.saturdayTotals],
    positionCounts: clonePositionCounts(state.positionCounts),
    positionByStaffDate: state.positionByStaffDate.map((positions) => new Map(positions)),
    halfDayAssignmentCount: state.halfDayAssignmentCount,
    roleCounts: Object.fromEntries(
      ALL_ROLES.map((role) => [role, [...state.roleCounts[role]]]),
    ),
    pairMatrix: state.pairMatrix.map((row) => [...row]),
  };
}

function cloneSolution(assignmentsByDate, state) {
  return {
    assignmentsByDate: new Map(assignmentsByDate),
    totals: [...state.totals],
    weeklyCounts: state.weeklyCounts.map((row) => [...row]),
    workDatesByStaff: state.workDatesByStaff.map((dates) => new Set(dates)),
    saturdayTotals: [...state.saturdayTotals],
    positionCounts: clonePositionCounts(state.positionCounts),
    positionByStaffDate: state.positionByStaffDate.map((positions) => new Map(positions)),
    halfDayAssignmentCount: state.halfDayAssignmentCount,
    roleCounts: Object.fromEntries(
      ALL_ROLES.map((role) => [role, [...state.roleCounts[role]]]),
    ),
    pairMatrix: state.pairMatrix.map((row) => [...row]),
  };
}

function renderResults(result) {
  const { scheduleInfo, staffList } = result;
  const staffNames = staffList.map((staff) => staff.name);

  elements.monthLabel.textContent = `${scheduleInfo.year}年${scheduleInfo.month}月`;
  renderSummaryCards(scheduleInfo, staffList, result);
  renderReportSheetHeader(scheduleInfo);
  renderScheduleTable(scheduleInfo, staffList, result.assignmentsByDate);
  renderStatsTable(staffList, result);
  renderPositionTable(staffList, result);
  renderPairSummary(result.pairMatrix);
  renderPairTable(staffNames, result.pairMatrix);
}

function renderReportSheetHeader(scheduleInfo) {
  elements.reportSheetHeader.innerHTML = `
    <div class="sheet-meta-row">
      <span>×=休み / am×=午前休み / ×pm=午後休み</span>
      <strong>【${scheduleInfo.year}年${scheduleInfo.month}月シフト】</strong>
      <span>作成日 ${formatJapaneseDate(new Date())}</span>
    </div>
    <div class="role-legend-grid">
      ${ROLE_LEGEND.map((role) => `
        <span><strong>${role.code}</strong> ${role.label} ${role.time}</span>
      `).join("")}
    </div>
  `;
}

function renderSummaryCards(scheduleInfo, staffList, result) {
  const requiredTotal = getRequiredAssignmentTotal(scheduleInfo);
  const targetTotal = staffList.reduce((sum, staff) => sum + staff.targetCount, 0);
  const totalGap = absoluteDeviationFromTargets(result.totals, staffList.map((staff) => staff.targetCount));
  const saturdayRange = rangeOf(result.saturdayTotals);
  const maxConsecutiveWorkdays = maxConsecutiveWorkdaysForResult(result.workDatesByStaff);
  const maxWeeklyRange = result.weeklyCounts.reduce((max, counts) => Math.max(max, rangeOf(counts)), 0);
  const maxPositionGap = maxPositionGapForResult(result, staffList.length);
  const maxWeekdayRoleGap = maxWeekdayRoleGapForResult(result, staffList.length);

  const cards = [
    { label: "稼働日数", value: `${scheduleInfo.workdays.length}日` },
    { label: "必要な枠", value: `${requiredTotal}枠` },
    { label: "入力枠", value: `${targetTotal}枠` },
    { label: "差", value: `${totalGap}` },
    { label: "最大連勤", value: `${maxConsecutiveWorkdays}日` },
    { label: "週ごとの差", value: `${maxWeeklyRange}` },
    { label: "A/B差最大", value: `${maxPositionGap}` },
    { label: "4種差最大", value: `${maxWeekdayRoleGap}` },
    { label: "半日NG勤務", value: `${result.halfDayAssignmentCount}` },
    { label: "土曜の差", value: `${saturdayRange}` },
  ];

  elements.summaryCards.innerHTML = cards
    .map(
      (card) => `
        <article class="summary-card">
          <div class="label">${card.label}</div>
          <div class="value">${card.value}</div>
        </article>
      `,
    )
    .join("");
}

function renderScheduleTable(scheduleInfo, staffList, assignmentsByDate) {
  const thead = elements.scheduleTable.querySelector("thead");
  const tbody = elements.scheduleTable.querySelector("tbody");

  thead.innerHTML = `
    <tr class="staff-name-row">
      <th>氏 名</th>
      ${staffList.map((staff) => `<th>${escapeHtml(staff.name)}</th>`).join("")}
    </tr>
  `;

  tbody.innerHTML = "";

  scheduleInfo.calendarDays.forEach((day) => {
    const row = document.createElement("tr");
    if (day.type === "saturday") {
      row.classList.add("weekday-sat");
    }
    if (day.type === "sunday") {
      row.classList.add("weekday-sun");
    }

    const assignment = assignmentsByDate.get(day.date) ?? {};
    const staffCells = staffList
      .map((_, staffIndex) => buildScheduleCellContent(day, assignment, staffIndex))
      .join("");

    row.innerHTML = `
      <td>${day.label}</td>
      ${staffCells}
    `;
    tbody.appendChild(row);
  });
}

function buildScheduleCellContent(day, assignment, staffIndex) {
  if (day.type === "sunday") {
    return "<td></td>";
  }

  const assignedRole = findAssignedRole(assignment, staffIndex);
  if (assignedRole) {
    const state = getAvailabilityState(staffIndex, day.date);
    if (isHalfDayCompatibleAssignment(day, assignedRole, state)) {
      const marker = getReportAvailabilityMarker(day, state);
      return `
        <td class="halfday-shift">
          <span class="shift-role">${assignedRole}</span>
          <span class="halfday-note">${marker}</span>
        </td>
      `;
    }
    return `<td>${assignedRole}</td>`;
  }

  const state = getAvailabilityState(staffIndex, day.date);
  const marker = getReportAvailabilityMarker(day, state);
  if (marker) {
    return `<td class="ng">${marker}</td>`;
  }

  return "<td></td>";
}

function isHalfDayCompatibleAssignment(day, role, state) {
  if (day.type !== "weekday" || !isHalfDayState(state)) {
    return false;
  }

  const period = getRolePeriod(day, role);
  return (
    (state === AVAILABILITY_STATES.AM && period === "PM") ||
    (state === AVAILABILITY_STATES.PM && period === "AM")
  );
}

function findAssignedRole(assignment, staffIndex) {
  for (const role of ALL_ROLES) {
    if (assignment[role] === staffIndex) {
      return role;
    }
  }
  return "";
}

function renderStatsTable(staffList, result) {
  const thead = elements.statsTable.querySelector("thead");
  const tbody = elements.statsTable.querySelector("tbody");

  thead.innerHTML = `
    <tr>
      <th></th>
      ${staffList.map((staff) => `<th>${escapeHtml(staff.name)}</th>`).join("")}
    </tr>
  `;

  const roleRows = REPORT_ROLE_ORDER.map((role) => `
    <tr>
      <td>${ROLE_LABELS[role]}</td>
      ${staffList.map((_, index) => `<td>${result.roleCounts[role][index]}</td>`).join("")}
    </tr>
  `).join("");

  const totalRow = `
    <tr class="total-row">
      <td>計</td>
      ${staffList.map((_, index) => `<td>${result.totals[index]}</td>`).join("")}
    </tr>
  `;

  tbody.innerHTML = roleRows + totalRow;
}

function renderPositionTable(staffList, result) {
  const thead = elements.positionTable.querySelector("thead");
  const tbody = elements.positionTable.querySelector("tbody");

  thead.innerHTML = `
    <tr>
      <th></th>
      ${staffList.map((staff) => `<th>${escapeHtml(staff.name)}</th>`).join("")}
    </tr>
  `;

  tbody.innerHTML = POSITION_GROUPS.map((group) => `
    <tr>
      <td>${group.label}</td>
      ${staffList.map((_, index) => `<td>${sumRolesForStaff(result.roleCounts, group.roles, index)}</td>`).join("")}
    </tr>
  `).join("");
}

function renderPairSummary(pairMatrix) {
  const stats = getPairStats(pairMatrix);
  const cards = [
    { label: "ペア最小回数", value: String(stats.min) },
    { label: "ペア最大回数", value: String(stats.max) },
    { label: "ペア回数差", value: String(stats.diff) },
  ];

  elements.pairSummary.innerHTML = cards
    .map(
      (card) => `
        <article class="inline-summary-card">
          <div class="label">${card.label}</div>
          <div class="value">${card.value}</div>
        </article>
      `,
    )
    .join("");
}

function renderPairTable(staffNames, pairMatrix) {
  const thead = elements.pairTable.querySelector("thead");
  const tbody = elements.pairTable.querySelector("tbody");

  thead.innerHTML = `
    <tr>
      <th>スタッフ</th>
      ${staffNames.map((name) => `<th>${escapeHtml(name)}</th>`).join("")}
    </tr>
  `;

  tbody.innerHTML = staffNames
    .map((name, rowIndex) => {
      const cells = staffNames
        .map((_, colIndex) => {
          if (rowIndex === colIndex) {
            return '<td class="diagonal">-</td>';
          }
          return `<td>${pairMatrix[rowIndex][colIndex]}</td>`;
        })
        .join("");

      return `
        <tr>
          <td>${escapeHtml(name)}</td>
          ${cells}
        </tr>
      `;
    })
    .join("");
}

function clearResults() {
  elements.monthLabel.textContent = "";
  elements.reportSheetHeader.innerHTML = "";
  elements.summaryCards.innerHTML = "";
  elements.scheduleTable.querySelector("thead").innerHTML = "";
  elements.scheduleTable.querySelector("tbody").innerHTML = "";
  elements.statsTable.querySelector("thead").innerHTML = "";
  elements.statsTable.querySelector("tbody").innerHTML = "";
  elements.positionTable.querySelector("thead").innerHTML = "";
  elements.positionTable.querySelector("tbody").innerHTML = "";
  elements.pairSummary.innerHTML = "";
  elements.pairTable.querySelector("thead").innerHTML = "";
  elements.pairTable.querySelector("tbody").innerHTML = "";
}

function setMessage(text, type) {
  elements.messageBox.textContent = text;
  elements.messageBox.className = "message-box";
  if (type === "error" || type === "success") {
    elements.messageBox.classList.add(type);
  }
}

function setBusy(isBusy, text = "") {
  appState.isBusy = isBusy;
  document.body.classList.toggle("is-busy", isBusy);
  elements.loadingOverlay.hidden = !isBusy;
  elements.loadingText.textContent = text || "シフトを探しています。";

  [
    elements.generateButton,
    elements.savedShiftButton,
    elements.printButton,
    elements.csvButton,
    elements.saveJsonButton,
    elements.loadJsonButton,
  ].forEach((button) => {
    button.disabled = isBusy;
  });
}

function waitForPaint() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  });
}

function handleSaveJson() {
  if (!appState.lastResult) {
    setMessage("先にシフトを作ってから保存してください。", "error");
    return;
  }

  const saveData = buildShiftSaveData(appState.lastResult);
  const { scheduleInfo } = appState.lastResult;
  const fileName = `shift_${scheduleInfo.year}_${String(scheduleInfo.month).padStart(2, "0")}.json`;
  downloadTextFile(JSON.stringify(saveData, null, 2), fileName, "application/json;charset=utf-8;");
  setMessage("シフトをJSONで保存しました。", "success");
}

function buildShiftSaveData(result) {
  return {
    app: SAVE_FILE_KIND,
    version: SAVE_FILE_VERSION,
    savedAt: new Date().toISOString(),
    year: result.scheduleInfo.year,
    month: result.scheduleInfo.month,
    halfDayPolicy: appState.halfDayPolicy,
    staff: result.staffList.map((staff) => ({
      name: staff.name,
      targetCount: staff.targetCount,
    })),
    availability: serializeAvailabilityEntries(result.scheduleInfo, result.staffList.length),
    assignmentsByDate: serializeAssignmentsByDate(result.assignmentsByDate),
  };
}

function serializeAvailabilityEntries(scheduleInfo, staffCount) {
  const entries = [];

  scheduleInfo.calendarDays.forEach((day) => {
    if (day.type === "sunday") {
      return;
    }
    for (let staffIndex = 0; staffIndex < staffCount; staffIndex += 1) {
      const state = getAvailabilityState(staffIndex, day.date);
      if (state !== AVAILABILITY_STATES.OK) {
        entries.push([staffIndex, day.date, state]);
      }
    }
  });

  return entries;
}

function serializeAssignmentsByDate(assignmentsByDate) {
  const assignments = {};
  [...assignmentsByDate.entries()]
    .sort(([leftDate], [rightDate]) => leftDate - rightDate)
    .forEach(([date, roles]) => {
      assignments[date] = { ...roles };
    });
  return assignments;
}

function downloadTextFile(text, fileName, type) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function handleLoadJsonClick() {
  if (appState.isBusy) {
    return;
  }
  elements.loadJsonInput.value = "";
  elements.loadJsonInput.click();
}

function handleLoadJsonFile(event) {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const imported = normalizeShiftSaveData(JSON.parse(String(reader.result ?? "")));
      applyImportedShiftData(imported);
    } catch (error) {
      console.error(error);
      setMessage("読み込めませんでした。保存したJSONファイルを選んでください。", "error");
    } finally {
      elements.loadJsonInput.value = "";
    }
  });
  reader.addEventListener("error", () => {
    setMessage("ファイルを読み込めませんでした。", "error");
    elements.loadJsonInput.value = "";
  });
  reader.readAsText(file, "utf-8");
}

function normalizeShiftSaveData(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid save data");
  }

  const year = Number(data.year);
  const month = Number(data.month);
  const scheduleInfo = buildScheduleInfo(year, month);
  if (!scheduleInfo.valid) {
    throw new Error("Invalid year or month");
  }

  const staff = normalizeSavedStaff(data.staff);
  const availability = normalizeSavedAvailability(data.availability, scheduleInfo, staff.length);
  const assignmentsByDate = normalizeSavedAssignments(data.assignmentsByDate, scheduleInfo, staff.length);

  return {
    year,
    month,
    halfDayPolicy: normalizeHalfDayPolicy(data.halfDayPolicy),
    staff,
    availability,
    assignmentsByDate,
  };
}

function normalizeSavedStaff(value) {
  if (!Array.isArray(value) || !Number.isInteger(parseStaffCount(value.length))) {
    throw new Error("Invalid staff list");
  }

  return value.map((staff, index) => {
    const name = String(staff?.name ?? `スタッフ${index + 1}`).trim() || `スタッフ${index + 1}`;
    const targetCount = Number(staff?.targetCount);
    if (!Number.isInteger(targetCount) || targetCount < 0) {
      throw new Error("Invalid target count");
    }
    return {
      name: name.slice(0, 20),
      targetCount,
    };
  });
}

function normalizeSavedAvailability(value, scheduleInfo, staffCount) {
  if (!Array.isArray(value)) {
    return [];
  }

  const daysByDate = new Map(scheduleInfo.calendarDays.map((day) => [day.date, day]));
  const entries = [];

  value.forEach((entry) => {
    const staffIndex = Number(Array.isArray(entry) ? entry[0] : entry?.staffIndex);
    const date = Number(Array.isArray(entry) ? entry[1] : entry?.date);
    const stateValue = Array.isArray(entry) ? entry[2] : entry?.state;
    const day = daysByDate.get(date);
    if (!Number.isInteger(staffIndex) || staffIndex < 0 || staffIndex >= staffCount || !day) {
      throw new Error("Invalid availability entry");
    }
    const state = normalizeAvailabilityStateForDay(day, stateValue);
    if (state !== AVAILABILITY_STATES.OK) {
      entries.push([staffIndex, date, state]);
    }
  });

  return entries;
}

function normalizeSavedAssignments(value, scheduleInfo, staffCount) {
  if (value == null) {
    return null;
  }
  if (typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Invalid assignments");
  }

  const assignmentsByDate = {};
  scheduleInfo.workdays.forEach((day) => {
    const rawAssignment = value[day.date];
    if (!rawAssignment || typeof rawAssignment !== "object" || Array.isArray(rawAssignment)) {
      throw new Error("Missing assignment");
    }

    const usedStaff = new Set();
    const assignment = {};
    day.roles.forEach((role) => {
      const staffIndex = Number(rawAssignment[role]);
      if (!Number.isInteger(staffIndex) || staffIndex < 0 || staffIndex >= staffCount || usedStaff.has(staffIndex)) {
        throw new Error("Invalid role assignment");
      }
      usedStaff.add(staffIndex);
      assignment[role] = staffIndex;
    });
    assignmentsByDate[day.date] = assignment;
  });

  return assignmentsByDate;
}

function applyImportedShiftData(data) {
  applySavedShiftInputs(data);

  if (data.assignmentsByDate) {
    appState.lastResult = buildSavedShiftResult(data);
    renderResults(appState.lastResult);
    setMessage(`${data.year}年${data.month}月の保存シフトを読み込みました。`, "success");
    return;
  }

  appState.lastResult = null;
  clearResults();
  setMessage("入力内容を読み込みました。シフト生成を押してください。", "success");
}

function handleDownloadCsv() {
  if (!appState.lastResult) {
    setMessage("先にシフトを作ってください。", "error");
    return;
  }

  const csv = buildCsv(appState.lastResult);
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const { scheduleInfo } = appState.lastResult;
  link.href = url;
  link.download = `shift_${scheduleInfo.year}_${String(scheduleInfo.month).padStart(2, "0")}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function buildCsv(result) {
  const { scheduleInfo, staffList, assignmentsByDate } = result;
  const staffNames = staffList.map((staff) => staff.name);
  const lines = [];
  const pairStats = getPairStats(result.pairMatrix);

  lines.push([`【${scheduleInfo.year}年${scheduleInfo.month}月シフト】`]);
  lines.push(["氏名", ...staffNames]);
  lines.push(["日付", ...staffNames]);

  scheduleInfo.calendarDays.forEach((day) => {
    const assignment = assignmentsByDate.get(day.date) ?? {};
    lines.push([
      day.label,
      ...staffNames.map((_, staffIndex) => buildCsvScheduleCell(day, assignment, staffIndex)),
    ]);
  });

  lines.push([]);
  lines.push(["≪ 出勤日数 ≫"]);
  lines.push(["", ...staffNames]);
  REPORT_ROLE_ORDER.forEach((role) => {
    lines.push([ROLE_LABELS[role], ...staffList.map((_, index) => result.roleCounts[role][index])]);
  });
  lines.push(["計", ...staffList.map((_, index) => result.totals[index])]);

  lines.push([]);
  POSITION_GROUPS.forEach((group) => {
    lines.push([group.label, ...staffList.map((_, index) => sumRolesForStaff(result.roleCounts, group.roles, index))]);
  });

  lines.push([]);
  lines.push(["週別勤務回数"]);
  lines.push(["", ...Array.from({ length: scheduleInfo.weekCount }, (_, index) => `${index + 1}週目`)]);
  staffList.forEach((staff, index) => {
    lines.push([staff.name, ...result.weeklyCounts[index]]);
  });

  lines.push([]);
  lines.push(["ペア回数サマリー"]);
  lines.push(["ペア最小回数", pairStats.min]);
  lines.push(["ペア最大回数", pairStats.max]);
  lines.push(["ペア回数差", pairStats.diff]);

  lines.push([]);
  lines.push(["ペア回数一覧"]);
  lines.push(["スタッフ", ...staffNames]);
  staffNames.forEach((name, rowIndex) => {
    lines.push([
      name,
      ...staffNames.map((_, colIndex) => (rowIndex === colIndex ? "-" : result.pairMatrix[rowIndex][colIndex])),
    ]);
  });

  return lines
    .map((line) => line.map((cell) => csvEscape(cell ?? "")).join(","))
    .join("\r\n");
}

function buildCsvScheduleCell(day, assignment, staffIndex) {
  if (day.type === "sunday") {
    return "";
  }

  const assignedRole = findAssignedRole(assignment, staffIndex);
  if (assignedRole) {
    const state = getAvailabilityState(staffIndex, day.date);
    if (isHalfDayCompatibleAssignment(day, assignedRole, state)) {
      return `${assignedRole} / ${getReportAvailabilityMarker(day, state)}`;
    }
    return assignedRole;
  }

  return getReportAvailabilityMarker(day, getAvailabilityState(staffIndex, day.date));
}

function getPairStats(pairMatrix) {
  const values = [];
  for (let i = 0; i < pairMatrix.length; i += 1) {
    for (let j = i + 1; j < pairMatrix.length; j += 1) {
      values.push(pairMatrix[i][j]);
    }
  }

  if (!values.length) {
    return { min: 0, max: 0, diff: 0 };
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  return {
    zeroCount: values.filter((value) => value === 0).length,
    min,
    max,
    diff: max - min,
  };
}

function maxConsecutiveWorkdaysForResult(workDatesByStaff) {
  return workDatesByStaff.reduce((max, workDates) => Math.max(max, maxConsecutiveWorkdaysForDates([...workDates])), 0);
}

function maxConsecutiveWorkdaysForDates(dates) {
  if (!dates.length) {
    return 0;
  }

  const sortedDates = [...dates].sort((left, right) => left - right);
  let maxCount = 1;
  let currentCount = 1;

  for (let i = 1; i < sortedDates.length; i += 1) {
    if (sortedDates[i] === sortedDates[i - 1] + 1) {
      currentCount += 1;
    } else {
      currentCount = 1;
    }
    maxCount = Math.max(maxCount, currentCount);
  }

  return maxCount;
}

function maxPositionGapForResult(result, staffCount) {
  return Math.max(
    0,
    ...Array.from({ length: staffCount }, (_, index) =>
      Math.abs(result.positionCounts.A[index] - result.positionCounts.B[index]),
    ),
  );
}

function maxWeekdayRoleGapForResult(result, staffCount) {
  return maxWeekdayRoleGapFromRoleCounts(result.roleCounts, staffCount);
}

function maxWeekdayRoleGapFromRoleCounts(roleCounts, staffCount) {
  return Math.max(
    0,
    ...Array.from({ length: staffCount }, (_, index) =>
      rangeOf(WEEKDAY_ROLES.map((role) => roleCounts[role][index])),
    ),
  );
}

function sumRolesForStaff(roleCounts, roles, staffIndex) {
  return roles.reduce((sum, role) => sum + roleCounts[role][staffIndex], 0);
}

function formatJapaneseDate(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function csvEscape(value) {
  const text = String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function formatSignedNumber(value) {
  if (value > 0) {
    return `+${value}`;
  }
  return String(value);
}

init();

