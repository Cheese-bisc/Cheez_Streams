const BASE_URL = "https://api.openf1.org/v1"

export async function fetchSessions(year = 2026) {
  try {
    const res = await fetch(`${BASE_URL}/sessions?year=${year}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (err) {
    console.error("Failed to fetch sessions:", err)
    return null
  }
}

export async function fetchPositions(sessionKey) {
  try {
    const res = await fetch(`${BASE_URL}/position?session_key=${sessionKey}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (err) {
    console.error("Failed to fetch positions:", err)
    return null
  }
}

export async function fetchLaps(sessionKey) {
  try {
    const res = await fetch(`${BASE_URL}/laps?session_key=${sessionKey}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (err) {
    console.error("Failed to fetch laps:", err)
    return null
  }
}
