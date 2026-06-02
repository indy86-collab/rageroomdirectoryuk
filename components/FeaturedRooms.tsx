import Link from "next/link"
import Image from "next/image"
import { MapPin, CheckCircle2 } from "lucide-react"
import type { Listing } from "@/types/listing"

interface FeaturedRoomsProps {
  listings: Listing[]
  variant?: "grid" | "compact"
}

export default function FeaturedRooms({ listings, variant = "grid" }: FeaturedRoomsProps) {
  if (listings.length === 0) {
    return (
      <div className="card-base p-8 text-center">
        <p className="text-zinc-400">Listings coming soon.</p>
      </div>
    )
  }

  if (variant === "compact") {
    return (
      <div className="grid grid-cols-2 gap-3">
        {listings.map((listing) => (
          <FeaturedCompactCard key={listing.id} listing={listing} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
      {listings.map((listing) => (
        <FeaturedCard key={listing.id} listing={listing} />
      ))}
    </div>
  )
}

function FeaturedCard({ listing }: { listing: Listing }) {
  const href = `/listing/${listing.slug || listing.id}`
  return (
    <div className="card-base card-hover overflow-hidden flex flex-col group">
      <Link href={href} className="relative block w-full h-40 sm:h-44 overflow-hidden bg-dark-800">
        {listing.image ? (
          <Image
            src={listing.image}
            alt={`${listing.name} rage room in ${listing.city}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-dark-700 to-dark-900 flex items-center justify-center">
            <span className="text-zinc-600 text-xs">No image</span>
          </div>
        )}
        {listing.verified && (
          <span className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-dark-900/80 border border-rage-500/60 text-[10px] font-bold uppercase tracking-wider text-rage-400">
            <CheckCircle2 className="w-3 h-3" />
            Verified
          </span>
        )}
      </Link>

      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <Link href={href} className="mb-1">
          <h3 className="text-[13px] sm:text-sm font-extrabold text-white uppercase tracking-wide leading-snug line-clamp-2 group-hover:text-rage-400 transition-colors">
            {listing.name}
          </h3>
        </Link>

        {listing.price != null && (
          <p className="text-rage-500 text-sm font-bold">
            From £{listing.price.toFixed(2)}
          </p>
        )}

        <p className="text-zinc-400 text-xs flex items-center gap-1 mt-0.5">
          <MapPin className="w-3 h-3 text-rage-500" />
          <span className="truncate">{listing.city}</span>
        </p>

        <Link
          href={href}
          className="mt-3 inline-flex items-center justify-center w-full bg-rage-500 hover:bg-rage-600 text-white text-[11px] font-bold uppercase tracking-wider py-2 rounded-md transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

function FeaturedCompactCard({ listing }: { listing: Listing }) {
  const href = `/listing/${listing.slug || listing.id}`
  return (
    <div className="card-base card-hover overflow-hidden flex flex-col group">
      <Link href={href} className="relative block w-full h-24 sm:h-28 overflow-hidden bg-dark-800">
        {listing.image ? (
          <Image
            src={listing.image}
            alt={`${listing.name} rage room in ${listing.city}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.05]"
            sizes="(max-width: 640px) 50vw, 200px"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-dark-700 to-dark-900" />
        )}
        {listing.verified && (
          <span className="absolute top-1.5 right-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-dark-900/80 border border-rage-500/60 text-[9px] font-bold uppercase tracking-wider text-rage-400">
            <CheckCircle2 className="w-2.5 h-2.5" />
            Verified
          </span>
        )}
      </Link>

      <div className="p-2.5 flex flex-col flex-grow">
        <Link href={href}>
          <h3 className="text-[11px] font-extrabold text-white uppercase tracking-wide leading-tight line-clamp-2 group-hover:text-rage-400 transition-colors">
            {listing.name}
          </h3>
        </Link>

        {listing.price != null && (
          <p className="text-rage-500 text-[11px] font-bold mt-0.5">
            From £{listing.price.toFixed(2)}
          </p>
        )}

        <p className="text-zinc-500 text-[10px] truncate">{listing.city}</p>

        <Link
          href={href}
          className="mt-2 inline-flex items-center justify-center w-full bg-rage-500 hover:bg-rage-600 text-white text-[10px] font-bold uppercase tracking-wider py-1.5 rounded transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}
