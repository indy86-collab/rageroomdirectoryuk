export const CANONICAL_SITE_URL = "https://www.rageroomdirectory.co.uk"

function trimTrailingSlash(url: string) {
  return url.replace(/\/+$/, "")
}

function ensureLeadingSlash(path: string) {
  return path.startsWith("/") ? path : `/${path}`
}

export function getSiteUrl() {
  return trimTrailingSlash(process.env.NEXT_PUBLIC_SITE_URL || CANONICAL_SITE_URL)
}

export function getSiteHost() {
  return new URL(getSiteUrl()).host
}

export function absoluteUrl(path = "/") {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path
  }

  return `${getSiteUrl()}${ensureLeadingSlash(path)}`
}

export function listingUrl(slugOrId: string) {
  return absoluteUrl(`/listing/${slugOrId}`)
}

/** Allow only http(s) origins in generated badge/widget markup. */
export function resolvePublicAssetOrigin(value: string) {
  try {
    const url = new URL(value)
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return CANONICAL_SITE_URL
    }
    return url.origin
  } catch {
    return CANONICAL_SITE_URL
  }
}
