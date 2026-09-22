/** Calendar day in Britain, so the homepage mix flips at UK midnight. */
export function londonDateKey(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date)
}

function hashString(value: string) {
  let hash = 2166136261
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function mulberry32(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Stable shuffle for a calendar day. Same date, same order; the next day, a new mix. */
export function pickDailyListings<T>(items: readonly T[], count: number, date = new Date()): T[] {
  if (count <= 0 || items.length === 0) return []
  const random = mulberry32(hashString(`inspired:${londonDateKey(date)}`))
  const pool = [...items]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    const current = pool[i]
    pool[i] = pool[j]
    pool[j] = current
  }
  return pool.slice(0, Math.min(count, pool.length))
}
