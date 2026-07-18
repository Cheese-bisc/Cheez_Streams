function DriverDot({ code }) {
  const hue = code
    ? code.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360
    : 0
  return (
    <div
      className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
      style={{ background: `linear-gradient(135deg, oklch(0.55 0.12 ${hue}), oklch(0.45 0.15 ${hue + 30}))` }}
    >
      {code ? code.slice(0, 2) : "--"}
    </div>
  )
}

function statusClass(status) {
  if (!status) return ""
  const s = status.toLowerCase()
  if (s.includes("finished") || s === "finished") return "text-success"
  if (s.includes("dnf") || s.includes("accident") || s.includes("collision") || s.includes("retired") || s.includes("engine") || s.includes("gear")) return "text-danger"
  if (s.includes("+") || s.includes("lap")) return "text-warning"
  return "text-muted"
}

export default function ResultsTable({ results, highlightPodium = true }) {
  if (!results || results.length === 0) {
    return (
      <div className="text-center py-8 text-xs text-muted">No results available</div>
    )
  }

  return (
    <div className="overflow-x-auto scrollable">
      <table className="w-full min-w-[500px]">
        <thead>
          <tr className="text-[10px] font-semibold uppercase tracking-wider text-muted">
            <th className="px-2 py-1.5 text-left w-8">Pos</th>
            <th className="px-2 py-1.5 text-left">Driver</th>
            <th className="px-2 py-1.5 text-left hidden md:table-cell">Team</th>
            <th className="px-2 py-1.5 text-center w-10 hidden sm:table-cell">Grid</th>
            <th className="px-2 py-1.5 text-right">Time/Gap</th>
            <th className="px-2 py-1.5 text-right w-14">Pts</th>
            <th className="px-2 py-1.5 text-left hidden md:table-cell">Status</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => {
            const pos = parseInt(r.position, 10)
            const isPodium = highlightPodium && pos >= 1 && pos <= 3

            return (
              <tr
                key={r.Driver?.driverId || i}
                className={`group transition-colors ${
                  isPodium
                    ? "bg-gradient-to-r from-transparent via-accent/[0.03] to-transparent"
                    : "hover:bg-surface-hover"
                } ${pos === 1 ? "border-l-2 border-accent" : ""}`}
              >
                <td className={`px-2 py-1.5 text-xs tabular-nums text-center ${
                  isPodium ? "font-bold text-ink" : "text-muted"
                } border-b border-border/50`}>
                  {r.position}
                </td>
                <td className="px-2 py-1.5 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <DriverDot code={r.Driver?.code} />
                    <span className={`text-xs ${isPodium ? "font-semibold text-ink" : "text-ink"}`}>
                      {r.Driver?.code || r.Driver?.driverId}
                    </span>
                  </div>
                </td>
                <td className="px-2 py-1.5 text-xs text-muted hidden md:table-cell border-b border-border/50">
                  {r.Constructor?.name}
                </td>
                <td className="px-2 py-1.5 text-xs tabular-nums text-center text-muted hidden sm:table-cell border-b border-border/50">
                  {r.grid || "--"}
                </td>
                <td className="px-2 py-1.5 text-xs tabular-nums text-right text-ink border-b border-border/50">
                  {r.Time?.time || r.status || "--"}
                  {r.FastestLap?.rank === "1" && (
                    <span className="text-[10px] text-accent ml-1 font-semibold" title="Fastest lap">FL</span>
                  )}
                </td>
                <td className="px-2 py-1.5 text-xs tabular-nums text-right font-medium text-ink border-b border-border/50">
                  {r.points || "0"}
                </td>
                <td className={`px-2 py-1.5 text-xs hidden md:table-cell border-b border-border/50 ${statusClass(r.status)}`}>
                  {r.status || "--"}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
