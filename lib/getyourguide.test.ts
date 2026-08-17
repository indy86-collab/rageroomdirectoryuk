import { describe, expect, it } from "vitest"
import {
  buildGetYourGuideUrl,
  getActivityRecommendations,
  GETYOURGUIDE_PARTNER_ID,
} from "@/lib/getyourguide"

describe("buildGetYourGuideUrl", () => {
  it("builds a city-specific search carrying the affiliate partner ID", () => {
    const url = new URL(buildGetYourGuideUrl("Manchester"))

    expect(url.origin).toBe("https://www.getyourguide.com")
    expect(url.pathname).toBe("/s/")
    expect(url.searchParams.get("q")).toBe("Manchester, United Kingdom")
    expect(url.searchParams.get("partner_id")).toBe(
      GETYOURGUIDE_PARTNER_ID
    )
  })

  it("encodes multi-word and punctuated city names safely", () => {
    const url = new URL(buildGetYourGuideUrl("Newcastle upon Tyne"))

    expect(url.searchParams.get("q")).toBe(
      "Newcastle upon Tyne, United Kingdom"
    )
  })

  it("adds a personalised search while preserving affiliate attribution", () => {
    const url = new URL(
      buildGetYourGuideUrl("Stockport", "food and drink experiences")
    )

    expect(url.searchParams.get("q")).toBe(
      "food and drink experiences in Stockport, United Kingdom"
    )
    expect(url.searchParams.get("partner_id")).toBe("IZRRCJT")
  })
})

describe("getActivityRecommendations", () => {
  it("returns distinct recommendations for the selected group, vibe and timing", () => {
    const recommendations = getActivityRecommendations({
      group: "couple",
      vibe: "food-drink",
      timing: "after",
    })

    expect(recommendations).toHaveLength(3)
    expect(recommendations.map((recommendation) => recommendation.id)).toEqual([
      "vibe",
      "group",
      "timing",
    ])
    expect(recommendations[0].query).toContain("food")
    expect(recommendations[1].query).toContain("couples")
    expect(recommendations[2].query).toContain("evening")
  })
})
