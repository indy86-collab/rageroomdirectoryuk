/**
 * Internal feature flags for Rage Reset.
 * No remote experiment infrastructure — local/URL only.
 */

export type CooldownChallengeId = "fragment-sort" | "rebuild-room"

/** Game presentation renderer — not exposed to ordinary users. */
export type GameRendererId = "legacy" | "next"

const STORAGE_KEY = "rage-reset-cooldown-challenge"
const RENDERER_STORAGE_KEY = "rage-reset-game-renderer"

function allowInternalCooldownOverride(): boolean {
  if (process.env.NODE_ENV !== "production") return true
  return process.env.NEXT_PUBLIC_RAGE_RESET_DIAGNOSTICS === "1"
}

function allowInternalRendererOverride(): boolean {
  if (process.env.NODE_ENV !== "production") return true
  return (
    process.env.NEXT_PUBLIC_RAGE_RESET_DIAGNOSTICS === "1" ||
    process.env.NEXT_PUBLIC_RAGE_RESET_GAME_RENDERER === "next" ||
    process.env.NEXT_PUBLIC_RAGE_RESET_GAME_RENDERER === "legacy"
  )
}

/**
 * Select active smash/boss/cooldown presentation.
 * Production stays on `legacy` until acceptance criteria pass.
 * Local/preview default to `next` when env is unset; override with
 * NEXT_PUBLIC_RAGE_RESET_GAME_RENDERER or ?renderer=legacy|next.
 */
export function getGameRenderer(): GameRendererId {
  const env = process.env.NEXT_PUBLIC_RAGE_RESET_GAME_RENDERER
  if (env === "legacy" || env === "next") return env

  if (typeof window !== "undefined" && allowInternalRendererOverride()) {
    try {
      const params = new URLSearchParams(window.location.search)
      const fromQuery = params.get("renderer")
      if (fromQuery === "legacy" || fromQuery === "next") return fromQuery
      // Exercise the rebuild during automated e2e unless explicitly pinned legacy.
      if (params.get("e2e") === "1") return "next"
      const stored = window.localStorage.getItem(RENDERER_STORAGE_KEY)
      if (stored === "legacy" || stored === "next") return stored
    } catch {
      /* ignore */
    }
  }

  // Production default: keep proven prototype until cutover.
  if (process.env.NODE_ENV === "production") return "legacy"
  // Local / preview iteration default.
  return "next"
}

/** Dev / internal only. */
export function setGameRenderer(id: GameRendererId): void {
  if (typeof window === "undefined") return
  if (process.env.NODE_ENV === "production") return
  try {
    window.localStorage.setItem(RENDERER_STORAGE_KEY, id)
  } catch {
    /* ignore */
  }
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
