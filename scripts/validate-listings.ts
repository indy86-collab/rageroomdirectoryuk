/**
 * Validate data/listings.json before commit.
 * Run: npx tsx scripts/validate-listings.ts
 *
 * Also fails if any listing matches data/listings-blacklist.json
 * (closed / do-not-re-add venues).
 */
import { readFileSync } from "fs"
import { join } from "path"
import type { Listing } from "../types/listing"
import {
  findBlacklistMatch,
  getListingsBlacklist,
  type ListingLike,
} from "../lib/listings-blacklist"
import { getListingCompleteness } from "../lib/listing-quality"
import { LISTING_FEATURES } from "../types/listing"

const REQUIRED = ["id", "name", "description", "city", "postcode", "slug"] as const

function main() {
  const path = join(process.cwd(), "data", "listings.json")
  const raw = readFileSync(path, "utf-8")
  const listings = JSON.parse(raw) as Listing[]

  if (!Array.isArray(listings) || listings.length === 0) {
    console.error("❌ listings.json must be a non-empty array")
    process.exit(1)
  }

  const blacklist = getListingsBlacklist()
  const ids = new Set<string>()
  const slugs = new Set<string>()
  let errors = 0
  let warnings = 0

  for (let i = 0; i < listings.length; i++) {
    const l = listings[i]
    const prefix = `[${i}] ${l.name ?? "unknown"}`

    for (const field of REQUIRED) {
      const val = l[field]
      if (val == null || (typeof val === "string" && val.trim() === "")) {
        console.error(`❌ ${prefix}: missing ${field}`)
        errors++
      }
    }

    if (ids.has(l.id)) {
      console.error(`❌ ${prefix}: duplicate id ${l.id}`)
      errors++
    }
    ids.add(l.id)

    if (l.slug) {
      if (slugs.has(l.slug)) {
        console.error(`❌ ${prefix}: duplicate slug ${l.slug}`)
        errors++
      }
      slugs.add(l.slug)
    }

    if (l.location?.lat != null && typeof l.location.lat !== "number") {
      console.error(`❌ ${prefix}: location.lat must be a number or null`)
      errors++
    }
    if (l.location?.lng != null && typeof l.location.lng !== "number") {
      console.error(`❌ ${prefix}: location.lng must be a number or null`)
      errors++
    }

    if (l.groupSizeMin != null && l.groupSizeMax != null && l.groupSizeMin > l.groupSizeMax) {
      console.error(`❌ ${prefix}: groupSizeMin cannot exceed groupSizeMax`)
      errors++
    }
    if (l.features?.some((feature) => !LISTING_FEATURES.includes(feature))) {
      console.error(`❌ ${prefix}: contains an unsupported feature value`)
      errors++
    }
    for (const media of l.media ?? []) {
      if (!media.url || !media.alt || typeof media.authorised !== "boolean") {
        console.error(`❌ ${prefix}: media requires url, alt and authorised`)
        errors++
      }
      if (media.authorised && !media.credit) {
        console.warn(`⚠ ${prefix}: authorised media is missing a credit`)
        warnings++
      }
    }

    const completeness = getListingCompleteness(l)
    if (completeness.missing.length) {
      console.warn(
        `⚠ ${prefix}: ${completeness.score}% complete; missing ${completeness.missing.join(", ")}`
      )
      warnings++
    }

    const blocked = findBlacklistMatch(l as ListingLike)
    if (blocked) {
      console.error(
        `❌ ${prefix}: blacklisted (${blocked.slug}) — ${blocked.reason}`
      )
      errors++
    }
  }

  if (errors > 0) {
    console.error(`\n❌ ${errors} validation error(s)`)
    process.exit(1)
  }

  console.log(
    `✅ ${listings.length} listings validated (${blacklist.length} blacklisted venue(s) excluded, ${warnings} completeness warning(s))`
  )
}

main()
