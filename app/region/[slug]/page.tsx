import { notFound } from "next/navigation"
import { Metadata } from "next"
import { slugToRegion } from "@/lib/location"
import ListingsGrid from "@/components/ListingsGrid"

interface RegionPageProps {
  params: { slug: string }
}

// Disable static generation - we'll use dynamic rendering instead
// export async function generateStaticParams() {
//   const { getDistinctRegions } = await import("@/lib/listings")
//   const { regionToSlug } = await import("@/lib/location")
//   
//   const regions = await getDistinctRegions()
//   
//   return regions.map((region) => ({
//     slug: regionToSlug(region),
//   }))
// }

export async function generateMetadata({
  params,
}: RegionPageProps): Promise<Metadata> {
  const regionName = slugToRegion(params.slug)
  
  return {
    title: `Rage Rooms in ${regionName} | Rage Room Directory UK`,
    description: `Discover rage rooms and smash rooms in ${regionName}. Compare venues, prices, and reviews to find the perfect rage room experience.`,
    openGraph: {
      title: `Rage Rooms in ${regionName} | Rage Room Directory UK`,
      description: `Discover rage rooms and smash rooms in ${regionName}. Compare venues, prices, and reviews.`,
      type: "website",
    },
  }
}

// Mark this route as dynamic to prevent build-time data collection
export const dynamic = 'force-dynamic'
export const dynamicParams = true

export default async function RegionPage({ params }: RegionPageProps) {
  const regionName = slugToRegion(params.slug)
  // Lazy load to prevent build-time initialization
  const { getListingsByRegion } = await import("@/lib/listings")
  const listings = await getListingsByRegion(regionName)

  // If no listings found, show 404
  if (listings.length === 0) {
    notFound()
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Rage Rooms in {regionName}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Find the best rage rooms and smash rooms in {regionName}. Browse our directory to compare venues, read reviews, and book your next rage room experience.
        </p>
        
        <div className="mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {listings.length} {listings.length === 1 ? "rage room" : "rage rooms"} found in {regionName}
          </p>
        </div>

        <ListingsGrid listings={listings} />
      </div>
    </div>
  )
}



