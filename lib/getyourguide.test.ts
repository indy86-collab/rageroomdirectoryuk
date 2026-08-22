import { afterEach, describe, expect, it, vi } from "vitest"
import {
  buildAffiliateCampaign,
  buildGetYourGuideBrowseUrl,
  buildGetYourGuideUrl,
  ensureGetYourGuideWidgetScript,
  GETYOURGUIDE_PARTNER_ID,
  GETYOURGUIDE_WIDGET_SCRIPT_SRC,
  getComplementaryActivityQuery,
  getGetYourGuideWidgetDataset,
  getOccasionPlannerGroup,
  getWidgetSearchQuery,
  isGetYourGuideWidgetScriptPresent,
  PLANNER_GROUPS,
  PLANNER_TIMINGS,
  PLANNER_VIBES,
  resetGetYourGuideWidgetScriptForTests,
  shouldShowAffiliateOnOccasion,
  usesCompetitorInventoryQuery,
} from "@/lib/getyourguide"

describe("buildGetYourGuideUrl", () => {
  it("builds a city-specific search carrying the affiliate partner ID and campaign", () => {
    const url = new URL(
      buildGetYourGuideUrl("Manchester", { campaign: "rageroom_city" })
    )

    expect(url.origin).toBe("https://www.getyourguide.com")
    expect(url.pathname).toBe("/s/")
    expect(url.searchParams.get("q")).toBe("Manchester, United Kingdom")
    expect(url.searchParams.get("partner_id")).toBe(GETYOURGUIDE_PARTNER_ID)
    expect(url.searchParams.get("cmp")).toBe("rageroom_city")
  })

  it("encodes multi-word and punctuated city names safely", () => {
    const url = new URL(
      buildGetYourGuideUrl("Newcastle upon Tyne", { campaign: "rageroom_listing" })
    )

    expect(url.searchParams.get("q")).toBe(
      "Newcastle upon Tyne, United Kingdom"
    )
  })

  it("adds a personalised search while preserving affiliate attribution", () => {
    const url = new URL(
      buildGetYourGuideUrl("Stockport", {
        query: "food tours and tastings",
        campaign: "rageroom_planner",
      })
    )

    expect(url.searchParams.get("q")).toBe(
      "food tours and tastings in Stockport, United Kingdom"
    )
    expect(url.searchParams.get("partner_id")).toBe("IZRRCJT")
    expect(url.searchParams.get("cmp")).toBe("rageroom_planner")
  })
})

describe("buildGetYourGuideBrowseUrl", () => {
  it("uses a destination page for mapped cities", () => {
    const url = new URL(
      buildGetYourGuideBrowseUrl("Manchester", "rageroom_city")
    )

    expect(url.origin).toBe("https://www.getyourguide.com")
    expect(url.pathname).toBe("/manchester-l1128/")
    expect(url.searchParams.get("partner_id")).toBe(GETYOURGUIDE_PARTNER_ID)
    expect(url.searchParams.get("cmp")).toBe("rageroom_city")
  })

  it("maps Newcastle directory cities onto the GYG destination page", () => {
    const url = new URL(buildGetYourGuideBrowseUrl("Newcastle", "rageroom_city"))
    expect(url.pathname).toBe("/newcastle-upon-tyne-l444/")
  })

  it("falls back to search for unmapped cities", () => {
    const url = new URL(
      buildGetYourGuideBrowseUrl("Stockport", "rageroom_listing")
    )

    expect(url.pathname).toBe("/s/")
    expect(url.searchParams.get("q")).toBe("Stockport, United Kingdom")
    expect(url.searchParams.get("cmp")).toBe("rageroom_listing")
  })
})

describe("buildAffiliateCampaign", () => {
  it("labels city, listing, planner and occasion placements", () => {
    expect(buildAffiliateCampaign({ placement: "city" })).toBe("rageroom_city")
    expect(buildAffiliateCampaign({ placement: "listing" })).toBe(
      "rageroom_listing"
    )
    expect(
      buildAffiliateCampaign({
        placement: "occasion",
        occasionSlug: "stag-parties",
      })
    ).toBe("rageroom_occasion_stag-parties")
    expect(
      buildAffiliateCampaign({ placement: "city", personalised: true })
    ).toBe("rageroom_planner")
  })
})

