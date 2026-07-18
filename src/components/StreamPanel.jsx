import { useState, useRef, useCallback } from "react"
import { Maximize2, Minimize2, RefreshCw, Monitor } from "lucide-react"

const STREAM_URL = "https://westreamf1.com/westreamf1.php"

export default function StreamPanel({ isLive, nextRace }) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [key, setKey] = useState(0)
  const containerRef = useRef(null)
  const iframeRef = useRef(null)

  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen()
        setIsFullscreen(true)
      } else {
        await document.exitFullscreen()
        setIsFullscreen(false)
      }
    } catch {
      setIsFullscreen(false)
    }
  }, [])

  const refresh = useCallback(() => {
    setKey((k) => k + 1)
  }, [])

  const raceName = nextRace?.raceName ?? ""
  const circuit = nextRace?.circuit ?? ""
  const raceDate = nextRace?.raceDate ?? ""
  const raceTime = nextRace?.raceTime ?? ""

  const formattedDate = raceDate
    ? new Date(`${raceDate}T${raceTime || "00:00:00"}`).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : ""

  return (
    <section className="flex flex-col rounded-lg border border-border bg-surface overflow-hidden" ref={containerRef}>
      <div className="flex items-center justify-between px-3 h-10 border-b border-border bg-surface-raised">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink">Live Stream</span>
          {isLive && (
            <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              LIVE
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={refresh}
            className="flex items-center justify-center w-7 h-7 rounded text-muted hover:text-ink hover:bg-surface-hover transition-colors"
            aria-label="Refresh stream"
          >
            <RefreshCw size={14} />
          </button>
          <button
            onClick={toggleFullscreen}
            className="flex items-center justify-center w-7 h-7 rounded text-muted hover:text-ink hover:bg-surface-hover transition-colors"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      <div className="relative flex-1 bg-black" style={{ aspectRatio: "16/9" }}>
        {isLive ? (
          <iframe
            ref={iframeRef}
            key={key}
            src={STREAM_URL}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            allow="autoplay; encrypted-media"
            title="Live F1 Stream"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <Monitor size={48} className="text-muted/40 mb-4" />
            <p className="text-sm font-medium text-ink/60 mb-1">No live session</p>
            {raceName && (
              <>
                <p className="text-xs text-muted mb-0.5">{raceName}</p>
                <p className="text-xs text-muted">{circuit}</p>
                {formattedDate && <p className="text-xs text-muted mt-1">{formattedDate}</p>}
              </>
            )}
            {!raceName && (
              <p className="text-xs text-muted">Check back when the next race weekend begins</p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
