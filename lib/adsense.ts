export const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-9868896840591922"

export const ADSENSE_INARTICLE_SLOT =
  process.env.NEXT_PUBLIC_ADSENSE_INARTICLE_SLOT?.trim() || "5555492233"

/** Keep local, test and preview traffic away from live advertising. */
export function isLiveAdsenseHost(hostname: string, environment: string): boolean {
  return environment === "production" &&
    ["rageroomdirectory.co.uk", "www.rageroomdirectory.co.uk"].includes(hostname.toLowerCase())
}

/** AdSense ad-unit IDs are numeric. Never emit an incomplete manual ad tag. */
export function isValidAdsenseAdSlot(
  slot: string | null | undefined
): slot is string {
  return typeof slot === "string" && /^\d{5,20}$/.test(slot.trim())
}

const EXCLUDED_EXACT = new Set([
  "/",
  "/guides",
  "/blog",
  "/listings",
  "/near-me",
  "/search",
  "/find",
  "/privacy",
  "/privacy-policy",
  "/terms",
  "/disclaimer",
  "/contact",
  "/about",
  "/uk-map",
  "/london-map",
  "/list-your-rage-room",
  "/corporate-event-builder",
  "/editorial-policy",
])

const EXCLUDED_PREFIXES = [
  "/listing/",
  "/city/",
  "/activities/",
  "/occasions/",
  "/region/",
  "/search",
  "/find",
  "/checkout",
  "/order/",
  "/digital-downloads",
  "/rage-reset",
  "/venue-owner",
  "/download/",
  "/embed/",
  "/insights",
  "/uk-rage-room-report-2026",
  "/for-venues/",
  "/for-publishers",
]

/**
 * Ads load only on long editorial URLs. Directory, booking, checkout,
 * game and legal pages do not mount manual units. Also configure account-side
 * Auto ads exclusions; this route check cannot revoke an already loaded script.
 */
export function isAdEligiblePath(pathname: string): boolean {
  if (!pathname) return false
  const path = pathname.split("?")[0].replace(/\/+$/, "") || "/"
  if (EXCLUDED_EXACT.has(path)) return false
  if (EXCLUDED_PREFIXES.some((prefix) => path === prefix.replace(/\/+$/, "") || path.startsWith(prefix))) {
    return false
  }
  return path.startsWith("/guides/") || path.startsWith("/blog/")
}

/** Split markdown so one in-article unit can sit between two content blocks. */
export function splitMarkdownForInArticleAd(content: string): {
  before: string
  after: string
} {
  const words = content.trim().split(/\s+/).filter(Boolean)
  if (words.length < 280) {
    return { before: content, after: "" }
  }

  const heading = content.search(/\n#{1,3} /)
  if (heading >= 180) {
    return { before: content.slice(0, heading), after: content.slice(heading) }
  }

  const blocks = content.split(/\n\n/)
  if (blocks.length < 4) {
    return { before: content, after: "" }
  }

  const mid = Math.ceil(blocks.length / 2)
  return {
    before: blocks.slice(0, mid).join("\n\n"),
    after: blocks.slice(mid).join("\n\n"),
  }
}
