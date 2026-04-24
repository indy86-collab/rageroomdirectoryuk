import { Metadata } from "next"
import Breadcrumbs from "@/components/Breadcrumbs"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Editorial Policy | How We Verify Listings | RageRoom Directory",
  description: "Learn how RageRoom Directory researches, verifies, and maintains its rage room listings. Our editorial process ensures accurate, trustworthy information for every venue.",
  alternates: { canonical: "/editorial-policy" },
  openGraph: {
    title: "Editorial Policy | RageRoom Directory",
    description: "How we research, verify, and maintain our rage room listings across the UK.",
    type: "website",
  },
}

export default function EditorialPolicyPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Editorial Policy", href: "/editorial-policy" },
  ]

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Breadcrumbs items={breadcrumbItems} />

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6 mt-4">
          Editorial Policy
        </h1>

        <div className="space-y-6 text-base sm:text-lg text-zinc-300">
          <p>
            RageRoom Directory is an independently maintained directory of rage room and smash
            room venues operating across the United Kingdom. This page explains how we find,
            verify, and present listing information so you can trust what you read on this site.
          </p>

          <div className="bg-[#181818] rounded-lg border border-zinc-800 p-5 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              How We Find Venues
            </h2>
            <p className="mb-3">
              We discover rage room venues through a combination of methods:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Manual web research across Google, social media, and business directories</li>
              <li>Cross-referencing with Google Maps and Google Business profiles</li>
              <li>Monitoring new venue openings through industry news and local press</li>
              <li>Direct submissions from venue owners through our{" "}
                <Link href="/list-your-rage-room" className="text-orange-500 hover:text-orange-600 underline">
                  listing submission form
                </Link>
              </li>
              <li>Community tips sent to us via email</li>
            </ul>
          </div>

          <div className="bg-[#181818] rounded-lg border border-zinc-800 p-5 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              How We Verify Listings
            </h2>
            <p className="mb-3">
              Before a venue is published to the directory, we check the following:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong className="text-white">Active website or social media presence</strong> — we
                confirm the venue has a working website or active social media page where visitors
                can learn more and book sessions
              </li>
              <li>
                <strong className="text-white">Correct location data</strong> — we verify the city,
                postcode, and geographic coordinates using Google Maps and the venue's own listed
                address
              </li>
              <li>
                <strong className="text-white">Pricing accuracy</strong> — where we list a starting
                price, it reflects the lowest publicly advertised price we found on the venue's
                website at the time of last review. We clearly label this as a starting price and
                direct visitors to the venue for full pricing
              </li>
              <li>
                <strong className="text-white">Business operational status</strong> — we check that
                the venue appears to be actively operating, not permanently closed or under
                construction
              </li>
            </ul>
            <p className="mt-3 text-sm text-zinc-400">
              Venues that have been through this process are marked with a "Verified" badge on their
              listing page.
            </p>
          </div>

          <div className="bg-[#181818] rounded-lg border border-zinc-800 p-5 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              What We Don't Do
            </h2>
            <p className="mb-3">
              Transparency matters. Here's what we're upfront about:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>We do not personally visit every venue (we are a directory, not a review site)</li>
              <li>We do not fabricate reviews, ratings, or testimonials</li>
              <li>We do not guarantee that prices, hours, or availability shown are current — we
                always direct users to the venue's own website for the latest information</li>
              <li>We do not accept payment from venues in exchange for higher placement or positive
                write-ups</li>
            </ul>
          </div>

          <div className="bg-[#181818] rounded-lg border border-zinc-800 p-5 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              How We Keep Listings Up to Date
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>We periodically re-check venue websites and Google Business profiles for changes</li>
              <li>We incorporate corrections submitted by visitors and venue owners</li>
              <li>Listings that appear to be permanently closed are removed from the directory</li>
              <li>We pull real Google reviews for venues where a verified Google Place ID is available</li>
            </ul>
            <p className="mt-3">
              If you notice outdated or incorrect information on any listing, please let us know
              at{" "}
              <a href="mailto:ukrageroom@gmail.com" className="text-orange-500 hover:text-orange-600 underline">
                ukrageroom@gmail.com
              </a>{" "}
              and we'll investigate and update it.
            </p>
          </div>

          <div className="bg-[#181818] rounded-lg border border-zinc-800 p-5 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              Reviews on This Site
            </h2>
            <p className="mb-3">
              Reviews displayed on listing pages come from two sources:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong className="text-white">Google Reviews</strong> — pulled from the Google
                Places API using the venue's verified Google Place ID. These are real reviews left
                by Google users and are displayed with the reviewer's name, rating, and comment
              </li>
              <li>
                <strong className="text-white">Site reviews</strong> — submitted by registered users
                of RageRoom Directory. These require an account and are associated with a real email
                address
              </li>
            </ul>
            <p className="mt-3 text-sm text-zinc-400">
              We do not fabricate, edit, or selectively filter reviews. Aggregate ratings shown on
              listing pages are calculated from the reviews actually present.
            </p>
          </div>

          <div className="bg-[#181818] rounded-lg border border-zinc-800 p-5 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              Content on This Site
            </h2>
            <p className="mb-3">
              Descriptive content on listing pages, city pages, and guide pages is written and
              maintained by the RageRoom Directory editorial team. Where listings include
              automatically generated summaries, these are produced using rule-based logic
              that draws from the venue's actual data (location, price, description, features) —
              not generic templates.
            </p>
            <p>
              Our{" "}
              <Link href="/blog" className="text-orange-500 hover:text-orange-600 underline">blog</Link> and{" "}
              <Link href="/guides" className="text-orange-500 hover:text-orange-600 underline">guides</Link>{" "}
              are written to provide genuine value to visitors who are researching rage rooms,
              planning a visit, or comparing venues.
            </p>
          </div>

          <div className="bg-[#181818] rounded-lg border border-zinc-800 p-5 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              For Venue Owners
            </h2>
            <p>
              If you own or manage a rage room venue listed on our site, you can request updates
              to your listing at any time. We also welcome new venue submissions. See
              our{" "}
              <Link href="/list-your-rage-room" className="text-orange-500 hover:text-orange-600 underline">
                listing submission page
              </Link>{" "}
              or email{" "}
              <a href="mailto:ukrageroom@gmail.com" className="text-orange-500 hover:text-orange-600 underline">
                ukrageroom@gmail.com
              </a>.
            </p>
          </div>

          <p className="text-sm text-zinc-500 mt-8">
            Last updated: March 2026
          </p>
        </div>
      </div>
    </div>
  )
}
