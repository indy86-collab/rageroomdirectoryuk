import Link from "next/link"
import ListingSubmissionForm from "@/components/ListingSubmissionForm"

export const metadata = {
  title: "List Your Rage Room | Rage Room Directory UK",
  description:
    "List your rage room business or update your existing listing. Priority outreach for Manchester, Glasgow, Leeds and Bristol venues.",
  alternates: { canonical: "/list-your-rage-room" },
}

const PRIORITY_CITIES = [
  {
    city: "Manchester",
    why: "High search demand, thin in-city inventory — nearest venues already get Manchester traffic.",
  },
  {
    city: "Glasgow",
    why: "Scotland’s largest city and a major stag/hen destination with room for more verified listings.",
  },
  {
    city: "Leeds",
    why: "West Yorkshire search volume with limited dedicated in-city smash rooms.",
  },
  {
    city: "Bristol",
    why: "South West hub — strong group and creative-crowd demand for destruction therapy.",
  },
]

export default function ListYourRageRoomPage({
  searchParams,
}: {
  searchParams?: { listing?: string; type?: string }
}) {
  const initialType =
    searchParams?.type === "claim" || searchParams?.type === "correction"
      ? searchParams.type
      : "new"
  return (
    <div className="py-8">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="mb-4 text-4xl font-bold text-white">List Your Rage Room</h1>
        <p className="mb-8 text-lg text-zinc-300">
          Are you a rage room business owner? Get your venue listed on the UK&apos;s
          premier rage room directory and reach thousands of potential customers.
        </p>

        <div className="mb-8 rounded-lg border border-rage-500/40 bg-rage-500/10 p-6">
          <h2 className="mb-3 text-2xl font-bold text-white">
            Featured listing placement
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-zinc-300">
            Standard listings are free. Featured placement puts your venue higher on
            the matching city page and near-me results, with a badge on your listing.
            It is optional and does not affect whether you stay in the directory.
          </p>
          <ul className="mb-5 list-disc space-y-2 pl-5 text-sm text-zinc-400">
            <li>Priority slot on your city page</li>
            <li>Highlighted on near-me and search results</li>
            <li>Featured badge visitors can see on your listing</li>
          </ul>
          <a
            href="mailto:ukrageroom@gmail.com?subject=Featured%20listing%20placement"
            className="btn-rage inline-flex min-h-[44px] items-center justify-center px-5 text-sm uppercase tracking-wider"
          >
            Ask about featured placement
          </a>
        </div>

        <div className="mb-8 rounded-lg border border-rage-500/40 bg-rage-500/10 p-6">
          <h2 className="mb-3 text-2xl font-bold text-white">
            Priority cities we want to list next
          </h2>
          <p className="mb-5 text-sm leading-relaxed text-zinc-300">
            We are actively expanding inventory in high-demand cities. If you operate
            in Manchester, Glasgow, Leeds or Bristol (or nearby), email us first —
            we will prioritise verification and city-page placement.
          </p>
          <ul className="mb-5 space-y-3">
            {PRIORITY_CITIES.map(({ city, why }) => (
              <li
                key={city}
                className="rounded-md border border-zinc-800 bg-[#181818] p-4"
              >
                <p className="font-bold text-white">{city}</p>
                <p className="mt-1 text-sm text-zinc-400">{why}</p>
                <Link
                  href={`/city/${city.toLowerCase()}`}
                  className="mt-2 inline-flex text-sm font-semibold text-orange-500 hover:text-orange-400"
                >
                  See current {city} coverage →
                </Link>
              </li>
            ))}
          </ul>
          <a href="#submission-form" className="btn-rage inline-flex min-h-[44px] items-center justify-center px-5 text-sm uppercase tracking-wider">
            Submit venue details
          </a>
        </div>

        <div className="mb-8 rounded-lg border border-zinc-800 bg-[#181818] p-6">
          <h2 className="mb-3 text-2xl font-bold text-white">Promote your listing</h2>
          <p className="mb-4 text-sm leading-relaxed text-zinc-300">
            If your venue is already listed, you can display a free “Listed on
            RageRoom Directory” badge on your website. It is optional and does not
            affect rankings.
          </p>
          <Link
            href="/for-venues/badge"
            className="inline-flex min-h-11 items-center text-sm font-semibold text-orange-500 hover:text-orange-400"
          >
            Get the listing badge →
          </Link>
        </div>

        <div className="mb-8 overflow-hidden rounded-lg border border-zinc-800 bg-[#181818] p-6">
          <h2 className="mb-4 text-2xl font-bold text-white">For Existing Listings</h2>
          <p className="mb-4 text-white">
            If your rage room is already listed and you&apos;d like to update information,
            add photos, or correct pricing, contact us.
          </p>
          <p className="text-sm text-zinc-400">
            Accurate prices and photos help you appear in city price pages and rich
            results.
          </p>
          <p className="mt-4 text-sm text-zinc-300">
            Running corporate enquiries already? The{" "}
            <Link
              href="/digital-downloads/rage-room-corporate-booking-system"
              className="font-semibold text-orange-500 hover:text-orange-400"
            >
              Corporate Booking System
            </Link>{" "}
            helps venue owners organise packages, quotes and follow-up — separate from
            listing your venue here.
          </p>
        </div>

        <div className="mb-8 overflow-hidden rounded-lg border border-zinc-800 bg-[#181818] p-6">
          <h2 className="mb-4 text-2xl font-bold text-white">For New Listings</h2>
          <p className="mb-4 text-white">
            Want to list your rage room business? We&apos;d love to feature you.
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-5 text-sm text-zinc-400">
            <li>Reach customers searching for rage rooms near them</li>
            <li>Appear on city, region and price comparison pages</li>
            <li>Get included in guides and the UK map</li>
            <li>Build credibility with a verified listing</li>
          </ul>
        </div>

        <div id="submission-form" className="overflow-hidden rounded-lg border border-zinc-800 bg-[#181818] p-6">
          <h2 className="mb-2 text-2xl font-bold text-white">Submit or update a venue</h2>
          <p className="mb-6 text-sm text-zinc-400">
            Nothing is published automatically. Our editors verify the details, sources and media permission before updating the directory.
          </p>
          <ListingSubmissionForm
            initialListingSlug={searchParams?.listing || ""}
            initialRequestType={initialType}
          />
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-orange-500 hover:text-orange-600">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
