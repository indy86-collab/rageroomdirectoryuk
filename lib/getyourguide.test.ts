import { describe, expect, it } from "vitest"
import {
  AFFILIATE_CHIP_CITIES,
  buildAffiliateCampaign,
  buildGetYourGuideCardUrl,
  buildGetYourGuideBrowseUrl,
  buildGetYourGuideUrl,
  buildOfferCampaign,
  GETYOURGUIDE_PARTNER_ID,
  getComplementaryActivityQuery,
  getOccasionPlannerGroup,
  getThemedActivityCards,
  PLANNER_GROUPS,
  PLANNER_TIMINGS,
  PLANNER_VIBES,
  shouldShowAffiliateOnActivity,
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
    expect(url.pathname).toBe("/destinations/manchester-l1128/")
    expect(url.searchParams.get("partner_id")).toBe(GETYOURGUIDE_PARTNER_ID)
    expect(url.searchParams.get("cmp")).toBe("rageroom_city")
  })

  it("maps Newcastle directory cities onto the GYG destination page", () => {
    const url = new URL(buildGetYourGuideBrowseUrl("Newcastle", "rageroom_city"))
    expect(url.pathname).toBe("/destinations/newcastle-upon-tyne-l444/")
  })

  it("uses destination pages for Brighton, Sheffield and Nottingham", () => {
    expect(
      new URL(buildGetYourGuideBrowseUrl("Brighton", "rageroom_home")).pathname
    ).toBe("/destinations/brighton-l440/")
    expect(
      new URL(buildGetYourGuideBrowseUrl("Sheffield", "rageroom_guide")).pathname
    ).toBe("/destinations/sheffield-l95510/")
    expect(
      new URL(buildGetYourGuideBrowseUrl("Nottingham", "rageroom_near_me"))
        .pathname
    ).toBe("/destinations/nottingham-l145813/")
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
  it("labels city, listing, planner, occasion, lead magnet and new surfaces", () => {
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
    expect(buildAffiliateCampaign({ placement: "home" })).toBe("rageroom_home")
    expect(buildAffiliateCampaign({ placement: "near_me" })).toBe(
      "rageroom_near_me"
    )
    expect(buildAffiliateCampaign({ placement: "guide" })).toBe("rageroom_guide")
    expect(buildAffiliateCampaign({ placement: "activity" })).toBe(
      "rageroom_activity"
    )
    expect(buildAffiliateCampaign({ placement: "lead_magnet" })).toBe(
      "rageroom_lead_magnet"
    )
    expect(buildAffiliateCampaign({ placement: "find" })).toBe("rageroom_find")
  })
})

describe("themed complementary links", () => {
  it("defaults to immersive, food and evening cards without competitor inventory", () => {
    const cards = getThemedActivityCards()
    expect(cards.map((card) => card.id)).toEqual([
      "immersive-games",
      "food-drink",
      "evening",
    ])
    for (const card of cards) {
      expect(usesCompetitorInventoryQuery(card.query ?? "")).toBe(false)
    }
  })

  it("personalises the first card from planner answers", () => {
    const cards = getThemedActivityCards({
      group: "couple",
      vibe: "food-drink",
      timing: "after",
    })

    expect(cards[0]?.id).toBe("best-match")
    expect(cards[0]?.query).toContain("food tours")
    expect(cards[0]?.query).toContain("evening experiences")
    expect(cards[0]?.query).toContain("couples")
    expect(cards).toHaveLength(3)
    expect(cards.some((card) => card.id === "food-drink")).toBe(false)
    expect(cards.some((card) => card.id === "immersive-games")).toBe(true)
  })

  it("never recommends rage rooms, smash rooms or axe throwing", () => {
    for (const group of PLANNER_GROUPS) {
      for (const vibe of PLANNER_VIBES) {
        for (const timing of PLANNER_TIMINGS) {
          const query = getComplementaryActivityQuery({ group, vibe, timing })
          expect(usesCompetitorInventoryQuery(query)).toBe(false)
          for (const card of getThemedActivityCards({ group, vibe, timing })) {
            expect(usesCompetitorInventoryQuery(card.query ?? "")).toBe(false)
          }
        }
      }
    }
  })

  it("uses specific high-intent city picks with offer-level campaigns", () => {
    const manchester = getThemedActivityCards(undefined, "Manchester")
    expect(manchester[0]).toMatchObject({
      id: "etihad-tour",
      path: expect.stringContaining("t155085"),
    })
    const campaign = buildOfferCampaign("rageroom_listing", manchester[0]!.id)
    const url = new URL(
      buildGetYourGuideCardUrl("Manchester", manchester[0]!, campaign)
    )
    expect(url.pathname).toContain("t155085")
    expect(url.searchParams.get("partner_id")).toBe(GETYOURGUIDE_PARTNER_ID)
    expect(url.searchParams.get("cmp")).toBe("rageroom_listing_etihad-tour")

    const london = getThemedActivityCards(undefined, "London")
    const searchUrl = new URL(
      buildGetYourGuideCardUrl(
        "London",
        london[0]!,
        buildOfferCampaign("rageroom_city", london[0]!.id)
      )
    )
    expect(searchUrl.pathname).toBe("/s/")
    expect(searchUrl.searchParams.get("q")).toContain("Sandbox VR")
  })
})

describe("occasion and activity affiliate eligibility", () => {
  it("pre-seeds planner groups for day-out occasions and skips corporate", () => {
    expect(getOccasionPlannerGroup("stag-parties")).toBe("friends")
    expect(getOccasionPlannerGroup("hen-parties")).toBe("friends")
    expect(getOccasionPlannerGroup("birthdays")).toBe("friends")
    expect(getOccasionPlannerGroup("date-night")).toBe("couple")
    expect(getOccasionPlannerGroup("kids-families")).toBe("family")
    expect(shouldShowAffiliateOnOccasion("corporate-team-building")).toBe(false)
    expect(getOccasionPlannerGroup("corporate-team-building")).toBeNull()
  })

  it("shows affiliate on rage-room activity pages and skips paint-splatter", () => {
    expect(shouldShowAffiliateOnActivity("rage-rooms")).toBe(true)
    expect(shouldShowAffiliateOnActivity("paint-splatter")).toBe(false)
  })

  it("exposes compact chip cities with destination browse URLs", () => {
    expect([...AFFILIATE_CHIP_CITIES]).toEqual([
      "London",
      "Manchester",
      "Birmingham",
      "Edinburgh",
      "Liverpool",
      "Leeds",
    ])
    for (const city of AFFILIATE_CHIP_CITIES) {
      const url = new URL(buildGetYourGuideBrowseUrl(city, "rageroom_home"))
      expect(url.origin).toBe("https://www.getyourguide.com")
      expect(url.searchParams.get("partner_id")).toBe(GETYOURGUIDE_PARTNER_ID)
      expect(url.pathname).not.toBe("/s/")
    }
  })
})
