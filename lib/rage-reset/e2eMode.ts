/**
 * Accelerated E2E mode for Playwright.
 * Enabled only when ?e2e=1 and (non-production OR NEXT_PUBLIC_RAGE_RESET_E2E=1).
 * Never unlocks paid content or exposes emotional diagnostics remotely.
 */

export function isRageResetE2eEnabled(): boolean {
  if (typeof window === "undefined") return false
  try {
    const params = new URLSearchParams(window.location.search)
    if (params.get("e2e") !== "1") return false
    const allowInProd =
      typeof process !== "undefined" && process.env.NEXT_PUBLIC_RAGE_RESET_E2E === "1"
    if (process.env.NODE_ENV === "production" && !allowInProd) return false
    return true
  } catch {
    return false
  }
}

export function isAnalyticsTestTraffic(): boolean {
  return isRageResetE2eEnabled()
}
