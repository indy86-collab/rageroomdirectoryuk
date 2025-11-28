import Link from "next/link"
import Image from "next/image"
import { Listing } from "@prisma/client"

interface ListingCardProps {
  listing: Listing
}

export default function ListingCard({ listing }: ListingCardProps) {
  // Use slug if available, fallback to id for backwards compatibility
  const href = listing.slug ? `/listing/${listing.slug}` : `/listing/${listing.id}`
  
  return (
    <Link href={href}>
      <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 hover:transform hover:scale-105 transition-transform duration-200 relative group">
        {/* Image or placeholder */}
        {listing.image ? (
          <div className="aspect-video w-full overflow-hidden relative">
            <Image
              src={listing.image}
              alt={`${listing.name} rage room in ${listing.city} - smash room experience`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
            />
            {/* Orange triangle overlay */}
            <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[60px] border-l-transparent border-b-[60px] border-b-orange-500 opacity-90"></div>
          </div>
        ) : (
          <div className="aspect-video w-full bg-zinc-800 flex items-center justify-center relative">
            <span className="text-zinc-400 text-sm">No image</span>
            <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[60px] border-l-transparent border-b-[60px] border-b-orange-500 opacity-90"></div>
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-1">
            {listing.name}
          </h3>
          <p className="text-sm text-zinc-400 mb-2">
            {listing.city}
            {listing.region && `, ${listing.region}`}
          </p>
          {listing.description && (
            <p className="text-xs text-zinc-500 mb-2 line-clamp-2">
              {listing.description.substring(0, 80)}
              {listing.description.length > 80 ? "..." : ""}
            </p>
          )}
          {listing.price && (
            <p className="text-sm font-medium text-orange-500 mt-2">
              From £{listing.price.toFixed(0)}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}




