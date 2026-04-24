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
  alternates: { canonical: "/smash-room-uk" },
  openGraph: {
    title: "Smash Room UK | Find Smash Rooms Across the UK",
    description: "Find and compare smash rooms across the UK. Book your stress-relief session today.",
    type: "website",
  },
}

export const revalidate = 86400

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
            Smash rooms have become one of the UK's fastest-growing alternative activities. The premise is straightforward: you're given safety gear and a room full of breakable items — then you smash everything in sight. It's physical, it's loud, and it's surprisingly satisfying. Whether people call them smash rooms, <Link href="/break-room-uk" className="text-orange-500 hover:text-orange-600 underline">break rooms</Link>, or <Link href="/anger-room-uk" className="text-orange-500 hover:text-orange-600 underline">anger rooms</Link>, they all offer the same core experience.
          </p>
          <p>
            Our directory lists smash room venues operating across the UK. Each listing includes the venue's location, starting price where available, and a link to their website for booking. Use the listings below to find a venue, or narrow your search by city.
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
          <div className="bg-[#181818] rounded-lg border border-zinc-800 p-6 space-y-4">
            <p className="text-zinc-300">
              A smash room is a venue where you pay to break things. The concept is simple: you're given safety gear, a selection of tools — typically baseball bats, sledgehammers, or crowbars — and a room full of items to destroy. Plates, mugs, glass bottles, old printers, keyboards, and TVs are common targets. The focus is on the physical, hands-on act of destruction.
            </p>
            <p className="text-zinc-300">
              The term "smash room" tends to emphasise the physical experience over the therapeutic angle. While <Link href="/anger-room-uk" className="text-orange-500 hover:text-orange-600 underline">anger rooms</Link> are often framed around emotional release, smash rooms lean into the entertainment factor — loud music, big swings, and the satisfaction of watching things shatter. This makes them especially popular for birthday parties, stag and hen dos, and group outings where fun is the primary goal.
            </p>
            <p className="text-zinc-300">
              In the UK, smash rooms typically charge between £25 and £50 per person for a 30-minute session. All items and safety equipment are included. Most venues require advance booking, and participants usually need to be at least 16 years old. Sessions are supervised by staff who conduct a safety briefing before you start. For a full breakdown of what to expect, read our <Link href="/guides/what-happens-in-a-rage-room" className="text-orange-500 hover:text-orange-600 underline">first-time guide</Link>.
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

