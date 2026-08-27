import { Metadata } from "next"
import RageRoomFinderWidget from "@/components/RageRoomFinderWidget"
import {
  buildWidgetLocationIndex,
  sanitiseWidgetActivity,
  sanitiseWidgetLocationSlug,
  sanitiseWidgetShowTitle,
} from "@/lib/widget-search"
import { getSiteUrl } from "@/lib/site-url"

export const metadata: Metadata = {
  title: "Find a Rage Room Near You",
  description: "Search verified UK rage rooms by postcode or town.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/embed/rage-room-finder" },
}

export const revalidate = 3600

export default async function RageRoomFinderEmbedPage({
  searchParams,
}: {
  searchParams?: { title?: string; activity?: string; location?: string }
}) {
  const { getAllListingsForAdmin } = await import("@/lib/listings")
  const activity = sanitiseWidgetActivity(searchParams?.activity)
  const locationSlug = sanitiseWidgetLocationSlug(searchParams?.location)
  const listings = await getAllListingsForAdmin()
  const index = buildWidgetLocationIndex(listings, activity)
  const preset = index.cities.find((city) => city.slug === locationSlug)
  const showTitle = sanitiseWidgetShowTitle(searchParams?.title)

  return (
    <RageRoomFinderWidget
      index={index}
      initialQuery={preset?.name ?? ""}
      showTitle={showTitle}
      source="embed"
      siteOrigin={getSiteUrl()}
    />
  )
}
