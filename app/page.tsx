import { Metadata } from "next"
import { cityToSlug } from "@/lib/location"
import Hero from "@/components/Hero"
import FeaturedRooms from "@/components/FeaturedRooms"
import FAQ from "@/components/FAQ"
import { globalFAQs } from "@/lib/faqs"
import Link from "next/link"

// Mark homepage as dynamic since it queries the database
export const dynamic = 'force-dynamic'
export const revalidate = 0

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rageroomdirectory.co.uk"

export const metadata: Metadata = {
  title: "RageRoom Directory UK | Compare Rage Rooms, Prices & Locations",
  description:
    "Find and compare the best rage rooms across the UK. View prices, packages, photos, reviews and book your next stress-relief smash session.",
  openGraph: {
    title: "RageRoom Directory UK",
    description:
      "Discover and compare UK rage rooms with prices, locations and booking links.",
    url: baseUrl,
    siteName: "RageRoom Directory",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RageRoom Directory",
      },
    ],
  },
}

export default async function Home() {
  // Lazy load to prevent build-time initialization
  const { getFeaturedListings, getDistinctCities } = await import("@/lib/listings")
  const featuredListings = await getFeaturedListings(6) // Show 6 listings, rotated daily
  const cities = await getDistinctCities()

  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* SEO Intro Paragraph */}
      <section className="w-full py-8 sm:py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="card-base p-6 sm:p-8 space-y-4 sm:space-y-5">
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              <span className="text-accent-600 font-semibold">Rage rooms</span> (also called <span className="text-accent-600 font-semibold">smash rooms</span> or <span className="text-accent-600 font-semibold">anger rooms</span>) are safe, controlled environments where you can release stress and tension by breaking items like plates, electronics, and glass bottles. These unique experiences have become increasingly popular across the UK as an alternative form of stress relief and entertainment.
            </p>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              <strong className="text-gray-900">RageRoom Directory</strong> is the UK's comprehensive guide to finding and comparing rage room experiences. Our purpose is to help you discover the best smash rooms in your area, <Link href="/rage-room-prices-uk" className="text-primary-600 hover:text-primary-700 underline underline-offset-2 font-medium transition-colors">compare prices and packages</Link>, and make informed decisions about where to <Link href="/listings" className="text-primary-600 hover:text-primary-700 underline underline-offset-2 font-medium transition-colors">book a rage room in the UK</Link>. We cover major cities including <Link href="/city/birmingham" className="text-primary-600 hover:text-primary-700 underline underline-offset-2 font-medium transition-colors">Birmingham</Link>, <Link href="/city/london" className="text-primary-600 hover:text-primary-700 underline underline-offset-2 font-medium transition-colors">London</Link>, <Link href="/city/manchester" className="text-primary-600 hover:text-primary-700 underline underline-offset-2 font-medium transition-colors">Manchester</Link>, and many more locations across the country.
            </p>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              Whether you're looking for a fun date night activity, corporate team building event, or simply need to let off steam, you can <Link href="/listings" className="text-primary-600 hover:text-primary-700 underline underline-offset-2 font-medium transition-colors">browse all rage rooms</Link> in our directory to view prices, packages, opening hours, and book your next stress-relief session. Each listing includes detailed information about what to expect, safety requirements, and nearby alternatives.
            </p>
          </div>
        </div>
      </section>

      {/* Top Rated Rage Rooms */}
      <section aria-labelledby="top-rated-heading" className="w-full py-12 sm:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10 sm:mb-12">
            <h2 id="top-rated-heading" className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-3 uppercase">
              <span className="text-gradient">Top Rated</span> Rage Rooms
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover the highest-rated smash rooms across the UK, verified by real customers
            </p>
          </div>
          
          <FeaturedRooms listings={featuredListings} />
          
          <div className="mt-10 sm:mt-12 text-center">
            <Link
              href="/listings"
              className="btn-rage inline-flex items-center gap-2 text-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Browse All Rage Rooms
            </Link>
          </div>
        </div>
      </section>

      {/* Top Cities for Rage Rooms in the UK */}
      <section aria-labelledby="top-cities-heading" className="section-primary py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10 sm:mb-12">
            <h2 id="top-cities-heading" className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-3 uppercase">
              Rage Rooms By <span className="text-gradient">City</span>
            </h2>
            <p className="text-gray-700 text-lg max-w-2xl mx-auto">
              Discover rage rooms in the UK's most popular cities. Each offers unique venues with different packages and experiences.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
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
                  className="group card-base card-hover text-center p-4 relative overflow-hidden"
                >
                  <span className="relative z-10 text-gray-900 font-semibold text-sm sm:text-base group-hover:text-primary-600 transition-all">
                    {city}
                  </span>
                  <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity"></div>
                </Link>
                <Link
                  href={guide}
                  className="text-xs text-primary-600 hover:text-primary-700 text-center font-medium transition-colors"
                >
                  Best in {city} →
                </Link>
              </div>
            ))}
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link
              href="/near-me"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors group"
            >
              <svg className="w-5 h-5 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Find rage rooms near me
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              href="/rage-room-prices-uk"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors group"
            >
              <svg className="w-5 h-5 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Compare prices
            </Link>
          </div>
        </div>
      </section>

      {/* Best Rage Rooms for Couples */}
      <section aria-labelledby="couples-heading" className="w-full py-12 sm:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10 sm:mb-12">
            <h2 id="couples-heading" className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-3 uppercase">
              Perfect For <span className="text-gradient">Couples</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Looking for a unique date night? Rage rooms offer an exciting, stress-relieving experience that's perfect for breaking the routine.
            </p>
          </div>
          
          <div className="card-base p-6 sm:p-8 mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <svg className="w-7 h-7 text-accent-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              Why Rage Rooms Make Great Date Nights
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {[
                { icon: "✨", text: "Unique experience that stands out from typical dates" },
                { icon: "🤝", text: "Shared bonding activity that creates lasting memories" },
                { icon: "💆", text: "Stress relief together - release tension as a couple" },
                { icon: "😄", text: "Fun and laughter guaranteed" },
                { icon: "🎉", text: "Perfect for anniversaries, birthdays, or just because" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  <span className="text-gray-700">{item.text}</span>
                </div>
              ))}
            </div>
            <Link
              href="/guides/best-rage-rooms-for-couples"
              className="btn-rage inline-flex items-center gap-2"
            >
              Read Complete Couples Guide
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Best Rage Rooms for Stress Relief */}
      <section aria-labelledby="stress-relief-heading" className="section-gray py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10 sm:mb-12">
            <h2 id="stress-relief-heading" className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-3 uppercase">
              Ultimate <span className="text-gradient">Stress Relief</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Rage rooms provide an effective, immediate way to release stress and tension through controlled destruction.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="card-base p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary-50 rounded-lg border border-primary-200">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Benefits of Rage Rooms</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                {[
                  "Immediate physical release of tension",
                  "Endorphin boost from physical activity",
                  "Safe outlet for frustration and anger",
                  "No judgment - break things without consequences",
                  "Controlled environment with professional supervision"
                ].map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="card-base p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-accent-50 rounded-lg border border-accent-200">
                  <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Who Benefits Most?</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                {[
                  "People with high-stress jobs",
                  "Anyone dealing with daily pressures",
                  "Those who need physical stress release",
                  "People looking for alternative therapy",
                  "Anyone needing to let off steam safely"
                ].map((person, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{person}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="text-center">
            <Link
              href="/listings"
              className="btn-rage inline-flex items-center gap-2 text-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Find Stress Relief Near You
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section aria-labelledby="how-it-works-heading" className="w-full bg-white py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 id="how-it-works-heading" className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-3 uppercase">
            HOW IT WORKS
          </h2>

          {/* 3-Step Icon Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12 mt-10">
            {/* Book Your Session - Ticket/Booking Icon */}
            <div className="flex flex-col items-center">
              <svg
                className="w-14 h-14 text-accent-500"
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
              <p className="mt-4 text-gray-900 font-medium text-sm tracking-wide uppercase">
                1. Book Your Session
              </p>
            </div>

            {/* Gear Up - Helmet Icon */}
            <div className="flex flex-col items-center">
              <svg
                className="w-14 h-14 text-accent-500"
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
              <p className="mt-4 text-gray-900 font-medium text-sm tracking-wide uppercase">
                2. Gear Up
              </p>
            </div>

            {/* Smash It - Small Hammer Icon */}
            <div className="flex flex-col items-center">
              <svg
                className="w-14 h-14 text-accent-500"
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
              <p className="mt-4 text-gray-900 font-medium text-sm tracking-wide uppercase">
                3. Smash It
              </p>
            </div>
          </div>

          {/* City Buttons */}
          {cities.length > 0 && (
            <section aria-labelledby="cities-heading" className="mt-12">
              <h2 id="cities-heading" className="text-2xl font-bold text-gray-900 mb-6">
                Browse Rage Rooms by City
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-center">
                {cities.map((city) => (
                  <Link
                    key={city}
                    href={`/city/${cityToSlug(city)}`}
                    title={`View rage rooms in ${city}`}
                    className="bg-accent-500 hover:bg-accent-600 text-white font-semibold py-2.5 sm:py-2 px-3 sm:px-4 rounded-lg transition-all shadow-soft hover:shadow-accent text-center text-sm sm:text-base min-h-[44px] flex items-center justify-center"
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
      <section aria-labelledby="how-rage-rooms-work-heading" className="w-full bg-gray-50 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 id="how-rage-rooms-work-heading" className="text-2xl font-bold text-gray-900 mb-6">
            How Rage Rooms Work
          </h2>
          <p className="text-gray-700 mb-6">
            New to rage rooms? Here's everything you need to know about how they work, what to expect, and how to get the most out of your experience.
          </p>
          <FAQ items={globalFAQs} title="Frequently Asked Questions About Rage Rooms" />
        </div>
      </section>
    </>
  )
}

