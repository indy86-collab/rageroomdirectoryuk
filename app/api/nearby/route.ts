import { NextRequest, NextResponse } from "next/server"
import { getListingsWithLocation } from "@/lib/listings"
import { findNearestListings } from "@/lib/nearby-search"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const POSTCODE_RE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i

export async function GET(request: NextRequest) {
  const rawPostcode = request.nextUrl.searchParams.get("postcode")?.trim() || ""
  if (!POSTCODE_RE.test(rawPostcode)) {
    return NextResponse.json(
      { error: "Enter a complete UK postcode, for example SW1A 1AA" },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    )
  }

  try {
    const response = await fetch(
      `https://api.postcodes.io/postcodes/${encodeURIComponent(rawPostcode)}`,
      { signal: AbortSignal.timeout(6_000), cache: "no-store" }
    )
    if (!response.ok) {
      return NextResponse.json(
        { error: "We could not find that postcode" },
        { status: 404, headers: { "Cache-Control": "no-store" } }
      )
    }

    const payload = (await response.json()) as {
      result?: { postcode?: string; latitude?: number; longitude?: number }
    }
    const latitude = payload.result?.latitude
    const longitude = payload.result?.longitude
    if (typeof latitude !== "number" || typeof longitude !== "number") {
      throw new Error("Postcode response did not include coordinates")
    }

    const listings = await getListingsWithLocation()
    const results = findNearestListings(listings, {
      lat: latitude,
      lng: longitude,
    })

    return NextResponse.json(
      {
        postcode: payload.result?.postcode || rawPostcode.toUpperCase(),
        results,
        attribution: "Postcode geocoding by Postcodes.io",
      },
      { headers: { "Cache-Control": "private, no-store" } }
    )
  } catch (error) {
    console.error("Nearby postcode search failed", error)
    return NextResponse.json(
      { error: "Postcode search is temporarily unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    )
  }
}
