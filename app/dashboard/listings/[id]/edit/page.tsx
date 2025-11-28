import { redirect, notFound } from "next/navigation"
import { requireAdmin } from "@/lib/auth"
import { getListingByIdForAdmin } from "@/lib/listings"
import ListingForm from "@/components/ListingForm"

export default async function EditListingPage({
  params,
}: {
  params: { id: string }
}) {
  try {
    await requireAdmin()
  } catch (error) {
    redirect("/dashboard")
  }

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



