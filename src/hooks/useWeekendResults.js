import { useState, useEffect, useCallback } from "react"
import { getAllSessions } from "../utils/sessions"
import useSeasonSchedule from "./useSeasonSchedule"
import { fetchRaceResults, fetchSprintResults, fetchQualifyingResults } from "../api/jolpica"

const SESSION_ORDER = ["FP1", "FP2", "FP3", "Sprint Qualifying", "Sprint", "Qualifying", "Race"]
const SESSION_DURATION_MS = 2.5 * 60 * 60 * 1000

function getSessionEnd(session) {
  const start = new Date(session.dateTime)
  return new Date(start.getTime() + SESSION_DURATION_MS)
}

function getWeekendSessions(race) {
  const sessions = getAllSessions(race)
  sessions.sort((a, b) => SESSION_ORDER.indexOf(a.sessionName) - SESSION_ORDER.indexOf(b.sessionName))
  return sessions
}

export default function useWeekendResults() {
  const year = new Date().getFullYear()
  const { races } = useSeasonSchedule(year)
  const [currentRound, setCurrentRound] = useState(null)
  const [currentRaceWeekend, setCurrentRaceWeekend] = useState(null)
  const [lastCompletedSession, setLastCompletedSession] = useState(null)
  const [nextSessionInWeekend, setNextSessionInWeekend] = useState(null)
  const [sessionResults, setSessionResults] = useState(null)
  const [sessionType, setSessionType] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isBeforeSeason, setIsBeforeSeason] = useState(false)
  const [isAfterSeason, setIsAfterSeason] = useState(false)
  const [seasonStartDate, setSeasonStartDate] = useState(null)

  const fetchResults = useCallback(async (race, completedSession, type) => {
    setLoading(true)
    setError(null)
    setSessionType(type)

    if (!type) {
      setSessionResults(null)
      setLoading(false)
      return
    }

    try {
      let results = null
      if (type === "race") {
        results = await fetchRaceResults(race.round)
      } else if (type === "sprint") {
        results = await fetchSprintResults(race.round)
      } else if (type === "qualifying") {
        results = await fetchQualifyingResults(race.round)
      }
      setSessionResults(results)
    } catch (err) {
      setError(err.message)
      setSessionResults(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const compute = useCallback(() => {
    if (!races || races.length === 0) return

    const now = new Date()

    const firstRace = races[0]
    const lastRace = races[races.length - 1]

    const firstSessions = getAllSessions(firstRace)
    const seasonStart = firstSessions.length > 0 ? new Date(firstSessions[0].dateTime) : null
    setSeasonStartDate(seasonStart)

    const lastRaceEnd = lastRace
      ? new Date(`${lastRace.raceDate}T${lastRace.raceTime}Z`).getTime() + SESSION_DURATION_MS
      : 0

    if (seasonStart && now < seasonStart) {
      setIsBeforeSeason(true)
      setIsAfterSeason(false)
      setCurrentRaceWeekend(null)
      setCurrentRound(null)
      setLastCompletedSession(null)
      setNextSessionInWeekend(firstSessions[0] || null)
      return
    }

    if (now.getTime() > lastRaceEnd) {
      setIsAfterSeason(true)
      setIsBeforeSeason(false)
      setCurrentRaceWeekend(lastRace)
      setCurrentRound(lastRace.round)
      setLastCompletedSession(null)
      setNextSessionInWeekend(null)
      return
    }

    setIsBeforeSeason(false)
    setIsAfterSeason(false)

    let activeRace = null
    let completedRace = null
    let lastCompletedRaceEnd = 0

    for (const race of races) {
      const sessions = getWeekendSessions(race)
      if (sessions.length === 0) continue

      const firstSessionStart = new Date(sessions[0].dateTime)
      const raceSession = sessions.find(s => s.sessionName === "Race") || sessions[sessions.length - 1]
      const weekendEnd = getSessionEnd(raceSession)

      if (now >= firstSessionStart && now < weekendEnd) {
        activeRace = race
        break
      }

      if (weekendEnd < now && weekendEnd > lastCompletedRaceEnd) {
        completedRace = race
        lastCompletedRaceEnd = weekendEnd
      }
    }

    const targetRace = activeRace || completedRace

    if (!targetRace) {
      setCurrentRaceWeekend(null)
      setCurrentRound(null)
      setLastCompletedSession(null)
      setNextSessionInWeekend(null)
      return
    }

    setCurrentRaceWeekend(targetRace)
    setCurrentRound(targetRace.round)

    const sessions = getWeekendSessions(targetRace)
    let lastCompleted = null
    let nextUpcoming = null

    for (const s of sessions) {
      const end = getSessionEnd(s)
      if (end < now) {
        lastCompleted = s
      } else if (!nextUpcoming && new Date(s.dateTime) > now) {
        nextUpcoming = s
        break
      }
    }

    setLastCompletedSession(lastCompleted)
    setNextSessionInWeekend(nextUpcoming)

    if (lastCompleted) {
      const name = lastCompleted.sessionName
      if (name === "Race") {
        fetchResults(targetRace, lastCompleted, "race")
      } else if (name === "Sprint") {
        fetchResults(targetRace, lastCompleted, "sprint")
      } else if (name === "Qualifying" || name === "Sprint Qualifying") {
        fetchResults(targetRace, lastCompleted, "qualifying")
      } else {
        setSessionType("practice")
        setSessionResults(null)
      }
    } else {
      setSessionType(null)
      setSessionResults(null)
    }
  }, [fetchResults, races])

  useEffect(() => {
    compute()
    const interval = setInterval(compute, 30_000)
    return () => clearInterval(interval)
  }, [compute])

  return {
    currentRound,
    currentRaceWeekend,
    lastCompletedSession,
    nextSessionInWeekend,
    sessionResults,
    sessionType,
    loading,
    error,
    isBeforeSeason,
    isAfterSeason,
    seasonStartDate,
  }
}
