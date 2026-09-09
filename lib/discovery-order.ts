import type { Listing } from "@/types/listing"

/** Exact venue-name searches win; otherwise surface rage rooms before related activities. */
export function orderDiscoveryListings<T extends Listing>(listings: T[], query = ""): T[] {
  const term = query.trim().toLowerCase()
  return [...listings].sort((a, b) => {
    const exactA = Boolean(term && a.name.toLowerCase() === term)
    const exactB = Boolean(term && b.name.toLowerCase() === term)
    return Number(exactB) - Number(exactA) ||
      Number(b.activities.includes("rage-room")) - Number(a.activities.includes("rage-room"))
  })
}
