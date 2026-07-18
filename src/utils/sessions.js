// Shared across both hardcoded calendar data and live API schedule data.
// Any race object with { fp1, fp2, fp3, quali, sprintQuali, sprint, raceDate, raceTime }
// (each session as { date, time } in UTC, time WITHOUT a trailing "Z") works here —
// it doesn't matter whether the race came from calendar2025/2026.js or the Jolpica API.

export function getAllSessions(race) {
  if (!race) return []

  const sessions = []
  const add = (key, label) => {
    const s = race[key]
    if (s) {
      sessions.push({
        ...s,
        sessionName: label,
        raceName: race.name,
        round: race.round,
        circuit: race.circuit,
        dateTime: `${s.date}T${s.time}Z`,
      })
    }
  }

  if (race.fp1) add("fp1", "FP1")
  if (race.fp2) add("fp2", "FP2")
  if (race.fp3) add("fp3", "FP3")
  if (race.sprintQuali) add("sprintQuali", "Sprint Qualifying")
  if (race.quali) add("quali", "Qualifying")
  if (race.sprint) add("sprint", "Sprint")
  if (race.raceDate && race.raceTime) {
    sessions.push({
      date: race.raceDate,
      time: race.raceTime,
      sessionName: "Race",
      raceName: race.name,
      round: race.round,
      circuit: race.circuit,
      dateTime: `${race.raceDate}T${race.raceTime}Z`,
    })
  }

  return sessions.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
}

// A race is a sprint weekend if the schedule actually contains a Sprint session —
// works for both hardcoded and API data, no separate round-number list to maintain.
export function isSprintRace(race) {
  return !!race?.sprint
}
