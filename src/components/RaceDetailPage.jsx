import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, Calendar, MapPin, Zap } from "lucide-react";
import useRaceResults from "../hooks/useRaceResults";
import useSeasonSchedule from "../hooks/useSeasonSchedule";
import PodiumCard from "./PodiumCard";
import ResultsTable from "./ResultsTable";

function formatDate(dateStr) {
  const d = new Date(`${dateStr}T00:00:00Z`);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getPodium(results) {
  if (!results) return [];
  return results
    .filter((r) => parseInt(r.position, 10) <= 3)
    .sort((a, b) => parseInt(a.position, 10) - parseInt(b.position, 10));
}

function PodiumSection({ results }) {
  const podium = getPodium(results);
  if (podium.length !== 3) return null;

  return (
    <div className="flex items-end justify-center mx-auto max-w-[420px] lg:max-w-[520px] mb-8">
      <div className="flex-1 min-w-0">
        <PodiumCard
          position={2}
          driver={podium[1].Driver}
          constructor={podium[1].Constructor}
          points={parseInt(podium[1].points, 10)}
        />
      </div>
      <div className="flex-1 min-w-0 pt-6 lg:pt-8">
        <PodiumCard
          position={1}
          driver={podium[0].Driver}
          constructor={podium[0].Constructor}
          points={parseInt(podium[0].points, 10)}
        />
      </div>
      <div className="flex-1 min-w-0">
        <PodiumCard
          position={3}
          driver={podium[2].Driver}
          constructor={podium[2].Constructor}
          points={parseInt(podium[2].points, 10)}
        />
      </div>
    </div>
  );
}

function ResultsSection({
  title,
  results,
  loading,
  error,
  highlightPodium,
  accent,
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={20} className="text-muted animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-border bg-surface overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border bg-surface-raised flex items-center gap-2">
          {accent}
          <span className="text-xs font-semibold uppercase tracking-wider text-ink">
            {title}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-xs text-danger">{error}</p>
        </div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-surface overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border bg-surface-raised flex items-center gap-2">
          {accent}
          <span className="text-xs font-semibold uppercase tracking-wider text-ink">
            {title}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-xs text-muted">
            No results available for this session.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-surface overflow-hidden">
      <div className="px-4 py-2.5 border-b border-border bg-surface-raised flex items-center gap-2">
        {accent}
        <span className="text-xs font-semibold uppercase tracking-wider text-ink">
          {title}
        </span>
      </div>
      <ResultsTable results={results} highlightPodium={highlightPodium} />
    </div>
  );
}

export default function RaceDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { year: yearParam, round: roundParam } = useParams();

  const year = Number(yearParam);
  const round = Number(roundParam);
  const stateRace = location.state?.race;

  const [race, setRace] = useState(stateRace ?? null);
  const { races } = useSeasonSchedule(year);

  const { raceData, sprintData, loading, error, sprintError, fetch } =
    useRaceResults();

  useEffect(() => {
    if (stateRace && stateRace.round === round && stateRace.year === year) {
      setRace(stateRace);
      return;
    }
    const found = races.find(
      (r) => r.round === round,
    );
    if (found) {
      setRace({ ...found, year });
    }
  }, [races, round, year, stateRace]);

  useEffect(() => {
    if (race) {
      document.title = `${race.name} · Cheez Streams`;
    }
    return () => {
      document.title = "F1 Stream Dashboard";
    };
  }, [race?.name]);

  useEffect(() => {
    fetch(round, year);
  }, [round, year, fetch]);

  const isSprint = !!race?.sprint;

  if (!race) {
    return (
      <div className="min-h-screen bg-bg text-ink antialiased flex flex-col items-center justify-center">
        <Loader2 size={28} className="text-muted animate-spin mb-4" />
        <p className="text-sm text-muted">Loading race data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-ink antialiased flex flex-col">
      <header className="sticky top-0 z-50 w-full bg-bg/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 lg:px-6 h-14">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/archive?year=${year}`)}
              className="flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back</span>
            </button>
            <span className="w-px h-5 bg-border" />
            <span className="text-sm font-semibold text-ink">
              {race.name}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 lg:p-6 max-w-[1200px] mx-auto w-full">
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted mb-1">
            <span className="text-[11px] font-semibold text-muted tabular-nums">
              R{race.round}
            </span>
            <span className="w-px h-3 bg-border hidden sm:block" />
            <Calendar size={12} className="sm:hidden" />
            <span>{formatDate(race.raceDate)}</span>
            <span className="w-px h-3 bg-border hidden sm:block" />
            <MapPin size={12} className="sm:hidden" />
            <span className="truncate">{race.circuit}</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-ink mt-1">
            {race.name}
          </h1>
          <p className="text-sm text-muted">{race.circuit}</p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="text-muted animate-spin" />
          </div>
        )}

        {!loading && error && raceData === null && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-sm text-danger mb-1">Failed to load results</p>
            <p className="text-xs text-muted">{error}</p>
          </div>
        )}

        {!loading && raceData !== null && (
          <div className="space-y-8">
            <PodiumSection results={raceData?.Results} />

            <ResultsSection
              title="Race Results"
              results={raceData?.Results}
              loading={false}
              error={null}
              highlightPodium
              accent={
                <span className="w-2 h-2 rounded-full bg-primary" />
              }
            />

            {isSprint && (
              <section className="pt-2 border-t border-border/50">
                <div className="flex items-center gap-2 mb-4">
                  <Zap size={16} className="text-accent" />
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">
                    Sprint Race
                  </h2>
                </div>

                <PodiumSection results={sprintData?.SprintResults} />

                <ResultsSection
                  title="Sprint Results"
                  results={sprintData?.SprintResults}
                  loading={false}
                  error={sprintError}
                  highlightPodium={false}
                  accent={
                    <span className="w-2 h-2 rounded-full bg-accent" />
                  }
                />
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}