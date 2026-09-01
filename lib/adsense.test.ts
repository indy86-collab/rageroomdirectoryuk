import { describe, expect, it } from "vitest"
import { isAdEligiblePath, splitMarkdownForInArticleAd } from "./adsense"

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
