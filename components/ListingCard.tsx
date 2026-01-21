import Link from "next/link"
import Image from "next/image"
import { Listing } from "@prisma/client"
import { MapPin, ArrowRight } from "lucide-react"

interface ListingCardProps {
  listing: Listing
}

export default function ListingCard({ listing }: ListingCardProps) {
  // Use slug if available, fallback to id for backwards compatibility
  const href = listing.slug ? `/listing/${listing.slug}` : `/listing/${listing.id}`
  
  return (
    <Link href={href} className="group">
      <div className="card-base card-hover overflow-hidden h-full flex flex-col relative">
        {/* Image or placeholder */}
        <div className="relative aspect-video w-full overflow-hidden">
          {listing.image ? (
            <>
              <Image
                src={listing.image}
                alt={`${listing.name} rage room in ${listing.city} - smash room experience`}
                fill
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
              />
              {/* Gradient overlay - Removed for performance */}
            </>
          ) : (
            <div className="aspect-video w-full bg-gradient-to-br from-dark-800 to-dark-900 flex items-center justify-center">
              <span className="text-zinc-600 text-sm font-medium">No image</span>
            </div>
          )}
          
          {/* Impact corner - Simplified for performance */}
          <div className="absolute bottom-0 right-0 w-12 h-12 bg-rage-600 opacity-70" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}></div>
          
          {/* Verified badge - Removed backdrop-blur */}
          {listing.verified && (
            <div className="absolute top-3 left-3 px-3 py-1 bg-rage-500 rounded-full text-xs font-bold text-white border border-rage-400/50 shadow-lg">
              VERIFIED
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-rage-400 transition-colors duration-150">
            {listing.name}
          </h3>
          
          <div className="flex items-center gap-2 text-sm text-zinc-400 mb-3">
            <MapPin className="w-4 h-4 text-rage-500" />
            <span>
              {listing.city}
              {listing.region && `, ${listing.region}`}
            </span>
          </div>
          
          {listing.description && (
            <p className="text-sm text-zinc-500 mb-4 line-clamp-2 flex-grow">
              {listing.description.substring(0, 100)}
              {listing.description.length > 100 ? "..." : ""}
            </p>
          )}
          
          {/* Bottom section */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-zinc-800">
            {listing.price ? (
              <div className="flex flex-col">
                <span className="text-xs text-zinc-500 uppercase">From</span>
                <span className="text-xl font-bold text-gradient">
                  £{listing.price.toFixed(0)}
                </span>
              </div>
            ) : (
              <span className="text-sm text-zinc-500">Price varies</span>
            )}
            
            <div className="flex items-center gap-2 text-rage-500 font-semibold text-sm group-hover:gap-3 transition-all duration-150">
              View Details
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Hover glow effect - Removed for performance */}
      </div>
    </Link>
  )
}




