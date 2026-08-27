import { NextRequest, NextResponse } from "next/server"
import { getListingsWithLocation } from "@/lib/listings"
import { findNearestListings } from "@/lib/nearby-search"
import { isCompleteUkPostcode } from "@/lib/uk-postcode"
import { allowRequest } from "@/lib/rate-limit"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function clientKey(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  )
}

export async function GET(request: NextRequest) {
  if (!allowRequest(`nearby:${clientKey(request)}`, 40, 60_000)) {
    return NextResponse.json(
      { error: "Too many postcode searches. Please wait a moment and try again." },
      { status: 429, headers: { "Cache-Control": "no-store", "Retry-After": "60" } }
    )
  }

  const rawPostcode = request.nextUrl.searchParams.get("postcode")?.trim() || ""
  if (!isCompleteUkPostcode(rawPostcode)) {
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
