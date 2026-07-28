/**
 * Venues that must not appear in data/listings.json and must not be
 * re-added by automation or agent-assisted listing imports.
 */
import blacklistData from "@/data/listings-blacklist.json"

export type BlacklistedVenue = {
  slug: string
  id?: string | null
  name?: string | null
  websiteContains?: string[]
  postcode?: string | null
  city?: string | null
  reason: string
  blacklistedAt?: string
}

export type ListingLike = {
  id?: string | null
  slug?: string | null
  name?: string | null
  website?: string | null
  postcode?: string | null
  city?: string | null
}

export function getListingsBlacklist(): BlacklistedVenue[] {
  return blacklistData as BlacklistedVenue[]
}

function normalize(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase()
}

function websiteMatches(website: string | null | undefined, needles: string[] | undefined): boolean {
  if (!website || !needles?.length) return false
  const haystack = normalize(website)
  return needles.some((needle) => haystack.includes(normalize(needle)))
}

/** Returns the blacklist entry if this listing (or candidate) is excluded. */
export function findBlacklistMatch(listing: ListingLike): BlacklistedVenue | null {
  const slug = normalize(listing.slug)
  const id = normalize(listing.id)
  const name = normalize(listing.name)
  const postcode = normalize(listing.postcode)
  const city = normalize(listing.city)

  for (const entry of getListingsBlacklist()) {
    if (entry.slug && slug === normalize(entry.slug)) return entry
    if (entry.id && id && id === normalize(entry.id)) return entry
    if (websiteMatches(listing.website, entry.websiteContains)) return entry
    if (
      entry.name &&
      name &&
      name === normalize(entry.name) &&
      entry.city &&
      city &&
      city === normalize(entry.city)
    ) {
      return entry
    }
    if (
      entry.postcode &&
      postcode &&
      postcode === normalize(entry.postcode) &&
      entry.name &&
      name &&
      name === normalize(entry.name)
    ) {
      return entry
    }
  }

  return null
}

export function isBlacklistedListing(listing: ListingLike): boolean {
  return findBlacklistMatch(listing) != null
}