describe("complementary widget queries", () => {
  it("defaults to walking tours rather than competing smash inventory", () => {
    const query = getWidgetSearchQuery("Manchester")
    expect(query).toBe(
      "walking tours and attractions in Manchester, United Kingdom"
    )
    expect(usesCompetitorInventoryQuery(query)).toBe(false)
  })

  it("combines vibe, evening timing and couple group without competitor terms", () => {
    const query = getComplementaryActivityQuery({
      group: "couple",
      vibe: "food-drink",
      timing: "after",
    })

    expect(query).toContain("food tours")
    expect(query).toContain("evening experiences")
    expect(query).toContain("couples")
    expect(usesCompetitorInventoryQuery(query)).toBe(false)
  })

  it("never recommends rage rooms, smash rooms or axe throwing", () => {
    for (const group of PLANNER_GROUPS) {
      for (const vibe of PLANNER_VIBES) {
        for (const timing of PLANNER_TIMINGS) {
          const query = getComplementaryActivityQuery({ group, vibe, timing })
          expect(usesCompetitorInventoryQuery(query)).toBe(false)
        }
      }
    }
  })

  it("describes the official activity widget with locale, partner and campaign", () => {
    const dataset = getGetYourGuideWidgetDataset(
      "walking tours and attractions in Leeds, United Kingdom",
      "rageroom_city"
    )

    expect(dataset["data-gyg-widget"]).toBe("activities")
    expect(dataset["data-gyg-partner-id"]).toBe("IZRRCJT")
    expect(dataset["data-gyg-locale-code"]).toBe("en-GB")
    expect(dataset["data-gyg-number-of-items"]).toBe("3")
    expect(dataset["data-gyg-cmp"]).toBe("rageroom_city")
  })
})

describe("occasion affiliate eligibility", () => {
  it("pre-seeds planner groups for day-out occasions and skips corporate", () => {
    expect(getOccasionPlannerGroup("stag-parties")).toBe("friends")
    expect(getOccasionPlannerGroup("hen-parties")).toBe("friends")
    expect(getOccasionPlannerGroup("birthdays")).toBe("friends")
    expect(getOccasionPlannerGroup("date-night")).toBe("couple")
    expect(getOccasionPlannerGroup("kids-families")).toBe("family")
    expect(shouldShowAffiliateOnOccasion("corporate-team-building")).toBe(false)
    expect(getOccasionPlannerGroup("corporate-team-building")).toBeNull()
  })
})

describe("GetYourGuide widget script loading", () => {
  afterEach(() => {
    resetGetYourGuideWidgetScriptForTests()
    vi.unstubAllGlobals()
  })

  it("reports the script as absent until a visitor asks to load it", () => {
    vi.stubGlobal("document", {
      querySelector: vi.fn(() => null),
    })

    expect(isGetYourGuideWidgetScriptPresent()).toBe(false)
  })

  it("injects the widget script once when requested", async () => {
    const created: Array<{
      src: string
      onload: (() => void) | null
    }> = []
    const appendChild = vi.fn(
      (element: { src: string; onload: (() => void) | null }) => {
        created.push(element)
        queueMicrotask(() => element.onload?.())
      }
    )

    vi.stubGlobal("document", {
      querySelector: vi.fn(() => null),
      createElement: vi.fn(() => ({
        src: "",
        async: false,
        defer: false,
        onload: null as (() => void) | null,
        onerror: null,
      })),
      body: { appendChild },
    })

    await Promise.all([
      ensureGetYourGuideWidgetScript(),
      ensureGetYourGuideWidgetScript(),
    ])

    expect(appendChild).toHaveBeenCalledTimes(1)
    expect(created[0]?.src).toBe(GETYOURGUIDE_WIDGET_SCRIPT_SRC)
  })
})
