/**
 * Rage Reset Public Validation Release — internal product / build identifiers.
 * Safe for diagnostics, SW cache naming, analytics (non-identifying), and reports.
 * Do not surface prominently to ordinary players.
 */

export const RAGE_RESET_RELEASE_NAME = "Rage Reset Public Validation Release"

/** Semver-style product label for this validation phase. */
export const RAGE_RESET_BUILD_VERSION = "pvr-1.0.0"

/** Cache bucket used by the scoped service worker (keep in sync with public/rage-reset-sw.js). */
export const RAGE_RESET_SW_CACHE = "rage-reset-pvr-1"

/** Compact token for error logs and diagnostics (no personal data). */
export function getRageResetBuildId(): string {
  const sha =
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 8)
      : undefined
  return sha ? `${RAGE_RESET_BUILD_VERSION}+${sha}` : RAGE_RESET_BUILD_VERSION
}
