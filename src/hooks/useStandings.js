import { useState, useEffect, useCallback, useRef } from "react"
import { fetchDriverStandings, fetchConstructorStandings } from "../api/jolpica"

const CACHE_DURATION = 60 * 60 * 1000

export default function useStandings() {
  const [wdc, setWdc] = useState([])
  const [wcc, setWcc] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const lastFetchRef = useRef(0)

  const fetch = useCallback(async (force) => {
    const now = Date.now()
    if (!force && now - lastFetchRef.current < CACHE_DURATION) return

    setLoading(true)
    setError(null)

    try {
      const [driverData, constructorData] = await Promise.all([
        fetchDriverStandings(),
        fetchConstructorStandings(),
      ])

      if (!driverData || !constructorData) {
        throw new Error("Failed to fetch standings data")
      }

      setWdc(driverData)
      setWcc(constructorData)
      lastFetchRef.current = now
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch(true)
  }, [fetch])

  return { wdc, wcc, loading, error, refresh: () => fetch(true) }
}
