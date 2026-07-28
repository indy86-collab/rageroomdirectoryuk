/** Coarse duration buckets for analytics — never exact timestamps tied to emotion. */

export type DurationBucket =
  | "under_30s"
  | "30s_1m"
  | "1m_2m"
  | "2m_3m"
  | "3m_5m"
  | "over_5m"

export function durationBucket(ms: number): DurationBucket {
  if (!Number.isFinite(ms) || ms < 0) return "under_30s"
  if (ms < 30_000) return "under_30s"
  if (ms < 60_000) return "30s_1m"
  if (ms < 120_000) return "1m_2m"
  if (ms < 180_000) return "2m_3m"
  if (ms < 300_000) return "3m_5m"
  return "over_5m"
}

export function averageDurationBucket(
  durationsMs: number[]
): DurationBucket | null {
  if (!durationsMs.length) return null
  const avg = durationsMs.reduce((a, b) => a + b, 0) / durationsMs.length
  return durationBucket(avg)
}
