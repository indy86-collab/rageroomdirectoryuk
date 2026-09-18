import { afterEach, describe, expect, it, vi } from "vitest"
import { approvedPartnerUrl, commercialOffers } from "./commercial-offers"

afterEach(() => vi.unstubAllEnvs())

function clearPartners() {
  vi.stubEnv("NEXT_PUBLIC_BOOKAPARTY_AFFILIATE_URL", "")
  vi.stubEnv("NEXT_PUBLIC_VIRGIN_EXPERIENCES_AFFILIATE_URL", "")
  vi.stubEnv("NEXT_PUBLIC_BUYAGIFT_AFFILIATE_URL", "")
}

describe("commercial offers", () => {
  it("does not invent partnerships when no approved links are configured", () => {
    clearPartners()
    expect(commercialOffers("gift")).toEqual([])
    expect(commercialOffers("alternatives")).toEqual([])
    expect(commercialOffers("group").every(offer => offer.provider === "getyourguide")).toBe(true)
  })
  it("preserves approved tracking parameters and uses partners only for relevant intent", () => {
    clearPartners()
    const href = "https://tracking.example/click?ref=publisher&signature=a%2Bb%3D&destination=groups"
    vi.stubEnv("NEXT_PUBLIC_BOOKAPARTY_AFFILIATE_URL", href)
    expect(commercialOffers("group")[0].href).toBe(href)
    expect(commercialOffers("gift")).toEqual([])
    vi.stubEnv("NEXT_PUBLIC_VIRGIN_EXPERIENCES_AFFILIATE_URL", "https://tracking.example/gifts?ref=publisher")
    expect(commercialOffers("gift")[0].provider).toBe("virginexperiencedays")
  })
  it("fails closed on unsafe or malformed affiliate URLs", () => {
    for (const url of [undefined, "", "javascript:alert(1)", "//example.com", "http://example.com", "https://user:password@example.com", "not a url"]) {
      expect(approvedPartnerUrl(url)).toBeNull()
    }
  })
  it("keeps location and attribution on relevant group and alternative searches", () => {
    clearPartners()
    for (const intent of ["group", "alternatives"] as const) {
      for (const offer of commercialOffers(intent, "Newcastle upon Tyne")) {
        const url = new URL(offer.href)
        expect(url.hostname).toBe("www.getyourguide.com")
        expect(url.searchParams.get("q")).toContain("Newcastle upon Tyne, United Kingdom")
        expect(url.searchParams.get("partner_id")).toBe("IZRRCJT")
        expect(url.searchParams.get("cmp")).toContain(`rageroom_${intent}`)
      }
    }
  })
})
