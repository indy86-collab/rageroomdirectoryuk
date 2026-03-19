/**
 * Looks up real Google Place IDs for all listings and updates the database.
 * 
 * Prerequisites:
 *   1. Enable billing on your Google Cloud project
 *   2. Enable "Places API" in Google Cloud Console
 *   3. GOOGLE_PLACES_API_KEY must be set in .env.local
 * 
 * Usage:
 *   npx tsx scripts/fetch-google-place-ids.ts
 * 
 * What it does:
 *   - For each listing, searches Google Places for the business name + city
 *   - Shows the matched result for verification
 *   - Updates the listing's googlePlaceId in the database
 *   - Adds a 500ms delay between requests to stay within rate limits
 */

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
const API_KEY = process.env.GOOGLE_PLACES_API_KEY

interface PlaceCandidate {
  place_id: string
  name: string
  formatted_address: string
  rating?: number
  user_ratings_total?: number
}

interface FindPlaceResponse {
  candidates: PlaceCandidate[]
  status: string
  error_message?: string
}

interface PlaceDetailsResponse {
  result: {
    place_id: string
    name: string
    formatted_address: string
    rating?: number
    user_ratings_total?: number
    reviews?: {
      author_name: string
      rating: number
      text: string
      relative_time_description: string
    }[]
  }
  status: string
}

async function findPlaceId(name: string, city: string): Promise<PlaceCandidate | null> {
  const query = encodeURIComponent(`${name} ${city} UK`)
  const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${query}&inputtype=textquery&fields=place_id,name,formatted_address,rating,user_ratings_total&key=${API_KEY}`

  const res = await fetch(url)
  const data: FindPlaceResponse = await res.json()

  if (data.status !== "OK" || data.candidates.length === 0) {
    // Try a broader search with just the business name
    const fallbackQuery = encodeURIComponent(`${name} UK rage room`)
    const fallbackUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${fallbackQuery}&inputtype=textquery&fields=place_id,name,formatted_address,rating,user_ratings_total&key=${API_KEY}`

    const fallbackRes = await fetch(fallbackUrl)
    const fallbackData: FindPlaceResponse = await fallbackRes.json()

    if (fallbackData.status === "OK" && fallbackData.candidates.length > 0) {
      return fallbackData.candidates[0]
    }

    return null
  }

  return data.candidates[0]
}

async function getPlaceReviewCount(placeId: string): Promise<{ rating: number | null; reviewCount: number }> {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,user_ratings_total,reviews&key=${API_KEY}`
  const res = await fetch(url)
  const data: PlaceDetailsResponse = await res.json()

  if (data.status !== "OK") {
    return { rating: null, reviewCount: 0 }
  }

  return {
    rating: data.result.rating || null,
    reviewCount: data.result.reviews?.length || 0,
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
  if (!API_KEY) {
    console.error("ERROR: GOOGLE_PLACES_API_KEY not set.")
    console.error("Add it to .env.local and make sure billing is enabled on your Google Cloud project.")
    process.exit(1)
  }

  console.log("Fetching all listings from database...\n")
  const listings = await prisma.listing.findMany({
    select: { id: true, name: true, city: true, googlePlaceId: true },
    orderBy: { name: "asc" },
  })

  console.log(`Found ${listings.length} listings.\n`)
  console.log("=" .repeat(80))

  let updated = 0
  let notFound = 0
  let alreadyValid = 0
  let errors = 0

  for (const listing of listings) {
    console.log(`\n[${listing.name}] (${listing.city})`)

    // Check if existing Place ID looks real (real ones are 27+ chars)
    const hasValidId = listing.googlePlaceId && listing.googlePlaceId.length > 20 && !listing.googlePlaceId.includes("_")
    if (hasValidId) {
      console.log(`  Already has valid Place ID: ${listing.googlePlaceId}`)
      alreadyValid++
      continue
    }

    try {
      const candidate = await findPlaceId(listing.name, listing.city)

      if (!candidate) {
        console.log(`  NOT FOUND on Google Places`)
        notFound++
        await sleep(300)
        continue
      }

      console.log(`  Found: ${candidate.name}`)
      console.log(`  Address: ${candidate.formatted_address}`)
      console.log(`  Place ID: ${candidate.place_id}`)
      if (candidate.rating) {
        console.log(`  Rating: ${candidate.rating}/5 (${candidate.user_ratings_total} reviews)`)
      }

      // Verify it has reviews
      await sleep(300)
      const details = await getPlaceReviewCount(candidate.place_id)
      console.log(`  Reviews available: ${details.reviewCount}`)

      // Update the database
      await prisma.listing.update({
        where: { id: listing.id },
        data: { googlePlaceId: candidate.place_id },
      })
      console.log(`  UPDATED in database`)
      updated++
    } catch (err) {
      console.log(`  ERROR: ${err}`)
      errors++
    }

    await sleep(500)
  }

  console.log("\n" + "=".repeat(80))
  console.log(`\nDone!`)
  console.log(`  Updated: ${updated}`)
  console.log(`  Already valid: ${alreadyValid}`)
  console.log(`  Not found on Google: ${notFound}`)
  console.log(`  Errors: ${errors}`)

  await prisma.$disconnect()
}

main().catch(console.error)
