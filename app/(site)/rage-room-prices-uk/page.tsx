import { Metadata } from "next"
import Link from "next/link"
import Breadcrumbs from "@/components/Breadcrumbs"
import FAQ from "@/components/FAQ"
import { buildOgImageUrl } from "@/lib/seo-schema"
import { absoluteUrl } from "@/lib/site-url"
import { cityToSlug } from "@/lib/location"
import { buildRageRoomReportData } from "@/lib/report-data"
import { CITY_PRICE_PAGE_CITIES } from "@/lib/priority-seo-cities"
import { formatListingPrice } from "@/lib/discovery"

const OG_IMAGE = buildOgImageUrl({
  title: "UK Rage Room Prices",
  subtitle: "Live directory data by venue & city",
  badge: "Pricing",
})

export const metadata: Metadata = {
  title: "Rage Room Prices UK | Live Venue & City Comparison 2026",
  description:
    "Compare current starting prices from verified UK rage rooms by venue and city. See session, group and BYO factors before booking direct.",
  alternates: { canonical: "/rage-room-prices-uk" },
  openGraph: {
    title: "Rage Room Prices UK | Live Directory Comparison",
    description: "Compare current starting prices from verified UK rage room listings.",
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "UK rage room pricing guide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rage Room Prices UK",
    description: "Current UK rage room starting prices compared.",
    images: [OG_IMAGE],
  },
}

export const revalidate = 3600

