const hits = new Map<string, number[]>()

/**
 * In-memory sliding window limiter for public endpoints.
 * Returns true when the request is allowed.
 */
export function allowRequest(key: string, limit: number, windowMs: number, now = Date.now()) {
  const recent = (hits.get(key) ?? []).filter((timestamp) => now - timestamp < windowMs)
  if (recent.length >= limit) {
    hits.set(key, recent)
    return false
  }
  recent.push(now)
  hits.set(key, recent)
  return true
}

export function resetRateLimitState() {
  hits.clear()
}
