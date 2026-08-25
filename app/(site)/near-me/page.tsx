import { Metadata } from "next"
import Link from "next/link"
import { cityToSlug } from "@/lib/location"
import Breadcrumbs from "@/components/Breadcrumbs"
import FAQ from "@/components/FAQ"
import { globalFAQs } from "@/lib/faqs"
import ListingsGrid from "@/components/ListingsGrid"
import ListingLeadCapture from "@/components/ListingLeadCapture"
import NearMeMap from "@/components/NearMeMap"
import RageResetCTA from "@/components/RageResetCTA"
import { absoluteUrl } from "@/lib/site-url"

export const metadata: Metadata = {
  title: "Rage Room Near Me | UK Map, Prices & Booking (2026)",
  description:
    "Find a rage room near you with our UK map. Compare verified smash rooms by distance, starting price and age limit, then book online.",
  alternates: { canonical: "/near-me" },
  openGraph: {
    title: "Rage Room Near Me | UK Map, Prices & Booking (2026)",
    description:
      "Locate the closest verified rage room to your postcode. Compare prices, ages and booking links across the UK.",
    type: "website",
  },
}

// ISR: directory data updates infrequently; distance sort happens client-side.
export const revalidate = 86400

export default async function NearMePage() {
  // Lazy load to prevent build-time initialization
  const { getDistinctCities, getFeaturedListings, getListingsWithLocation } = await import("@/lib/listings")
  const cities = await getDistinctCities()
  // Pass EVERY listing with coordinates to the map so the "nearest venue"
  // search actually considers the whole directory, not just the 12 featured
  // rotation. Otherwise a user in London can end up with a 66km nearest match
  // purely because no London venue was in today's featured pool.
  const allLocatedListings = await getListingsWithLocation()
  // Keep a smaller curated list for the non-distance grid below.
  const nearbyListings = await getFeaturedListings(12)

  // LocalBusiness schema for near me page
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Rage Rooms Near Me",
    description: "Find rage rooms and smash rooms near your location",
    url: absoluteUrl("/near-me"),
  }

  // UK major cities list for SEO
  const majorCities = [
    "London", "Birmingham", "Manchester", "Glasgow", "Liverpool", 
    "Leeds", "Sheffield", "Edinburgh", "Bristol", "Cardiff",
    "Newcastle", "Nottingham", "Leicester", "Southampton", "Belfast",
    "Brighton", "Portsmouth", "Reading", "Northampton", "Luton",
    "Bolton", "Bournemouth", "Norwich", "Swindon", "Southend-on-Sea",
    "Middlesbrough", "Peterborough", "Cambridge", "Oxford", "Ipswich",
    "Coventry", "Bradford", "Wolverhampton", "Stoke-on-Trent", "Kingston upon Hull",
    "Plymouth", "Derby", "York", "Blackpool", "Milton Keynes"
  ]

  // Combine database cities with major cities, remove duplicates
  const allCities = Array.from(new Set([...cities, ...majorCities])).sort()

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Rage Room Near Me" },
          ]}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />

        <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-white">
          Rage Room Near Me
        </h1>
        
        <div className="text-base sm:text-lg text-zinc-300 mb-6 sm:mb-8 space-y-3 sm:space-y-4">
          <p>
            Looking for a rage room near you? Use the map below to find the closest verified UK smash room to your postcode — then compare starting prices, age limits and booking links before you travel.
          </p>
          <p>
            Each listing includes{" "}
            <Link href="/rage-room-prices-uk" className="text-orange-500 hover:text-orange-600 underline">
              pricing and packages
            </Link>
            ,{" "}
            <Link href="/guides/are-rage-rooms-safe-uk" className="text-orange-500 hover:text-orange-600 underline">
              safety notes
            </Link>
            , and direct booking options. Prefer browsing by city first? See the{" "}
            <Link href="/guides/rage-room-near-me" className="text-orange-500 hover:text-orange-600 underline">
              UK city guide
            </Link>
            {" "}or the full{" "}
            <Link href="/uk-map" className="text-orange-500 hover:text-orange-600 underline">
              UK rage room map
            </Link>
            .
          </p>
          <p>
            Rage rooms (also known as smash rooms, break rooms, or anger rooms) provide a safe, controlled environment to release stress by breaking items like plates, electronics, and glass bottles. Perfect for date nights, team building, or simply letting off steam.
          </p>
        </div>

        <div className="mb-8 grid gap-4 lg:grid-cols-2">
          <ListingLeadCapture source="near-me" idPrefix="near-me-lead" />
          <RageResetCTA surface="near-me" compact />
        </div>

        {/* Interactive Map Section */}
        <section aria-labelledby="map-heading" className="mb-12">
          <h2 id="map-heading" className="text-2xl font-bold text-white mb-6">
            Find Rage Rooms on the Map
          </h2>
          <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-4">
            <NearMeMap listings={allLocatedListings} />
          </div>
        </section>

        {/* Nearby Listings */}
        {nearbyListings.length > 0 && (
          <section aria-labelledby="nearby-heading" className="mb-12">
            <h2 id="nearby-heading" className="text-2xl font-bold text-white mb-6">
              Rage Rooms Across the UK
            </h2>
            <ListingsGrid listings={nearbyListings} />
          </section>
        )}

        {/* Big List of Cities */}
        <section aria-labelledby="cities-heading" className="mb-12">
          <h2 id="cities-heading" className="text-2xl font-bold text-white mb-6">
            Browse Rage Rooms by City
          </h2>
          <p className="text-zinc-300 mb-6">
            Browse major UK cities below. Where we do not yet list a venue in the city centre, the city page shows the nearest verified smash rooms within travelling distance.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {allCities.map((city) => (
              <Link
                key={city}
                href={`/city/${cityToSlug(city)}`}
                className="bg-[#181818] hover:bg-[#252525] border border-zinc-800 hover:border-orange-500 text-white font-medium py-3 px-4 rounded-md transition-all text-center text-sm sm:text-base"
              >
                {city}
              </Link>
            ))}
          </div>
        </section>

        {/* Additional City Links Section */}
        <section aria-labelledby="popular-cities-heading" className="mb-12">
          <h2 id="popular-cities-heading" className="text-2xl font-bold text-white mb-6">
            Popular Cities for Rage Rooms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { city: "London", description: "The UK's largest selection of rage rooms across multiple boroughs, from East London warehouses to central venues" },
              { city: "Birmingham", description: "The Midlands' main hub for destruction therapy, with competitive pricing and easy access from across the West Midlands" },
              { city: "Manchester", description: "Find the nearest verified smash rooms within travelling distance of Manchester — compare prices and book nearby venues" },
              { city: "Bristol", description: "Nearest South West smash rooms within travelling distance of Bristol, Bath and Weston-super-Mare" },
              { city: "Newcastle", description: "The North East's go-to city for group rage room experiences, especially popular with party bookings" },
              { city: "Leeds", description: "Nearest West Yorkshire smash rooms for Leeds groups — compare nearby venues, prices and booking links" },
              { city: "Glasgow", description: "Nearest Central Belt smash rooms for Glasgow stag parties, birthdays and stress-relief sessions" },
              { city: "Cardiff", description: "Wales' main hub for rage rooms — compare Cardiff venues, prices and group packages" },
            ].map(({ city, description }) => (
              <Link
                key={city}
                href={`/city/${cityToSlug(city)}`}
                className="bg-[#181818] hover:bg-[#252525] border border-zinc-800 hover:border-orange-500 rounded-lg p-6 transition-all group"
              >
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-500 transition-colors">
                  Rage Rooms Near {city}
                </h3>
                <p className="text-zinc-400 text-sm">{description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Topical guide cluster — dense internal linking for crawl depth
            and LLM topical authority. */}
        <section
          aria-labelledby="guides-heading"
          className="mb-12 bg-[#181818] rounded-lg border border-zinc-800 p-6"
        >
          <h2
            id="guides-heading"
            className="text-2xl font-bold text-white mb-4"
          >
            Planning your visit
          </h2>
          <p className="text-zinc-300 mb-4">
            Before you book, make sure you know what to expect. Our UK rage
            room guides cover pricing, safety, first-time tips and specialist
            use cases like couples and corporate team building.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/guides/what-happens-in-a-rage-room"
              className="p-3 rounded-lg border border-zinc-700 hover:border-orange-500/50 transition-colors"
            >
              <p className="text-white font-semibold text-sm">
                What happens in a rage room?
              </p>
              <p className="text-zinc-400 text-xs mt-1">Step-by-step first visit guide</p>
            </Link>
            <Link
              href="/guides/how-much-do-rage-rooms-cost-uk"
              className="p-3 rounded-lg border border-zinc-700 hover:border-orange-500/50 transition-colors"
            >
              <p className="text-white font-semibold text-sm">
                How much do rage rooms cost in the UK?
              </p>
              <p className="text-zinc-400 text-xs mt-1">Solo, couples, group &amp; corporate pricing</p>
            </Link>
            <Link
              href="/guides/are-rage-rooms-safe-uk"
              className="p-3 rounded-lg border border-zinc-700 hover:border-orange-500/50 transition-colors"
            >
              <p className="text-white font-semibold text-sm">Are rage rooms safe?</p>
              <p className="text-zinc-400 text-xs mt-1">PPE, age limits &amp; insurance</p>
            </Link>
            <Link
              href="/guides/best-rage-rooms-for-couples"
              className="p-3 rounded-lg border border-zinc-700 hover:border-orange-500/50 transition-colors"
            >
              <p className="text-white font-semibold text-sm">Rage rooms for couples</p>
              <p className="text-zinc-400 text-xs mt-1">Date night packages &amp; private sessions</p>
            </Link>
            <Link
              href="/guides/best-rage-rooms-for-team-building"
              className="p-3 rounded-lg border border-zinc-700 hover:border-orange-500/50 transition-colors"
            >
              <p className="text-white font-semibold text-sm">
                Rage rooms for team building
              </p>
              <p className="text-zinc-400 text-xs mt-1">Corporate events &amp; away-day bookings</p>
            </Link>
            <Link
              href="/guides"
              className="p-3 rounded-lg border border-zinc-700 hover:border-orange-500/50 transition-colors"
            >
              <p className="text-white font-semibold text-sm">All rage room guides</p>
              <p className="text-zinc-400 text-xs mt-1">Full editorial library</p>
            </Link>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQ items={globalFAQs} title="Frequently Asked Questions About Rage Rooms Near Me" />

        {/* Call to Action */}
        <div className="mt-12 text-center bg-[#181818] rounded-lg border border-zinc-800 p-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Can't Find a Rage Room Near You?
          </h2>
          <p className="text-zinc-300 mb-6">
            We're constantly adding new venues to our directory. If you own or know of a rage room that's not listed, help us grow the directory!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/list-your-rage-room"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-md transition-colors"
            >
              List Your Rage Room
            </Link>
            <Link
              href="/listings"
              className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white border border-zinc-700 font-semibold px-8 py-3 rounded-md transition-colors"
            >
              Browse All Rage Rooms
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
