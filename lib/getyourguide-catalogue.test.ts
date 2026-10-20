import { describe, expect, it } from "vitest"
import { GETYOURGUIDE_CATALOGUE, eligibleRecommendations, curatedProductUrl, getYourGuideCampaign, cityBrowseOffer } from "./getyourguide-catalogue"
import { commercialOffers } from "./commercial-offers"

describe("verified GetYourGuide catalogue", () => {
  it("keeps product, city, source and attribution identity on every direct link", () => {
    const campaigns = new Set<string>()
    for (const placement of ["city", "listing", "guide", "occasion", "activity"]) {
      for (const product of GETYOURGUIDE_CATALOGUE) {
        const campaign = getYourGuideCampaign({ placement, city: product.city, occasion: "birthdays", recommendationId: product.id })
        expect(campaign.length).toBeLessThanOrEqual(100)
        expect(campaigns.has(campaign)).toBe(false)
        campaigns.add(campaign)
        const url = new URL(curatedProductUrl(product, campaign))
        expect(url.pathname).toContain(`-t${product.productId}/`)
        expect(url.searchParams.get("partner_id")).toBe("IZRRCJT")
        expect(url.searchParams.get("cmp")).toBe(campaign)
        expect(product.source).toBe(product.canonicalUrl)
        expect(product.verifiedAt).toBe("2026-10-20")
      }
    }
  })
  it("filters local inventory, audience, timing and vibe without broadening the search", () => {
    expect(eligibleRecommendations("London", { group: "family", vibe: "adrenaline" }).map(p => p.id)).toEqual(["sandbox-vr"])
    expect(eligibleRecommendations("London", { vibe: "food-drink" })).toEqual([])
    expect(eligibleRecommendations("Oxford")).toEqual([])
    expect(eligibleRecommendations("Edinburgh", { group: "family" }).map(p => p.id)).toEqual(["edinburgh-castle"])
    expect(eligibleRecommendations("Edinburgh", { group: "friends", timing: "before" }).some(p => p.id === "vaults-terror")).toBe(false)
    expect(eligibleRecommendations("Edinburgh", { group: "friends", timing: "after" }).map(p => p.id)).toEqual(["edinburgh-castle", "vaults-terror"])
    for (const timing of [undefined, "before", "full-day"] as const) {
      expect(eligibleRecommendations("Manchester", { group: "friends", timing }).some(p => p.id === "funnyboyz")).toBe(false)
    }
    expect(eligibleRecommendations("Manchester", { group: "friends", timing: "after" }).map(p => p.id)).toContain("funnyboyz")
    expect(eligibleRecommendations("Manchester", { group: "family", timing: "after" }).some(p => p.adultOnly)).toBe(false)
  })
  it("omits unavailable products and limits each module to two", () => {
    const product = GETYOURGUIDE_CATALOGUE[0]
    expect(eligibleRecommendations("London", {}, [{ ...product, status: "unavailable" }])).toEqual([])
    expect(eligibleRecommendations("London", {}, [product, product, product])).toHaveLength(2)
  })
  it("uses the same products in commercial and standard modules, with one city browse route", () => {
    const offers = commercialOffers("group", "Manchester", "occasion_birthdays").filter(p => p.provider === "getyourguide")
    expect(offers.filter(p => p.product).map(p => p.product?.id)).toEqual(eligibleRecommendations("Manchester", { group: "friends", timing: "after" }).map(p => p.id))
    expect(offers.filter(p => p.id === "browse-all")).toHaveLength(1)
    expect(offers.every(p => new URL(p.href).searchParams.get("cmp")?.includes("occasion-birthdays_manchester_group"))).toBe(true)
  })
  it("retains originating placement and city when planner answers change", () => {
    const product = eligibleRecommendations("London", { group: "family", vibe: "adrenaline", timing: "after" })[0]
    const campaign = getYourGuideCampaign({ city: "London", placement: "listing", recommendationId: product.id })
    expect(campaign).toBe("rr2_listing_london_general_sandbox-vr")
    expect(cityBrowseOffer("London", "guide").campaign).toBe("rr2_guide_london_general_browse-all")
    expect(cityBrowseOffer("Liverpool", "guide").campaign).not.toBe(cityBrowseOffer("London", "guide").campaign)
  })
  it("rejects an external or mismatched product destination", () => {
    for (const canonicalUrl of ["https://example.com/a-t1036747/", "http://www.getyourguide.com/a-t1036747/", "https://www.getyourguide.com/a-t1/"]) {
      expect(() => curatedProductUrl({ ...GETYOURGUIDE_CATALOGUE[0], canonicalUrl }, "test")).toThrow()
    }
  })
})

describe("GetYourGuide rollout switches", () => {
  it("defaults to measurement first and independently permits rollback", async () => {
    const { vi } = await import("vitest")
    vi.resetModules()
    vi.stubEnv("NEXT_PUBLIC_GYG_CURATED_ENABLED", "false")
    vi.stubEnv("NEXT_PUBLIC_GYG_ANALYZER_ENABLED", "true")
    const measurement = await import("./getyourguide-catalogue")
    expect(measurement.GYG_CURATED_ENABLED).toBe(false)
    expect(measurement.GYG_ANALYZER_ENABLED).toBe(true)
    vi.resetModules()
    vi.stubEnv("NEXT_PUBLIC_GYG_CURATED_ENABLED", "true")
    vi.stubEnv("NEXT_PUBLIC_GYG_ANALYZER_ENABLED", "false")
    const pilot = await import("./getyourguide-catalogue")
    expect(pilot.GYG_CURATED_ENABLED).toBe(true)
    expect(pilot.GYG_ANALYZER_ENABLED).toBe(false)
    vi.unstubAllEnvs()
    vi.resetModules()
  })
})
