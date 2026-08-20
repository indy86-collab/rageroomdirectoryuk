import type { Listing } from "@/types/listing"

export function getListingSchemaBusinessType(listing: Listing) {
  return listing.locationType === "mobile-service"
    ? "Organization"
    : (["LocalBusiness", "EntertainmentBusiness"] as const)
}

export function getListingSchemaAddress(listing: Listing) {
  if (listing.locationType === "mobile-service") return undefined

  return {
    "@type": "PostalAddress",
    ...(listing.streetAddress ? { streetAddress: listing.streetAddress } : {}),
    addressLocality: listing.city,
    ...(listing.region ? { addressRegion: listing.region } : {}),
    ...(listing.postcode ? { postalCode: listing.postcode } : {}),
    addressCountry: "GB",
  }
}

export function getListingSchemaAreaServed(listing: Listing) {
  if (listing.locationType === "mobile-service") {
    return (listing.serviceAreas ?? ["United Kingdom"]).map((area) => ({
      "@type":
        area === "United Kingdom" || area === "UK-wide"
          ? "Country"
          : "AdministrativeArea",
      name: area,
    }))
  }

  return [
    { "@type": "City", name: listing.city },
    ...(listing.region
      ? [{ "@type": "AdministrativeArea", name: listing.region }]
      : []),
  ]
}
