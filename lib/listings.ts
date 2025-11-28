import { Listing } from "@prisma/client"

// Lazy load Prisma to avoid build-time initialization
function getPrisma() {
  return require("@/lib/prisma").prisma
}

export async function getFeaturedListings(limit: number = 6): Promise<Listing[]> {
  // Get all listings
  const prisma = getPrisma()
  const allListings = await prisma.listing.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })

  // If we have fewer listings than the limit, return all
  if (allListings.length <= limit) {
    return allListings
  }

  // Calculate daily rotation based on current date
  // Use days since epoch as a seed that changes daily
  const today = new Date()
  const epoch = new Date(1970, 0, 1)
  const daysSinceEpoch = Math.floor((today.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24))
  
  // Use modulo to get a starting index that rotates daily
  const startIndex = daysSinceEpoch % allListings.length
  
  // Get listings starting from rotated position, wrapping around if needed
  const rotatedListings = [
    ...allListings.slice(startIndex),
    ...allListings.slice(0, startIndex)
  ]

  // Return the first 'limit' listings
  return rotatedListings.slice(0, limit)
}

export async function searchListings(
  query: string | undefined,
  limit?: number
): Promise<Listing[]> {
  if (!query || query.trim() === "") {
    // If no query, return featured listings
    return await getFeaturedListings(limit || 20)
  }

  const searchTerm = query.trim()
  const prisma = getPrisma()

  return await prisma.listing.findMany({
    where: {
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { city: { contains: searchTerm, mode: "insensitive" } },
        { region: { contains: searchTerm, mode: "insensitive" } },
        { postcode: { contains: searchTerm, mode: "insensitive" } },
      ],
    },
    ...(limit ? { take: limit } : {}),
    orderBy: {
      createdAt: "desc",
    },
  })
}

export async function getListingById(id: string): Promise<Listing | null> {
  const prisma = getPrisma()
  return await prisma.listing.findUnique({
    where: { id },
  })
}

export async function getListingBySlug(slug: string) {
  const prisma = getPrisma()
  return await prisma.listing.findUnique({
    where: { slug },
    include: {
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  })
}

export async function getListingWithReviews(idOrSlug: string) {
  const prisma = getPrisma()
  // Try slug first, then fall back to ID for backwards compatibility
  const bySlug = await prisma.listing.findUnique({
    where: { slug: idOrSlug },
    include: {
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  })

  if (bySlug) return bySlug

  // Fallback to ID lookup
  return await prisma.listing.findUnique({
    where: { id: idOrSlug },
    include: {
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  })
}

export async function getAllListingsForAdmin(): Promise<Listing[]> {
  const prisma = getPrisma()
  return await prisma.listing.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })
}

export async function getListingByIdForAdmin(id: string): Promise<Listing | null> {
  const prisma = getPrisma()
  return await prisma.listing.findUnique({
    where: { id },
  })
}

export async function getListingsByCity(city: string): Promise<Listing[]> {
  const prisma = getPrisma()
  // Try multiple formats since database has inconsistent formatting
  // Some cities use hyphens (Weston-super-Mare), others use spaces (Newcastle upon Tyne)
  const normalizedWithHyphens = city.replace(/\s+/g, "-")
  const normalizedWithSpaces = city.replace(/-/g, " ")
  
  return await prisma.listing.findMany({
    where: {
      OR: [
        {
          city: {
            equals: normalizedWithHyphens,
            mode: "insensitive",
          },
        },
        {
          city: {
            equals: normalizedWithSpaces,
            mode: "insensitive",
          },
        },
        {
          city: {
            equals: city,
            mode: "insensitive",
          },
        },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export async function getDistinctCities(): Promise<string[]> {
  const prisma = getPrisma()
  const listings = await prisma.listing.findMany({
    select: {
      city: true,
    },
    distinct: ["city"],
    where: {
      city: {
        not: "",
      },
    },
  })

  return listings
    .map((listing) => listing.city)
    .filter((city) => city.trim() !== "")
    .sort()
}

export async function getListingsByRegion(region: string): Promise<Listing[]> {
  const prisma = getPrisma()
  return await prisma.listing.findMany({
    where: {
      region: {
        equals: region,
        mode: "insensitive",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export async function getSimilarListings(
  currentListingId: string,
  city: string,
  limit: number = 4,
  currentLocation?: { lat: number; lng: number }
): Promise<Listing[]> {
  const prisma = getPrisma()
  const listings = await prisma.listing.findMany({
    where: {
      city: {
        equals: city,
        mode: "insensitive",
      },
      id: {
        not: currentListingId,
      },
    },
    take: limit * 2, // Get more to sort by distance
    orderBy: {
      createdAt: "desc",
    },
  })

  // If we have location data, sort by distance
  if (currentLocation) {
    const { calculateDistance } = await import("./distance")
    
    return listings
      .map((listing) => {
        const location = listing.location as { lat: number; lng: number } | null
        if (!location) return { listing, distance: Infinity }
        
        const distance = calculateDistance(
          currentLocation.lat,
          currentLocation.lng,
          location.lat,
          location.lng
        )
        return { listing, distance }
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit)
      .map((item) => item.listing)
  }

  return listings.slice(0, limit)
}

export async function getDistinctRegions(): Promise<string[]> {
  const prisma = getPrisma()
  const listings = await prisma.listing.findMany({
    select: {
      region: true,
    },
    distinct: ["region"],
    where: {
      region: {
        not: "",
      },
    },
  })

  return listings
    .map((listing: any) => listing.region)
    .filter((region: string) => region.trim() !== "")
    .sort()
}



