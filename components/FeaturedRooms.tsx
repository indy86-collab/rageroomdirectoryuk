import type { Listing } from "@/types/listing"
import ListingCard from "./ListingCard"

export default function FeaturedRooms({ listings, variant = "grid" }: { listings: Listing[]; variant?: "grid" | "compact" }) {
  return <div className={`grid gap-5 ${variant === "compact" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
    {listings.map(listing => <ListingCard key={listing.id} listing={listing} />)}
  </div>
}
