import Link from "next/link"
import Image from "next/image"
import { Listing } from "@prisma/client"

interface FeaturedRoomsProps {
  listings: Listing[]
}

export default function FeaturedRooms({ listings }: FeaturedRoomsProps) {
  if (listings.length === 0) {
    return (
      <section className="w-full bg-transparent py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-8">
            Featured Smash Zones
          </h2>
          <p className="text-zinc-400 text-center py-8">
            Listings coming soon.
          </p>
        </div>
      </section>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {listings.map((listing) => (
        <Link key={listing.id} href={`/listing/${listing.slug || listing.id}`} className="group h-full">
          <div className="card-base card-hover overflow-hidden h-full flex flex-col shadow-xl">
            {/* Image with effects */}
            <div className="relative w-full h-56 flex-shrink-0 overflow-hidden">
              {listing.image ? (
                <>
                  <Image
                    src={listing.image}
                    alt={`${listing.name} rage room in ${listing.city}`}
                    fill
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* Gradient overlay - Removed for performance */}
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-dark-800 to-dark-900 flex items-center justify-center">
                  <span className="text-zinc-600 text-sm font-medium">No image</span>
                </div>
              )}
              {/* Impact corner - Simplified for performance */}
              <div className="absolute bottom-0 right-0 w-12 h-12 bg-rage-600 opacity-80" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}></div>
              
              {/* Featured badge - Removed backdrop-blur */}
              <div className="absolute top-3 right-3 px-3 py-1.5 bg-gradient-rage rounded-full shadow-lg">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Featured</span>
              </div>
            </div>

            {/* Card content */}
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-rage-400 transition-colors duration-150">
                {listing.name}
              </h3>
              
              <p className="text-sm text-zinc-400 mt-auto flex items-center gap-1">
                <svg className="w-4 h-4 text-rage-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {listing.city}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

