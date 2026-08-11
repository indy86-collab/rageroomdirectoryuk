import type { VenueOwnerWorkspace } from "@/lib/corporate-booking-system"

export async function fetchWorkspace(accessToken: string) {
  const response = await fetch("/api/corporate-booking-system/workspace", {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  })
  const data = (await response.json()) as {
    workspace?: VenueOwnerWorkspace
    error?: string
  }
  if (!response.ok || !data.workspace) {
    throw new Error(data.error || "Unable to load workspace")
  }
  return data.workspace
}

export async function saveWorkspaceRemote(
  accessToken: string,
  workspace: VenueOwnerWorkspace
) {
  const response = await fetch("/api/corporate-booking-system/workspace", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ workspace }),
  })
  const data = (await response.json()) as {
    workspace?: VenueOwnerWorkspace
    error?: string
  }
  if (!response.ok || !data.workspace) {
    throw new Error(data.error || "Unable to save workspace")
  }
  return data.workspace
}

export async function searchDirectoryVenues(accessToken: string, q: string) {
  const response = await fetch(
    `/api/corporate-booking-system/venues?q=${encodeURIComponent(q)}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    }
  )
  const data = (await response.json()) as {
    venues?: Array<{
      id: string
      slug: string | null
      name: string
      city: string
      website: string | null
      phone: string | null
      price: number | null
      groupSizeMax: number | null
      sessionLengths: number[] | null
    }>
    error?: string
  }
  if (!response.ok) {
    throw new Error(data.error || "Venue search failed")
  }
  return data.venues || []
}

export async function fetchDirectoryListing(
  accessToken: string,
  listingId: string
) {
  const response = await fetch(
    `/api/corporate-booking-system/venues?listing_id=${encodeURIComponent(listingId)}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    }
  )
  const data = (await response.json()) as {
    listing?: import("@/types/listing").Listing
    error?: string
  }
  if (!response.ok || !data.listing) {
    throw new Error(data.error || "Listing not found")
  }
  return data.listing
}
