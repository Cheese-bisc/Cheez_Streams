const sprintRounds = new Set([2, 4, 5, 9, 12, 16]);

function session(date, time) {
  if (!date || !time) return null;
  return { date, time };
}

function makeRace(
  round,
  name,
  circuit,
  location,
  raceDate,
  raceTime,
  fp1,
  fp2,
  fp3,
  quali,
  sprintQuali,
  sprint,
) {
  const isSprint = sprintRounds.has(round);
  return {
    round,
    name,
    circuit,
    location,
    raceDate,
    raceTime,
    fp1: session(fp1?.date, fp1?.time),
    fp2: isSprint ? null : session(fp2?.date, fp2?.time),
    fp3: isSprint ? null : session(fp3?.date, fp3?.time),
    quali: isSprint ? null : session(quali?.date, quali?.time),
    sprintQuali: isSprint
      ? session(sprintQuali?.date, sprintQuali?.time)
      : null,
    sprint: isSprint ? session(sprint?.date, sprint?.time) : null,
  };
}

export const CALENDAR_2026 = [
  // Round 1: Australian Grand Prix — Standard
  makeRace(
    1,
    "Australian Grand Prix",
    "Albert Park Circuit",
    "Melbourne",
    "2026-03-08",
    "05:00:00",
    { date: "2026-03-06", time: "01:30:00" },
    { date: "2026-03-06", time: "05:00:00" },
    { date: "2026-03-07", time: "01:30:00" },
    { date: "2026-03-07", time: "05:00:00" },
  ),

  // Round 2: Chinese Grand Prix — SPRINT
  makeRace(
    2,
    "Chinese Grand Prix",
    "Shanghai International Circuit",
    "Shanghai",
    "2026-03-15",
    "07:00:00",
    { date: "2026-03-13", time: "03:30:00" },
    null,
    null,
    null,
    { date: "2026-03-13", time: "07:30:00" },
    { date: "2026-03-14", time: "03:00:00" },
  ),

  // Round 3: Japanese Grand Prix — Standard
  makeRace(
    3,
    "Japanese Grand Prix",
    "Suzuka International Racing Course",
    "Suzuka",
    "2026-03-29",
    "06:00:00",
    { date: "2026-03-27", time: "03:30:00" },
    { date: "2026-03-27", time: "07:00:00" },
    { date: "2026-03-28", time: "03:30:00" },
    { date: "2026-03-28", time: "07:00:00" },
  ),

  // Round 4: Miami Grand Prix — SPRINT
  makeRace(
    4,
    "Miami Grand Prix",
    "Miami International Autodrome",
    "Miami",
    "2026-05-03",
    "20:00:00",
    { date: "2026-05-01", time: "16:30:00" },
    null,
    null,
    null,
    { date: "2026-05-01", time: "20:30:00" },
    { date: "2026-05-02", time: "16:00:00" },
  ),

  // Round 5: Canadian Grand Prix — SPRINT
  makeRace(
    5,
    "Canadian Grand Prix",
    "Circuit Gilles Villeneuve",
    "Montreal",
    "2026-05-24",
    "18:00:00",
    { date: "2026-05-22", time: "14:30:00" },
    null,
    null,
    null,
    { date: "2026-05-22", time: "18:30:00" },
    { date: "2026-05-23", time: "14:00:00" },
  ),

  // Round 6: Monaco Grand Prix — Standard
  makeRace(
    6,
    "Monaco Grand Prix",
    "Circuit de Monaco",
    "Monte Carlo",
    "2026-06-07",
    "13:00:00",
    { date: "2026-06-05", time: "09:30:00" },
    { date: "2026-06-05", time: "13:00:00" },
    { date: "2026-06-06", time: "09:30:00" },
    { date: "2026-06-06", time: "13:00:00" },
  ),

  // Round 7: Barcelona-Catalunya Grand Prix — Standard
  makeRace(
    7,
    "Barcelona-Catalunya Grand Prix",
    "Circuit de Barcelona-Catalunya",
    "Barcelona",
    "2026-06-14",
    "15:00:00",
    { date: "2026-06-12", time: "11:30:00" },
    { date: "2026-06-12", time: "15:00:00" },
    { date: "2026-06-13", time: "11:30:00" },
    { date: "2026-06-13", time: "15:00:00" },
  ),

  // Round 8: Austrian Grand Prix — Standard
  makeRace(
    8,
    "Austrian Grand Prix",
    "Red Bull Ring",
    "Spielberg",
    "2026-06-28",
    "15:00:00",
    { date: "2026-06-26", time: "11:30:00" },
    { date: "2026-06-26", time: "15:00:00" },
    { date: "2026-06-27", time: "11:30:00" },
    { date: "2026-06-27", time: "15:00:00" },
  ),

  // Round 9: British Grand Prix — SPRINT
  makeRace(
    9,
    "British Grand Prix",
    "Silverstone Circuit",
    "Silverstone",
    "2026-07-05",
    "14:00:00",
    { date: "2026-07-03", time: "10:30:00" },
    null,
    null,
    null,
    { date: "2026-07-03", time: "14:30:00" },
    { date: "2026-07-04", time: "10:00:00" },
  ),

  // Round 10: Belgian Grand Prix — Standard
  makeRace(
    10,
    "Belgian Grand Prix",
    "Circuit de Spa-Francorchamps",
    "Spa",
    "2026-07-19",
    "15:00:00",
    { date: "2026-07-17", time: "11:30:00" },
    { date: "2026-07-17", time: "15:00:00" },
    { date: "2026-07-18", time: "10:30:00" },
    { date: "2026-07-18", time: "14:00:00" },
  ),

  // Round 11: Hungarian Grand Prix — Standard
  makeRace(
    11,
    "Hungarian Grand Prix",
    "Hungaroring",
    "Budapest",
    "2026-07-26",
    "15:00:00",
    { date: "2026-07-24", time: "11:30:00" },
    { date: "2026-07-24", time: "15:00:00" },
    { date: "2026-07-25", time: "11:30:00" },
    { date: "2026-07-25", time: "15:00:00" },
  ),

  // Round 12: Dutch Grand Prix — SPRINT
  makeRace(
    12,
    "Dutch Grand Prix",
    "Circuit Zandvoort",
    "Zandvoort",
    "2026-08-23",
    "15:00:00",
    { date: "2026-08-21", time: "10:30:00" },
    null,
    null,
    null,
    { date: "2026-08-21", time: "14:30:00" },
    { date: "2026-08-22", time: "10:00:00" },
  ),

  // Round 13: Italian Grand Prix — Standard
  makeRace(
    13,
    "Italian Grand Prix",
    "Monza Circuit",
    "Monza",
    "2026-09-06",
    "15:00:00",
    { date: "2026-09-04", time: "11:30:00" },
    { date: "2026-09-04", time: "15:00:00" },
    { date: "2026-09-05", time: "11:30:00" },
    { date: "2026-09-05", time: "15:00:00" },
  ),

  // Round 14: Spanish Grand Prix (Madrid) — Standard
  makeRace(
    14,
    "Spanish Grand Prix",
    "Madring",
    "Madrid",
    "2026-09-13",
    "15:00:00",
    { date: "2026-09-11", time: "11:30:00" },
    { date: "2026-09-11", time: "15:00:00" },
    { date: "2026-09-12", time: "11:30:00" },
    { date: "2026-09-12", time: "15:00:00" },
  ),

  // Round 15: Azerbaijan Grand Prix — Standard
  makeRace(
    15,
    "Azerbaijan Grand Prix",
    "Baku City Circuit",
    "Baku",
    "2026-09-26",
    "11:00:00",
    { date: "2026-09-24", time: "07:30:00" },
    { date: "2026-09-24", time: "11:00:00" },
    { date: "2026-09-25", time: "07:30:00" },
    { date: "2026-09-25", time: "11:00:00" },
  ),

  // Round 16: Singapore Grand Prix — SPRINT
  makeRace(
    16,
    "Singapore Grand Prix",
    "Marina Bay Street Circuit",
    "Singapore",
    "2026-10-11",
    "12:00:00",
    { date: "2026-10-09", time: "08:30:00" },
    null,
    null,
    null,
    { date: "2026-10-09", time: "12:30:00" },
    { date: "2026-10-10", time: "08:00:00" },
  ),

  // Round 17: United States Grand Prix — Standard
  makeRace(
    17,
    "United States Grand Prix",
    "Circuit of the Americas",
    "Austin",
    "2026-10-25",
    "19:00:00",
    { date: "2026-10-23", time: "15:30:00" },
    { date: "2026-10-23", time: "19:00:00" },
    { date: "2026-10-24", time: "15:30:00" },
    { date: "2026-10-24", time: "19:00:00" },
  ),

  // Round 18: Mexico City Grand Prix — Standard
  makeRace(
    18,
    "Mexico City Grand Prix",
    "Autodromo Hermanos Rodriguez",
    "Mexico City",
    "2026-11-01",
    "20:00:00",
    { date: "2026-10-30", time: "16:30:00" },
    { date: "2026-10-30", time: "20:00:00" },
    { date: "2026-10-31", time: "16:30:00" },
    { date: "2026-10-31", time: "20:00:00" },
  ),

  // Round 19: São Paulo Grand Prix — Standard
  makeRace(
    19,
    "São Paulo Grand Prix",
    "Interlagos Circuit",
    "São Paulo",
    "2026-11-08",
    "17:00:00",
    { date: "2026-11-06", time: "13:30:00" },
    { date: "2026-11-06", time: "17:00:00" },
    { date: "2026-11-07", time: "13:30:00" },
    { date: "2026-11-07", time: "17:00:00" },
  ),

  // Round 20: Las Vegas Grand Prix — Standard
  makeRace(
    20,
    "Las Vegas Grand Prix",
    "Las Vegas Strip Circuit",
    "Las Vegas",
    "2026-11-21",
    "06:00:00",
    { date: "2026-11-19", time: "02:30:00" },
    { date: "2026-11-19", time: "06:00:00" },
    { date: "2026-11-20", time: "02:30:00" },
    { date: "2026-11-20", time: "06:00:00" },
  ),

  // Round 21: Qatar Grand Prix — Standard
  makeRace(
    21,
    "Qatar Grand Prix",
    "Lusail International Circuit",
    "Lusail",
    "2026-11-29",
    "16:00:00",
    { date: "2026-11-27", time: "12:30:00" },
    { date: "2026-11-27", time: "16:00:00" },
    { date: "2026-11-28", time: "13:30:00" },
    { date: "2026-11-28", time: "17:00:00" },
  ),

  // Round 22: Abu Dhabi Grand Prix — Standard
  makeRace(
    22,
    "Abu Dhabi Grand Prix",
    "Yas Marina Circuit",
    "Abu Dhabi",
    "2026-12-06",
    "14:00:00",
    { date: "2026-12-04", time: "10:30:00" },
    { date: "2026-12-04", time: "14:00:00" },
    { date: "2026-12-05", time: "10:30:00" },
    { date: "2026-12-05", time: "14:00:00" },
  ),
];

export { getAllSessions } from "../utils/sessions";

export function isSprintWeekend(round) {
  return sprintRounds.has(round);
}
