import { Metadata } from "next"
import Link from "next/link"
import { cityToSlug } from "@/lib/location"
import Breadcrumbs from "@/components/Breadcrumbs"
import FAQ from "@/components/FAQ"
import { globalFAQs } from "@/lib/faqs"
import ListingsGrid from "@/components/ListingsGrid"
import { buildOgImageUrl } from "@/lib/seo-schema"

const OG_IMAGE = buildOgImageUrl({
  title: "Break Rooms UK",
  subtitle: "UK break room & rage room directory",
  badge: "Break Rooms",
})

export const metadata: Metadata = {
  title: "Break Room UK | Find Break Rooms Across the UK",
  description:
    "Discover break rooms across the UK. Browse venues, compare prices, and book your stress-relief session. Break rooms (also known as rage rooms or smash rooms) provide a safe way to release tension.",
  alternates: { canonical: "/break-room-uk" },
  openGraph: {
    title: "Break Room UK | Find Break Rooms Across the UK",
    description:
      "Find and compare break rooms across the UK. Book your stress-relief session today.",
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Break rooms UK directory" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Break Room UK",
    description: "UK break room directory — venues, prices and booking.",
    images: [OG_IMAGE],
  },
}

export const revalidate = 86400

export default async function BreakRoomUKPage() {
  const { getFeaturedListings, getDistinctCities } = await import("@/lib/listings")
  const listings = await getFeaturedListings(12)
  const cities = await getDistinctCities()

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Break Rooms UK",
    description: "Find break rooms and rage rooms across the UK",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://rageroomdirectory.co.uk"}/break-room-uk`,
  }

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Break Room UK" },
          ]}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />

        <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-white">
          Break Room UK: Find Break Rooms Across the UK
        </h1>

        <div className="text-base sm:text-lg text-zinc-300 mb-6 sm:mb-8 space-y-3 sm:space-y-4">
          <p>
            Break rooms offer a physical approach to stress relief that's gaining traction across the UK. The idea is rooted in the therapeutic benefit of channelling tension into controlled destruction — you book a session, gear up, and spend your time breaking plates, glassware, electronics, and other items in a purpose-built room. It's the same activity as a <Link href="/smash-room-uk" className="text-orange-500 hover:text-orange-600 underline">smash room</Link> or rage room, but the "break room" name reflects the stress-relief angle many visitors are looking for.
          </p>
          <p>
            Browse our UK directory below to find break room venues near you. Each listing shows the venue's location and starting price where available, with links to their websites for full details and booking.
          </p>
        </div>

        {/* Featured Break Rooms */}
        {listings.length > 0 && (
          <section aria-labelledby="featured-heading" className="mb-12">
            <h2 id="featured-heading" className="text-2xl sm:text-3xl font-bold text-white mb-6">
              Featured Break Rooms in the UK
            </h2>
            <ListingsGrid listings={listings} />
          </section>
        )}

        {/* Browse by City */}
        {cities.length > 0 && (
          <section aria-labelledby="cities-heading" className="mb-12">
            <h2 id="cities-heading" className="text-2xl sm:text-3xl font-bold text-white mb-6">
              Find Break Rooms by City
            </h2>
            <p className="text-zinc-300 mb-6">
              Browse break rooms in major cities across the UK. Click on any city to view all available venues.
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

        {/* What is a Break Room Section */}
        <section aria-labelledby="what-is-heading" className="mb-12">
          <h2 id="what-is-heading" className="text-2xl sm:text-3xl font-bold text-white mb-6">
            What is a Break Room?
          </h2>
          <div className="bg-[#181818] rounded-lg border border-zinc-800 p-6 space-y-4">
            <p className="text-zinc-300">
              A break room — sometimes called a destruction room or wreck room — is a supervised space where people go to physically break objects as a form of stress relief. Unlike the more entertainment-focused <Link href="/smash-room-uk" className="text-orange-500 hover:text-orange-600 underline">smash room</Link>, the "break room" name often appeals to people who are specifically seeking a way to process frustration, work stress, or emotional tension through physical activity.
            </p>
            <p className="text-zinc-300">
              The experience at a break room is straightforward: you book a time slot, arrive at the venue, receive a safety briefing and protective gear, and then spend your session breaking provided items like crockery, glassware, and electronics. The physical exertion involved — swinging bats, throwing plates, smashing glass — engages your body in a way that many people find genuinely relieving, especially after periods of sitting at a desk or dealing with daily stressors.
            </p>
            <p className="text-zinc-300">
              Break rooms in the UK have grown alongside the broader wellness and stress-management trend. They are particularly popular with corporate groups as <Link href="/guides/best-rage-rooms-for-team-building" className="text-orange-500 hover:text-orange-600 underline">team-building activities</Link> and with individuals looking for an alternative to gym sessions or meditation. Sessions are typically 30 minutes and cost between £25–£50 per person. Read our <Link href="/guides/how-much-do-rage-rooms-cost-uk" className="text-orange-500 hover:text-orange-600 underline">UK pricing guide</Link> for more detail.
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
              <h3 className="text-xl font-bold text-white mb-2">Break Room Near Me</h3>
              <p className="text-zinc-400">Find break rooms near your location</p>
            </Link>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQ items={globalFAQs} title="Frequently Asked Questions About Break Rooms in the UK" />

        {/* Call to Action */}
        <div className="mt-12 text-center bg-[#181818] rounded-lg border border-zinc-800 p-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Book Your Break Room Session?
          </h2>
          <p className="text-zinc-300 mb-6">
            Browse our directory, compare prices, and book your stress-relief session today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/listings"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-md transition-colors"
            >
              Browse All Break Rooms
            </Link>
            <Link
              href="/list-your-rage-room"
              className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white border border-zinc-700 font-semibold px-8 py-3 rounded-md transition-colors"
            >
              List Your Break Room
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

