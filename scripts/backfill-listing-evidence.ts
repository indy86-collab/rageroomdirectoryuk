/**
 * One-time deterministic backfill from evidence already stored in listings.json.
 * It does not crawl venue sites or infer unpublished packages/permissions.
 */
import { readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import type { Listing, ListingFeature } from "../types/listing"

const path = join(process.cwd(), "data", "listings.json")
const listings = JSON.parse(readFileSync(path, "utf8")) as Listing[]

for (const listing of listings) {
  if (listing.verified && !listing.lastVerified) {
    // The venue was checked when the verified listing was first published.
    listing.lastVerified = listing.createdAt
  }
  if (!listing.sourceUrl && listing.website) {
    listing.sourceUrl = listing.website
  }

  const ageMatch = listing.description.match(/(?:ages?|minimum age)\s*(\d{1,2})\s*\+?/i)
  if (listing.ageMin == null && ageMatch) {
    listing.ageMin = Number(ageMatch[1])
  }

  const explicitDurations = Array.from(
    listing.description.matchAll(/\b(\d{1,3})[ -]minute/gi),
    (match) => Number(match[1])
  ).filter((duration) => duration >= 5 && duration <= 180)
  if (!listing.sessionLengths?.length && explicitDurations.length) {
    listing.sessionLengths = Array.from(new Set(explicitDurations)).sort((a, b) => a - b)
  }

  const copy = `${listing.name} ${listing.description}`.toLowerCase()
  const features = new Set<ListingFeature>(listing.features ?? [])
  if (/corporate|team building|team-building/.test(copy)) features.add("corporate-groups")
  if (/birthday/.test(copy)) features.add("birthday-parties")
  if (/hen|stag/.test(copy)) features.add("hen-stag-parties")
  if (/couples?|date night/.test(copy)) features.add("couples")
  if (/mobile (?:rage|smash)|mobile smash/.test(copy)) features.add("mobile-experience")
  if (/bring your own|\bbyo\b|\bbyos\b/.test(copy)) features.add("byo-smashables")
  if (features.size) listing.features = Array.from(features)
}

writeFileSync(path, `${JSON.stringify(listings, null, 2)}\n`)
console.log(`Backfilled explicit provenance and listing evidence for ${listings.length} venues`)
