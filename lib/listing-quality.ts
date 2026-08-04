import type { Listing, ListingMedia } from "@/types/listing"
import { absoluteUrl } from "@/lib/site-url"

export const COMPLETENESS_FIELDS = [
  "bookingUrl",
  "ageMin",
  "openingHours",
  "packages",
  "sessionLengths",
  "groupSize",
  "features",
  "sourceUrl",
  "lastVerified",
  "authorisedMedia",
] as const

export type CompletenessField = (typeof COMPLETENESS_FIELDS)[number]

function hasItems(value: unknown): boolean {
  return Array.isArray(value) && value.length > 0
}

export function getAuthorisedMedia(listing: Listing): ListingMedia[] {
  return (listing.media ?? []).filter(
    (media) => media.authorised && media.url.trim() && media.alt.trim()
  )
}

export function getListingCompleteness(listing: Listing) {
  const checks: Record<CompletenessField, boolean> = {
    bookingUrl: Boolean(listing.bookingUrl),
    ageMin: listing.ageMin != null,
    openingHours: hasItems(listing.openingHours),
    packages: hasItems(listing.packages),
    sessionLengths: hasItems(listing.sessionLengths),
    groupSize: listing.groupSizeMin != null || listing.groupSizeMax != null,
    features: hasItems(listing.features),
    sourceUrl: Boolean(listing.sourceUrl),
    lastVerified: Boolean(listing.lastVerified),
    authorisedMedia: getAuthorisedMedia(listing).length > 0,
  }
  const complete = COMPLETENESS_FIELDS.filter((field) => checks[field])
  const missing = COMPLETENESS_FIELDS.filter((field) => !checks[field])

  return {
    checks,
    complete,
    missing,
    score: Math.round((complete.length / COMPLETENESS_FIELDS.length) * 100),
  }
}

export function buildListingMediaSchema(listing: Listing, listingUrl: string) {
  return getAuthorisedMedia(listing).map((media, index) => {
    if (media.type === "video") {
      return {
        "@type": "VideoObject",
        "@id": `${listingUrl}#video-${index + 1}`,
        name: media.caption || media.alt,
        description: media.alt,
        contentUrl: absoluteUrl(media.url),
        ...(media.thumbnailUrl ? { thumbnailUrl: absoluteUrl(media.thumbnailUrl) } : {}),
      }
    }

    return {
      "@type": "ImageObject",
      "@id": `${listingUrl}#image-${index + 1}`,
      contentUrl: absoluteUrl(media.url),
      url: absoluteUrl(media.url),
      caption: media.caption || media.alt,
      ...(media.width ? { width: media.width } : {}),
      ...(media.height ? { height: media.height } : {}),
      ...(media.credit ? { creditText: media.credit } : {}),
      ...(media.sourceUrl ? { isBasedOn: absoluteUrl(media.sourceUrl) } : {}),
    }
  })
}

const FEATURE_LABELS = {
  "byo-smashables": "Bring your own smashables",
  "corporate-groups": "Corporate groups",
  "birthday-parties": "Birthday parties",
  "hen-stag-parties": "Hen and stag groups",
  couples: "Couples",
  "mobile-experience": "Mobile experience",
  "accessible-venue": "Accessible venue",
  "video-recording": "Session video available",
} as const

export function formatListingFeature(feature: keyof typeof FEATURE_LABELS) {
  return FEATURE_LABELS[feature]
}
