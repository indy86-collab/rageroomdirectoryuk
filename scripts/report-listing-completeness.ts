import listings from "../data/listings.json"
import { getListingCompleteness } from "../lib/listing-quality"
import type { Listing } from "../types/listing"

const PRIORITY_CITIES = new Set([
  "Edinburgh",
  "Manchester",
  "Bournemouth",
  "Swansea",
  "Sheffield",
  "London",
  "Birmingham",
  "Nottingham",
  "Leicester",
  "Oxford",
  "Peterborough",
  "Portsmouth",
  "Coventry",
  "Southampton",
])

const rows = (listings as Listing[])
  .map((listing) => ({
    listing,
    ...getListingCompleteness(listing),
    priority: PRIORITY_CITIES.has(listing.city),
  }))
  .sort((a, b) => Number(b.priority) - Number(a.priority) || a.score - b.score)

console.log("Priority | Score | Venue | City | Missing fields")
console.log("--- | ---: | --- | --- | ---")
for (const row of rows) {
  console.log(
    `${row.priority ? "Yes" : "No"} | ${row.score}% | ${row.listing.name} | ${row.listing.city} | ${row.missing.join(", ") || "None"}`
  )
}

const average = Math.round(
  rows.reduce((sum, row) => sum + row.score, 0) / Math.max(rows.length, 1)
)
console.log(`\n${rows.length} listings · ${average}% average completeness`)
