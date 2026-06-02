/**
 * Download listing photos from Google Places and update data/listings.json
 * Run: npx tsx scripts/fetch-listing-images.ts
 */
import { writeFileSync, mkdirSync, statSync } from "fs"
import { join } from "path"
import { execFileSync } from "child_process"
import listings from "../data/listings.json"
import type { Listing } from "../types/listing"

const API_KEY = process.env.GOOGLE_PLACES_API_KEY
if (!API_KEY) {
  console.error("GOOGLE_PLACES_API_KEY is required")
  process.exit(1)
}

const TARGETS: { slug: string; query: string }[] = [
  { slug: "rage-it-out-consett", query: "Rage It Out Consett DH8 5DA" },
  { slug: "the-rabbit-hole-rage-room-swindon", query: "The Rabbit Hole Rage Room Swindon" },
  { slug: "arcadia-rage-room-darlington", query: "Arcadia Darlington" },
  { slug: "hatchet-harrys-rage-room-liverpool", query: "Hatchet Harry's Liverpool L3 7HJ" },
  { slug: "hatchet-harrys-rage-room-derby", query: "Hatchet Harry's Derby DE1 2PR" },
  { slug: "players-the-rage-rooms-brighton", query: "Players Brighton Kings Road" },
  { slug: "rage-cage-uk-croydon", query: "Rage Cage UK Croydon" },
]

async function findPlace(query: string) {
  const url = new URL("https://maps.googleapis.com/maps/api/place/findplacefromtext/json")
  url.searchParams.set("input", query)
  url.searchParams.set("inputtype", "textquery")
  url.searchParams.set("fields", "place_id,name,photos")
  url.searchParams.set("key", API_KEY!)

  const res = await fetch(url.toString())
  const data = (await res.json()) as {
    status: string
    candidates?: { place_id: string; name: string; photos?: { photo_reference: string }[] }[]
    error_message?: string
  }

  if (data.status !== "OK" || !data.candidates?.[0]) {
    throw new Error(`${query}: ${data.status} ${data.error_message ?? ""}`)
  }

  return data.candidates[0]
}

async function downloadPhoto(photoRef: string, outPath: string) {
  const url = new URL("https://maps.googleapis.com/maps/api/place/photo")
  url.searchParams.set("maxwidth", "1200")
  url.searchParams.set("photo_reference", photoRef)
  url.searchParams.set("key", API_KEY!)

  const res = await fetch(url.toString(), { redirect: "follow" })
  if (!res.ok) throw new Error(`Photo download failed: ${res.status}`)

  const buf = Buffer.from(await res.arrayBuffer())
  writeFileSync(outPath, buf)
}

/** Resize and re-encode JPEGs for listing cards (macOS sips). */
function compressImage(outPath: string) {
  const before = statSync(outPath).size
  execFileSync("sips", ["-Z", "1200", outPath, "--out", outPath], { stdio: "ignore" })
  execFileSync(
    "sips",
    ["-s", "format", "jpeg", "-s", "formatOptions", "60", outPath, "--out", outPath],
    { stdio: "ignore" }
  )
  const after = statSync(outPath).size
  if (after > 350_000) {
    execFileSync("sips", ["-Z", "1000", outPath, "--out", outPath], { stdio: "ignore" })
    execFileSync(
      "sips",
      ["-s", "formatOptions", "55", outPath, "--out", outPath],
      { stdio: "ignore" }
    )
  }
  const final = statSync(outPath).size
  console.log(`  compressed ${Math.round(before / 1024)}KB → ${Math.round(final / 1024)}KB`)
}

async function main() {
  const imagesDir = join(process.cwd(), "public", "images")
  mkdirSync(imagesDir, { recursive: true })

  const allListings = listings as Listing[]
  let updated = 0

  for (const target of TARGETS) {
    const listing = allListings.find((l) => l.slug === target.slug)
    if (!listing) {
      console.warn(`⚠ Listing not found: ${target.slug}`)
      continue
    }

    try {
      const place = await findPlace(target.query)
      const photoRef = place.photos?.[0]?.photo_reference
      if (!photoRef) {
        console.warn(`⚠ No photo for ${target.slug} (${place.name})`)
        continue
      }

      const filename = `${target.slug}.jpg`
      const outPath = join(imagesDir, filename)
      await downloadPhoto(photoRef, outPath)
      compressImage(outPath)

      listing.image = `/images/${filename}`
      listing.googlePlaceId = place.place_id
      updated++
      console.log(`✓ ${target.slug} → /images/${filename} (${place.name})`)
    } catch (e) {
      console.error(`✗ ${target.slug}:`, e)
    }
  }

  writeFileSync(
    join(process.cwd(), "data", "listings.json"),
    JSON.stringify(allListings, null, 2) + "\n"
  )
  console.log(`\nUpdated ${updated} listings`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
