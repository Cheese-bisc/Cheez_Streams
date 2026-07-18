const CIRCUIT_IMAGE_MAP = {
  "Albert Park Circuit": "albert_park.webp",
  "Albert Park Grand Prix Circuit": "albert_park.webp",
  "Shanghai International Circuit": "shanghai.webp",
  "Suzuka Circuit": "suzuka.webp",
  "Suzuka International Racing Course": "suzuka.webp",
  "Bahrain International Circuit": "bahrain.webp",
  "Jeddah Corniche Circuit": "jeddah.webp",
  "Miami International Autodrome": "miami.webp",
  "Imola Circuit": "imola.webp",
  "Autodromo Enzo e Dino Ferrari": "imola.webp",
  "Circuit de Monaco": "monaco.webp",
  "Circuit de Barcelona-Catalunya": "catalunya.webp",
  "Circuit Gilles Villeneuve": "villeneuve.webp",
  "Red Bull Ring": "red_bull_ring.webp",
  "Silverstone Circuit": "silverstone.webp",
  "Circuit de Spa-Francorchamps": "spa.webp",
  "Hungaroring": "hungaroring.webp",
  "Circuit Zandvoort": "zandvoort.webp",
  "Circuit Park Zandvoort": "zandvoort.webp",
  "Monza Circuit": "monza.webp",
  "Autodromo Nazionale di Monza": "monza.webp",
  "Madring": "madrid.webp",
  "Baku City Circuit": "baku.webp",
  "Marina Bay Street Circuit": "marina_bay.webp",
  "Circuit of the Americas": "americas.webp",
  "Autodromo Hermanos Rodriguez": "rodriguez.webp",
  "Autódromo Hermanos Rodríguez": "rodriguez.webp",
  "Interlagos Circuit": "interlagos.webp",
  "Autodromo Jose Carlos Pace": "interlagos.webp",
  "Autódromo José Carlos Pace": "interlagos.webp",
  "Las Vegas Strip Circuit": "vegas.webp",
  "Las Vegas Strip Street Circuit": "vegas.webp",
  "Lusail International Circuit": "losail.webp",
  "Losail International Circuit": "losail.webp",
  "Yas Marina Circuit": "yas_marina.webp",
}

function normalizeName(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
}

const BASE = import.meta.env.BASE_URL

export function getCircuitImage(circuitName) {
  if (CIRCUIT_IMAGE_MAP[circuitName]) {
    return `${BASE}assets/circuits/${CIRCUIT_IMAGE_MAP[circuitName]}`
  }
  const normalized = normalizeName(circuitName)
  for (const [apiName, fileName] of Object.entries(CIRCUIT_IMAGE_MAP)) {
    if (normalizeName(apiName) === normalized) {
      return `${BASE}assets/circuits/${fileName}`
    }
  }
  return `${BASE}assets/circuits/${normalized}.webp`
}

export function updateCircuitMapping(apiName, fileName) {
  CIRCUIT_IMAGE_MAP[apiName] = fileName
}
