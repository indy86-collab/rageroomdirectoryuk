import { redirect } from "next/navigation"
import ListingForm from "@/components/ListingForm"

// Mark this route as dynamic
export const dynamic = 'force-dynamic'

export default async function NewListingPage() {
  try {
    // Lazy load to prevent build-time initialization
    const { requireAdmin } = await import("@/lib/auth")
    await requireAdmin()
  } catch (error) {
    redirect("/dashboard")
  }

  return (
    <div className="py-8 px-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Create New Listing
      </h1>
      <ListingForm mode="create" />
    </div>
  )
}



