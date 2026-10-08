export const EXIT_INTENT_STORAGE_KEY = "rageroom:exit-intent-shown"
export const EXIT_INTENT_COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000
export const EXIT_INTENT_MIN_DWELL_MS = 10_000
export const EXIT_INTENT_MOBILE_SCROLL_DEPTH = 0.6

/** Editorial pages only — never directory, booking, checkout or downloads. */
export function isExitIntentPath(pathname: string): boolean {
  const path = (pathname || "").split("?")[0].replace(/\/+$/, "")
  return path.startsWith("/guides/") || path.startsWith("/blog/")
}

export function shouldShowExitIntent(input: {
  pathname: string
  lastShownAt: number | null
  now: number
  hasConsentDecision: boolean
  alreadySubscribed: boolean
}): boolean {
  if (!isExitIntentPath(input.pathname)) return false
  // Never stack on top of the privacy banner.
  if (!input.hasConsentDecision) return false
  if (input.alreadySubscribed) return false
  if (input.lastShownAt != null && input.now - input.lastShownAt < EXIT_INTENT_COOLDOWN_MS) return false
  return true
}

export function parseLastShown(value: string | null): number | null {
  const n = Number(value)
  return value && Number.isFinite(n) && n > 0 ? n : null
}
