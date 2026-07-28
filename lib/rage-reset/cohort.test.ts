import { describe, expect, it, beforeEach, afterEach, vi } from "vitest"
import {
  cohortForSessionComplete,
  getLaunchCohort,
  hasPriorRageResetVisit,
  markRageResetSeen,
} from "./cohort"
import { RAGE_RESET_BUILD_VERSION, RAGE_RESET_RELEASE_NAME, RAGE_RESET_SW_CACHE } from "./build"

describe("build identifiers", () => {
  it("exposes non-sensitive public validation labels", () => {
    expect(RAGE_RESET_RELEASE_NAME).toContain("Public Validation")
    expect(RAGE_RESET_BUILD_VERSION).toMatch(/^pvr-/)
    expect(RAGE_RESET_SW_CACHE).toMatch(/^rage-reset-pvr-\d+$/)
  })
})

describe("launch cohort", () => {
  beforeEach(() => {
    const store = new Map<string, string>()
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => {
        store.set(k, v)
      },
      removeItem: (k: string) => {
        store.delete(k)
      },
    })
    vi.stubGlobal("window", { localStorage: globalThis.localStorage })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("classifies first visit vs returning visitor", () => {
    const storage = { progression: { completedSessions: 0 } } as never
    expect(getLaunchCohort(storage, false).visitor_cohort).toBe("first_visit")
    markRageResetSeen()
    expect(hasPriorRageResetVisit()).toBe(true)
    expect(getLaunchCohort(storage, true).visitor_cohort).toBe("returning_visitor")
  })

  it("classifies player cohort without emotional data", () => {
    expect(cohortForSessionComplete(0, false).player_cohort).toBe("first_completion")
    expect(cohortForSessionComplete(0, false).visitor_cohort).toBe("first_visit")
    expect(cohortForSessionComplete(2, true).player_cohort).toBe("returning_player")
    expect(cohortForSessionComplete(0)).not.toHaveProperty("score")
  })
})
