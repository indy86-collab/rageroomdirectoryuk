import { Metadata } from "next"
import Breadcrumbs from "@/components/Breadcrumbs"
import Link from "next/link"
import { buildOgImageUrl, buildBreadcrumbSchema } from "@/lib/seo-schema"
import { getSiteUrl } from "@/lib/site-url"

const baseUrl = getSiteUrl()

const OG_IMAGE = buildOgImageUrl({
  title: "Editorial Policy",
  subtitle: "How we research, verify & maintain UK rage room listings",
  badge: "Editorial",
})

export const metadata: Metadata = {
  title: "Editorial Policy | How We Verify Listings | RageRoom Directory",
  description:
    "Learn how RageRoom Directory researches, verifies and maintains its rage room listings. Our editorial process ensures accurate, trustworthy information for every venue.",
  alternates: { canonical: "/editorial-policy" },
  openGraph: {
    title: "Editorial Policy | RageRoom Directory",
    description:
      "How we research, verify and maintain our rage room listings across the UK.",
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "RageRoom Directory editorial policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Editorial Policy | RageRoom Directory",
    description:
      "How we research, verify and maintain UK rage room listings.",
    images: [OG_IMAGE],
  },
}

export const revalidate = 86400

// Last major editorial review of the policy itself. Bump this whenever
// the policy text changes so Google sees a genuine dateModified signal.
const LAST_REVIEWED = "2026-04-24"

export default function EditorialPolicyPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Editorial Policy", href: "/editorial-policy" },
  ]

  // AboutPage wrapping — tells Google this is the canonical authority page
  // for our organisation's editorial standards. Links to Organization via @id.
  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${baseUrl}/editorial-policy#aboutpage`,
    url: `${baseUrl}/editorial-policy`,
    name: "Editorial Policy | RageRoom Directory",
    description:
      "How RageRoom Directory researches, verifies and maintains its rage room listings across the UK.",
    inLanguage: "en-GB",
    isPartOf: { "@id": `${baseUrl}#website` },
    about: { "@id": `${baseUrl}#organization` },
    dateModified: LAST_REVIEWED,
    lastReviewed: LAST_REVIEWED,
    reviewedBy: { "@id": `${baseUrl}/editorial-policy#editorial-team` },
  }

  // Named Person schema representing our editorial team. Having a named
  // `Person` (with role and affiliation) that all our articles cite via
  // `author` is a core Google E-E-A-T signal and a strong hint to LLMs
  // that there is a real editorial entity behind the content.
  const editorPersonSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${baseUrl}/editorial-policy#editorial-team`,
    name: "The RageRoom Directory Editorial Team",
    url: `${baseUrl}/editorial-policy`,
    jobTitle: "Editorial Team",
    description:
      "The in-house editorial team at RageRoom Directory is responsible for researching, verifying and maintaining every rage room and smash room listing published on the site.",
    knowsAbout: [
      "UK rage rooms",
      "smash rooms",
      "anger rooms",
      "break rooms",
      "stress relief activities",
      "experiential leisure venues",
      "team-building activities",
      "health and safety for immersive venues",
    ],
    worksFor: { "@id": `${baseUrl}#organization` },
    knowsLanguage: ["en-GB"],
  }

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Editorial Policy", url: "/editorial-policy" },
  ])

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(editorPersonSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />

        <Breadcrumbs items={breadcrumbItems} />

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6 mt-4">
          Editorial Policy
        </h1>

        <div className="space-y-6 text-base sm:text-lg text-zinc-300">
          <p>
            RageRoom Directory is an independently maintained directory of rage
            room and smash room venues operating across the United Kingdom.
            This page explains who we are, how we find and verify venues, and
            how we keep our information accurate so you can trust what you
            read on this site.
          </p>

          <div
            id="editorial-team"
            className="bg-[#181818] rounded-lg border border-zinc-800 p-5 sm:p-6"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              About our editorial team
            </h2>
            <p className="mb-3">
              All content on RageRoom Directory is produced and reviewed by
              our in-house editorial team — journalists and researchers
              specialising in UK experiential leisure, small independent
              venues, and consumer-facing venue directories.
            </p>
            <p className="mb-3">
              Our editorial team is responsible for:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Researching and vetting every new rage room added to the directory</li>
              <li>Writing and editing the city guides, pricing guides, safety guides and first-time guides under <Link href="/guides" className="text-orange-500 hover:text-orange-600 underline">/guides</Link></li>
              <li>Reviewing listing data on a rolling basis, typically every 6–12 months per venue</li>
              <li>Investigating visitor corrections and venue-owner change requests</li>
              <li>Curating which venues are featured on the homepage and city pages</li>
            </ul>
            <p className="mt-3 text-sm text-zinc-400">
              We use the byline &ldquo;The RageRoom Directory Editorial Team&rdquo; to
              signal that an article has been reviewed collectively, not
              attributed to any single contributor. Named contributor bylines
              are used when we publish long-form journalism.
            </p>
          </div>

          <div className="bg-[#181818] rounded-lg border border-zinc-800 p-5 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              How we find venues
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
              How we verify listings
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
              Venues that have been through this process are marked with a &ldquo;Verified&rdquo;
              badge on their listing page.
            </p>
          </div>

          <div className="bg-[#181818] rounded-lg border border-zinc-800 p-5 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              Sources we cite
            </h2>
            <p className="mb-3">
              Our guides and listing pages draw on a limited, repeatable set
              of primary and secondary sources so the information is easy to
              trace back:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong className="text-white">Primary:</strong> the venue's
                own website, booking portal, price list and published
                FAQs; public Google Business Profile listings; and direct
                communication with venue owners for edits and corrections.
              </li>
              <li>
                <strong className="text-white">Secondary:</strong> UK trade
                press, local news outlets, published safety guidance from
                the Health &amp; Safety Executive where relevant, and peer-
                reviewed UK consumer publications for pricing comparisons.
              </li>
            </ul>
          </div>

          <div className="bg-[#181818] rounded-lg border border-zinc-800 p-5 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              What we don&apos;t do
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
              <li>We do not hide the difference between editorial and directory content</li>
            </ul>
          </div>

          <div className="bg-[#181818] rounded-lg border border-zinc-800 p-5 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              How we correct mistakes
            </h2>
            <p className="mb-3">
              If we publish something inaccurate, we fix it and flag the
              change. Our correction process:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Confirmed factual errors are corrected in the source article or listing and the
                <code className="mx-1 px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 text-sm">dateModified</code>
                is updated</li>
              <li>Significant corrections (prices, safety claims, venue status) add a brief note at
                the bottom of the affected page</li>
              <li>Venues that have permanently closed are removed from the directory within 14 days
                of us confirming closure</li>
            </ul>
            <p className="mt-3">
              Spotted something wrong? Email{" "}
              <a href="mailto:ukrageroom@gmail.com" className="text-orange-500 hover:text-orange-600 underline">
                ukrageroom@gmail.com
              </a>{" "}
              and we'll investigate.
            </p>
          </div>

          <div className="bg-[#181818] rounded-lg border border-zinc-800 p-5 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              How we keep listings up to date
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
              Reviews on this site
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
                <strong className="text-white">Site reviews</strong> — not currently collected; Google reviews are shown where available
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
              Content on this site
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
              For venue owners
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
            Last reviewed:{" "}
            <time dateTime={LAST_REVIEWED}>24 April 2026</time>
          </p>
        </div>
      </div>
    </div>
  )
}
