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
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-60"></div>
            </>
          ) : (
            <div className="aspect-video w-full bg-gradient-to-br from-dark-800 to-dark-900 flex items-center justify-center">
              <span className="text-zinc-600 text-sm font-medium">No image</span>
            </div>
          )}
          
          {/* Impact corner - enhanced */}
          <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[70px] border-l-transparent border-b-[70px] border-b-rage-600 opacity-90 transition-all duration-300 group-hover:border-b-rage-500"></div>
          
          {/* Verified badge */}
          {listing.verified && (
            <div className="absolute top-3 left-3 px-3 py-1 bg-rage-500/90 backdrop-blur-sm rounded-full text-xs font-bold text-white border border-rage-400/50">
              VERIFIED
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-gradient transition-all">
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
            
            <div className="flex items-center gap-2 text-rage-500 font-semibold text-sm group-hover:gap-3 transition-all">
              View Details
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-gradient-rage opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"></div>
      </div>
    </Link>
  )
}




