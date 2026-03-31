const STAFF_COUNT = 7;
const WEEKDAY_ROLES = ["AA", "BA", "AP", "BP"];
const SATURDAY_ROLES = ["AD", "BD"];
const WEEKDAY_PAIR_ROLES = [
  ["AA", "BA"],
  ["AP", "BP"],
];
const SATURDAY_PAIR_ROLES = [["AD", "BD"]];
const WEEKDAY_NAMES = ["日", "月", "火", "水", "木", "金", "土"];
const DEFAULT_NAMES = ["スタッフ1", "スタッフ2", "スタッフ3", "スタッフ4", "スタッフ5", "スタッフ6", "スタッフ7"];
const AVAILABILITY_STATES = {
  OK: "OK",
  FULL: "FULL",
  AM: "AM",
  PM: "PM",
};
const AVAILABILITY_MODES = [
  { value: AVAILABILITY_STATES.FULL, label: "終日不可" },
  { value: AVAILABILITY_STATES.AM, label: "AM不可" },
  { value: AVAILABILITY_STATES.PM, label: "PM不可" },
  { value: AVAILABILITY_STATES.OK, label: "解除" },
];
const AVAILABILITY_MARKS = {
  [AVAILABILITY_STATES.OK]: "",
  [AVAILABILITY_STATES.FULL]: "×",
  [AVAILABILITY_STATES.AM]: "×AM",
  [AVAILABILITY_STATES.PM]: "×PM",
};

const elements = {
  yearInput: document.getElementById("yearInput"),
  monthInput: document.getElementById("monthInput"),
  staffInputs: document.getElementById("staffInputs"),
  targetSummary: document.getElementById("targetSummary"),
  availabilityModeSelector: document.getElementById("availabilityModeSelector"),
  availabilityLegend: document.getElementById("availabilityLegend"),
  availabilityGrid: document.getElementById("availabilityGrid"),
  generateButton: document.getElementById("generateButton"),
  printButton: document.getElementById("printButton"),
  csvButton: document.getElementById("csvButton"),
  messageBox: document.getElementById("messageBox"),
  monthLabel: document.getElementById("monthLabel"),
  scheduleTable: document.getElementById("scheduleTable"),
  statsTable: document.getElementById("statsTable"),
  pairSummary: document.getElementById("pairSummary"),
  pairTable: document.getElementById("pairTable"),
  summaryCards: document.getElementById("summaryCards"),
  staffInputTemplate: document.getElementById("staffInputTemplate"),
};

const appState = {
  availabilityMap: new Map(),
  availabilityMode: AVAILABILITY_STATES.FULL,
  lastResult: null,
};

function init() {
  const today = new Date();
  elements.yearInput.value = String(today.getFullYear());
  elements.monthInput.value = String(today.getMonth() + 1);

  renderStaffInputs();
  renderAvailabilityGrid();
  updateTargetSummary();
  clearResults();
  setMessage("設定を確認して「シフト生成」を押してください。", "neutral");

  elements.yearInput.addEventListener("input", handleCalendarChange);
  elements.monthInput.addEventListener("input", handleCalendarChange);
  elements.staffInputs.addEventListener("input", handleStaffInputChange);
  elements.generateButton.addEventListener("click", handleGenerate);
  elements.printButton.addEventListener("click", () => window.print());
  elements.csvButton.addEventListener("click", handleDownloadCsv);
}

