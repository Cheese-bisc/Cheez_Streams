# Cheez Streams

A live Formula 1 dashboard with streaming, session tracking, race weekend results, championship standings, and a multi-season race archive.

Site: **[https://Cheese-bisc.github.io/Cheez_Streams/](https://Cheese-bisc.github.io/Cheez_Streams/)**

## Features

- **Live Dashboard** — Stream panel, weekend session tracker, WDC/WCC standings
- **Race Archive** — Browse completed and upcoming races across multiple seasons (2025+), with circuit images and sorting
- **Race Detail** — Podium cards with driver photos, full results tables, sprint session support
- **Proper Routing** — Season preserved across navigation, browser back/forward works, deep-linkable race pages (`/#/archive/2025/7`)
- **Sprint Weekends** — Sprint results section below race results on detail pages
- **Responsive** — Mobile-friendly layout with adaptive padding, gaps, and table scrolling

## Tech Stack

- React 19
- Vite 8
- Tailwind CSS v4
- [React Router v7](https://reactrouter.com/) (HashRouter)
- [lucide-react](https://lucide.dev/) icons
- Data from [Jolpica Ergast API](https://api.jolpi.ca/ergast/f1/)

## Local Development

```bash
npm install
npm run dev       # Start dev server at http://localhost:5173
npm run build     # Production build
npm run preview   # Preview production build locally
npm run lint      # Run linter
```

## Adding a New Season

1. Create `src/data/calendarYYYY.js` following the same structure as `calendar2026.js`
2. Import and register it in `src/data/calendars.js`:
   ```js
   import { CALENDAR_2027, isSprintWeekend as isSprint2027 } from "./calendar2027"

   export const CALENDARS = { 2025: CALENDAR_2025, 2026: CALENDAR_2026, 2027: CALENDAR_2027 }
   export const AVAILABLE_SEASONS = Object.keys(CALENDARS).map(Number).sort((a, b) => b - a)

   const SEASON_SPRINT_CHECK = { 2025: isSprintWeekend2025, 2026: isSprintWeekend2026, 2027: isSprint2027 }
   ```
3. Add circuit images to `public/assets/circuits/` if new circuits are introduced
4. Add driver photos to `public/assets/drivers/` as lowercase `{familyName}.webp`
5. If the Jolpica API returns different circuit names than the hardcoded calendar, add the API variants to `src/utils/circuitImages.js`

## Circuit Image Mappings

Circuit images are resolved by `src/utils/circuitImages.js`. The mapping supports:
- Hardcoded calendar names (from `src/data/calendarYYYY.js`)
- Jolpica/Ergast API names (may differ — e.g. `"Autódromo José Carlos Pace"` vs `"Interlagos Circuit"`)
- Accented character normalization (NFD decomposition)
- Fallback gradient when an image file is missing

## Project Structure

```
src/
  api/          — Jolpica and OpenF1 API clients
  components/   — React components (Header, ArchivePage, RaceDetailPage, etc.)
  data/         — Hardcoded season calendars (fallback when API is slow/offline)
  hooks/        — Custom hooks (useCalendar, useStandings, useWeekendResults, etc.)
  utils/        — Circuit image mappings, session helpers
public/
  assets/
    circuits/   — Circuit track layout images (.webp)
    drivers/    — Driver portrait photos (.webp)
    formula1.png
```
