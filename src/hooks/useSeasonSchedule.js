import { useState, useEffect, useRef } from "react"
import { fetchSeasonSchedule } from "../api/jolpica"
import { getCalendar } from "../data/calendars"

const CACHE_PREFIX = "cheez_schedule_"
const CACHE_TTL_MS = 6 * 60 * 60 * 1000 // 6 hours — session times rarely change mid-week

function readCache(year) {
  try {
    const raw = localStorage.getItem(`${CACHE_PREFIX}${year}`)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed.races) || !parsed.races.length || !parsed.fetchedAt) return null
    return parsed
  } catch {
    return null
  }
}

function writeCache(year, races) {
  try {
    localStorage.setItem(
      `${CACHE_PREFIX}${year}`,
      JSON.stringify({ races, fetchedAt: Date.now() }),
    )
  } catch {
    // localStorage unavailable/full — fine, we just refetch next time
  }
}

// Serves race schedule data for a given season. Always returns something
// synchronously (cached API data, or the hardcoded calendar as a last resort)
// so the UI never has to sit on a blank/loading state, then quietly checks
// the Jolpica API in the background and upgrades to fresh data when it can.
export default function useSeasonSchedule(year) {
  const cached = readCache(year)
  const [races, setRaces] = useState(cached?.races ?? getCalendar(year))
  const [source, setSource] = useState(cached ? "cache" : "fallback")
  const [loading, setLoading] = useState(true)
  const requestId = useRef(0)

  useEffect(() => {
    let cancelled = false
    const id = ++requestId.current

    const cachedNow = readCache(year)
    if (cachedNow) {
      setRaces(cachedNow.races)
      setSource("cache")
    } else {
      setRaces(getCalendar(year))
      setSource("fallback")
    }

    const isFresh = cachedNow && Date.now() - cachedNow.fetchedAt < CACHE_TTL_MS
    if (isFresh) {
      setLoading(false)
      return
    }

    setLoading(true)
    fetchSeasonSchedule(year).then((apiRaces) => {
      if (cancelled || requestId.current !== id) return
      if (apiRaces && apiRaces.length > 0) {
        setRaces(apiRaces)
        setSource("api")
        writeCache(year, apiRaces)
      }
      // API failed or returned nothing — keep whatever fallback/cache we already set above
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [year])

  return { races, loading, source }
}
