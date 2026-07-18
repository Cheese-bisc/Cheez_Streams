import { useState, useEffect, useRef } from "react"
import { fetchSessions } from "../api/openf1"

const POLL_INTERVAL = 60_000

export default function useLiveSession() {
  const [currentSession, setCurrentSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const intervalRef = useRef(null)

  useEffect(() => {
    async function check() {
      try {
        const sessions = await fetchSessions(2026)
        if (!sessions) return

        const now = new Date()
        const active = sessions.find((s) => {
          const start = new Date(s.date_start)
          const end = s.date_end ? new Date(s.date_end) : new Date(start.getTime() + 2 * 60 * 60 * 1000)
          return now >= start && now < end
        })

        setCurrentSession(active || null)
      } catch {
        setCurrentSession(null)
      } finally {
        setLoading(false)
      }
    }

    check()
    intervalRef.current = setInterval(check, POLL_INTERVAL)
    return () => clearInterval(intervalRef.current)
  }, [])

  return {
    currentSession,
    sessionKey: currentSession?.session_key ?? null,
    loading,
  }
}
