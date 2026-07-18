const BASE = "https://api.jolpi.ca/ergast/f1"

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function fetchDriverStandings() {
  try {
    const json = await fetchJson(`${BASE}/current/driverStandings.json`)
    return json.MRData.StandingsTable.StandingsLists[0]?.DriverStandings ?? null
  } catch (err) {
    console.error("Failed to fetch driver standings:", err)
    return null
  }
}

export async function fetchConstructorStandings() {
  try {
    const json = await fetchJson(`${BASE}/current/constructorStandings.json`)
    return json.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings ?? null
  } catch (err) {
    console.error("Failed to fetch constructor standings:", err)
    return null
  }
}

export async function fetchRaceResults(round, year = "current") {
  try {
    const json = await fetchJson(`${BASE}/${year}/${round}/results.json`)
    return json.MRData.RaceTable.Races[0] ?? null
  } catch (err) {
    console.error(`Failed to fetch race results for ${year}/${round}:`, err)
    return null
  }
}

export async function fetchSprintResults(round, year = "current") {
  try {
    const json = await fetchJson(`${BASE}/${year}/${round}/sprint.json`)
    return json.MRData.RaceTable.Races[0] ?? null
  } catch (err) {
    console.error(`Failed to fetch sprint results for ${year}/${round}:`, err)
    return null
  }
}

export async function fetchQualifyingResults(round, year = "current") {
  try {
    const json = await fetchJson(`${BASE}/${year}/${round}/qualifying.json`)
    return json.MRData.RaceTable.Races[0] ?? null
  } catch (err) {
    console.error(`Failed to fetch qualifying results for ${year}/${round}:`, err)
    return null
  }
}

// Turns a single Jolpica/Ergast "session" object ({ date, time: "14:00:00Z" })
// into our internal shape ({ date, time: "14:00:00" }) — the "Z" is added back
// by getAllSessions() when it builds the combined dateTime, so it must not be
// present here or the timestamp becomes "...00:00:00ZZ" and fails to parse.
function mapSession(session) {
  if (!session?.date || !session?.time) return null
  return { date: session.date, time: session.time.replace("Z", "") }
}

// Maps one Ergast-shaped race (from /races.json) into the same object shape
// that makeRace() produces in src/data/calendar2025.js / calendar2026.js, so
// every existing consumer (getAllSessions, ArchivePage, RaceDetailPage, etc.)
// works identically regardless of whether the data came from the API or the
// hardcoded fallback file.
function mapRace(race) {
  return {
    round: Number(race.round),
    name: race.raceName,
    circuit: race.Circuit?.circuitName ?? "",
    location: race.Circuit?.Location?.locality ?? "",
    raceDate: race.date,
    raceTime: (race.time ?? "00:00:00Z").replace("Z", ""),
    fp1: mapSession(race.FirstPractice),
    fp2: mapSession(race.SecondPractice),
    fp3: mapSession(race.ThirdPractice),
    quali: mapSession(race.Qualifying),
    sprintQuali: mapSession(race.SprintQualifying),
    sprint: mapSession(race.Sprint),
  }
}

// Fetches the full season schedule (every round, every session time) straight
// from the officially-sourced Jolpica data instead of hand-typed UTC times.
// Returns null on failure so callers can fall back to cached/hardcoded data.
export async function fetchSeasonSchedule(year) {
  try {
    const json = await fetchJson(`${BASE}/${year}/races.json?limit=40`)
    const races = json.MRData?.RaceTable?.Races ?? []
    if (races.length === 0) return null
    return races.map(mapRace).sort((a, b) => a.round - b.round)
  } catch (err) {
    console.error(`Failed to fetch ${year} season schedule:`, err)
    return null
  }
}
