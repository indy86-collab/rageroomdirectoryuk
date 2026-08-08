import { Metadata } from "next"
import CityGuidePage from "@/components/CityGuidePage"
import { buildOgImageUrl } from "@/lib/seo-schema"

const OG_IMAGE = buildOgImageUrl({
  title: "Best Rage Rooms in London",
  subtitle: "Top venues ranked · Prices, packages & local tips",
  badge: "Guide",
})

export const metadata: Metadata = {
  title: "Best Rage Rooms in London (2026) | Prices, Ages & Areas",
  description:
    "Compare the best London rage rooms by starting price, area and minimum age. Verified smash rooms with packages, nearby options and booking links for 2026.",
  alternates: { canonical: "/guides/best-rage-rooms-london" },
  openGraph: {
    title: "Best Rage Rooms in London (2026) | Prices, Ages & Areas",
    description:
      "Compare verified London rage rooms by price, area and age policy — then book a smash session.",
    type: "article",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Best Rage Rooms in London" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Rage Rooms in London (2026) | Prices, Ages & Areas",
    description: "Compare London rage rooms by price, area and age — verified venues for 2026.",
    images: [OG_IMAGE],
  },
}

export const revalidate = 86400

export default function BestRageRoomsLondonPage() {
  return <CityGuidePage city="London" path="/guides/best-rage-rooms-london" />
}
