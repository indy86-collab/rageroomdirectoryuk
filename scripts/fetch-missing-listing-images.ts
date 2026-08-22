/**
 * Download venue photos from Google Places for listings that have no cover image.
 * Run: npx tsx scripts/fetch-missing-listing-images.ts
 *
 * Official Whistle Punks / TimberJacks domains are compromised, so this uses
 * Google Places photos of the named venues instead of those sites.
 */
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "fs"
import { join } from "path"
import { execFileSync } from "child_process"
import listings from "../data/listings.json"
import type { Listing } from "../types/listing"

function loadEnvLocal() {
  const envPath = join(process.cwd(), ".env.local")
  if (!existsSync(envPath)) return
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eq = trimmed.indexOf("=")
    if (eq === -1) continue
    const key = trimmed.slice(0, eq)
    let value = trimmed.slice(eq + 1)
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = value
  }
}

loadEnvLocal()

const API_KEY = process.env.GOOGLE_PLACES_API_KEY
if (!API_KEY) {
  console.error("GOOGLE_PLACES_API_KEY is required")
  process.exit(1)
}

const TARGETS: { slug: string; query: string }[] = [
  {
    slug: "whistle-punks-london",
    query: "Whistle Punks Urban Axe Throwing 53 Eastcastle Street London W1W 8DN",
  },
  {
    slug: "whistle-punks-manchester",
    query: "Whistle Punks Urban Axe Throwing Great Northern Warehouse 235 Deansgate Manchester M3 4EN",
  },
  {
    slug: "whistle-punks-bristol",
    query: "Whistle Punks Urban Axe Throwing All Saints Street Bristol BS1 2LZ",
  },
  {
    slug: "whistle-punks-leeds",
    query: "Whistle Punks Urban Axe Throwing Millennium Square Leeds LS2 3AD",
  },
  {
    slug: "timberjacks-shrewsbury",
    query: "TimberJacks Axe Throwing Flexspace Stafford Drive Battlefield Enterprise Park Shrewsbury SY1 3FE",
  },
  {
    slug: "timberjacks-kidderminster",
    query: "TimberJacks Axe Throwing Unit E Green Street Kidderminster DY10 1RD",
  },
  {
    slug: "timberjacks-leeds",
    query: "TimberJacks Axe Throwing Flexspace Burley Hill Trading Estate Leeds LS4 2PU",
  },
  {
    slug: "timberjacks-liverpool",
    query: "TimberJacks Axe Throwing Dairy Business Park Long Lane Liverpool L9 7BD",
  },
]

async function findPlace(query: string) {
  const url = new URL("https://maps.googleapis.com/maps/api/place/findplacefromtext/json")
  url.searchParams.set("input", query)
  url.searchParams.set("inputtype", "textquery")
  url.searchParams.set("fields", "place_id,name,photos,formatted_address")
  url.searchParams.set("key", API_KEY!)

  const res = await fetch(url.toString())
  const data = (await res.json()) as {
    status: string
    candidates?: {
      place_id: string
      name: string
      formatted_address?: string
      photos?: { photo_reference: string }[]
    }[]
    error_message?: string
  }

  if (data.status !== "OK" || !data.candidates?.[0]) {
    throw new Error(`${query}: ${data.status} ${data.error_message ?? ""}`)
  }

  return data.candidates[0]
}

async function downloadPhoto(photoRef: string, outPath: string) {
  const url = new URL("https://maps.googleapis.com/maps/api/place/photo")
  url.searchParams.set("maxwidth", "1600")
  url.searchParams.set("photo_reference", photoRef)
  url.searchParams.set("key", API_KEY!)

  const res = await fetch(url.toString(), { redirect: "follow" })
  if (!res.ok) throw new Error(`Photo download failed: ${res.status}`)

  writeFileSync(outPath, Buffer.from(await res.arrayBuffer()))
}

function compressImage(outPath: string) {
  const before = statSync(outPath).size
  execFileSync("sips", ["-Z", "1600", outPath, "--out", outPath], { stdio: "ignore" })
  execFileSync(
    "sips",
    ["-s", "format", "jpeg", "-s", "formatOptions", "70", outPath, "--out", outPath],
    { stdio: "ignore" }
  )
  const after = statSync(outPath).size
  if (after > 400_000) {
    execFileSync("sips", ["-Z", "1200", outPath, "--out", outPath], { stdio: "ignore" })
    execFileSync(
      "sips",
      ["-s", "formatOptions", "60", outPath, "--out", outPath],
      { stdio: "ignore" }
    )
  }
  console.log(`  compressed ${Math.round(before / 1024)}KB → ${Math.round(statSync(outPath).size / 1024)}KB`)
}

async function main() {
  const imagesDir = join(process.cwd(), "public", "images", "venues")
  mkdirSync(imagesDir, { recursive: true })

  const allListings = listings as Listing[]
  let updated = 0

  for (const target of TARGETS) {
    const listing = allListings.find((item) => item.slug === target.slug)
    if (!listing) {
      console.warn(`⚠ Listing not found: ${target.slug}`)
      continue
    }

    try {
      const place = await findPlace(target.query)
      const photoRef = place.photos?.[0]?.photo_reference
      console.log(`→ ${target.slug}: ${place.name} (${place.formatted_address ?? "no address"})`)
      if (!photoRef) {
        console.warn(`⚠ No photo for ${target.slug}`)
        continue
      }

      const filename = `${target.slug}.jpg`
      const outPath = join(imagesDir, filename)
      await downloadPhoto(photoRef, outPath)
      compressImage(outPath)

      listing.image = `/images/venues/${filename}`
      listing.googlePlaceId = place.place_id
      updated++
      console.log(`✓ ${target.slug} → ${listing.image}`)
    } catch (error) {
      console.error(`✗ ${target.slug}:`, error)
    }
  }

  writeFileSync(
    join(process.cwd(), "data", "listings.json"),
    JSON.stringify(allListings, null, 2) + "\n"
  )
  console.log(`\nUpdated ${updated} listings`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
