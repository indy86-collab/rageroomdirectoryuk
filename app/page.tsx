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
              <strong>RageRoom Directory</strong> is the UK's comprehensive guide to finding and comparing rage room experiences. Our purpose is to help you discover the best smash rooms in your area, compare prices and packages, and make informed decisions about where to <Link href="/listings" className="text-orange-500 hover:text-orange-600 underline">book a rage room in the UK</Link>. We cover major cities including <Link href="/city/birmingham" className="text-orange-500 hover:text-orange-600 underline">Birmingham</Link>, <Link href="/city/london" className="text-orange-500 hover:text-orange-600 underline">London</Link>, <Link href="/city/manchester" className="text-orange-500 hover:text-orange-600 underline">Manchester</Link>, and many more locations across the country.
            </p>
            <p>
              Whether you're looking for a fun date night activity, corporate team building event, or simply need to let off steam, you can <Link href="/listings" className="text-orange-500 hover:text-orange-600 underline">browse all rage rooms</Link> in our directory to view prices, packages, opening hours, and book your next stress-relief session. Each listing includes detailed information about what to expect, safety requirements, and nearby alternatives.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Smash Zones */}
      <section aria-labelledby="featured-heading" className="w-full bg-transparent py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 id="featured-heading" className="text-2xl font-bold text-white mb-8">
            Featured Smash Zones
          </h2>
          <FeaturedRooms listings={featuredListings} />
        </div>
      </section>

      {/* Browse All Button */}
      <div className="w-full py-8 flex justify-center">
        <Link
          href="/listings"
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-md transition-colors"
        >
          Browse All Rage Rooms
        </Link>
      </div>

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

      {/* Global FAQ Section */}
      <section className="w-full bg-transparent py-10">
        <div className="max-w-6xl mx-auto px-4">
          <FAQ items={globalFAQs} />
        </div>
      </section>
    </>
  )
}

