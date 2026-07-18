import { useState, useEffect } from "react"

function formatDiff(ms) {
  if (ms <= 0) return { text: "00:00", isUrgent: false, expired: true }

  const totalSeconds = Math.floor(ms / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  let text
  let isUrgent = false

  if (days > 0) {
    text = `${days}d ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
  } else if (hours > 0) {
    text = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    isUrgent = hours < 1
  } else {
    text = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    isUrgent = true
  }

  return { text, isUrgent, expired: false }
}

export default function CountdownTimer({ targetDate }) {
  const [display, setDisplay] = useState(() => formatDiff(targetDate ? targetDate.getTime() - Date.now() : 0))

  useEffect(() => {
    if (!targetDate) {
      setDisplay({ text: "--:--", isUrgent: false, expired: false })
      return
    }

    function tick() {
      setDisplay(formatDiff(targetDate.getTime() - Date.now()))
    }

    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  if (!targetDate) return null

  return (
    <span
      className={`tabular-nums text-sm font-medium transition-colors duration-300 ${
        display.expired ? "text-muted" : display.isUrgent ? "text-warning" : "text-ink"
      }`}
    >
      {display.text}
    </span>
  )
}
