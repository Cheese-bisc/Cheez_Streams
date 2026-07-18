import { Clock, Loader2, Calendar } from "lucide-react"
import CountdownTimer from "./CountdownTimer"

function sessionBadge(name) {
  const styles = {
    Race: "bg-primary/20 text-primary",
    Sprint: "bg-accent/20 text-accent",
    "Sprint Qualifying": "bg-info/20 text-info",
    Qualifying: "bg-info/20 text-info",
    FP1: "bg-surface-hover text-muted",
    FP2: "bg-surface-hover text-muted",
    FP3: "bg-surface-hover text-muted",
  }
  return styles[name] || "bg-surface-hover text-muted"
}

function renderResultsTable(results, sessionType) {
  return (
    <table className="w-full">
      <thead>
        <tr className="text-[10px] font-semibold uppercase tracking-wider text-muted">
          <th className="px-2 py-1 text-left w-8 border-b border-border">Pos</th>
          <th className="px-2 py-1 text-left border-b border-border">Driver</th>
          <th className="px-2 py-1 text-left hidden sm:table-cell border-b border-border">Team</th>
          <th className="px-2 py-1 text-right border-b border-border">Time/Gap</th>
        </tr>
      </thead>
      <tbody>
        {results.map((r, i) => (
          <tr key={r.Driver?.driverId || i} className="group hover:bg-surface-hover transition-colors">
            <td className="px-2 py-1 text-xs tabular-nums text-center text-muted w-8 border-b border-border/50 group-last:border-b-0">
              {r.position}
            </td>
            <td className="px-2 py-1 text-xs text-ink font-medium border-b border-border/50 group-last:border-b-0">
              {r.Driver?.code || r.Driver?.driverId}
            </td>
            <td className="px-2 py-1 text-xs text-muted hidden sm:table-cell border-b border-border/50 group-last:border-b-0">
              {r.Constructor?.name}
            </td>
            <td className="px-2 py-1 text-xs tabular-nums text-right text-ink border-b border-border/50 group-last:border-b-0">
              {sessionType === "qualifying"
                ? (r.Q3 || r.Q2 || r.Q1 || "--")
                : (r.Time?.time || r.status || "--")}
              {r.FastestLap?.rank === "1" && (
                <span className="text-[10px] text-accent ml-1" title="Fastest lap">FL</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function Placeholder({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      {Icon && <Icon size={32} className="text-muted/40 mb-3" />}
      <p className="text-sm text-ink/60 mb-1">{title}</p>
      {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
      {children}
    </div>
  )
}

export default function WeekendResults({
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
}) {
  const race = currentRaceWeekend
  const session = lastCompletedSession

  let body

  if (isBeforeSeason && seasonStartDate) {
    body = (
      <Placeholder icon={Calendar} title="2026 season begins soon" subtitle={`First session: ${seasonStartDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}`} />
    )
  } else if (isAfterSeason) {
    const results = sessionResults?.Results
    if (results) {
      body = (
        <div className="p-3 space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted mb-1">
            <span className="font-medium text-ink">{race?.name}</span>
            <span>&middot;</span>
            <span>{race?.circuit}</span>
          </div>
          {renderResultsTable(results, "race")}
          <p className="text-xs text-muted pt-1">Season complete</p>
        </div>
      )
    } else {
      body = (
        <Placeholder icon={Clock} title="Season complete" subtitle="The 2026 champion has been decided" />
      )
    }
  } else if (!race) {
    body = (
      <Placeholder icon={Calendar} title="No race weekend" subtitle="Check back when the season begins" />
    )
  } else if (!session && nextSessionInWeekend) {
    body = (
      <Placeholder icon={Clock} title="Weekend in progress" subtitle={`Next: ${nextSessionInWeekend.sessionName}`}>
        <p className="text-xs text-muted mt-1">
          Starts in <CountdownTimer targetDate={new Date(nextSessionInWeekend.dateTime)} />
        </p>
        <p className="text-xs text-muted mt-2">{race.name} &middot; {race.circuit}</p>
      </Placeholder>
    )
  } else if (!session && !nextSessionInWeekend && race) {
    body = (
      <Placeholder title="Race weekend complete" subtitle={race.name} />
    )
  } else if (session && sessionType === "practice") {
    body = (
      <Placeholder title={`${session.sessionName} complete`} subtitle={nextSessionInWeekend ? `Next: ${nextSessionInWeekend.sessionName}` : "All sessions complete for this weekend"}>
        {nextSessionInWeekend && (
          <p className="text-xs text-muted mt-1">
            Starts in <CountdownTimer targetDate={new Date(nextSessionInWeekend.dateTime)} />
          </p>
        )}
        <p className="text-xs text-muted mt-2">{race.name} &middot; {race.circuit}</p>
      </Placeholder>
    )
  } else if (loading) {
    body = (
      <div className="flex items-center justify-center h-full py-12">
        <Loader2 size={20} className="text-muted animate-spin" />
      </div>
    )
  } else if (error) {
    body = (
      <Placeholder title="Failed to load results" subtitle={error} />
    )
  } else if (session && sessionResults) {
    const results = sessionType === "qualifying"
      ? sessionResults?.QualifyingResults
      : sessionResults?.Results

    if (!results || results.length === 0) {
      body = (
        <Placeholder title="No results available" subtitle="Results data not yet published" />
      )
    } else {
      body = (
        <div className="p-3 space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted mb-1">
            <span className="font-medium text-ink">{race?.name}</span>
            <span>&middot;</span>
            <span>{race?.circuit}</span>
          </div>
          {renderResultsTable(results, sessionType)}
          {nextSessionInWeekend && (
            <div className="flex items-center gap-1.5 text-xs text-muted pt-1 border-t border-border">
              <Clock size={12} />
              <span>
                Next: {nextSessionInWeekend.sessionName} in{" "}
                <CountdownTimer targetDate={new Date(nextSessionInWeekend.dateTime)} />
              </span>
            </div>
          )}
        </div>
      )
    }
  } else if (session && !sessionResults) {
    body = (
      <Placeholder title={`${session.sessionName} complete`} subtitle={nextSessionInWeekend ? `Next: ${nextSessionInWeekend.sessionName}` : "All sessions complete"}>
        {nextSessionInWeekend && (
          <p className="text-xs text-muted mt-1">
            Starts in <CountdownTimer targetDate={new Date(nextSessionInWeekend.dateTime)} />
          </p>
        )}
        <p className="text-xs text-muted mt-2">{race?.name} &middot; {race?.circuit}</p>
      </Placeholder>
    )
  } else {
    body = (
      <Placeholder icon={Clock} title="No results yet" />
    )
  }

  return (
    <section className="flex flex-col rounded-lg border border-border bg-surface overflow-hidden">
      <div className="flex items-center justify-between px-3 h-10 border-b border-border bg-surface-raised">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink shrink-0">Weekend Results</span>
          {session && (
            <span className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 ${sessionBadge(session.sessionName)}`}>
              {session.sessionName}
            </span>
          )}
          {isAfterSeason && (
            <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent/20 text-accent shrink-0">
              Season Finale
            </span>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scrollable">
        {body}
      </div>
    </section>
  )
}
