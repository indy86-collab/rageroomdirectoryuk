import { Metadata } from "next"
import CityGuidePage from "@/components/CityGuidePage"
import { buildOgImageUrl } from "@/lib/seo-schema"

const OG_IMAGE = buildOgImageUrl({
  title: "Best Rage Rooms in Newcastle",
  subtitle: "Top venues ranked · Prices, packages & local tips",
  badge: "Guide",
})

export const metadata: Metadata = {
  title: "Best Rage Rooms in Newcastle | Top Venues Ranked (2026)",
  description:
    "Independent guide to the best rage rooms in Newcastle. Compare verified venues, starting prices, packages and local tips — updated for 2026.",
  alternates: { canonical: "/guides/best-rage-rooms-newcastle" },
  openGraph: {
    title: "Best Rage Rooms in Newcastle | Top Venues Ranked",
    description:
      "Find the best rage rooms and smash rooms in Newcastle. Compare venues, prices, and book your stress-relief session.",
    type: "article",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Best Rage Rooms in Newcastle" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Rage Rooms in Newcastle",
    description: "Compare the best rage rooms in Newcastle for 2026.",
    images: [OG_IMAGE],
  },
}

export const revalidate = 86400

export default function BestRageRoomsNewcastlePage() {
  return <CityGuidePage city="Newcastle" path="/guides/best-rage-rooms-newcastle" />
}
