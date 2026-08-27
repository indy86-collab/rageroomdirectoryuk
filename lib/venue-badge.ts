import { escapeHtml } from "@/lib/html-escape"
import { listingUrl, resolvePublicAssetOrigin } from "@/lib/site-url"
import type { Listing } from "@/types/listing"

export const BADGE_EMBED_LINK_REL = "nofollow noopener"

export const VENUE_BADGE_VARIANTS = ["compact", "standard"] as const
export type VenueBadgeVariant = (typeof VENUE_BADGE_VARIANTS)[number]

export const VENUE_BADGE_ASSETS: Record<
  VenueBadgeVariant,
  { src: string; width: number; height: number; alt: string }
> = {
  compact: {
    src: "/badges/listed-on-rageroom-compact.svg",
    width: 180,
    height: 40,
    alt: "Listed on RageRoom Directory",
  },
  standard: {
    src: "/badges/listed-on-rageroom-standard.svg",
    width: 220,
    height: 64,
    alt: "Listed on RageRoom Directory",
  },
}

export function getVenueProfilePath(listing: Pick<Listing, "id" | "slug">) {
  const slugOrId = listing.slug || listing.id
  if (!slugOrId) {
    throw new Error("A venue listing needs a slug or id to build a canonical profile URL")
  }
  return `/listing/${slugOrId}`
}

export function getVenueProfileUrl(listing: Pick<Listing, "id" | "slug">) {
  return listingUrl(listing.slug || listing.id)
}

export function isBadgeEligibleListing(listing: Pick<Listing, "verified" | "id" | "slug">) {
  return listing.verified === true && Boolean(listing.slug || listing.id)
}

export function buildVenueBadgeEmbedHtml({
  listing,
  variant = "standard",
  siteOrigin,
}: {
  listing: Pick<Listing, "id" | "slug" | "name">
  variant?: VenueBadgeVariant
  siteOrigin: string
}) {
  const profileUrl = getVenueProfileUrl(listing)
  const asset = VENUE_BADGE_ASSETS[variant]
  const imageSrc = `${resolvePublicAssetOrigin(siteOrigin)}${asset.src}`
  const alt = asset.alt

  return `<a href="${escapeHtml(profileUrl)}" target="_blank" rel="${BADGE_EMBED_LINK_REL}"><img src="${escapeHtml(imageSrc)}" alt="${escapeHtml(alt)}" width="${asset.width}" height="${asset.height}"></a>`
}

export function venueBadgeLookupOptions(
  listings: Array<Pick<Listing, "id" | "slug" | "name" | "city" | "verified">>
) {
  return listings
    .filter(isBadgeEligibleListing)
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name) || a.city.localeCompare(b.city))
    .map((listing) => ({
      value: listing.slug || listing.id,
      label: `${listing.name} (${listing.city})`,
      name: listing.name,
      city: listing.city,
    }))
}
