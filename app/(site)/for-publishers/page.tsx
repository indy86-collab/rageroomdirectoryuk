import { Metadata } from "next"
import Link from "next/link"
import Breadcrumbs from "@/components/Breadcrumbs"
import WidgetEmbedBuilder from "@/components/WidgetEmbedBuilder"
import { buildBreadcrumbSchema, buildOgImageUrl } from "@/lib/seo-schema"
import { buildWidgetLocationIndex } from "@/lib/widget-search"
import { getSiteUrl } from "@/lib/site-url"

const PATH = "/for-publishers"
const OG_IMAGE = buildOgImageUrl({
  title: "Rage Room Finder Widget",
  subtitle: "Embed verified UK venue search",
  badge: "For publishers",
})

export const metadata: Metadata = {
  title: "Rage Room Finder Widget for Publishers",
  description:
    "Embed a lightweight UK rage room finder on your website. Visitors search by town or postcode and open verified RageRoom Directory results.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "Rage Room Finder Widget",
    description:
      "Add a Find a Rage Room Near You widget to your site. Powered by RageRoom Directory.",
    type: "website",
    url: PATH,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Rage Room Finder Widget" }],
  },
}

export const revalidate = 3600

export default async function ForPublishersPage() {
  const { getAllListingsForAdmin } = await import("@/lib/listings")
  const index = buildWidgetLocationIndex(await getAllListingsForAdmin())
  const cities = index.cities.slice(0, 12).map((city) => ({
    name: city.name,
    slug: city.slug,
  }))
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Rage Room Finder Widget", url: PATH },
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
            { label: "Rage Room Finder Widget" },
          ]}
        />

        <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
          Rage Room Finder Widget
        </h1>
        <p className="mb-6 text-base leading-relaxed text-zinc-300 sm:text-lg">
          Add a compact “Find a Rage Room Near You” search box to a blog, city guide or
          venue website. Results open on RageRoom Directory so visitors can compare
          verified listings.
        </p>

        <ul className="mb-8 list-disc space-y-2 pl-5 text-sm text-zinc-300">
          <li>Works on desktop and mobile inside an iframe, so your styles stay intact.</li>
          <li>Searches verified directory data by town/city, or by complete UK postcode.</li>
          <li>No login and no access to private venue-owner information.</li>
          <li>Includes a visible “Powered by RageRoom Directory” attribution.</li>
        </ul>

        <div className="mb-8 rounded-lg border border-zinc-800 bg-[#181818] p-5 text-sm text-zinc-300">
          <p>
            Exact postcode radius search uses the same public postcode lookup already
            used on our{" "}
            <Link href="/near-me" className="font-semibold text-orange-500">
              Near Me
            </Link>{" "}
            page. If a postcode cannot be geocoded, ask visitors to try the town or city
            name instead.
          </p>
        </div>

        <div className="mb-10 rounded-lg border border-zinc-800 bg-[#181818] p-5 sm:p-6">
          <h2 className="mb-4 text-xl font-bold text-white">Preview and copy</h2>
          <WidgetEmbedBuilder cities={cities} siteOrigin={getSiteUrl()} />
        </div>
      </div>
    </div>
  )
}
