import { Routes, Route, Navigate } from "react-router-dom"
import { useEffect } from "react"
import useCalendar from "./hooks/useCalendar"
import useStandings from "./hooks/useStandings"
import useLiveSession from "./hooks/useLiveSession"
import useWeekendResults from "./hooks/useWeekendResults"
import Header from "./components/Header"
import StreamPanel from "./components/StreamPanel"
import WeekendResults from "./components/WeekendResults"
import StandingsPanel from "./components/StandingsPanel"
import ArchivePage from "./components/ArchivePage"
import RaceDetailPage from "./components/RaceDetailPage"

function DashboardPage() {
  const { nextSession, isSessionLive } = useCalendar()
  const { wdc, wcc, loading, error, refresh } = useStandings()
  const { currentSession } = useLiveSession()
  const weekend = useWeekendResults()

  useEffect(() => {
    document.title = nextSession?.raceName
      ? `CheezStreams - ${nextSession.raceName}`
      : "CheezStreams"
  }, [nextSession?.raceName])

  const isLive = isSessionLive || currentSession !== null

  const nextRace = nextSession
    ? {
        raceName: nextSession.raceName,
        circuit: nextSession.circuit,
        raceDate: nextSession.date,
        raceTime: nextSession.time,
      }
    : null

  return (
    <div className="min-h-screen bg-bg text-ink antialiased flex flex-col">
      <Header
        nextSession={nextSession}
        isLive={isLive}
        view="dashboard"
      />

      <main className="flex-1 p-4 lg:p-6 space-y-4 lg:space-y-6 max-w-[1600px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4 lg:gap-6">
          <StreamPanel isLive={isLive} nextRace={nextRace} />
          <WeekendResults
            currentRaceWeekend={weekend.currentRaceWeekend}
            lastCompletedSession={weekend.lastCompletedSession}
            nextSessionInWeekend={weekend.nextSessionInWeekend}
            sessionResults={weekend.sessionResults}
            sessionType={weekend.sessionType}
            loading={weekend.loading}
            error={weekend.error}
            isBeforeSeason={weekend.isBeforeSeason}
            isAfterSeason={weekend.isAfterSeason}
            seasonStartDate={weekend.seasonStartDate}
          />
        </div>

        <StandingsPanel
          wdcData={wdc}
          wccData={wcc}
          loading={loading}
          error={error}
          onRefresh={refresh}
        />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/archive" element={<ArchivePage />} />
      <Route path="/archive/:year/:round" element={<RaceDetailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
