import { useState, useEffect, useCallback } from "react"
import useSeasonSchedule from "./useSeasonSchedule"
import { getAllSessions } from "../utils/sessions"

const PRE_STREAM_BUFFER_MS = 20 * 60 * 1000

export default function useCalendar() {
  const year = new Date().getFullYear()
  const { races } = useSeasonSchedule(year)
  const [nextSession, setNextSession] = useState(null)
  const [isSessionLive, setIsSessionLive] = useState(false)

  const compute = useCallback(() => {
    const now = new Date()
    const allSessions = races.flatMap(getAllSessions)

    let foundNext = null
    let foundLive = false

    for (const s of allSessions) {
      const start = new Date(s.dateTime)
      const end = new Date(start.getTime() + 2 * 60 * 60 * 1000)

      if (now >= new Date(start.getTime() - PRE_STREAM_BUFFER_MS) && now < end) {
        foundLive = true
        foundNext = s
        break
      }

      if (start > now && (!foundNext || start < new Date(foundNext.dateTime))) {
        foundNext = s
      }
    }

    setIsSessionLive(foundLive)
    setNextSession(foundNext)
  }, [races])

  useEffect(() => {
    compute()
    const interval = setInterval(compute, 30_000)
    return () => clearInterval(interval)
  }, [compute])

  return { nextSession, isSessionLive, getAllSessions }
}
