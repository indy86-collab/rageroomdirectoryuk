import { NextRequest, NextResponse } from "next/server"
import { getDistinctCities } from "@/lib/listings"
import { searchListings } from "@/lib/listings"
import { cityToSlug } from "@/lib/location"

// Mark this route as dynamic
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")?.trim() || ""

  if (!query || query.length < 2) {
    return NextResponse.json({ cities: [], listings: [] })
  }

  try {
    // Get cities that match the query
    const allCities = await getDistinctCities()
    const matchingCities = allCities
      .filter((city) => city.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5) // Limit to 5 cities

    // Get listings that match the query
    const matchingListings = await searchListings(query, 5)

    // Format cities for response
    const citySuggestions = matchingCities.map((city) => ({
      type: "city" as const,
      label: city,
      href: `/city/${cityToSlug(city)}`,
    }))

    // Format listings for response
    const listingSuggestions = matchingListings.map((listing) => ({
      type: "listing" as const,
      label: `${listing.name} ${listing.city}`,
      href: `/listing/${listing.slug || listing.id}`,
      city: listing.city,
    }))

    return NextResponse.json({
      cities: citySuggestions,
      listings: listingSuggestions,
    })
  } catch (error) {
    console.error("Error fetching search suggestions:", error)
    return NextResponse.json({ cities: [], listings: [] }, { status: 500 })
  }
}


