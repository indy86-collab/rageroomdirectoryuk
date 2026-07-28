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
    `✅ ${listings.length} listings validated (${blacklist.length} blacklisted venue(s) excluded)`
  )
}

main()
