import { Metadata } from "next"
import Link from "next/link"
import { cityToSlug } from "@/lib/location"
import Breadcrumbs from "@/components/Breadcrumbs"
import FAQ from "@/components/FAQ"
import { globalFAQs } from "@/lib/faqs"
import ListingsGrid from "@/components/ListingsGrid"

export const metadata: Metadata = {
  title: "Smash Room UK | Find Smash Rooms Across the UK",
  description: "Discover smash rooms across the UK. Browse venues, compare prices, and book your stress-relief session. Smash rooms (also known as rage rooms) provide a safe way to release tension.",
  openGraph: {
    title: "Smash Room UK | Find Smash Rooms Across the UK",
    description: "Find and compare smash rooms across the UK. Book your stress-relief session today.",
    type: "website",
  },
}

export const dynamic = 'force-dynamic'

export default async function SmashRoomUKPage() {
  const { getFeaturedListings, getDistinctCities } = await import("@/lib/listings")
  const listings = await getFeaturedListings(12)
  const cities = await getDistinctCities()

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Smash Rooms UK",
    description: "Find smash rooms and rage rooms across the UK",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://rageroomdirectory.co.uk"}/smash-room-uk`,
  }

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Smash Room UK" },
          ]}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />

        <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-white">
          Smash Room UK: Find Smash Rooms Across the UK
        </h1>

        <div className="text-base sm:text-lg text-zinc-300 mb-6 sm:mb-8 space-y-3 sm:space-y-4">
          <p>
            Looking for a smash room in the UK? You've found the right place. Smash rooms (also known as rage rooms, break rooms, or anger rooms) are safe, controlled environments where you can release stress and tension by breaking items like plates, electronics, and glass bottles.
          </p>
          <p>
            Our comprehensive directory helps you find and <Link href="/rage-room-prices-uk" className="text-orange-500 hover:text-orange-600 underline">compare smash rooms</Link> across the UK, from London to Manchester, Birmingham to Newcastle, and everywhere in between. Each venue provides protective gear, smashing tools, and breakable items for a unique stress-relief experience.
          </p>
          <p>
            Whether you're looking for a fun date night activity, corporate team building event, or simply need to let off steam, browse our directory to find the perfect smash room near you. Compare prices, packages, and book your session today.
          </p>
        </div>

        {/* Featured Smash Rooms */}
        {listings.length > 0 && (
          <section aria-labelledby="featured-heading" className="mb-12">
            <h2 id="featured-heading" className="text-2xl sm:text-3xl font-bold text-white mb-6">
              Featured Smash Rooms in the UK
            </h2>
            <ListingsGrid listings={listings} />
          </section>
        )}

        {/* Browse by City */}
        {cities.length > 0 && (
          <section aria-labelledby="cities-heading" className="mb-12">
            <h2 id="cities-heading" className="text-2xl sm:text-3xl font-bold text-white mb-6">
              Find Smash Rooms by City
            </h2>
            <p className="text-zinc-300 mb-6">
              Browse smash rooms in major cities across the UK. Click on any city to view all available venues.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {cities.map((city) => (
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
        )}

        {/* What is a Smash Room Section */}
        <section aria-labelledby="what-is-heading" className="mb-12">
          <h2 id="what-is-heading" className="text-2xl sm:text-3xl font-bold text-white mb-6">
            What is a Smash Room?
          </h2>
          <div className="bg-[#181818] rounded-lg border border-zinc-800 p-6">
            <p className="text-zinc-300 mb-4">
              A smash room (also called a rage room, break room, or anger room) is a controlled environment designed for stress relief and entertainment. Participants are provided with protective gear, smashing tools (hammers, bats, crowbars), and breakable items (plates, electronics, glass bottles) to destroy in a safe, supervised setting.
            </p>
            <p className="text-zinc-300 mb-4">
              Smash rooms have become increasingly popular across the UK as an alternative form of stress relief, team building, and entertainment. Sessions typically last 30 minutes, with all safety equipment and items included in the price.
            </p>
            <p className="text-zinc-300">
              All smash rooms in the UK follow strict safety protocols, with mandatory safety briefings, professional supervision, and high-quality protective equipment. Whether you're visiting solo, as a couple, or with a group, smash rooms cater to all experience levels.
            </p>
          </div>
        </section>

        {/* Related Terms */}
        <section aria-labelledby="related-terms-heading" className="mb-12">
          <h2 id="related-terms-heading" className="text-2xl sm:text-3xl font-bold text-white mb-6">
            Related Terms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/break-room-uk"
              className="bg-[#181818] hover:bg-[#252525] border border-zinc-800 hover:border-orange-500 rounded-lg p-6 transition-all"
            >
              <h3 className="text-xl font-bold text-white mb-2">Break Room UK</h3>
              <p className="text-zinc-400">Find break rooms across the UK</p>
            </Link>
            <Link
              href="/anger-room-uk"
              className="bg-[#181818] hover:bg-[#252525] border border-zinc-800 hover:border-orange-500 rounded-lg p-6 transition-all"
            >
              <h3 className="text-xl font-bold text-white mb-2">Anger Room UK</h3>
              <p className="text-zinc-400">Discover anger rooms in the UK</p>
            </Link>
            <Link
              href="/near-me"
              className="bg-[#181818] hover:bg-[#252525] border border-zinc-800 hover:border-orange-500 rounded-lg p-6 transition-all"
            >
              <h3 className="text-xl font-bold text-white mb-2">Smash Room Near Me</h3>
              <p className="text-zinc-400">Find smash rooms near your location</p>
            </Link>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQ items={globalFAQs} title="Frequently Asked Questions About Smash Rooms in the UK" />

        {/* Call to Action */}
        <div className="mt-12 text-center bg-[#181818] rounded-lg border border-zinc-800 p-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Book Your Smash Room Session?
          </h2>
          <p className="text-zinc-300 mb-6">
            Browse our directory, compare prices, and book your stress-relief session today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/listings"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-md transition-colors"
            >
              Browse All Smash Rooms
            </Link>
            <Link
              href="/list-your-rage-room"
              className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white border border-zinc-700 font-semibold px-8 py-3 rounded-md transition-colors"
            >
              List Your Smash Room
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