function renderStaffInputs() {
  elements.staffInputs.innerHTML = "";
  const defaultTargets = buildDefaultTargetCounts(getRequiredAssignmentTotal(getScheduleInfo()), STAFF_COUNT);

  for (let i = 0; i < STAFF_COUNT; i += 1) {
    const fragment = elements.staffInputTemplate.content.cloneNode(true);
    const label = fragment.querySelector(".staff-label");
    const nameInput = fragment.querySelector(".staff-name-input");
    const targetInput = fragment.querySelector(".staff-target-input");

    label.textContent = `スタッフ ${i + 1}`;
    nameInput.value = DEFAULT_NAMES[i];
    nameInput.dataset.staffIndex = String(i);
    nameInput.placeholder = `スタッフ ${i + 1}`;

    targetInput.value = String(defaultTargets[i] ?? 0);
    targetInput.dataset.staffIndex = String(i);
    targetInput.placeholder = "0";

    elements.staffInputs.appendChild(fragment);
  }
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

function handleStaffInputChange() {
  updateTargetSummary();
  renderAvailabilityGrid();
  resetGeneratedResults();
}

function resetGeneratedResults() {
  appState.lastResult = null;
  clearResults();
}

function renderAvailabilityGrid() {
  const scheduleInfo = getScheduleInfo();
  renderAvailabilityModeSelector();

  if (!scheduleInfo.valid) {
    elements.availabilityLegend.innerHTML = "";
    elements.availabilityGrid.innerHTML = "";
    return;
  }

  preserveAvailabilityState(scheduleInfo);
  const staffList = getStaffList();

  elements.availabilityLegend.innerHTML = [
    '<span class="legend-pill">終日不可: ×</span>',
    '<span class="legend-pill">AM不可: ×AM</span>',
    '<span class="legend-pill">PM不可: ×PM</span>',
    '<span class="legend-pill">可: 空欄</span>',
    '<span class="legend-pill">土曜は終日不可のみ有効</span>',
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
          button.title = "土曜は終日不可のみ設定できます。";
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

function preserveAvailabilityState(scheduleInfo) {
  const nextMap = new Map();

  scheduleInfo.calendarDays.forEach((day) => {
    for (let staffIndex = 0; staffIndex < STAFF_COUNT; staffIndex += 1) {
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

  const requiredTotal = getRequiredAssignmentTotal(scheduleInfo);
  const staffList = getStaffList();
  const hasInvalid = staffList.some((staff) => !Number.isInteger(staff.targetCount) || staff.targetCount < 0);
  const targetTotal = hasInvalid ? null : staffList.reduce((sum, staff) => sum + staff.targetCount, 0);
  const diff = hasInvalid ? null : targetTotal - requiredTotal;

  elements.targetSummary.className = `target-summary${hasInvalid || diff !== 0 ? " mismatch" : ""}`;
  elements.targetSummary.textContent = hasInvalid
    ? `必要総勤務枠数 ${requiredTotal} 枠 / 目標勤務数を 0 以上の整数で入力してください。`
    : `必要総勤務枠数 ${requiredTotal} 枠 / 目標合計 ${targetTotal} 枠 / 差 ${formatSignedNumber(diff)}`;
}

function getScheduleInfo() {
  const year = Number(elements.yearInput.value);
  const month = Number(elements.monthInput.value);

  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return { valid: false };
  }

  const daysInMonth = new Date(year, month, 0).getDate();
  const calendarDays = [];
  const workdays = [];

  for (let date = 1; date <= daysInMonth; date += 1) {
    const jsDate = new Date(year, month - 1, date);
    const weekday = jsDate.getDay();
    const type = weekday === 0 ? "sunday" : weekday === 6 ? "saturday" : "weekday";
    const roles = type === "weekday" ? WEEKDAY_ROLES : type === "saturday" ? SATURDAY_ROLES : [];
    const dayInfo = {
      date,
      weekday,
      type,
      roles,
      label: `${month}/${date}(${WEEKDAY_NAMES[weekday]})`,
    };
    calendarDays.push(dayInfo);
    if (type !== "sunday") {
      workdays.push(dayInfo);
    }
  }

  return { valid: true, year, month, daysInMonth, calendarDays, workdays };
}

function getRequiredAssignmentTotal(scheduleInfo) {
  if (!scheduleInfo.valid) {
    return 0;
  }
  return scheduleInfo.workdays.reduce((sum, day) => sum + day.roles.length, 0);
}

function handleGenerate() {
  const scheduleInfo = getScheduleInfo();
  const staffList = getStaffList();

  if (!scheduleInfo.valid) {
    setMessage("年または月の入力が正しくありません。", "error");
    return;
  }

  if (new Set(staffList.map((staff) => staff.name)).size !== staffList.length) {
    setMessage("スタッフ名が重複しないように入力してください。", "error");
    return;
  }

  const invalidTargetStaff = staffList.find((staff) => !Number.isInteger(staff.targetCount) || staff.targetCount < 0);
  if (invalidTargetStaff) {
    setMessage("目標勤務数は 0 以上の整数で入力してください。", "error");
    return;
  }

  const requiredTotal = getRequiredAssignmentTotal(scheduleInfo);
  const targetTotal = staffList.reduce((sum, staff) => sum + staff.targetCount, 0);
  if (targetTotal !== requiredTotal) {
    setMessage(`目標勤務数の合計が必要総勤務枠数と一致していません。必要 ${requiredTotal} 枠、入力合計 ${targetTotal} 枠です。`, "error");
    return;
  }

  const dayQueue = buildPreparedWorkdays(scheduleInfo, staffList.length);
  const impossibleDay = dayQueue.find((day) => day.feasibleAssignments.length === 0);
  if (impossibleDay) {
    setMessage(`${impossibleDay.label} は現在の不可設定では必要人数を割り当てできません。`, "error");
    return;
  }

  setMessage("シフトを生成しています。条件を評価しながら割り当てを探索しています。", "neutral");

  const result = generateSchedule(scheduleInfo, staffList, dayQueue);
  if (!result) {
    setMessage("条件を満たすシフトを見つけられませんでした。不可日や目標勤務数を調整してください。", "error");
    clearResults();
    return;
  }

  appState.lastResult = { ...result, scheduleInfo, staffList };
  renderResults(appState.lastResult);
  setMessage("シフトを生成しました。印刷と CSV ダウンロードも利用できます。", "success");
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
    .sort((a, b) => {
      if (a.feasibleAssignments.length !== b.feasibleAssignments.length) {
        return a.feasibleAssignments.length - b.feasibleAssignments.length;
      }
      if (a.type !== b.type) {
        return a.type === "saturday" ? -1 : 1;
      }
      return a.date - b.date;
    });
}

function buildDayFeasibleAssignments(day, staffCount) {
  if (day.type === "saturday") {
    const assignable = [];
    for (let staffIndex = 0; staffIndex < staffCount; staffIndex += 1) {
      if (canAssign(staffIndex, day, "AD")) {
        assignable.push(staffIndex);
      }
    }

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

  const assignableByRole = Object.fromEntries(
    WEEKDAY_ROLES.map((role) => [
      role,
      Array.from({ length: staffCount }, (_, staffIndex) => staffIndex).filter((staffIndex) => canAssign(staffIndex, day, role)),
    ]),
  );

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

function canAssign(staffIndex, day, role) {
  if (day.type === "sunday") {
    return false;
  }

  const state = getAvailabilityState(staffIndex, day.date);
  if (state === AVAILABILITY_STATES.FULL) {
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
  const weekdayRoleTargets = buildWeekdayRoleTargets(scheduleInfo, totalTargets);

  const state = {
    assignmentsByDate: new Map(),
    totals: Array(staffList.length).fill(0),
    saturdayTotals: Array(staffList.length).fill(0),
    roleCounts: Object.fromEntries(WEEKDAY_ROLES.map((role) => [role, Array(staffList.length).fill(0)])),
    pairMatrix: Array.from({ length: staffList.length }, () => Array(staffList.length).fill(0)),
  };

  const deadline = Date.now() + 3500;
  let bestResult = null;
  let bestScore = null;

  const greedySeed = buildGreedySolution(dayQueue, state, totalTargets, targetSaturday, weekdayRoleTargets);
  if (greedySeed) {
    bestResult = cloneSolution(greedySeed.assignmentsByDate, greedySeed.state);
    bestScore = evaluateState(greedySeed.state, totalTargets, targetSaturday, weekdayRoleTargets);
  }

  function search(dayIndex) {
    if (Date.now() > deadline) {
      return;
    }

    if (dayIndex >= dayQueue.length) {
      const score = evaluateState(state, totalTargets, targetSaturday, weekdayRoleTargets);
      if (!bestScore || compareScore(score, bestScore) < 0) {
        bestScore = score;
        bestResult = cloneSolution(state.assignmentsByDate, state);
      }
      return;
    }

    const day = dayQueue[dayIndex];
    const candidateLimit = day.type === "saturday" ? 24 : 18;
    const candidates = buildDayCandidates(day, state, totalTargets, targetSaturday, weekdayRoleTargets).slice(0, candidateLimit);

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

function buildWeekdayRoleTargets(scheduleInfo, totalTargets) {
  const totalTargetAssignments = totalTargets.reduce((sum, value) => sum + value, 0);
  const weekdayCount = scheduleInfo.workdays.filter((day) => day.type === "weekday").length;

  if (totalTargetAssignments === 0) {
    return Object.fromEntries(
      WEEKDAY_ROLES.map((role) => [role, totalTargets.map(() => 0)]),
    );
  }

  return Object.fromEntries(
    WEEKDAY_ROLES.map((role) => [
      role,
      totalTargets.map((targetCount) => (weekdayCount * targetCount) / totalTargetAssignments),
    ]),
  );
}

function buildGreedySolution(dayQueue, initialState, totalTargets, targetSaturday, weekdayRoleTargets) {
  const state = cloneState(initialState);

  for (const day of dayQueue) {
    const candidates = buildDayCandidates(day, state, totalTargets, targetSaturday, weekdayRoleTargets);
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

function buildDayCandidates(day, state, totalTargets, targetSaturday, weekdayRoleTargets) {
  return day.feasibleAssignments
    .map((roles) => ({
      roles,
      incrementScore: estimateAssignmentImpact(day, roles, state, totalTargets, targetSaturday, weekdayRoleTargets),
    }))
    .sort((left, right) => compareScore(left.incrementScore, right.incrementScore));
}

function estimateAssignmentImpact(day, roles, state, totalTargets, targetSaturday, weekdayRoleTargets) {
  const touched = new Set(Object.values(roles));
  const totalsAfter = [...state.totals];
  const saturdayAfter = [...state.saturdayTotals];
  const roleAfter = Object.fromEntries(WEEKDAY_ROLES.map((role) => [role, [...state.roleCounts[role]]]));
  const pairAfter = state.pairMatrix.map((row) => [...row]);

  touched.forEach((staffIndex) => {
    totalsAfter[staffIndex] += 1;
  });

  if (day.type === "saturday") {
    touched.forEach((staffIndex) => {
      saturdayAfter[staffIndex] += 1;
    });
    addPair(pairAfter, roles.AD, roles.BD);
  } else {
    WEEKDAY_ROLES.forEach((role) => {
      roleAfter[role][roles[role]] += 1;
    });
    WEEKDAY_PAIR_ROLES.forEach(([roleA, roleB]) => {
      addPair(pairAfter, roles[roleA], roles[roleB]);
    });
  }

  return evaluateVectors(
    totalsAfter,
    saturdayAfter,
    roleAfter,
    pairAfter,
    totalTargets,
    targetSaturday,
    weekdayRoleTargets,
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

  Object.values(candidate.roles).forEach((staffIndex) => {
    state.totals[staffIndex] += 1;
  });

  if (day.type === "saturday") {
    Object.values(candidate.roles).forEach((staffIndex) => {
      state.saturdayTotals[staffIndex] += 1;
    });
    SATURDAY_PAIR_ROLES.forEach(([roleA, roleB]) => {
      addPair(state.pairMatrix, candidate.roles[roleA], candidate.roles[roleB]);
    });
  } else {
    WEEKDAY_ROLES.forEach((role) => {
      state.roleCounts[role][candidate.roles[role]] += 1;
    });
    WEEKDAY_PAIR_ROLES.forEach(([roleA, roleB]) => {
      addPair(state.pairMatrix, candidate.roles[roleA], candidate.roles[roleB]);
    });
  }
}

function rollbackAssignment(day, candidate, state) {
  state.assignmentsByDate.delete(day.date);

  Object.values(candidate.roles).forEach((staffIndex) => {
    state.totals[staffIndex] -= 1;
  });

  if (day.type === "saturday") {
    Object.values(candidate.roles).forEach((staffIndex) => {
      state.saturdayTotals[staffIndex] -= 1;
    });
    SATURDAY_PAIR_ROLES.forEach(([roleA, roleB]) => {
      addPair(state.pairMatrix, candidate.roles[roleA], candidate.roles[roleB], -1);
    });
  } else {
    WEEKDAY_ROLES.forEach((role) => {
      state.roleCounts[role][candidate.roles[role]] -= 1;
    });
    WEEKDAY_PAIR_ROLES.forEach(([roleA, roleB]) => {
      addPair(state.pairMatrix, candidate.roles[roleA], candidate.roles[roleB], -1);
    });
  }
}

function addPair(pairMatrix, staffA, staffB, delta = 1) {
  pairMatrix[staffA][staffB] += delta;
  pairMatrix[staffB][staffA] += delta;
}

function evaluateState(state, totalTargets, targetSaturday, weekdayRoleTargets) {
  return evaluateVectors(
    state.totals,
    state.saturdayTotals,
    state.roleCounts,
    state.pairMatrix,
    totalTargets,
    targetSaturday,
    weekdayRoleTargets,
  );
}

function evaluateVectors(totals, saturdayTotals, roleCounts, pairMatrix, totalTargets, targetSaturday, weekdayRoleTargets) {
  const roleMaxDeviation = Math.max(
    ...WEEKDAY_ROLES.flatMap((role) =>
      roleCounts[role].map((value, index) => Math.abs(value - weekdayRoleTargets[role][index])),
    ),
  );
  const roleDeviationScore = WEEKDAY_ROLES.reduce(
    (sum, role) => sum + squaredDeviationFromTargets(roleCounts[role], weekdayRoleTargets[role]),
    0,
  );

  return [
    absoluteDeviationFromTargets(totals, totalTargets),
    squaredDeviationFromTargets(totals, totalTargets),
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

function cloneState(state) {
  return {
    assignmentsByDate: new Map(state.assignmentsByDate),
    totals: [...state.totals],
    saturdayTotals: [...state.saturdayTotals],
    roleCounts: Object.fromEntries(
      WEEKDAY_ROLES.map((role) => [role, [...state.roleCounts[role]]]),
    ),
    pairMatrix: state.pairMatrix.map((row) => [...row]),
  };
}

function cloneSolution(assignmentsByDate, state) {
  return {
    assignmentsByDate: new Map(assignmentsByDate),
    totals: [...state.totals],
    saturdayTotals: [...state.saturdayTotals],
    roleCounts: Object.fromEntries(
      WEEKDAY_ROLES.map((role) => [role, [...state.roleCounts[role]]]),
    ),
    pairMatrix: state.pairMatrix.map((row) => [...row]),
  };
}

function renderResults(result) {
  const { scheduleInfo, staffList } = result;
  const staffNames = staffList.map((staff) => staff.name);

  elements.monthLabel.textContent = `${scheduleInfo.year}年${scheduleInfo.month}月`;
  renderSummaryCards(scheduleInfo, staffList, result);
  renderScheduleTable(scheduleInfo, staffNames, result.assignmentsByDate);
  renderStatsTable(staffList, result);
  renderPairSummary(result.pairMatrix);
  renderPairTable(staffNames, result.pairMatrix);
}

function renderSummaryCards(scheduleInfo, staffList, result) {
  const requiredTotal = getRequiredAssignmentTotal(scheduleInfo);
  const targetTotal = staffList.reduce((sum, staff) => sum + staff.targetCount, 0);
  const totalGap = absoluteDeviationFromTargets(result.totals, staffList.map((staff) => staff.targetCount));
  const saturdayRange = rangeOf(result.saturdayTotals);

  const cards = [
    { label: "稼働日数", value: `${scheduleInfo.workdays.length}日` },
    { label: "必要総勤務枠数", value: `${requiredTotal}枠` },
    { label: "目標合計", value: `${targetTotal}枠` },
    { label: "目標との差合計", value: `${totalGap}` },
    { label: "土曜勤務最大差", value: `${saturdayRange}` },
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

function renderScheduleTable(scheduleInfo, staffNames, assignmentsByDate) {
  const thead = elements.scheduleTable.querySelector("thead");
  const tbody = elements.scheduleTable.querySelector("tbody");

  thead.innerHTML = `
    <tr>
      <th>日付</th>
      <th>曜日</th>
      ${staffNames.map((name) => `<th>${name}</th>`).join("")}
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
    const staffCells = staffNames
      .map((_, staffIndex) => buildScheduleCellContent(day, assignment, staffIndex))
      .join("");

    row.innerHTML = `
      <td>${day.date}</td>
      <td>${WEEKDAY_NAMES[day.weekday]}</td>
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
    const className = isHalfDayCompatibleAssignment(day, assignedRole, state) ? ' class="halfday-shift"' : "";
    return `<td${className}>${assignedRole}</td>`;
  }

  const state = getAvailabilityState(staffIndex, day.date);
  const marker = getAvailabilityMarker(day, state);
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
  for (const role of [...WEEKDAY_ROLES, ...SATURDAY_ROLES]) {
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
      <th>スタッフ</th>
      <th>目標</th>
      <th>実績</th>
      <th>差</th>
      <th>土曜</th>
      <th>AA</th>
      <th>BA</th>
      <th>AP</th>
      <th>BP</th>
    </tr>
  `;

  tbody.innerHTML = staffList
    .map(
      (staff, index) => `
        <tr>
          <td>${staff.name}</td>
          <td>${staff.targetCount}</td>
          <td>${result.totals[index]}</td>
          <td>${formatSignedNumber(result.totals[index] - staff.targetCount)}</td>
          <td>${result.saturdayTotals[index]}</td>
          <td>${result.roleCounts.AA[index]}</td>
          <td>${result.roleCounts.BA[index]}</td>
          <td>${result.roleCounts.AP[index]}</td>
          <td>${result.roleCounts.BP[index]}</td>
        </tr>
      `,
    )
    .join("");
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
      ${staffNames.map((name) => `<th>${name}</th>`).join("")}
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
          <td>${name}</td>
          ${cells}
        </tr>
      `;
    })
    .join("");
}

function clearResults() {
  elements.monthLabel.textContent = "";
  elements.summaryCards.innerHTML = "";
  elements.scheduleTable.querySelector("thead").innerHTML = "";
  elements.scheduleTable.querySelector("tbody").innerHTML = "";
  elements.statsTable.querySelector("thead").innerHTML = "";
  elements.statsTable.querySelector("tbody").innerHTML = "";
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

function handleDownloadCsv() {
  if (!appState.lastResult) {
    setMessage("CSV を出力する前にシフトを生成してください。", "error");
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

  lines.push(["シフト表"]);
  lines.push(["日付", "曜日", "区分", ...staffNames]);

  scheduleInfo.calendarDays.forEach((day) => {
    const assignment = assignmentsByDate.get(day.date) ?? {};
    lines.push([
      `${scheduleInfo.month}/${day.date}`,
      WEEKDAY_NAMES[day.weekday],
      day.type === "weekday" ? "平日" : day.type === "saturday" ? "土曜" : "日曜",
      ...staffNames.map((_, staffIndex) => buildCsvScheduleCell(day, assignment, staffIndex)),
    ]);
  });

  lines.push([]);
  lines.push(["勤務集計"]);
  lines.push(["スタッフ", "目標", "実績", "差", "土曜", "AA", "BA", "AP", "BP"]);
  staffList.forEach((staff, index) => {
    lines.push([
      staff.name,
      staff.targetCount,
      result.totals[index],
      formatSignedNumber(result.totals[index] - staff.targetCount),
      result.saturdayTotals[index],
      result.roleCounts.AA[index],
      result.roleCounts.BA[index],
      result.roleCounts.AP[index],
      result.roleCounts.BP[index],
    ]);
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
    return assignedRole;
  }

  return getAvailabilityMarker(day, getAvailabilityState(staffIndex, day.date));
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

