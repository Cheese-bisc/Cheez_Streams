import {
  CALENDAR_2025,
  isSprintWeekend as isSprintWeekend2025,
} from "./calendar2025";
import {
  CALENDAR_2026,
  isSprintWeekend as isSprintWeekend2026,
} from "./calendar2026";

const SEASON_SPRINT_CHECK = {
  2025: isSprintWeekend2025,
  2026: isSprintWeekend2026,
};

export const CALENDARS = {
  2025: CALENDAR_2025,
  2026: CALENDAR_2026,
};

export const AVAILABLE_SEASONS = Object.keys(CALENDARS)
  .map(Number)
  .sort((a, b) => b - a);
// Result: [2026, 2025]

export function getCalendar(year) {
  return CALENDARS[year] || [];
}

export function isSprintWeekend(year, round) {
  const check = SEASON_SPRINT_CHECK[year];
  if (!check) return false;
  return check(round);
}
