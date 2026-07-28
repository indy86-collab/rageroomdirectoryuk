/**
 * Internal feature flags for Rage Reset.
 * No remote experiment infrastructure — local/URL only.
 */

export type CooldownChallengeId = "fragment-sort" | "rebuild-room"

const STORAGE_KEY = "rage-reset-cooldown-challenge"

function allowInternalCooldownOverride(): boolean {
  if (process.env.NODE_ENV !== "production") return true
  return process.env.NEXT_PUBLIC_RAGE_RESET_DIAGNOSTICS === "1"
}

export function getCooldownChallenge(): CooldownChallengeId {
  if (typeof window === "undefined") return "fragment-sort"
  try {
    // Rebuild-the-room is a development prototype — not for ordinary production visitors.
    if (allowInternalCooldownOverride()) {
      const params = new URLSearchParams(window.location.search)
      const fromQuery = params.get("cooldown")
      if (fromQuery === "rebuild-room" || fromQuery === "fragment-sort") {
        return fromQuery
      }
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored === "rebuild-room" || stored === "fragment-sort") {
        return stored
      }
    }
  } catch {
    /* ignore */
  }
  return "fragment-sort"
}

/** Dev / internal only — never call from production UI without a gate. */
export function setCooldownChallenge(id: CooldownChallengeId): void {
  if (typeof window === "undefined") return
  if (process.env.NODE_ENV === "production") return
  try {
    window.localStorage.setItem(STORAGE_KEY, id)
  } catch {
    /* ignore */
  }
}

export function isDiagnosticsEnabled(): boolean {
  if (typeof window === "undefined") return false
  if (process.env.NODE_ENV === "production") {
    return process.env.NEXT_PUBLIC_RAGE_RESET_DIAGNOSTICS === "1"
  }
  try {
    const params = new URLSearchParams(window.location.search)
    return params.get("debug") === "1" || params.get("e2e") === "1"
  } catch {
    return false
  }
}
