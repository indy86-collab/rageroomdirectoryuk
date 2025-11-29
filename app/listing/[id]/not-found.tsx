import Link from "next/link"

export default function NotFound() {
  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Listing Not Found
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          The listing you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Browse All Rage Rooms
        </Link>
      </div>
    </div>
  )
}



