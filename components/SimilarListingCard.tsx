import Link from "next/link"
import Image from "next/image"
import { Listing } from "@prisma/client"

interface SimilarListingCardProps {
  listing: Listing
  distance?: number
}

export default function SimilarListingCard({ listing, distance }: SimilarListingCardProps) {
  return (
    <Link href={listing.slug ? `/listing/${listing.slug}` : `/listing/${listing.id}`}>
      <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 hover:border-orange-500 transition-colors h-full flex flex-col">
        {/* Image */}
        {listing.image ? (
          <div className="aspect-video w-full overflow-hidden relative">
            <Image
              src={listing.image}
              alt={`${listing.name} rage room in ${listing.city}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="aspect-video w-full bg-zinc-800 flex items-center justify-center">
            <span className="text-zinc-400 text-sm">No image</span>
          </div>
        )}

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-white mb-1">
            {listing.name}
          </h3>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-zinc-400">
              {listing.city}
              {listing.region && `, ${listing.region}`}
            </p>
            {distance !== undefined && (
              <p className="text-xs text-orange-500 font-medium">
                {distance} miles away
              </p>
            )}
          </div>
          {listing.price && (
            <p className="text-sm font-medium text-orange-500 mt-auto">
              From £{listing.price.toFixed(0)}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

