import type { Metadata } from "next"
import { notFound } from "next/navigation"
import LocationDiscoveryPage from "@/components/LocationDiscoveryPage"
import { getAllListingsForAdmin } from "@/lib/listings"
import {
  getEligibleLocationDiscoveryPages,
  getLocationDiscoveryMetadata,
  getLocationDiscoveryPageData,
} from "@/lib/location-discovery"

interface ActivityLocationPageProps {
  params: { slug: string; location: string }
  searchParams?: Record<string, string | string[] | undefined>
}

export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  const listings = await getAllListingsForAdmin()
  return getEligibleLocationDiscoveryPages(listings, "activity").map((page) => ({
    slug: page.category.slug,
    location: page.location.slug,
  }))
}

export async function generateMetadata({
  params,
  searchParams = {},
}: ActivityLocationPageProps): Promise<Metadata> {
  const listings = await getAllListingsForAdmin()
  const page = getLocationDiscoveryPageData({
    type: "activity",
    categorySlug: params.slug,
    locationSlug: params.location,
    listings,
  })
  if (!page) return { title: "Activity Location Not Found" }
  return {
    ...getLocationDiscoveryMetadata(page),
    ...(Object.keys(searchParams).length > 0
      ? { robots: { index: false, follow: true } }
      : {}),
  }
}

export default async function ActivityLocationPage({
  params,
}: ActivityLocationPageProps) {
  const listings = await getAllListingsForAdmin()
  const page = getLocationDiscoveryPageData({
    type: "activity",
    categorySlug: params.slug,
    locationSlug: params.location,
    listings,
  })
  if (!page) notFound()
  return <LocationDiscoveryPage page={page} allListings={listings} />
}
