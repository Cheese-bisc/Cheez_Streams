import { useState, useCallback, useRef } from "react"
import { fetchRaceResults, fetchSprintResults } from "../api/jolpica"

export default function useRaceResults() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sprintError, setSprintError] = useState(null)
  const [raceData, setRaceData] = useState(null)
  const [sprintData, setSprintData] = useState(null)
  const cacheRef = useRef({})

  const fetch = useCallback(async (round, year = 2026) => {
    const key = `${year}-${round}`
    if (cacheRef.current[key]) {
      const cached = cacheRef.current[key]
      setRaceData(cached.raceData)
      setSprintData(cached.sprintData)
      setError(cached.error)
      setSprintError(cached.sprintError)
      return cached
    }

    setLoading(true)
    setError(null)
    setSprintError(null)
    setRaceData(null)
    setSprintData(null)

    const [raceRes, sprintRes] = await Promise.allSettled([
      fetchRaceResults(round, year),
      fetchSprintResults(round, year),
    ])

    const result = {
      raceData: raceRes.status === "fulfilled" ? (raceRes.value ?? null) : null,
      sprintData: sprintRes.status === "fulfilled" ? (sprintRes.value ?? null) : null,
      error: raceRes.status === "rejected" ? raceRes.reason?.message || "Failed to load race results" : null,
      sprintError: sprintRes.status === "rejected" ? sprintRes.reason?.message || "Failed to load sprint results" : null,
    }

    cacheRef.current[key] = result
    setRaceData(result.raceData)
    setSprintData(result.sprintData)
    setError(result.error)
    setSprintError(result.sprintError)
    setLoading(false)
    return result
  }, [])

  const clear = useCallback(() => {
    setRaceData(null)
    setSprintData(null)
    setError(null)
    setSprintError(null)
    setLoading(false)
  }, [])

  return { raceData, sprintData, loading, error, sprintError, fetch, clear }
}
