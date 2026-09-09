import { describe, expect, it } from "vitest"
import {
  isAdEligiblePath,
  isLiveAdsenseHost,
  isValidAdsenseAdSlot,
  splitMarkdownForInArticleAd,
} from "./adsense"

describe("isValidAdsenseAdSlot", () => {
  it("accepts numeric AdSense unit IDs", () => {
    expect(isValidAdsenseAdSlot("1234567890")).toBe(true)
  })

  it("rejects missing, malformed and publisher IDs", () => {
    expect(isValidAdsenseAdSlot("")).toBe(false)
    expect(isValidAdsenseAdSlot(undefined)).toBe(false)
    expect(isValidAdsenseAdSlot("ca-pub-9868896840591922")).toBe(false)
    expect(isValidAdsenseAdSlot("1234abc890")).toBe(false)
  })
})

describe("isAdEligiblePath", () => {
  it("allows editorial guide and blog article URLs", () => {
    expect(isAdEligiblePath("/guides/what-happens-in-a-rage-room")).toBe(true)
    expect(isAdEligiblePath("/guides/best-rage-rooms-london")).toBe(true)
    expect(isAdEligiblePath("/blog/some-post")).toBe(true)
  })

  it("blocks directory, conversion, game and legal URLs", () => {
    expect(isAdEligiblePath("/")).toBe(false)
    expect(isAdEligiblePath("/guides")).toBe(false)
    expect(isAdEligiblePath("/blog")).toBe(false)
    expect(isAdEligiblePath("/listing/rage-out-maidstone-maidstone")).toBe(false)
    expect(isAdEligiblePath("/city/london")).toBe(false)
    expect(isAdEligiblePath("/near-me")).toBe(false)
    expect(isAdEligiblePath("/activities/rage-rooms")).toBe(false)
    expect(isAdEligiblePath("/activities/rage-rooms/london")).toBe(false)
    expect(isAdEligiblePath("/search")).toBe(false)
    expect(isAdEligiblePath("/find")).toBe(false)
    expect(isAdEligiblePath("/checkout/cancel")).toBe(false)
    expect(isAdEligiblePath("/order/success")).toBe(false)
    expect(isAdEligiblePath("/rage-reset")).toBe(false)
    expect(isAdEligiblePath("/digital-downloads/rage-room-party-planner-pack")).toBe(false)
    expect(isAdEligiblePath("/privacy")).toBe(false)
    expect(isAdEligiblePath("/uk-map")).toBe(false)
    expect(isAdEligiblePath("/insights")).toBe(false)
    expect(isAdEligiblePath("/insights/rage-room-prices")).toBe(false)
    expect(isAdEligiblePath("/uk-rage-room-report-2026")).toBe(false)
    expect(isAdEligiblePath("/embed/rage-room-finder")).toBe(false)
    expect(isAdEligiblePath("/for-publishers")).toBe(false)
    expect(isAdEligiblePath("/for-venues/badge")).toBe(false)
  })
})

describe("splitMarkdownForInArticleAd", () => {
  it("keeps short posts in one piece", () => {
    const short = "A short post with only a handful of words."
    expect(splitMarkdownForInArticleAd(short)).toEqual({
      before: short,
      after: "",
    })
  })

  it("splits on the first heading after the intro", () => {
    const intro = Array.from({ length: 80 }, (_, i) => `Intro sentence number ${i}.`).join(" ")
    const content = `${intro}\n# Next section\nBody of the next section with more words here.`
    const split = splitMarkdownForInArticleAd(content)
    expect(split.before).toBe(intro)
    expect(split.after.startsWith("\n# Next section")).toBe(true)
  })
})


describe("live ad environment", () => {
  it("allows only production builds on the two public hosts", () => {
    expect(isLiveAdsenseHost("www.rageroomdirectory.co.uk", "production")).toBe(true)
    expect(isLiveAdsenseHost("rageroomdirectory.co.uk", "production")).toBe(true)
    for (const hostname of ["localhost", "127.0.0.1", "preview.vercel.app", "www.rageroomdirectory.co.uk.example.com"]) {
      expect(isLiveAdsenseHost(hostname, "production")).toBe(false)
    }
    expect(isLiveAdsenseHost("www.rageroomdirectory.co.uk", "development")).toBe(false)
    expect(isLiveAdsenseHost("www.rageroomdirectory.co.uk", "test")).toBe(false)
  })
})
