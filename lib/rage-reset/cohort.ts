/**
 * Privacy-safe first-party launch cohort — local and non-sensitive only.
 * No accounts, fingerprints, cross-device IDs, or emotional data.
 */

import type { RageResetStorageV1 } from "./types"
import { getDisplayMode, type DisplayMode } from "./displayMode"

export type VisitorCohort = "first_visit" | "returning_visitor"

/** Broad player category for analytics — never tied to scores or triggers. */
export type PlayerCohort = "never_completed" | "first_completion" | "returning_player"

export type LaunchCohort = {
  visitor_cohort: VisitorCohort
  player_cohort: PlayerCohort
  display_mode: DisplayMode
}

const VISIT_FLAG_KEY = "rage-reset-seen"

/** Mark that this browser has opened Rage Reset at least once. */
export function markRageResetSeen(): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(VISIT_FLAG_KEY, "1")
  } catch {
    /* ignore */
  }
}

export function hasPriorRageResetVisit(): boolean {
  if (typeof window === "undefined") return false
  try {
    return window.localStorage.getItem(VISIT_FLAG_KEY) === "1"
  } catch {
    return false
  }
}

/**
 * Classify visitor/player for analytics.
 * Pass `seenBeforeThisOpen` from a capture taken before markRageResetSeen().
 */
export function getLaunchCohort(
  storage: Pick<RageResetStorageV1, "progression">,
  seenBeforeThisOpen?: boolean
): LaunchCohort {
  const seen =
    typeof seenBeforeThisOpen === "boolean" ? seenBeforeThisOpen : hasPriorRageResetVisit()
  const completed = storage.progression.completedSessions

  const visitor_cohort: VisitorCohort =
    !seen && completed === 0 ? "first_visit" : "returning_visitor"

  let player_cohort: PlayerCohort = "never_completed"
  if (completed === 1) player_cohort = "first_completion"
  else if (completed > 1) player_cohort = "returning_player"

  return {
    visitor_cohort,
    player_cohort,
    display_mode: getDisplayMode(),
  }
}

/**
 * Cohort for a session_complete event.
 * `previousCompletedSessions` is the count before this completion is applied.
 * `seenBeforeThisOpen` preserves first-visit classification for the current browser open.
 */
export function cohortForSessionComplete(
  previousCompletedSessions: number,
  seenBeforeThisOpen = true
): {
  visitor_cohort: VisitorCohort
  player_cohort: PlayerCohort
  returning_user: boolean
} {
  return {
    visitor_cohort:
      seenBeforeThisOpen || previousCompletedSessions > 0
        ? "returning_visitor"
        : "first_visit",
    player_cohort: previousCompletedSessions <= 0 ? "first_completion" : "returning_player",
    returning_user: previousCompletedSessions > 0,
  }
}

/** Broad analytics props only — no emotional fields. */
export function cohortAnalyticsParams(
  storage: Pick<RageResetStorageV1, "progression">,
  seenBeforeThisOpen?: boolean
): Record<string, string | boolean> {
  const cohort = getLaunchCohort(storage, seenBeforeThisOpen)
  return {
    visitor_cohort: cohort.visitor_cohort,
    player_cohort: cohort.player_cohort,
    display_mode: cohort.display_mode,
    returning_user: storage.progression.completedSessions > 0,
  }
}
