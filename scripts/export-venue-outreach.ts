import listings from "../data/listings.json"
import { getListingCompleteness } from "../lib/listing-quality"
import { listingUrl } from "../lib/site-url"
import type { Listing } from "../types/listing"

const PRIORITY_CITIES = new Set([
  "Edinburgh", "Manchester", "Bournemouth", "Swansea", "Sheffield",
  "London", "Birmingham", "Nottingham", "Leicester", "Oxford",
  "Peterborough", "Portsmouth", "Coventry", "Southampton",
])

function csv(value: string | number | boolean) {
  const string = String(value)
  return /[",\n]/.test(string) ? `"${string.replace(/"/g, '""')}"` : string
}

const rows = (listings as Listing[])
  .map((listing) => {
    const completeness = getListingCompleteness(listing)
    return {
      priority: PRIORITY_CITIES.has(listing.city),
      score: completeness.score,
      venue: listing.name,
      city: listing.city,
      website: listing.website || "",
      phone: listing.phone || "",
      listing: listingUrl(listing.slug || listing.id),
      missing: completeness.missing.join("; "),
      subject: `Please verify ${listing.name} on RageRoom Directory`,
    }
  })
  .sort((a, b) => Number(b.priority) - Number(a.priority) || a.score - b.score)

console.log("priority,score,venue,city,website,phone,listing_url,missing_fields,suggested_subject")
for (const row of rows) console.log(Object.values(row).map(csv).join(","))
