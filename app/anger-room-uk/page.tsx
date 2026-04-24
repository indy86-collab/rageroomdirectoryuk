import { Metadata } from "next"
import Link from "next/link"
import { cityToSlug } from "@/lib/location"
import Breadcrumbs from "@/components/Breadcrumbs"
import FAQ from "@/components/FAQ"
import { globalFAQs } from "@/lib/faqs"
import ListingsGrid from "@/components/ListingsGrid"

export const metadata: Metadata = {
  title: "Anger Room UK | Find Anger Rooms Across the UK",
  description: "Discover anger rooms across the UK. Browse venues, compare prices, and book your stress-relief session. Anger rooms (also known as rage rooms or smash rooms) provide a safe way to release tension.",
  alternates: { canonical: "/anger-room-uk" },
  openGraph: {
    title: "Anger Room UK | Find Anger Rooms Across the UK",
    description: "Find and compare anger rooms across the UK. Book your stress-relief session today.",
    type: "website",
  },
}

export const revalidate = 86400

export default async function AngerRoomUKPage() {
  const { getFeaturedListings, getDistinctCities } = await import("@/lib/listings")
  const listings = await getFeaturedListings(12)
  const cities = await getDistinctCities()

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Anger Rooms UK",
    description: "Find anger rooms and rage rooms across the UK",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://rageroomdirectory.co.uk"}/anger-room-uk`,
  }

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Anger Room UK" },
          ]}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />

        <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-white">
          Anger Room UK: Find Anger Rooms Across the UK
        </h1>

        <div className="text-base sm:text-lg text-zinc-300 mb-6 sm:mb-8 space-y-3 sm:space-y-4">
          <p>
            Anger rooms provide a space specifically designed for people who need to let out frustration in a physical, immediate way. While the activity is the same as a <Link href="/smash-room-uk" className="text-orange-500 hover:text-orange-600 underline">smash room</Link> or <Link href="/break-room-uk" className="text-orange-500 hover:text-orange-600 underline">break room</Link> — breaking items in a supervised environment — the anger room framing speaks to visitors who are coming specifically to process real frustration or stress rather than just looking for a novelty activity.
          </p>
          <p>
            Our directory lists anger room and destruction therapy venues across the UK. Each listing includes location, starting price, and a link to the venue's website. Browse below or filter by city to find an anger room near you.
          </p>
        </div>

        {/* Featured Anger Rooms */}
        {listings.length > 0 && (
          <section aria-labelledby="featured-heading" className="mb-12">
            <h2 id="featured-heading" className="text-2xl sm:text-3xl font-bold text-white mb-6">
              Featured Anger Rooms in the UK
            </h2>
            <ListingsGrid listings={listings} />
          </section>
        )}

        {/* Browse by City */}
        {cities.length > 0 && (
          <section aria-labelledby="cities-heading" className="mb-12">
            <h2 id="cities-heading" className="text-2xl sm:text-3xl font-bold text-white mb-6">
              Find Anger Rooms by City
            </h2>
            <p className="text-zinc-300 mb-6">
              Browse anger rooms in major cities across the UK. Click on any city to view all available venues.
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

        {/* What is an Anger Room Section */}
        <section aria-labelledby="what-is-heading" className="mb-12">
          <h2 id="what-is-heading" className="text-2xl sm:text-3xl font-bold text-white mb-6">
            What is an Anger Room?
          </h2>
          <div className="bg-[#181818] rounded-lg border border-zinc-800 p-6 space-y-4">
            <p className="text-zinc-300">
              An anger room is a controlled environment specifically designed to help people release pent-up anger and frustration through physical destruction. While all destruction therapy venues involve breaking things, the "anger room" name places the emphasis squarely on the emotional release aspect — using physical activity as an outlet for genuine frustration, stress, or anger rather than purely for entertainment.
            </p>
            <p className="text-zinc-300">
              The concept draws on the idea that sometimes, redirecting anger into a safe physical activity can provide immediate relief. An anger room gives you that outlet in a supervised setting with protective equipment and purpose-built rooms. Unlike talking therapies or meditation, it's a raw, physical approach — you pick up a bat, and you swing. For some people, especially those who struggle with passive stress-management techniques, this directness is exactly what works.
            </p>
            <p className="text-zinc-300">
              It's worth noting that anger rooms are not a substitute for professional mental health support. They work best as a complementary activity — a way to let off steam in the moment, not a long-term anger management strategy. That said, many visitors report feeling noticeably lighter and calmer after a session. Whether you're dealing with workplace frustration, relationship stress, or just a difficult week, an anger room provides a space where it's not just acceptable to let it out — it's the entire point. Learn more about <Link href="/guides/are-rage-rooms-safe-uk" className="text-orange-500 hover:text-orange-600 underline">safety and how these venues operate</Link>.
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
              href="/smash-room-uk"
              className="bg-[#181818] hover:bg-[#252525] border border-zinc-800 hover:border-orange-500 rounded-lg p-6 transition-all"
            >
              <h3 className="text-xl font-bold text-white mb-2">Smash Room UK</h3>
              <p className="text-zinc-400">Find smash rooms across the UK</p>
            </Link>
            <Link
              href="/break-room-uk"
              className="bg-[#181818] hover:bg-[#252525] border border-zinc-800 hover:border-orange-500 rounded-lg p-6 transition-all"
            >
              <h3 className="text-xl font-bold text-white mb-2">Break Room UK</h3>
              <p className="text-zinc-400">Discover break rooms in the UK</p>
            </Link>
            <Link
              href="/near-me"
              className="bg-[#181818] hover:bg-[#252525] border border-zinc-800 hover:border-orange-500 rounded-lg p-6 transition-all"
            >
              <h3 className="text-xl font-bold text-white mb-2">Anger Room Near Me</h3>
              <p className="text-zinc-400">Find anger rooms near your location</p>
            </Link>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQ items={globalFAQs} title="Frequently Asked Questions About Anger Rooms in the UK" />

        {/* Call to Action */}
        <div className="mt-12 text-center bg-[#181818] rounded-lg border border-zinc-800 p-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Book Your Anger Room Session?
          </h2>
          <p className="text-zinc-300 mb-6">
            Browse our directory, compare prices, and book your stress-relief session today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/listings"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-md transition-colors"
            >
              Browse All Anger Rooms
            </Link>
            <Link
              href="/list-your-rage-room"
              className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white border border-zinc-700 font-semibold px-8 py-3 rounded-md transition-colors"
            >
              List Your Anger Room
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

