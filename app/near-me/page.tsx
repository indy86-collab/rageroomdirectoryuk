import { Metadata } from "next"
import Link from "next/link"
import { cityToSlug } from "@/lib/location"
import Breadcrumbs from "@/components/Breadcrumbs"
import FAQ from "@/components/FAQ"
import { globalFAQs } from "@/lib/faqs"
import ListingsGrid from "@/components/ListingsGrid"
import NearMeMap from "@/components/NearMeMap"

export const metadata: Metadata = {
  title: "Rage Room Near Me | Find Local Smash Rooms",
  description: "Find the best rage rooms and smash rooms near you. Browse local venues, compare prices, and book your stress-relief session. Interactive map and city directory included.",
  openGraph: {
    title: "Rage Room Near Me | Find Local Smash Rooms",
    description: "Discover rage rooms and smash rooms in your area. Compare venues, prices, and book your session.",
    type: "website",
  },
}

// Mark this route as dynamic
export const dynamic = 'force-dynamic'

export default async function NearMePage() {
  // Lazy load to prevent build-time initialization
  const { getDistinctCities, getFeaturedListings } = await import("@/lib/listings")
  const cities = await getDistinctCities()
  const nearbyListings = await getFeaturedListings(12) // Show 12 nearby listings

  // LocalBusiness schema for near me page
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Rage Rooms Near Me",
    description: "Find rage rooms and smash rooms near your location",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://rageroomdirectory.co.uk"}/near-me`,
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
            Looking for a rage room near you? You've come to the right place. Our directory helps you find the best smash rooms and anger rooms in your local area, whether you're in London, Manchester, Birmingham, or anywhere across the UK.
          </p>
          <p>
            Use our interactive map below to discover rage rooms near your location, or browse our comprehensive city directory to find venues in specific areas. Each listing includes detailed information about <Link href="/rage-room-prices-uk" className="text-orange-500 hover:text-orange-600 underline">pricing and packages</Link>, safety equipment, and booking options.
          </p>
          <p>
            Rage rooms (also known as smash rooms, break rooms, or anger rooms) provide a safe, controlled environment to release stress by breaking items like plates, electronics, and glass bottles. Perfect for date nights, team building, or simply letting off steam.
          </p>
        </div>

        {/* Interactive Map Section */}
        <section aria-labelledby="map-heading" className="mb-12">
          <h2 id="map-heading" className="text-2xl font-bold text-white mb-6">
            Find Rage Rooms on the Map
          </h2>
          <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-4">
            <NearMeMap listings={nearbyListings} />
          </div>
        </section>

        {/* Nearby Listings */}
        {nearbyListings.length > 0 && (
          <section aria-labelledby="nearby-heading" className="mb-12">
            <h2 id="nearby-heading" className="text-2xl font-bold text-white mb-6">
              Popular Rage Rooms Near You
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
            Find rage rooms in major cities across the UK. Click on any city to view all available venues, compare prices, and book your session.
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
              { city: "London", description: "Discover the best rage rooms in the capital city" },
              { city: "Birmingham", description: "Find smash rooms in the heart of the Midlands" },
              { city: "Manchester", description: "Explore rage rooms in the North West" },
              { city: "Bristol", description: "Book your stress-relief session in the South West" },
              { city: "Newcastle", description: "Find rage rooms in the North East" },
              { city: "Leeds", description: "Discover smash rooms in Yorkshire" },
            ].map(({ city, description }) => (
              <Link
                key={city}
                href={`/city/${cityToSlug(city)}`}
                className="bg-[#181818] hover:bg-[#252525] border border-zinc-800 hover:border-orange-500 rounded-lg p-6 transition-all group"
              >
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-500 transition-colors">
                  Rage Rooms in {city}
                </h3>
                <p className="text-zinc-400">{description}</p>
              </Link>
            ))}
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

