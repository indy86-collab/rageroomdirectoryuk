import { Metadata } from "next"
import Link from "next/link"
import Breadcrumbs from "@/components/Breadcrumbs"
import VenueBadgeEmbedTool from "@/components/VenueBadgeEmbedTool"
import { buildBreadcrumbSchema, buildOgImageUrl } from "@/lib/seo-schema"
import { venueBadgeLookupOptions } from "@/lib/venue-badge"
import { getSiteUrl } from "@/lib/site-url"

const PATH = "/for-venues/badge"
const OG_IMAGE = buildOgImageUrl({
  title: "Listed on RageRoom Directory",
  subtitle: "Free venue listing badge",
  badge: "For venues",
})

export const metadata: Metadata = {
  title: "Venue Listing Badge",
  description:
    "If your venue is listed on RageRoom Directory, you can display a free badge linking visitors to your canonical venue profile. Optional, with no ranking benefit.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "Listed on RageRoom Directory badge",
    description:
      "Display a free listing badge on your website linking to your RageRoom Directory profile.",
    type: "website",
    url: PATH,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Listed on RageRoom Directory" }],
  },
}

export const revalidate = 3600

export default async function VenueBadgePage({
  searchParams,
}: {
  searchParams?: { listing?: string }
}) {
  const { getAllListingsForAdmin } = await import("@/lib/listings")
  const options = venueBadgeLookupOptions(await getAllListingsForAdmin())
  const siteOrigin = getSiteUrl()
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "List your rage room", url: "/list-your-rage-room" },
    { name: "Venue listing badge", url: PATH },
  ])

  return (
    <div className="py-6 sm:py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "For venue owners", href: "/list-your-rage-room" },
            { label: "Listing badge" },
          ]}
        />

        <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
          Listed on RageRoom Directory
        </h1>
        <p className="mb-6 text-base leading-relaxed text-zinc-300 sm:text-lg">
          Is your venue listed on RageRoom Directory? You can display a free badge on
          your website linking visitors to your RageRoom Directory venue profile.
        </p>

        <div className="mb-8 rounded-lg border border-zinc-800 bg-[#181818] p-5 text-sm leading-relaxed text-zinc-300">
          <p>
            The badge only states that the venue is listed in the directory. It is not
            an award, ranking or recommendation, and using it does not change your
            position in search results. There is no payment, incentive or placement
            benefit attached to the backlink.
          </p>
        </div>

        <div className="mb-10 rounded-lg border border-zinc-800 bg-[#181818] p-5 sm:p-6">
          <h2 className="mb-4 text-xl font-bold text-white">Get your badge</h2>
          <VenueBadgeEmbedTool
            options={options}
            initialSlug={searchParams?.listing}
            siteOrigin={siteOrigin}
          />
        </div>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-bold text-white">Not listed yet?</h2>
          <p className="text-sm text-zinc-300">
            Submit or claim your venue first. Editors verify details before a listing
            is published.{" "}
            <Link
              href="/list-your-rage-room"
              className="font-semibold text-orange-500 hover:text-orange-400"
            >
              List your rage room →
            </Link>
          </p>
        </section>
      </div>
    </div>
  )
}
