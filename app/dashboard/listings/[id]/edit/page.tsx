import { redirect, notFound } from "next/navigation"
import ListingForm from "@/components/ListingForm"

// Mark this route as dynamic
export const dynamic = 'force-dynamic'
export const dynamicParams = true

export default async function EditListingPage({
  params,
}: {
  params: { id: string }
}) {
  try {
    // Lazy load to prevent build-time initialization
    const { requireAdmin } = await import("@/lib/auth")
    await requireAdmin()
  } catch (error) {
    redirect("/dashboard")
  }

  // Lazy load to prevent build-time initialization
  const { getListingByIdForAdmin } = await import("@/lib/listings")
  const listing = await getListingByIdForAdmin(params.id)

  if (!listing) {
    notFound()
  }

  return (
    <div className="py-8 px-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Edit Listing
      </h1>
      <ListingForm mode="edit" listing={listing} listingId={listing.id} />
    </div>
  )
}



