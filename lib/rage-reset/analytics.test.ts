import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"

vi.mock("@/lib/analytics", () => ({
  trackEvent: vi.fn(),
}))

import { trackEvent } from "@/lib/analytics"
import { trackRageReset, sanitizeRageResetParams } from "./analytics"
import { RAGE_RESET_BUILD_VERSION } from "./build"

describe("rage reset analytics privacy", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetModules()
  })

  it("strips scores and triggers from event params", () => {
    trackRageReset("rage_reset_session_complete", {
      room_id: "office-meltdown",
      initialScore: 9,
      finalScore: 2,
      trigger: "work",
      scoreChange: -7,
      calmEnergy: 99,
    })
    expect(trackEvent).toHaveBeenCalledWith("rage_reset_session_complete", {
      room_id: "office-meltdown",
      build_version: RAGE_RESET_BUILD_VERSION,
    })
  })

  it("allows funnel properties and drops unapproved gameplay counts", () => {
    trackRageReset("rage_reset_session_abandoned", {
      stage: "free-smash",
      duration_bucket: "under_30s",
      room_id: "office-meltdown",
      display_mode: "browser",
      objects_destroyed: 12,
      best_combo: 4,
      href: "/near-me",
    })
    expect(trackEvent).toHaveBeenCalledWith("rage_reset_session_abandoned", {
      stage: "free-smash",
      duration_bucket: "under_30s",
      room_id: "office-meltdown",
      display_mode: "browser",
      build_version: RAGE_RESET_BUILD_VERSION,
    })
  })

  it("allows cohort and preference flags", () => {
    const clean = sanitizeRageResetParams({
      visitor_cohort: "first_visit",
      player_cohort: "never_completed",
      returning_user: false,
      sound_enabled: true,
      haptics_enabled: false,
      reduced_effects: true,
      entry_source: "homepage",
      build_version: RAGE_RESET_BUILD_VERSION,
      safetyCause: "high",
      mood: "angry",
    })
    expect(clean).toEqual({
      visitor_cohort: "first_visit",
      player_cohort: "never_completed",
      returning_user: false,
      sound_enabled: true,
      haptics_enabled: false,
      reduced_effects: true,
      entry_source: "homepage",
      build_version: RAGE_RESET_BUILD_VERSION,
    })
  })
})
