/**
 * Rage Reset analytics — stage/usage only.
 * Never send scores, triggers, history text, or emotional data.
 *
 * Params use an allowlist so unknown keys cannot leak sensitive fields.
 */

"use client"

import { trackEvent } from "@/lib/analytics"
import { RAGE_RESET_BUILD_VERSION } from "./build"
import { isAnalyticsTestTraffic } from "./e2eMode"

export type RageResetAnalyticsEvent =
  | "rage_reset_view"
  | "rage_reset_start"
  | "rage_reset_room_selected"
  | "rage_reset_weapon_selected"
  | "rage_reset_free_smash_complete"
  | "rage_reset_controlled_smash_complete"
  | "rage_reset_cooldown_complete"
  | "rage_reset_session_complete"
  | "rage_reset_session_abandoned"
  | "rage_reset_second_session_start"
  | "rage_reset_directory_cta_clicked"
  | "rage_reset_share_started"
  | "rage_reset_share_completed"
  | "rage_reset_install_prompt_shown"
  | "rage_reset_installed"
  | "rage_reset_discovery_clicked"

/** Approved non-sensitive event properties only. */
const ALLOWED_KEYS = new Set([
  "room_id",
  "weapon_id",
  "returning_user",
  "visitor_cohort",
  "player_cohort",
  "display_mode",
  "sound_enabled",
  "haptics_enabled",
  "reduced_effects",
  "entry_source",
  "stage",
  "duration_bucket",
  "completed",
  "skipped",
  "cooldown_skipped",
  "cooldown_variant",
  "cta_destination",
  "surface",
  "method",
  "build_version",
  "traffic",
  "daily_challenge_completed",
  "reason",
])

const SENSITIVE_KEYS = new Set([
  "initialScore",
  "finalScore",
  "score",
  "scoreChange",
  "trigger",
  "triggerCategory",
  "mood",
  "anger",
  "history",
  "text",
  "message",
  "calmEnergy",
  "calm_energy",
  "safety",
  "safetyCause",
  "highIntensity",
  "before",
  "after",
  "difference",
  "objects_destroyed",
  "best_combo",
  "controlled_strikes",
  "href",
  "cta",
])

export type AllowedAnalyticsParams = Record<
  string,
  string | number | boolean | null | undefined
>

export function sanitizeRageResetParams(
  params?: AllowedAnalyticsParams
): Record<string, string | number | boolean> {
  if (!params) return {}
  const out: Record<string, string | number | boolean> = {}
  for (const [key, value] of Object.entries(params)) {
    if (SENSITIVE_KEYS.has(key)) continue
    if (!ALLOWED_KEYS.has(key)) continue
    if (value === null || value === undefined) continue
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      out[key] = value
    }
  }
  return out
}

/** @deprecated use sanitizeRageResetParams — kept for older imports in tests */
function sanitizeParams(params?: AllowedAnalyticsParams) {
  return sanitizeRageResetParams(params)
}

/** In-memory ring buffer for diagnostics only — never includes sensitive keys. */
const recentEvents: { name: string; at: number; params: Record<string, string | number | boolean> }[] =
  []
const MAX_RECENT = 40

export function getRecentAnalyticsEvents() {
  return [...recentEvents]
}

export function clearRecentAnalyticsEvents() {
  recentEvents.length = 0
}

export function trackRageReset(
  event: RageResetAnalyticsEvent,
  params?: AllowedAnalyticsParams
): void {
  const clean = sanitizeParams(params)
  if (!clean.build_version) {
    clean.build_version = RAGE_RESET_BUILD_VERSION
  }
  if (isAnalyticsTestTraffic()) {
    clean.traffic = "e2e"
  }
  recentEvents.push({ name: event, at: Date.now(), params: clean })
  if (recentEvents.length > MAX_RECENT) recentEvents.shift()
  trackEvent(event, clean)
}
