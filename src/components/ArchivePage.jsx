import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowDownUp, Trophy, ChevronDown, RefreshCw } from "lucide-react";
import { AVAILABLE_SEASONS } from "../data/calendars";
import useSeasonSchedule from "../hooks/useSeasonSchedule";
import { getCircuitImage } from "../utils/circuitImages";

const SESSION_DURATION_MS = 2.5 * 60 * 60 * 1000;

function circuitGradient(round) {
  const hues = [
    200, 250, 300, 350, 40, 90, 140, 190, 240, 290, 340, 30, 80, 130, 180, 230,
    280, 330, 20, 70, 120, 170,
  ];
  const h = hues[(round - 1) % hues.length];
  return {
    background: `linear-gradient(135deg, oklch(0.18 0.04 ${h}), oklch(0.12 0.02 ${h + 20}))`,
    accent: `oklch(0.5 0.12 ${h})`,
  };
}

function RaceCard({ race, onClick, isUpcoming, isCurrentWeekend }) {
  const g = circuitGradient(race.round);
  const sprint = !!race.sprint;
  const [imgFailed, setImgFailed] = useState(false);
  const circuitImg = getCircuitImage(race.circuit);

  return (
    <button
      onClick={onClick}
      className={`relative rounded-xl border overflow-hidden text-left transition-all duration-200 w-full aspect-4/3 ${
        isCurrentWeekend
          ? "border-primary/50 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
          : isUpcoming
            ? "border-border opacity-50 cursor-default"
            : "border-border hover:border-border-hover hover:shadow-lg hover:-translate-y-0.5"
      }`}
      disabled={isUpcoming}
    >
      {!imgFailed ? (
        <img
          src={circuitImg}
          alt={race.circuit}
          className="absolute inset-0 w-full h-full object-contain"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <div className="absolute inset-0" style={g} />
      )}

      <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/80 to-transparent" />

      <div className="absolute top-2 right-2 flex items-center gap-1">
        {isCurrentWeekend && (
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-primary text-white">
            Live
          </span>
        )}
        {sprint && (
          <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent/80 text-white backdrop-blur-sm">
            Sprint
          </span>
        )}
        <span
          className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
          style={{ background: g.accent, color: "white" }}
        >
          R{race.round}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-center pb-3 px-3">
        <p className="text-sm font-bold text-white text-center leading-tight drop-shadow-md">
          {race.name}
        </p>
      </div>
    </button>
  );
}

export default function ArchivePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const queryYear = Number(searchParams.get("year"));
  const selectedYear =
    Number.isFinite(queryYear) && AVAILABLE_SEASONS.includes(queryYear)
      ? queryYear
      : new Date().getFullYear();

  const [sortAsc, setSortAsc] = useState(true);
  const [yearOpen, setYearOpen] = useState(false);

  const { races: calendar, loading: scheduleLoading } =
    useSeasonSchedule(selectedYear);

  const { completed, upcoming, currentWeekendRound } = useMemo(() => {
    const now = Date.now();
    let current = null;
    const completed_list = [];
    const upcoming_list = [];

    for (const race of calendar) {
      const raceEnd =
        new Date(`${race.raceDate}T${race.raceTime}Z`).getTime() +
        SESSION_DURATION_MS;

      if (raceEnd < now) {
        completed_list.push(race);
      } else {
        const fp1 = race.fp1;
        const firstSessionStart = fp1
          ? new Date(`${fp1.date}T${fp1.time}Z`).getTime()
          : raceEnd;

        if (now >= firstSessionStart && now < raceEnd) {
          current = race.round;
        }
        upcoming_list.push(race);
      }
    }

    return {
      completed: completed_list,
      upcoming: upcoming_list,
      currentWeekendRound: current,
    };
  }, [calendar]);

  const races = useMemo(() => {
    const all = [...completed, ...upcoming];
    if (sortAsc) return all;
    return all.slice().reverse();
  }, [sortAsc, completed, upcoming]);

  function selectYear(y) {
    setSearchParams({ year: String(y) }, { replace: false });
    setYearOpen(false);
  }

  function handleRaceSelect(race) {
    // Push to a real URL so browser back works; pass the race object through
    // history state so RaceDetailPage can render instantly without waiting on
    // a schedule refetch.
    navigate(`/archive/${selectedYear}/${race.round}`, {
      state: { race: { ...race, year: selectedYear } },
    });
  }

  return (
    <div className="min-h-screen bg-bg text-ink antialiased flex flex-col">
      <header className="sticky top-0 z-50 w-full bg-bg/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 lg:px-6 h-14">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <span className="w-px h-5 bg-border" />
            <Trophy size={16} className="text-accent" />
            <span className="text-sm font-semibold text-ink">Race Archive</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="relative">
              <button
                onClick={() => setYearOpen((o) => !o)}
                className="flex items-center gap-1 px-2 py-1 rounded text-muted hover:text-ink hover:bg-surface-hover transition-colors"
              >
                <span className="font-semibold tabular-nums">
                  {selectedYear}
                </span>
                <ChevronDown size={12} />
              </button>
              {yearOpen && (
                <div className="absolute right-0 top-full mt-1 bg-surface border border-border rounded-lg overflow-hidden shadow-xl z-50 min-w-20">
                  {AVAILABLE_SEASONS.map((y) => (
                    <button
                      key={y}
                      onClick={() => selectYear(y)}
                      className={`w-full text-left px-3 py-1.5 text-xs transition-colors hover:bg-surface-hover ${
                        y === selectedYear
                          ? "text-ink font-semibold"
                          : "text-muted"
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span className="text-muted hidden sm:flex items-center gap-1.5">
              {completed.length} completed &middot; {upcoming.length} upcoming
              {scheduleLoading && (
                <RefreshCw size={11} className="animate-spin text-muted/60" aria-label="Syncing schedule" />
              )}
            </span>
            <button
              onClick={() => setSortAsc((s) => !s)}
              className="flex items-center gap-1 px-2 py-1 rounded text-muted hover:text-ink hover:bg-surface-hover transition-colors"
              aria-label="Toggle sort order"
            >
              <ArrowDownUp size={13} />
              <span className="hidden sm:inline">
                {sortAsc ? "Oldest" : "Newest"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* main — no max-width cap, wider horizontal padding */}
      <main className="flex-1 px-4 py-4 sm:px-6 lg:px-10 lg:py-6 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-10">
          {races.map((race) => {
            const isWeekend = race.round === currentWeekendRound;
            const isUpcoming =
              !completed.find((c) => c.round === race.round) && !isWeekend;

            return (
              <RaceCard
                key={`${selectedYear}-${race.round}`}
                race={race}
                onClick={() => handleRaceSelect(race)}
                isUpcoming={isUpcoming}
                isCurrentWeekend={isWeekend}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}
