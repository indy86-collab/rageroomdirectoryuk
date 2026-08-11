import { NextRequest, NextResponse } from "next/server"
import {
  readAccessTokenFromRequest,
  resolveCorporateBookingAccess,
} from "@/lib/corporate-booking-system/access"
import { listingToDirectoryOption } from "@/lib/corporate-booking-system/venues"
import { getListingById, searchListings } from "@/lib/listings"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const accessToken =
    request.nextUrl.searchParams.get("access") ||
    readAccessTokenFromRequest(request)
  const sessionId = request.nextUrl.searchParams.get("session_id")
  const access = await resolveCorporateBookingAccess({ accessToken, sessionId })
  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status })
  }

  const listingId = request.nextUrl.searchParams.get("listing_id")?.trim()
  if (listingId) {
    const listing = await getListingById(listingId)
    if (!listing) {
      return NextResponse.json({ error: "Listing not found." }, { status: 404 })
    }
    return NextResponse.json({
      venue: listingToDirectoryOption(listing),
      listing,
    })
  }

  const q = request.nextUrl.searchParams.get("q")?.trim() || ""
  try {
    const listings = await searchListings(q || undefined, 24)
    return NextResponse.json({
      venues: listings.map(listingToDirectoryOption),
    })
  } catch (error) {
    console.error("Corporate Booking System venue search failed", error)
    return NextResponse.json({ venues: [] }, { status: 500 })
  }
}
