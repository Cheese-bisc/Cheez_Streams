import { useNavigate } from "react-router-dom";
import { Timer, Radio, Trophy } from "lucide-react";
import CountdownTimer from "./CountdownTimer";

export default function Header({ nextSession, isLive }) {
  const navigate = useNavigate();
  const targetDate = nextSession?.dateTime
    ? new Date(nextSession.dateTime)
    : null;
  const sessionLabel = nextSession?.sessionName ?? null;
  const raceLabel = nextSession?.raceName ?? null;

  return (
    <header className="sticky top-0 z-50 w-full bg-bg/95 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-4 lg:px-6 h-14">
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex items-center shrink-0">
            <img
              src={`${import.meta.env.BASE_URL}assets/formula1.png`}
              alt="Formula 1"
              className="h-10 sm:h-14 lg:h-20 w-auto inline-block"
            />
            <span className="text-ink font-bold text-sm sm:text-base lg:text-lg tracking-tight shrink-0 -ml-1 sm:-ml-2">
              CHEEZ STREAMS
            </span>
          </div>

          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider transition-colors duration-300 shrink-0 ${
                isLive
                  ? "bg-primary text-white"
                  : "bg-surface-raised text-muted"
              }`}
            >
              {isLive && (
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              )}
              {isLive ? "LIVE" : sessionLabel || "OFF SEASON"}
            </div>

            {!isLive && sessionLabel && raceLabel && (
              <span className="hidden sm:block text-xs text-muted truncate">
                {raceLabel} &middot; {sessionLabel}
              </span>
            )}

            {isLive && raceLabel && (
              <span className="hidden sm:block text-xs text-ink/70 truncate">
                {raceLabel}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 lg:gap-3 shrink-0">
          {nextSession && !isLive && (
            <div className="hidden sm:flex items-center gap-2 text-muted">
              <Timer size={14} className="shrink-0" />
              <CountdownTimer targetDate={targetDate} />
            </div>
          )}

          <button
            onClick={() => navigate("/archive")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-semibold text-muted hover:text-ink hover:bg-surface-hover transition-colors"
            aria-label="Open race archive"
          >
            <Trophy size={14} />
            <span className="hidden sm:inline">Archive</span>
          </button>

          <Radio
            size={16}
            className={`shrink-0 ${isLive ? "text-primary" : "text-muted"}`}
          />
        </div>
      </div>
    </header>
  );
}