export default async function RageRoomPricesUKPage() {
  const { getAllListingsForAdmin, getListingsNearCity } = await import("@/lib/listings")
  const listings = (await getAllListingsForAdmin()).filter((listing) => listing.verified)
  const report = buildRageRoomReportData(listings)
  const pricedListings = listings
    .filter((listing): listing is typeof listing & { price: number } =>
      typeof listing.price === "number" && listing.priceUnit != null
    )
    .sort((a, b) => a.price - b.price)
  const cityPrices = (
    await Promise.all(
      CITY_PRICE_PAGE_CITIES.map(async (city) => {
        const { allForSchema } = await getListingsNearCity(city)
        const prices = allForSchema
          .filter((listing) => listing.priceUnit === "per-person")
          .map((listing) => listing.price)
          .filter((price): price is number => typeof price === "number")
        return prices.length
          ? { city, count: allForSchema.length, min: Math.min(...prices), max: Math.max(...prices) }
          : null
      })
    )
  ).filter((row): row is NonNullable<typeof row> => row != null)
  const byoListings = listings.filter((listing) => listing.features?.includes("byo-smashables"))
  const priceSummary =
    report.minimumStartingPrice != null && report.maximumStartingPrice != null
      ? `£${report.minimumStartingPrice}–£${report.maximumStartingPrice}`
      : "Prices vary"
  const faqItems = [
    {
      question: "How much does a rage room cost in the UK?",
      answer: `Across ${report.verifiedListings} verified listings, comparable published per-person starting prices currently range from ${priceSummary}, with an average of ${report.averageStartingPrice != null ? `about £${report.averageStartingPrice}` : "not yet available"}. Room and group prices are shown separately in the venue table.`,
    },
    {
      question: "What is included in a rage room price?",
      answer: "Most packages include protective equipment, a safety briefing, tools and a set quantity of breakables. Session length, electronics, larger items, recordings and additional crates may cost more, so compare the full package rather than the headline price.",
    },
    {
      question: "Can I bring my own items to smash?",
      answer: `BYO policies are venue-specific. ${byoListings.length ? `${byoListings.length} current listings explicitly mention a bring-your-own option in our verified data.` : "We do not currently have enough verified BYO data to publish a definitive venue list."} Always ask the venue what materials are accepted before travelling.`,
    },
    {
      question: "Are group rage room bookings cheaper per person?",
      answer: "They can be, but some venues price per room while others charge per participant. Check the minimum group size, maximum capacity, session duration and number of included breakables before comparing per-person value.",
    },
    {
      question: "How current are the prices?",
      answer: "Each table uses the current data stored on verified RageRoom Directory listings. A starting price is not a guaranteed quote. Follow the booking link and confirm the live package before paying.",
    },
  ]
  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Rage Room Prices UK",
    description: "Current starting-price comparison for verified UK rage rooms",
    url: absoluteUrl("/rage-room-prices-uk"),
    dateModified: report.lastUpdated,
  }
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  }

  return (
    <div className="py-6 sm:py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Rage Room Prices UK" }]} />
        {[webpageSchema, faqSchema].map((schema, index) => (
          <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        ))}

        <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
          Rage Room Prices UK: Live Comparison
        </h1>
        <div className="mb-8 max-w-4xl space-y-3 text-base text-zinc-300 sm:text-lg">
          <p>
            Current comparable per-person directory prices range from {priceSummary}. The average is {report.averageStartingPrice != null ? `about £${report.averageStartingPrice}` : "still being calculated"}; room and group rates are excluded from that comparison.
          </p>
          <p>
            Compare duration, group requirements and what is included, then follow the venue&apos;s booking link for the live price. Recorded figures were last updated {new Date(report.lastUpdated).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.
          </p>
        </div>

        <section className="mb-12" aria-labelledby="price-bands-heading">
          <h2 id="price-bands-heading" className="mb-6 text-2xl font-bold text-white sm:text-3xl">UK starting-price bands</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {report.priceBands.map((band) => (
              <div key={band.label} className="rounded-lg border border-zinc-800 bg-[#181818] p-5">
                <p className="text-sm text-zinc-400">{band.label}</p>
                <p className="mt-2 text-3xl font-black text-orange-500">{band.count}</p>
                <p className="text-xs text-zinc-500">verified {band.count === 1 ? "venue" : "venues"}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12" aria-labelledby="venue-comparison-heading">
          <h2 id="venue-comparison-heading" className="mb-3 text-2xl font-bold text-white sm:text-3xl">Verified venue price comparison</h2>
          <p className="mb-6 text-zinc-300">Published starting prices with their stated unit; packages and live availability may differ.</p>
          <div className="overflow-x-auto rounded-lg border border-zinc-800">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-[#151515] text-zinc-400">
                <tr>
                  <th className="px-4 py-3">Venue</th><th className="px-4 py-3">Location</th><th className="px-4 py-3">From</th><th className="px-4 py-3">Known duration</th><th className="px-4 py-3">Checked</th>
                </tr>
              </thead>
              <tbody>
                {pricedListings.map((listing) => (
                  <tr key={listing.id} className="border-t border-zinc-800 text-zinc-300">
                    <td className="px-4 py-3"><Link href={`/listing/${listing.slug || listing.id}`} className="font-semibold text-orange-500 hover:text-orange-400">{listing.name}</Link></td>
                    <td className="px-4 py-3">{listing.city}</td>
                    <td className="px-4 py-3 font-semibold text-white">{formatListingPrice(listing, { includeFrom: false })}</td>
                    <td className="px-4 py-3">{listing.sessionLengths?.length ? listing.sessionLengths.map((duration) => `${duration} min`).join(", ") : "Ask venue"}</td>
                    <td className="px-4 py-3 text-xs text-zinc-500">{listing.lastVerified ? new Date(listing.lastVerified).toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : "Not recorded"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12" aria-labelledby="city-comparison-heading">
          <h2 id="city-comparison-heading" className="mb-3 text-2xl font-bold text-white sm:text-3xl">Prices in and near major UK cities</h2>
          <p className="mb-6 text-zinc-300">Nearby-only pages are labelled clearly; a price shown for a city may belong to a venue within travelling distance rather than the centre.</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cityPrices.map((row) => (
              <Link key={row.city} href={`/rage-room-prices/${cityToSlug(row.city)}`} className="rounded-lg border border-zinc-800 bg-[#181818] p-5 hover:border-orange-500">
                <h3 className="font-bold text-white">{row.city}</h3>
                <p className="mt-2 text-2xl font-black text-orange-500">£{row.min}{row.max !== row.min ? `–£${row.max}` : ""} per person</p>
                <p className="mt-1 text-sm text-zinc-400">{row.count} {row.count === 1 ? "venue" : "venues"} compared</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-zinc-800 bg-[#181818] p-6">
            <h2 className="mb-4 text-2xl font-bold text-white">What changes the price?</h2>
            <ul className="list-disc space-y-2 pl-5 text-zinc-300">
              <li>Session length and briefing time</li><li>Number and type of breakables</li><li>Per-person versus per-room pricing</li><li>Minimum and maximum group size</li><li>Electronics, large-item or recording add-ons</li><li>Peak-time availability</li>
            </ul>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-[#181818] p-6">
            <h2 className="mb-4 text-2xl font-bold text-white">Compare safely</h2>
            <ul className="list-disc space-y-2 pl-5 text-zinc-300">
              <li>Confirm that PPE and the safety briefing are included.</li><li>Ask which BYO items are permitted before travelling.</li><li>Check age rules for every participant.</li><li>Read cancellation and rescheduling terms.</li><li>Use the venue&apos;s direct booking page for the final quote.</li>
            </ul>
          </div>
        </section>

        <FAQ items={faqItems} title="Frequently Asked Questions About Rage Room Prices" />

        <section className="mb-12 mt-12 grid gap-4 md:grid-cols-3">
          <Link href="/near-me" className="rounded-lg border border-zinc-800 bg-[#181818] p-5 hover:border-orange-500"><h2 className="font-bold text-white">Find the nearest venue</h2><p className="mt-2 text-sm text-zinc-400">Search by UK postcode and compare distances.</p></Link>
          <Link href="/uk-rage-room-report-2026" className="rounded-lg border border-zinc-800 bg-[#181818] p-5 hover:border-orange-500"><h2 className="font-bold text-white">UK Rage Room Report</h2><p className="mt-2 text-sm text-zinc-400">Download aggregate price and coverage data.</p></Link>
          <Link href="/guides/what-happens-in-a-rage-room" className="rounded-lg border border-zinc-800 bg-[#181818] p-5 hover:border-orange-500"><h2 className="font-bold text-white">Plan your first visit</h2><p className="mt-2 text-sm text-zinc-400">Know what happens before you book.</p></Link>
        </section>
      </div>
    </div>
  )
}
