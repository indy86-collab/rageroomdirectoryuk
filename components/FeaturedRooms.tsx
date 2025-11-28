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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {listings.map((listing) => (
        <Link key={listing.id} href={`/listing/${listing.slug || listing.id}`} className="h-full">
          <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 shadow-md transition-transform hover:-translate-y-1 h-full flex flex-col">
            {/* Image with orange diagonal */}
            <div className="relative w-full h-48 flex-shrink-0">
              {listing.image ? (
                <Image
                  src={listing.image}
                  alt={`${listing.name} rage room in ${listing.city}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                  <span className="text-zinc-400 text-sm">No image</span>
                </div>
              )}
              {/* Orange diagonal */}
              <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[50px] border-l-transparent border-b-[50px] border-b-orange-500"></div>
            </div>

            {/* Card text */}
            <div className="p-4 flex flex-col flex-grow">
              <div className="text-orange-400 text-sm mb-1">★★★★★</div>
              <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">{listing.name}</h3>
              <p className="text-zinc-400 text-sm mt-auto">{listing.city}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

