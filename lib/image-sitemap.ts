import { getAuthorisedMedia } from "@/lib/listing-quality"
import { absoluteUrl, getSiteHost, listingUrl } from "@/lib/site-url"
import type { Listing } from "@/types/listing"

function xmlEscape(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => {
    const entities: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "'": "&apos;",
      '"': "&quot;",
    }
    return entities[character]
  })
}

function sitemapImageUrl(value: string) {
  const resolved = absoluteUrl(value)
  const verifiedHosts = new Set([
    getSiteHost(),
    ...(process.env.IMAGE_SITEMAP_VERIFIED_HOSTS || "")
      .split(",")
      .map((host) => host.trim())
      .filter(Boolean),
  ])
  try {
    return verifiedHosts.has(new URL(resolved).host) ? resolved : null
  } catch {
    return null
  }
}

export function buildImageSitemapXml(listings: Listing[]) {
  const entries = listings
    .map((listing) => {
      if (!listing.verified) return ""

      const urls = new Set<string>()
      for (const media of getAuthorisedMedia(listing)) {
        if (media.type !== "image") continue
        const url = sitemapImageUrl(media.url)
        if (url) urls.add(url)
      }

      // First-party listing cover images hosted on the site are safe to
      // advertise even before a full authorised media gallery exists.
      if (listing.image) {
        const coverUrl = sitemapImageUrl(listing.image)
        if (coverUrl) urls.add(coverUrl)
      }

      if (urls.size === 0) return ""

      const imageEntries = [...urls]
        .map(
          (url) => `    <image:image>
      <image:loc>${xmlEscape(url)}</image:loc>
    </image:image>`
        )
        .join("\n")

      return `  <url>
    <loc>${xmlEscape(listingUrl(listing.slug || listing.id))}</loc>
${imageEntries}
  </url>`
    })
    .filter(Boolean)
    .join("\n")

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries}
</urlset>\n`
}
