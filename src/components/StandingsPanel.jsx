import { Trophy, Loader2, AlertCircle, RefreshCw } from "lucide-react"

function WdcRow({ driver }) {
  return (
    <tr className="group hover:bg-surface-hover transition-colors">
      <td className="px-2 py-1.5 text-xs tabular-nums text-center text-muted w-8 border-b border-border/50 group-last:border-b-0">
        {driver.position}
      </td>
      <td className="px-2 py-1.5 text-xs text-ink font-medium min-w-[12ch] border-b border-border/50 group-last:border-b-0">
        {driver.Driver?.givenName} {driver.Driver?.familyName}
      </td>
      <td className="px-2 py-1.5 text-xs text-muted min-w-[14ch] border-b border-border/50 group-last:border-b-0">
        {driver.Constructors?.[0]?.name}
      </td>
      <td className="px-2 py-1.5 text-xs tabular-nums text-right text-ink font-medium w-[6ch] border-b border-border/50 group-last:border-b-0">
        {driver.points}
      </td>
      <td className="px-2 py-1.5 text-xs tabular-nums text-right text-muted w-[5ch] border-b border-border/50 group-last:border-b-0">
        {driver.wins}
      </td>
    </tr>
  )
}

function WccRow({ constructor }) {
  return (
    <tr className="group hover:bg-surface-hover transition-colors">
      <td className="px-2 py-1.5 text-xs tabular-nums text-center text-muted w-8 border-b border-border/50 group-last:border-b-0">
        {constructor.position}
      </td>
      <td className="px-2 py-1.5 text-xs text-ink font-medium min-w-[16ch] border-b border-border/50 group-last:border-b-0">
        {constructor.Constructor?.name}
      </td>
      <td className="px-2 py-1.5 text-xs tabular-nums text-right text-ink font-medium w-[6ch] border-b border-border/50 group-last:border-b-0">
        {constructor.points}
      </td>
      <td className="px-2 py-1.5 text-xs tabular-nums text-right text-muted w-[5ch] border-b border-border/50 group-last:border-b-0">
        {constructor.wins}
      </td>
    </tr>
  )
}

export default function StandingsPanel({ wdcData, wccData, loading, error, onRefresh }) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="flex flex-col rounded-lg border border-border bg-surface overflow-hidden">
        <div className="flex items-center gap-2 px-3 h-10 border-b border-border bg-surface-raised">
          <Trophy size={14} className="text-accent" />
          <span className="text-xs font-semibold uppercase tracking-wider text-ink">Drivers&apos; Championship</span>
        </div>

        <div className="max-h-[320px] overflow-x-auto overflow-y-auto scrollable">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={20} className="text-muted animate-spin" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <AlertCircle size={20} className="text-danger mb-2" />
              <p className="text-xs text-muted mb-3">{error}</p>
              {onRefresh && (
                <button
                  onClick={onRefresh}
                  className="flex items-center gap-1.5 text-xs font-medium text-info hover:text-info/80 transition-colors"
                >
                  <RefreshCw size={12} />
                  Retry
                </button>
              )}
            </div>
          ) : wdcData?.length > 0 ? (
            <table className="w-full min-w-[320px]">
              <thead className="sticky top-0 bg-surface-raised">
                <tr className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                  <th className="px-2 py-1.5 text-center w-8 border-b border-border">Pos</th>
                  <th className="px-2 py-1.5 text-left min-w-[12ch] border-b border-border">Driver</th>
                  <th className="px-2 py-1.5 text-left min-w-[14ch] border-b border-border">Team</th>
                  <th className="px-2 py-1.5 text-right w-[6ch] border-b border-border">Pts</th>
                  <th className="px-2 py-1.5 text-right w-[5ch] border-b border-border">Wins</th>
                </tr>
              </thead>
              <tbody>
                {wdcData.map((d, i) => (
                  <WdcRow key={d.Driver?.driverId || i} driver={d} />
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <p className="text-xs text-muted">No standings data available yet for the 2026 season.</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col rounded-lg border border-border bg-surface overflow-hidden">
        <div className="flex items-center gap-2 px-3 h-10 border-b border-border bg-surface-raised">
          <Trophy size={14} className="text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-ink">Constructors&apos; Championship</span>
        </div>

        <div className="max-h-[320px] overflow-x-auto overflow-y-auto scrollable">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={20} className="text-muted animate-spin" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <AlertCircle size={20} className="text-danger mb-2" />
              <p className="text-xs text-muted mb-3">{error}</p>
              {onRefresh && (
                <button
                  onClick={onRefresh}
                  className="flex items-center gap-1.5 text-xs font-medium text-info hover:text-info/80 transition-colors"
                >
                  <RefreshCw size={12} />
                  Retry
                </button>
              )}
            </div>
          ) : wccData?.length > 0 ? (
            <table className="w-full min-w-[280px]">
              <thead className="sticky top-0 bg-surface-raised">
                <tr className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                  <th className="px-2 py-1.5 text-center w-8 border-b border-border">Pos</th>
                  <th className="px-2 py-1.5 text-left min-w-[16ch] border-b border-border">Constructor</th>
                  <th className="px-2 py-1.5 text-right w-[6ch] border-b border-border">Pts</th>
                  <th className="px-2 py-1.5 text-right w-[5ch] border-b border-border">Wins</th>
                </tr>
              </thead>
              <tbody>
                {wccData.map((c, i) => (
                  <WccRow key={c.Constructor?.constructorId || i} constructor={c} />
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <p className="text-xs text-muted">No standings data available yet for the 2026 season.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
