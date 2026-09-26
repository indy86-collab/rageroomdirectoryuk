import { existsSync, readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import {
  ADSENSE_SCRIPT_SRC,
  MAX_MANUAL_ADS_PER_PAGE,
  isAdEligiblePath,
  isFillableManualAdSlot,
  isLiveAdsenseHost,
  isValidAdsenseAdSlot,
  shouldMountManualAd,
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

describe("shouldMountManualAd", () => {
  const live = {
    hostname: "www.rageroomdirectory.co.uk",
    environment: "production",
    pathname: "/guides/what-to-wear-to-a-rage-room",
    slot: "5555492233",
  }

  it("mounts only when host, path and slot are all valid", () => {
    expect(shouldMountManualAd(live)).toBe(true)
  })

  it("does not load ads when the slot is missing", () => {
    expect(shouldMountManualAd({ ...live, slot: "" })).toBe(false)
    expect(shouldMountManualAd({ ...live, slot: undefined })).toBe(false)
  })

  it("does not load ads on directory or local hosts", () => {
    expect(shouldMountManualAd({ ...live, pathname: "/listing/rage-remedies-romford" })).toBe(false)
    expect(shouldMountManualAd({ ...live, hostname: "localhost" })).toBe(false)
    expect(shouldMountManualAd({ ...live, environment: "development" })).toBe(false)
  })
})

describe("manual ad density", () => {
  it("caps fillable units at one per page", () => {
    expect(MAX_MANUAL_ADS_PER_PAGE).toBe(1)
    const first = { className: "adsbygoogle" } as unknown as Element
    const second = { className: "adsbygoogle" } as unknown as Element
    const root = {
      querySelectorAll: () => [first, second],
    } as unknown as ParentNode
    expect(isFillableManualAdSlot(first, root)).toBe(false)
    expect(isFillableManualAdSlot(second, root)).toBe(false)

    const singleRoot = {
      querySelectorAll: () => [first],
    } as unknown as ParentNode
    expect(isFillableManualAdSlot(first, singleRoot)).toBe(true)
    expect(isFillableManualAdSlot(null, singleRoot)).toBe(false)
  })

  it("keeps the official script URL and never ships a script-only Auto ads fallback", () => {
    expect(ADSENSE_SCRIPT_SRC).toMatch(/^https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-/)
    const source = readFileSync(join(process.cwd(), "components/InArticleAd.tsx"), "utf8")
    expect(source).toContain("if (!allowed) return null")
    expect(source).not.toMatch(/if \(!hasManualSlot\) return loader/)
  })

  it("places at most one InArticleAd in each page or shared template", () => {
    const roots = ["app", "components"]
    const files: string[] = []

    function walk(dir: string) {
      if (!existsSync(dir)) return
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const path = join(dir, entry.name)
        if (entry.isDirectory()) walk(path)
        else if (entry.name.endsWith(".tsx")) files.push(path)
      }
    }
    roots.forEach(walk)

    const offenders = files.flatMap((file) => {
      const matches = readFileSync(file, "utf8").match(/<InArticleAd\b/g) ?? []
      return matches.length > 1 ? [`${file}: ${matches.length}`] : []
    })
    expect(offenders).toEqual([])
  })
})
