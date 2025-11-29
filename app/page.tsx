import { cityToSlug } from "@/lib/location"
import Hero from "@/components/Hero"
import FeaturedRooms from "@/components/FeaturedRooms"
import FAQ from "@/components/FAQ"
import { globalFAQs } from "@/lib/faqs"
import Link from "next/link"

// Mark homepage as dynamic since it queries the database
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
  // Lazy load to prevent build-time initialization
  const { getFeaturedListings, getDistinctCities } = await import("@/lib/listings")
  const featuredListings = await getFeaturedListings(6) // Show 6 listings, rotated daily
  const cities = await getDistinctCities()

  // WebSite Schema for homepage
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RageRoom Directory",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://rageroomdirectory.co.uk",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || "https://rageroomdirectory.co.uk"}/search?query={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {/* Hero Section */}
      <Hero />

      {/* SEO Intro Paragraph */}
      <section className="w-full bg-transparent py-4 sm:py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-base sm:text-lg text-zinc-300 space-y-3 sm:space-y-4">
            <p>
              Rage rooms (also called smash rooms or anger rooms) are safe, controlled environments where you can release stress and tension by breaking items like plates, electronics, and glass bottles. These unique experiences have become increasingly popular across the UK as an alternative form of stress relief and entertainment.
            </p>
            <p>
              <strong>RageRoom Directory</strong> is the UK's comprehensive guide to finding and comparing rage room experiences. Our purpose is to help you discover the best smash rooms in your area, <Link href="/rage-room-prices-uk" className="text-orange-500 hover:text-orange-600 underline">compare prices and packages</Link>, and make informed decisions about where to <Link href="/listings" className="text-orange-500 hover:text-orange-600 underline">book a rage room in the UK</Link>. We cover major cities including <Link href="/city/birmingham" className="text-orange-500 hover:text-orange-600 underline">Birmingham</Link>, <Link href="/city/london" className="text-orange-500 hover:text-orange-600 underline">London</Link>, <Link href="/city/manchester" className="text-orange-500 hover:text-orange-600 underline">Manchester</Link>, and many more locations across the country.
            </p>
            <p>
              Whether you're looking for a fun date night activity, corporate team building event, or simply need to let off steam, you can <Link href="/listings" className="text-orange-500 hover:text-orange-600 underline">browse all rage rooms</Link> in our directory to view prices, packages, opening hours, and book your next stress-relief session. Each listing includes detailed information about what to expect, safety requirements, and nearby alternatives.
            </p>
          </div>
        </div>
      </section>

      {/* Top Rated Rage Rooms */}
      <section aria-labelledby="top-rated-heading" className="w-full bg-transparent py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 id="top-rated-heading" className="text-2xl font-bold text-white mb-8">
            Top Rated Rage Rooms
          </h2>
          <FeaturedRooms listings={featuredListings} />
          <div className="mt-8 text-center">
            <Link
              href="/listings"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-md transition-colors"
            >
              Browse All Rage Rooms
            </Link>
          </div>
        </div>
      </section>

      {/* Top Cities for Rage Rooms in the UK */}
      <section aria-labelledby="top-cities-heading" className="w-full bg-transparent py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 id="top-cities-heading" className="text-2xl font-bold text-white mb-6">
            Top Cities for Rage Rooms in the UK
          </h2>
          <p className="text-zinc-300 mb-6">
            Discover rage rooms in the UK's most popular cities. Each city offers unique venues with different packages, prices, and experiences.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
            {[
              { city: "London", href: "/city/london", guide: "/guides/best-rage-rooms-london" },
              { city: "Birmingham", href: "/city/birmingham", guide: "/guides/best-rage-rooms-birmingham" },
              { city: "Manchester", href: "/city/manchester", guide: "/guides/best-rage-rooms-manchester" },
              { city: "Bristol", href: "/city/bristol", guide: "/guides/best-rage-rooms-bristol" },
              { city: "Newcastle", href: "/city/newcastle", guide: "/guides/best-rage-rooms-newcastle" },
              { city: "Leeds", href: "/city/leeds", guide: "/guides/best-rage-rooms-leeds" },
              { city: "Liverpool", href: "/city/liverpool", guide: "/guides/best-rage-rooms-liverpool" },
              { city: "Sheffield", href: "/city/sheffield", guide: "/guides/best-rage-rooms-sheffield" },
              { city: "Nottingham", href: "/city/nottingham", guide: "/guides/best-rage-rooms-nottingham" },
            ].map(({ city, href, guide }) => (
              <div key={city} className="flex flex-col gap-2">
                <Link
                  href={href}
                  className="bg-[#181818] hover:bg-[#252525] border border-zinc-800 hover:border-orange-500 text-white font-medium py-3 px-4 rounded-md transition-all text-center"
                >
                  {city}
                </Link>
                <Link
                  href={guide}
                  className="text-xs text-orange-500 hover:text-orange-400 text-center"
                >
                  Best in {city} →
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center space-x-4">
            <Link
              href="/near-me"
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              Find rage rooms near me →
            </Link>
            <span className="text-zinc-500">|</span>
            <Link
              href="/rage-room-prices-uk"
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              Compare prices →
            </Link>
          </div>
        </div>
      </section>

      {/* Best Rage Rooms for Couples */}
      <section aria-labelledby="couples-heading" className="w-full bg-transparent py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 id="couples-heading" className="text-2xl font-bold text-white mb-6">
            Best Rage Rooms for Couples
          </h2>
          <p className="text-zinc-300 mb-6">
            Looking for a unique date night? Rage rooms offer couples an exciting, stress-relieving experience that's perfect for breaking the routine. Many venues offer private sessions, extended time, and special couple packages.
          </p>
          <div className="bg-[#181818] rounded-lg border border-zinc-800 p-6 mb-6">
            <h3 className="text-xl font-bold text-white mb-4">Why Rage Rooms Make Great Date Nights</h3>
            <ul className="list-disc list-inside text-zinc-300 space-y-2 mb-4">
              <li>Unique experience that stands out from typical dates</li>
              <li>Shared bonding activity that creates lasting memories</li>
              <li>Stress relief together - release tension as a couple</li>
              <li>Fun and laughter guaranteed</li>
              <li>Perfect for anniversaries, birthdays, or just because</li>
            </ul>
            <Link
              href="/guides/best-rage-rooms-for-couples"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-md transition-colors"
            >
              Read Complete Couples Guide
            </Link>
          </div>
        </div>
      </section>

      {/* Best Rage Rooms for Stress Relief */}
      <section aria-labelledby="stress-relief-heading" className="w-full bg-transparent py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 id="stress-relief-heading" className="text-2xl font-bold text-white mb-6">
            Best Rage Rooms for Stress Relief
          </h2>
          <p className="text-zinc-300 mb-6">
            Rage rooms provide an effective, immediate way to release stress and tension. The physical act of smashing items in a safe, controlled environment offers cathartic release that many find more satisfying than traditional stress-relief methods.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-[#181818] rounded-lg border border-zinc-800 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Benefits of Rage Rooms for Stress Relief</h3>
              <ul className="list-disc list-inside text-zinc-300 space-y-2">
                <li>Immediate physical release of tension</li>
                <li>Endorphin boost from physical activity</li>
                <li>Safe outlet for frustration and anger</li>
                <li>No judgment - break things without consequences</li>
                <li>Controlled environment with professional supervision</li>
              </ul>
            </div>
            <div className="bg-[#181818] rounded-lg border border-zinc-800 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Who Benefits Most?</h3>
              <ul className="list-disc list-inside text-zinc-300 space-y-2">
                <li>People with high-stress jobs</li>
                <li>Anyone dealing with daily pressures</li>
                <li>Those who need physical stress release</li>
                <li>People looking for alternative therapy</li>
                <li>Anyone needing to let off steam safely</li>
              </ul>
            </div>
          </div>
          <div className="text-center">
            <Link
              href="/listings"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-md transition-colors"
            >
              Find Stress Relief Near You
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section aria-labelledby="how-it-works-heading" className="w-full bg-transparent py-10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 id="how-it-works-heading" className="text-white text-xl font-semibold tracking-wide mb-10">
            HOW IT WORKS
          </h2>

          {/* 3-Step Icon Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
            {/* Book Your Session - Ticket/Booking Icon */}
            <div className="flex flex-col items-center">
              <svg
                className="w-14 h-14 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                />
              </svg>
              <p className="mt-4 text-white font-medium text-sm tracking-wide uppercase">
                1. Book Your Session
              </p>
            </div>

            {/* Gear Up - Helmet Icon */}
            <div className="flex flex-col items-center">
              <svg
                className="w-14 h-14 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                {/* Helmet dome */}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3C8 3 5 6 5 10v2c0 2 1 4 3 5v2h8v-2c2-1 3-3 3-5v-2c0-4-3-7-7-7z"
                />
                {/* Helmet visor */}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 12h8"
                />
                {/* Face shield area */}
                <ellipse cx="12" cy="11" rx="4" ry="3" opacity="0.3" />
              </svg>
              <p className="mt-4 text-white font-medium text-sm tracking-wide uppercase">
                2. Gear Up
              </p>
            </div>

            {/* Smash It - Small Hammer Icon */}
            <div className="flex flex-col items-center">
              <svg
                className="w-14 h-14 text-orange-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                {/* Hammer head */}
                <rect x="9" y="7" width="8" height="6" rx="1" />
                {/* Hammer handle */}
                <rect x="15" y="11" width="2" height="7" rx="1" />
                {/* Impact lines */}
                <path
                  d="M7 9 L10 6 M7 11 L10 14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.6"
                />
              </svg>
              <p className="mt-4 text-white font-medium text-sm tracking-wide uppercase">
                3. Smash It
              </p>
            </div>
          </div>

          {/* City Buttons */}
          {cities.length > 0 && (
            <section aria-labelledby="cities-heading" className="mt-12">
              <h2 id="cities-heading" className="text-white text-xl font-semibold tracking-wide mb-6">
                Browse Rage Rooms by City
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-center">
                {cities.map((city) => (
                  <Link
                    key={city}
                    href={`/city/${cityToSlug(city)}`}
                    title={`View rage rooms in ${city}`}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 sm:py-2 px-3 sm:px-4 rounded-md transition-colors text-center text-sm sm:text-base min-h-[44px] flex items-center justify-center"
                  >
                    {city}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </section>

      {/* How Rage Rooms Work (FAQ) */}
      <section aria-labelledby="how-rage-rooms-work-heading" className="w-full bg-transparent py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 id="how-rage-rooms-work-heading" className="text-2xl font-bold text-white mb-6">
            How Rage Rooms Work
          </h2>
          <p className="text-zinc-300 mb-6">
            New to rage rooms? Here's everything you need to know about how they work, what to expect, and how to get the most out of your experience.
          </p>
          <FAQ items={globalFAQs} title="Frequently Asked Questions About Rage Rooms" />
        </div>
      </section>
    </>
  )
}

