import Link from "next/link"
import TrackedBookingLink from "@/components/TrackedBookingLink"
import {
  formatCheckedDate,
  formatListingPrice,
  getListingHref,
  listingHasRageRoom,
} from "@/lib/discovery"
import type { Listing } from "@/types/listing"

function latestCheckedDate(listings: Listing[]) {
  const dates = listings
    .map((listing) => listing.lastVerified)
    .filter((value): value is string => Boolean(value))
    .sort()
  return formatCheckedDate(dates.at(-1))
}

export default function CityPriceComparison({
  listings,
  cityName,
  nearbyOnly,
  locationSlug,
}: {
  listings: Listing[]
  cityName: string
  nearbyOnly: boolean
  locationSlug: string
}) {
  const rageRooms = listings.filter(listingHasRageRoom)
  const rows = (rageRooms.length > 0 ? rageRooms : listings)
    .slice()
    .sort((a, b) => {
      const priceA = a.price ?? Number.POSITIVE_INFINITY
      const priceB = b.price ?? Number.POSITIVE_INFINITY
      if (priceA !== priceB) return priceA - priceB
      return a.name.localeCompare(b.name)
    })

  if (rows.length === 0) return null

  const checked = latestCheckedDate(rows)
  const heading = rageRooms.length > 0
    ? nearbyOnly
      ? `Rage room prices near ${cityName}`
      : `Rage room prices in ${cityName}`
    : nearbyOnly
      ? `Venue prices near ${cityName}`
      : `Venue prices in ${cityName}`

  return (
    <section className="mb-8" aria-labelledby="city-price-comparison">
      <h2 id="city-price-comparison" className="text-xl font-bold text-white">
        {heading}
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-zinc-400">
        {nearbyOnly
          ? `No rage room is listed in ${cityName} yet. These are the nearest rooms, with the published starting price and age limit.`
          : "Starting price, minimum age, and a link to book. Confirm the current price with the venue before you travel."}
        {checked ? ` Prices checked ${checked}.` : ""}
      </p>
      <div className="mt-4 overflow-hidden rounded-lg border border-zinc-800">
        <ul>
          {rows.map((listing) => {
            const price = formatListingPrice(listing)
            const checkedOn = formatCheckedDate(listing.lastVerified)
            const href = getListingHref(listing)
            return (
              <li
                key={listing.id}
                className="grid gap-3 border-b border-zinc-800 bg-[#181818] p-4 last:border-b-0 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto] sm:items-center"
              >
                <div className="min-w-0">
                  <Link href={href} className="font-semibold text-white hover:text-orange-400">
                    {listing.name}
                  </Link>
                  <p className="mt-1 text-sm text-zinc-400">
                    {listing.city}
                    {checkedOn ? ` · Checked ${checkedOn}` : ""}
                  </p>
                </div>
                <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-1">
                  <div>
                    <dt className="text-zinc-500">Price</dt>
                    <dd className="font-semibold text-white">{price ?? "Ask the venue"}</dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500">Age</dt>
                    <dd className="font-semibold text-white">
                      {listing.ageMin != null ? `${listing.ageMin}+` : "Ask the venue"}
                    </dd>
                  </div>
                </dl>
                {listing.bookingUrl ? (
                  <TrackedBookingLink
                    href={listing.bookingUrl}
                    venueSlug={listing.slug || listing.id}
                    venueCity={listing.city}
                    context={{ pageType: "city", discoveryLocation: locationSlug }}
                    ctaPlacement="comparison_table"
                    className="inline-flex min-h-11 items-center justify-center rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
                  >
                    Book
                  </TrackedBookingLink>
                ) : (
                  <Link
                    href={href}
                    className="inline-flex min-h-11 items-center justify-center rounded-md border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200 hover:border-orange-500 hover:text-white"
                  >
                    View venue
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
