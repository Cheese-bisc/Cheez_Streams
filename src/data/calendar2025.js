const sprintRounds = new Set([2, 6, 13, 19, 21, 23]);

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

// 2025 FIA Formula 1 World Championship Calendar
// 24 races. Sprint weekends: China (R2), Miami (R6), Belgium (R13), USA (R19), Brazil (R21), Qatar (R23)

export const CALENDAR_2025 = [
  // Round 1: Australian Grand Prix — Standard
  makeRace(
    1,
    "Australian Grand Prix",
    "Albert Park Circuit",
    "Melbourne",
    "2025-03-16",
    "05:00:00",
    { date: "2025-03-14", time: "01:30:00" },
    { date: "2025-03-14", time: "05:00:00" },
    { date: "2025-03-15", time: "01:30:00" },
    { date: "2025-03-15", time: "05:00:00" },
  ),

  // Round 2: Chinese Grand Prix — SPRINT
  makeRace(
    2,
    "Chinese Grand Prix",
    "Shanghai International Circuit",
    "Shanghai",
    "2025-03-23",
    "07:00:00",
    { date: "2025-03-21", time: "03:30:00" },
    null,
    null,
    null,
    { date: "2025-03-21", time: "07:30:00" },
    { date: "2025-03-22", time: "03:00:00" },
  ),

  // Round 3: Japanese Grand Prix — Standard
  makeRace(
    3,
    "Japanese Grand Prix",
    "Suzuka Circuit",
    "Suzuka",
    "2025-04-06",
    "06:00:00",
    { date: "2025-04-04", time: "03:30:00" },
    { date: "2025-04-04", time: "07:00:00" },
    { date: "2025-04-05", time: "03:30:00" },
    { date: "2025-04-05", time: "07:00:00" },
  ),

  // Round 4: Bahrain Grand Prix — Standard
  makeRace(
    4,
    "Bahrain Grand Prix",
    "Bahrain International Circuit",
    "Sakhir",
    "2025-04-13",
    "15:00:00",
    { date: "2025-04-11", time: "11:30:00" },
    { date: "2025-04-11", time: "15:00:00" },
    { date: "2025-04-12", time: "11:30:00" },
    { date: "2025-04-12", time: "15:00:00" },
  ),

  // Round 5: Saudi Arabian Grand Prix — Standard
  makeRace(
    5,
    "Saudi Arabian Grand Prix",
    "Jeddah Corniche Circuit",
    "Jeddah",
    "2025-04-20",
    "17:00:00",
    { date: "2025-04-18", time: "13:30:00" },
    { date: "2025-04-18", time: "17:00:00" },
    { date: "2025-04-19", time: "13:30:00" },
    { date: "2025-04-19", time: "17:00:00" },
  ),

  // Round 6: Miami Grand Prix — SPRINT
  makeRace(
    6,
    "Miami Grand Prix",
    "Miami International Autodrome",
    "Miami",
    "2025-05-04",
    "20:00:00",
    { date: "2025-05-02", time: "16:30:00" },
    null,
    null,
    null,
    { date: "2025-05-02", time: "20:30:00" },
    { date: "2025-05-03", time: "16:00:00" },
  ),

  // Round 7: Emilia Romagna Grand Prix — Standard
  makeRace(
    7,
    "Emilia Romagna Grand Prix",
    "Imola Circuit",
    "Imola",
    "2025-05-18",
    "15:00:00",
    { date: "2025-05-16", time: "11:30:00" },
    { date: "2025-05-16", time: "15:00:00" },
    { date: "2025-05-17", time: "11:30:00" },
    { date: "2025-05-17", time: "15:00:00" },
  ),

  // Round 8: Monaco Grand Prix — Standard
  makeRace(
    8,
    "Monaco Grand Prix",
    "Circuit de Monaco",
    "Monaco",
    "2025-05-25",
    "13:00:00",
    { date: "2025-05-23", time: "09:30:00" },
    { date: "2025-05-23", time: "13:00:00" },
    { date: "2025-05-24", time: "09:30:00" },
    { date: "2025-05-24", time: "13:00:00" },
  ),

  // Round 9: Spanish Grand Prix — Standard
  makeRace(
    9,
    "Spanish Grand Prix",
    "Circuit de Barcelona-Catalunya",
    "Barcelona",
    "2025-06-01",
    "15:00:00",
    { date: "2025-05-30", time: "11:30:00" },
    { date: "2025-05-30", time: "15:00:00" },
    { date: "2025-05-31", time: "11:30:00" },
    { date: "2025-05-31", time: "15:00:00" },
  ),

  // Round 10: Canadian Grand Prix — Standard
  makeRace(
    10,
    "Canadian Grand Prix",
    "Circuit Gilles Villeneuve",
    "Montreal",
    "2025-06-15",
    "18:00:00",
    { date: "2025-06-13", time: "14:30:00" },
    { date: "2025-06-13", time: "18:00:00" },
    { date: "2025-06-14", time: "14:30:00" },
    { date: "2025-06-14", time: "18:00:00" },
  ),

  // Round 11: Austrian Grand Prix — Standard
  makeRace(
    11,
    "Austrian Grand Prix",
    "Red Bull Ring",
    "Spielberg",
    "2025-06-29",
    "15:00:00",
    { date: "2025-06-27", time: "11:30:00" },
    { date: "2025-06-27", time: "15:00:00" },
    { date: "2025-06-28", time: "11:30:00" },
    { date: "2025-06-28", time: "15:00:00" },
  ),

  // Round 12: British Grand Prix — Standard
  makeRace(
    12,
    "British Grand Prix",
    "Silverstone Circuit",
    "Silverstone",
    "2025-07-06",
    "14:00:00",
    { date: "2025-07-04", time: "10:30:00" },
    { date: "2025-07-04", time: "14:00:00" },
    { date: "2025-07-05", time: "10:30:00" },
    { date: "2025-07-05", time: "14:00:00" },
  ),

  // Round 13: Belgian Grand Prix — SPRINT
  makeRace(
    13,
    "Belgian Grand Prix",
    "Circuit de Spa-Francorchamps",
    "Spa",
    "2025-07-27",
    "15:00:00",
    { date: "2025-07-25", time: "11:30:00" },
    null,
    null,
    null,
    { date: "2025-07-25", time: "15:30:00" },
    { date: "2025-07-26", time: "11:00:00" },
  ),

  // Round 14: Hungarian Grand Prix — Standard
  makeRace(
    14,
    "Hungarian Grand Prix",
    "Hungaroring",
    "Budapest",
    "2025-08-03",
    "15:00:00",
    { date: "2025-08-01", time: "11:30:00" },
    { date: "2025-08-01", time: "15:00:00" },
    { date: "2025-08-02", time: "11:30:00" },
    { date: "2025-08-02", time: "15:00:00" },
  ),

  // Round 15: Dutch Grand Prix — Standard
  makeRace(
    15,
    "Dutch Grand Prix",
    "Circuit Zandvoort",
    "Zandvoort",
    "2025-08-31",
    "15:00:00",
    { date: "2025-08-29", time: "11:30:00" },
    { date: "2025-08-29", time: "15:00:00" },
    { date: "2025-08-30", time: "11:30:00" },
    { date: "2025-08-30", time: "15:00:00" },
  ),

  // Round 16: Italian Grand Prix — Standard
  makeRace(
    16,
    "Italian Grand Prix",
    "Monza Circuit",
    "Monza",
    "2025-09-07",
    "15:00:00",
    { date: "2025-09-05", time: "11:30:00" },
    { date: "2025-09-05", time: "15:00:00" },
    { date: "2025-09-06", time: "11:30:00" },
    { date: "2025-09-06", time: "15:00:00" },
  ),

  // Round 17: Azerbaijan Grand Prix — Standard
  makeRace(
    17,
    "Azerbaijan Grand Prix",
    "Baku City Circuit",
    "Baku",
    "2025-09-21",
    "11:00:00",
    { date: "2025-09-19", time: "07:30:00" },
    { date: "2025-09-19", time: "11:00:00" },
    { date: "2025-09-20", time: "07:30:00" },
    { date: "2025-09-20", time: "11:00:00" },
  ),

  // Round 18: Singapore Grand Prix — Standard
  makeRace(
    18,
    "Singapore Grand Prix",
    "Marina Bay Street Circuit",
    "Singapore",
    "2025-10-05",
    "12:00:00",
    { date: "2025-10-03", time: "08:30:00" },
    { date: "2025-10-03", time: "12:00:00" },
    { date: "2025-10-04", time: "08:30:00" },
    { date: "2025-10-04", time: "12:00:00" },
  ),

  // Round 19: United States Grand Prix — SPRINT
  makeRace(
    19,
    "United States Grand Prix",
    "Circuit of the Americas",
    "Austin",
    "2025-10-19",
    "19:00:00",
    { date: "2025-10-17", time: "15:30:00" },
    null,
    null,
    null,
    { date: "2025-10-17", time: "19:30:00" },
    { date: "2025-10-18", time: "15:00:00" },
  ),

  // Round 20: Mexico City Grand Prix — Standard
  makeRace(
    20,
    "Mexico City Grand Prix",
    "Autodromo Hermanos Rodriguez",
    "Mexico City",
    "2025-10-26",
    "20:00:00",
    { date: "2025-10-24", time: "16:30:00" },
    { date: "2025-10-24", time: "20:00:00" },
    { date: "2025-10-25", time: "16:30:00" },
    { date: "2025-10-25", time: "20:00:00" },
  ),

  // Round 21: São Paulo Grand Prix — SPRINT
  makeRace(
    21,
    "São Paulo Grand Prix",
    "Interlagos Circuit",
    "São Paulo",
    "2025-11-09",
    "17:00:00",
    { date: "2025-11-07", time: "13:30:00" },
    null,
    null,
    null,
    { date: "2025-11-07", time: "17:30:00" },
    { date: "2025-11-08", time: "13:00:00" },
  ),

  // Round 22: Las Vegas Grand Prix — Standard
  makeRace(
    22,
    "Las Vegas Grand Prix",
    "Las Vegas Strip Circuit",
    "Las Vegas",
    "2025-11-22",
    "06:00:00",
    { date: "2025-11-20", time: "02:30:00" },
    { date: "2025-11-20", time: "06:00:00" },
    { date: "2025-11-21", time: "02:30:00" },
    { date: "2025-11-21", time: "06:00:00" },
  ),

  // Round 23: Qatar Grand Prix — SPRINT
  makeRace(
    23,
    "Qatar Grand Prix",
    "Lusail International Circuit",
    "Lusail",
    "2025-11-30",
    "16:00:00",
    { date: "2025-11-28", time: "12:30:00" },
    null,
    null,
    null,
    { date: "2025-11-28", time: "16:30:00" },
    { date: "2025-11-29", time: "12:00:00" },
  ),

  // Round 24: Abu Dhabi Grand Prix — Standard
  makeRace(
    24,
    "Abu Dhabi Grand Prix",
    "Yas Marina Circuit",
    "Abu Dhabi",
    "2025-12-07",
    "14:00:00",
    { date: "2025-12-05", time: "10:30:00" },
    { date: "2025-12-05", time: "14:00:00" },
    { date: "2025-12-06", time: "10:30:00" },
    { date: "2025-12-06", time: "14:00:00" },
  ),
];

export { getAllSessions } from "../utils/sessions";

export function isSprintWeekend(round) {
  return sprintRounds.has(round);
}
