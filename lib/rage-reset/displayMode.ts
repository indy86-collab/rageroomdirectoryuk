export type DisplayMode = "browser" | "standalone"

export function getDisplayMode(): DisplayMode {
  if (typeof window === "undefined") return "browser"
  try {
    const mq = window.matchMedia("(display-mode: standalone)")
    if (mq.matches) return "standalone"
    // iOS Safari home-screen
    const nav = window.navigator as Navigator & { standalone?: boolean }
    if (nav.standalone) return "standalone"
  } catch {
    /* ignore */
  }
  return "browser"
}

export type EntrySource =
  | "direct"
  | "nav"
  | "homepage"
  | "listing"
  | "guide"
  | "sitemap"
  | "share"
  | "pwa"
  | "instagram"
  | "facebook"
  | "tester"
  | "unknown"

const ENTRY_SOURCES = new Set<EntrySource>([
  "direct",
  "nav",
  "homepage",
  "listing",
  "guide",
  "sitemap",
  "share",
  "pwa",
  "instagram",
  "facebook",
  "tester",
])

function asEntrySource(value: string | null): EntrySource | null {
  if (!value) return null
  return ENTRY_SOURCES.has(value as EntrySource) ? (value as EntrySource) : null
}

/**
 * Campaign-level entry only. Never encode scores, triggers, or personal data in URLs.
 */
export function getEntrySource(): EntrySource {
  if (typeof window === "undefined") return "unknown"
  try {
    const params = new URLSearchParams(window.location.search)
    const fromSrc = asEntrySource(params.get("src") || params.get("from"))
    if (fromSrc) return fromSrc

    const utmContent = asEntrySource(params.get("utm_content"))
    if (utmContent) return utmContent

    const utmSource = params.get("utm_source")
    if (utmSource === "instagram") return "instagram"
    if (utmSource === "facebook") return "facebook"
    if (utmSource === "tester" || utmSource === "direct_tester") return "tester"

    if (getDisplayMode() === "standalone") return "pwa"
    if (document.referrer.includes(window.location.host)) {
      if (document.referrer.includes("/guides/")) return "guide"
      if (document.referrer.includes("/listing/")) return "listing"
      if (document.referrer.endsWith("/") || document.referrer.includes("/?")) return "homepage"
      return "unknown"
    }
    return "direct"
  } catch {
    return "unknown"
  }
}
