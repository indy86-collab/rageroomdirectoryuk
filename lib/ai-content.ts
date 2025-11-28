import { Listing } from "@prisma/client"
import { getSimilarListings } from "./listings"

/**
 * Generates AI-optimized content for listing pages
 * This creates natural, conversational content that works well for both SEO and generative engines
 */

interface ListingContent {
  summary: string
  highlights: string[]
  uniquePoints: string[]
  nearbyRecommendations: string[]
  safetyNotes: string[]
}

export async function generateListingContent(
  listing: Listing,
  similarListings: Listing[]
): Promise<ListingContent> {
  const city = listing.city
  const name = listing.name
  const price = listing.price ? `£${listing.price.toFixed(0)}` : "varies"
  const hasPhone = !!listing.phone
  const hasWebsite = !!listing.website
  const verified = listing.verified

  // Generate summary paragraph
  const summary = generateSummary(listing, city, name, price)

  // Generate highlights
  const highlights = generateHighlights(listing, city, price, hasPhone, hasWebsite, verified)

  // Generate unique selling points
  const uniquePoints = generateUniquePoints(listing, city, name)

  // Generate nearby recommendations
  const nearbyRecommendations = generateNearbyRecommendations(similarListings, city)

  // Generate safety notes
  const safetyNotes = generateSafetyNotes(city)

  return {
    summary,
    highlights,
    uniquePoints,
    nearbyRecommendations,
    safetyNotes,
  }
}

function generateSummary(
  listing: Listing,
  city: string,
  name: string,
  price: string
): string {
  const description = listing.description || ""
  const hasDescription = description.length > 50

  if (hasDescription) {
    return `${name} in ${city} offers an exhilarating rage room experience where you can safely unleash stress and frustration. ${description.substring(0, 200)}${description.length > 200 ? "..." : ""} With packages starting from ${price}, this venue provides a unique outlet for individuals, couples, and groups looking to de-stress in a controlled environment.`
  }

  return `${name} in ${city} is a premier rage room destination where visitors can safely smash, destroy, and release pent-up energy. Perfect for stress relief, unique dates, or group activities, this venue offers packages starting from ${price}. Whether you're looking to blow off steam after a long week or celebrate a special occasion, ${name} provides a safe, supervised environment with all the protective gear and smashable items you need.`
}

function generateHighlights(
  listing: Listing,
  city: string,
  price: string,
  hasPhone: boolean,
  hasWebsite: boolean,
  verified: boolean
): string[] {
  const highlights: string[] = []

  highlights.push(`Located in ${city} with easy access and convenient booking options`)
  highlights.push(`Packages starting from ${price} with various session lengths available`)
  highlights.push(`Full protective gear provided including coveralls, gloves, and face shields`)
  highlights.push(`Wide selection of smashable items from glass bottles to electronics`)
  highlights.push(`Choice of weapons including baseball bats, crowbars, and sledgehammers`)

  if (verified) {
    highlights.push(`Verified venue with excellent safety standards and customer reviews`)
  }

  if (hasPhone) {
    highlights.push(`Direct contact available for bookings and inquiries`)
  }

  if (hasWebsite) {
    highlights.push(`Online booking available through their website`)
  }

  highlights.push(`Perfect for individuals, couples, groups, and corporate team building events`)

  return highlights
}

function generateUniquePoints(
  listing: Listing,
  city: string,
  name: string
): string[] {
  const uniquePoints: string[] = []

  // Base unique points that apply to most rage rooms
  uniquePoints.push(`One of ${city}'s premier rage room experiences with a focus on safety and fun`)
  uniquePoints.push(`Customizable packages to suit different group sizes and preferences`)
  uniquePoints.push(`Professional staff on hand to ensure a safe and enjoyable experience`)

  if (listing.description && listing.description.length > 100) {
    uniquePoints.push(`Specialized in providing a cathartic release experience in a controlled environment`)
  }

  uniquePoints.push(`Conveniently located in ${city} with flexible booking options`)
  uniquePoints.push(`Regular updates to smashable items to keep the experience fresh and exciting`)

  return uniquePoints
}

function generateNearbyRecommendations(
  similarListings: Listing[],
  city: string
): string[] {
  if (similarListings.length === 0) {
    return [
      `Explore other rage rooms across the UK for a variety of experiences`,
      `Check out our city directory to find rage rooms in other locations`,
    ]
  }

  const recommendations: string[] = []

  if (similarListings.length === 1) {
    recommendations.push(
      `Also check out ${similarListings[0].name} in ${city} for another great rage room experience`
    )
  } else if (similarListings.length <= 3) {
    const names = similarListings.map((l) => l.name).join(", ")
    recommendations.push(
      `Other top-rated rage rooms in ${city} include ${names} - each offering unique experiences`
    )
  } else {
    recommendations.push(
      `${city} is home to several excellent rage rooms - browse our full directory to compare options and find the perfect fit for your needs`
    )
  }

  recommendations.push(
    `Consider booking multiple sessions to try different venues and experiences`
  )

  return recommendations
}

function generateSafetyNotes(city: string): string[] {
  return [
    `All participants must wear provided protective gear including coveralls, gloves, and face shields`,
    `Safety briefing is mandatory before each session - staff will explain all rules and procedures`,
    `Minimum age requirements apply (typically 16-18 years) - check with the venue for specific policies`,
    `Closed-toe shoes are required - long sleeves and trousers recommended for extra protection`,
    `Follow all staff instructions and safety guidelines throughout your session`,
    `The venue maintains strict safety protocols to ensure a secure environment for all participants`,
  ]
}


