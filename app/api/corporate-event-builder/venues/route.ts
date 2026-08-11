import { NextRequest, NextResponse } from "next/server"
import { verifyCorporateBuilderAccess } from "@/lib/corporate-event-builder/access"
import { listingToVenueSearchResult } from "@/lib/corporate-event-builder/venues"
import { searchListings } from "@/lib/listings"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id")
  const access = await verifyCorporateBuilderAccess(sessionId)
  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status })
  }

  const q = request.nextUrl.searchParams.get("q")?.trim() || ""
  const city = request.nextUrl.searchParams.get("city")?.trim() || ""
  const query = q || city

  try {
    const listings = await searchListings(query || undefined, 24)
    const venues = listings.map(listingToVenueSearchResult)
    return NextResponse.json({ venues })
  } catch (error) {
    console.error("Corporate Event Builder venue search failed", error)
    return NextResponse.json({ venues: [] }, { status: 500 })
  }
}
