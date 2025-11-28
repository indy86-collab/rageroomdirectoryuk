import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { Role } from "@prisma/client"
import Link from "next/link"

// Mark this route as dynamic
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const isAdmin = user.role === Role.ADMIN

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        Dashboard
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Welcome, {user.name || user.email}!
      </p>

      {isAdmin ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Admin Tools
          </h2>
          <div className="space-y-4">
            <Link
              href="/dashboard/listings"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Manage Listings
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-gray-600 dark:text-gray-300">
            This is your dashboard. More features coming soon.
          </p>
        </div>
      )}
    </div>
  )
}
