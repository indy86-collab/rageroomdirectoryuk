/**
 * One-off: add Rage X-treme (Polegate) listing.
 *
 * Run from project root with env loaded (e.g. DATABASE_URL from .env.local):
 *   export $(grep -v '^#' .env.local | xargs) && npx tsx scripts/add-rage-xtreme.ts
 *
 * Optional: set GOOGLE_PLACES_API_KEY to auto-fill googlePlaceId via Find Place.
 */

import { PrismaClient } from "@prisma/client"
import { generateUniqueSlug } from "../lib/slugify"

const prisma = new PrismaClient()

async function findPlaceId(name: string, city: string): Promise<string | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY
  if (!key) return null
  const query = encodeURIComponent(`${name} ${city} UK`)
  const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${query}&inputtype=textquery&fields=place_id,name,formatted_address&key=${key}`
  const res = await fetch(url)
  const data = (await res.json()) as {
    status: string
    candidates?: { place_id: string; name: string; formatted_address: string }[]
  }
  if (data.status === "OK" && data.candidates?.length) {
    return data.candidates[0].place_id
  }
  return null
}

async function main() {
  const name = "Rage X-treme"
  const city = "Polegate"

  const existing = await prisma.listing.findFirst({
    where: { name, city },
  })
  if (existing) {
    console.log("Listing already exists:", existing.id, existing.slug)
    return
  }

  const slug = await generateUniqueSlug(name, city)
  let googlePlaceId: string | null = null
  try {
    googlePlaceId = await findPlaceId(name, city)
    if (googlePlaceId) console.log("Resolved googlePlaceId:", googlePlaceId)
  } catch (e) {
    console.warn("Could not resolve Place ID (optional):", e)
  }

  const listing = await prisma.listing.create({
    data: {
      name,
      description:
        "Rage X-treme runs one of the largest rage rooms in the UK, with space for up to 10 people in a single session. The venue offers disabled access and wheelchair-friendly access where advertised. Sessions start from £15 per person. Located at Unit C2, Chaucer Business Park, Dittons Road, Polegate (BN26 6QH). Contact the team on 01323 912990 or info@ragex-treme.co.uk for bookings and current packages.",
      city,
      region: "South East",
      postcode: "BN26 6QH",
      location: { lat: 50.818825, lng: 0.270878 },
      website: "https://ragex-treme.co.uk",
      phone: "01323 912990",
      price: 15,
      image: "/images/rageroom_Polegate1.jpg",
      verified: true,
      googlePlaceId,
      slug,
    },
  })

  console.log("Created listing:", listing.id, listing.slug)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
