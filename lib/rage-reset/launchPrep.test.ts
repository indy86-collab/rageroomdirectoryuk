import { describe, expect, it } from "vitest"
import {
  ROUTE_INVENTORY,
  assertPublicPath,
  pathsNeverExposeRouteGroups,
} from "./routeInventory"
import { durationBucket } from "./durationBuckets"
import {
  consecutiveControlMultiplier,
  controlledStrikeFeedback,
  breathPhase,
} from "./scoring"
import { CONTROLLED_STRIKE_CONFIG } from "./sessionTiming"

describe("route inventory", () => {
  it("never exposes route-group segments in public paths", () => {
    const bad = pathsNeverExposeRouteGroups(ROUTE_INVENTORY.map((r) => r.path))
    expect(bad).toEqual([])
    for (const route of ROUTE_INVENTORY) {
      expect(() => assertPublicPath(route.path)).not.toThrow()
    }
  })

  it("includes homepage, directory, legal, sitemap, robots and rage-reset", () => {
    const paths = new Set(ROUTE_INVENTORY.map((r) => r.path))
    expect(paths.has("/")).toBe(true)
    expect(paths.has("/listings")).toBe(true)
    expect(paths.has("/rage-reset")).toBe(true)
    expect(paths.has("/sitemap.xml")).toBe(true)
    expect(paths.has("/robots.txt")).toBe(true)
    expect(paths.has("/contact")).toBe(true)
    expect(paths.has("/privacy")).toBe(true)
  })
})

describe("duration buckets", () => {
  it("buckets durations coarsely", () => {
    expect(durationBucket(10_000)).toBe("under_30s")
    expect(durationBucket(45_000)).toBe("30s_1m")
    expect(durationBucket(90_000)).toBe("1m_2m")
    expect(durationBucket(150_000)).toBe("2m_3m")
    expect(durationBucket(240_000)).toBe("3m_5m")
    expect(durationBucket(400_000)).toBe("over_5m")
  })
})

describe("controlled strike polish helpers", () => {
  it("builds consecutive multipliers", () => {
    expect(consecutiveControlMultiplier(0)).toBe(1)
    expect(consecutiveControlMultiplier(2)).toBeCloseTo(1.36)
    expect(consecutiveControlMultiplier(99)).toBeCloseTo(1 + 5 * 0.18)
  })

  it("labels feedback without clinical language", () => {
    expect(controlledStrikeFeedback(1, false)).toBe("Perfect control")
    expect(controlledStrikeFeedback(0.6, false)).toBe("Strong hit")
    expect(controlledStrikeFeedback(0, true)).toBe("Too early")
  })

  it("respects configurable breath timing", () => {
    const early = breathPhase(100, CONTROLLED_STRIKE_CONFIG)
    expect(early.phase).toBe("expand")
    expect(early.inCalmZone).toBe(false)
    const lateExpand = breathPhase(
      CONTROLLED_STRIKE_CONFIG.expandMs * 0.9,
      CONTROLLED_STRIKE_CONFIG
    )
    expect(lateExpand.inCalmZone).toBe(true)
  })
})
