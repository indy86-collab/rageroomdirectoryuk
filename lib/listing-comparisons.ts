import { formatListingPrice, listingHasRageRoom } from "@/lib/discovery"
import type { Listing } from "@/types/listing"

export interface PricedRageRoomRow {
  listing: Listing
  price: number
  priceUnit: NonNullable<Listing["priceUnit"]>
  formattedPrice: string
}

export interface AgeLimitRow {
  listing: Listing
  ageMin: number | null
  ageLabel: string
}

function rageRoomListings(listings: Listing[]) {
  return listings.filter(
    (listing) =>
      listing.verified &&
      listing.locationType !== "mobile-service" &&
      listingHasRageRoom(listing)
  )
}

/** Cheapest comparable rage rooms, grouped so per-person and per-room rates are never mixed. */
export function getCheapestRageRoomRows(listings: Listing[]): {
  perPerson: PricedRageRoomRow[]
  perRoomOrGroup: PricedRageRoomRow[]
} {
  const priced = rageRoomListings(listings)
    .filter(
      (listing): listing is Listing & { price: number; priceUnit: NonNullable<Listing["priceUnit"]> } =>
        typeof listing.price === "number" && listing.priceUnit != null
    )
    .map((listing) => ({
      listing,
      price: listing.price,
      priceUnit: listing.priceUnit,
      formattedPrice: formatListingPrice(listing, { includeFrom: false }) ?? "",
    }))
    .sort((a, b) => a.price - b.price || a.listing.name.localeCompare(b.listing.name))

  return {
    perPerson: priced.filter((row) => row.priceUnit === "per-person"),
    perRoomOrGroup: priced.filter((row) => row.priceUnit !== "per-person"),
  }
}

export function getRageRoomAgeLimitRows(listings: Listing[]): {
  known: AgeLimitRow[]
  unknown: AgeLimitRow[]
} {
  const rows = rageRoomListings(listings)
    .map((listing) => ({
      listing,
      ageMin: listing.ageMin ?? null,
      ageLabel: listing.ageMin != null ? `${listing.ageMin}+` : "Check venue",
    }))
    .sort((a, b) => {
      if (a.ageMin == null && b.ageMin == null) {
        return a.listing.name.localeCompare(b.listing.name)
      }
      if (a.ageMin == null) return 1
      if (b.ageMin == null) return -1
      return a.ageMin - b.ageMin || a.listing.name.localeCompare(b.listing.name)
    })

  return {
    known: rows.filter((row) => row.ageMin != null),
    unknown: rows.filter((row) => row.ageMin == null),
  }
}

export function getByoRageRoomListings(listings: Listing[]) {
  return rageRoomListings(listings).filter((listing) =>
    listing.features?.includes("byo-smashables")
  )
}

function paintListings(listings: Listing[]) {
  return listings.filter(
    (listing) => listing.verified && listing.activities.includes("paint-splatter")
  )
}

/** Published paint/splatter prices, grouped so per-person and per-room rates are never mixed. */
export function getPaintPriceRows(listings: Listing[]): {
  perPerson: PricedRageRoomRow[]
  perRoomOrGroup: PricedRageRoomRow[]
} {
  const priced = paintListings(listings)
    .filter(
      (listing): listing is Listing & { price: number; priceUnit: NonNullable<Listing["priceUnit"]> } =>
        typeof listing.price === "number" && listing.priceUnit != null
    )
    .map((listing) => ({
      listing,
      price: listing.price,
      priceUnit: listing.priceUnit,
      formattedPrice: formatListingPrice(listing, { includeFrom: false }) ?? "",
    }))
    .sort((a, b) => a.price - b.price || a.listing.name.localeCompare(b.listing.name))

  return {
    perPerson: priced.filter((row) => row.priceUnit === "per-person"),
    perRoomOrGroup: priced.filter((row) => row.priceUnit !== "per-person"),
  }
}

export function getPaintAgeRows(listings: Listing[]): {
  known: AgeLimitRow[]
  unknown: AgeLimitRow[]
} {
  const rows = paintListings(listings)
    .map((listing) => ({
      listing,
      ageMin: listing.ageMin ?? null,
      ageLabel: listing.ageMin != null ? `${listing.ageMin}+` : "Check venue",
    }))
    .sort((a, b) => {
      if (a.ageMin == null && b.ageMin == null) {
        return a.listing.name.localeCompare(b.listing.name)
      }
      if (a.ageMin == null) return 1
      if (b.ageMin == null) return -1
      return a.ageMin - b.ageMin || a.listing.name.localeCompare(b.listing.name)
    })

  return {
    known: rows.filter((row) => row.ageMin != null),
    unknown: rows.filter((row) => row.ageMin == null),
  }
}

export function getSmashAndPaintListings(listings: Listing[]) {
  return paintListings(listings).filter((listing) => listingHasRageRoom(listing))
}

export interface PaintCityGroup {
  city: string
  listings: Listing[]
}

export function getPaintCityGroups(listings: Listing[]): PaintCityGroup[] {
  const groups = new Map<string, Listing[]>()
  for (const listing of paintListings(listings)) {
    if (listing.locationType === "mobile-service") continue
    const city = listing.city
    const existing = groups.get(city) ?? []
    existing.push(listing)
    groups.set(city, existing)
  }
  return [...groups.entries()]
    .map(([city, cityListings]) => ({ city, listings: cityListings }))
    .sort(
      (a, b) =>
        b.listings.length - a.listings.length || a.city.localeCompare(b.city)
    )
}
