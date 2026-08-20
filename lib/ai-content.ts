import type { Listing } from "@/types/listing"
import {
  formatListingPrice,
  getActivityLabel,
  getListingExperienceLabel,
  getListingExperienceSummary,
  listingHasRageRoom,
} from "@/lib/discovery"

interface ListingContent {
  summary: string
  highlights: string[]
  uniquePoints: string[]
  nearbyRecommendations: string[]
}

export async function generateListingContent(
  listing: Listing,
  similarListings: Listing[]
): Promise<ListingContent> {
  const city = listing.city
  const name = listing.name
  const price = formatListingPrice(listing, { includeFrom: false })
  const hasPhone = !!listing.phone
  const hasWebsite = !!listing.website
  const verified = listing.verified
  const description = listing.description || ""
  const region = listing.region || ""
  const postcode = listing.postcode || ""

  const summary = generateSummary(listing, city, name, price, description, region)
  const highlights = generateHighlights(listing, city, name, price, hasPhone, hasWebsite, verified, description, region, postcode)
  const uniquePoints = generateUniquePoints(listing, city, name, price, description, similarListings)
  const nearbyRecommendations = generateNearbyRecommendations(similarListings, city, name)

  return {
    summary,
    highlights,
    uniquePoints,
    nearbyRecommendations,
  }
}

function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  return Math.abs(hash)
}

function generateSummary(
  listing: Listing,
  city: string,
  name: string,
  price: string | null,
  description: string,
  region: string
): string {
  const hasDescription = description.length > 50
  const priceInfo = price ? ` with a published starting price of ${price}` : ""
  const regionInfo = region ? ` in the ${region} region` : ""
  const experienceLabel = getListingExperienceLabel(listing).toLowerCase()
  const experiences = getListingExperienceSummary(listing)

  if (hasDescription) {
    const cleanDesc = description.substring(0, 250).trim()
    const ellipsis = description.length > 250 ? "..." : ""
    return `${name} is a verified ${experienceLabel} venue in ${city}${regionInfo}. ${cleanDesc}${ellipsis} Its confirmed activities are ${experiences}${priceInfo}.`
  }

  const variant = hashCode(name) % 4
  const summaries = [
    `${name} is a verified ${experienceLabel} experience based in ${city}${regionInfo}${priceInfo}. Confirmed activities include ${experiences}.`,
    `Located in ${city}${regionInfo}, ${name} offers ${experiences}${priceInfo}. Check the venue's published rules and package details before booking.`,
    `${name} brings ${experienceLabel} sessions to ${city}${regionInfo}${priceInfo}. The directory only shows activities confirmed in current venue information.`,
    `Based in ${city}${regionInfo}, ${name} runs bookable ${experienceLabel} sessions${priceInfo}. Check activity-specific safety and age rules before visiting.`,
  ]
  return summaries[variant]
}

function generateHighlights(
  listing: Listing,
  city: string,
  name: string,
  price: string | null,
  hasPhone: boolean,
  hasWebsite: boolean,
  verified: boolean,
  description: string,
  region: string,
  postcode: string
): string[] {
  const highlights: string[] = []
  const descLower = description.toLowerCase()

  if (postcode) {
    highlights.push(`Located in the ${postcode} area of ${city}, making it accessible for local visitors and those travelling in`)
  } else {
    highlights.push(`Based in ${city}${region ? `, ${region}` : ""}, convenient for those in the area`)
  }

  if (price) {
    highlights.push(`Published starting price: ${price} — check the venue's website for current package details`)
  }

  if (verified) {
    highlights.push(`This listing has been checked by the RageRoom Directory team against current official venue information`)
  }

  if (listing.corporatePackages === true) {
    highlights.push("The venue publishes corporate or team-building options")
  }

  if (listing.occasions.includes("date-nights")) {
    highlights.push(`The venue explicitly markets a date-night option in ${city}`)
  }

  if (listing.occasions.includes("birthdays")) {
    highlights.push("The venue explicitly advertises birthday bookings")
  }

  if (listing.activities.length > 1) {
    highlights.push(`Confirmed activities: ${listing.activities.map(getActivityLabel).join(", ")}`)
  }

  if (listing.onlineBooking === true) {
    highlights.push(`Online booking available through their website for easy session planning`)
  }

  if (hasPhone && !hasWebsite) {
    highlights.push(`Direct phone booking available for arranging sessions and asking questions`)
  }

  return highlights.slice(0, 6)
}

function generateUniquePoints(
  listing: Listing,
  city: string,
  name: string,
  price: string | null,
  description: string,
  similarListings: Listing[]
): string[] {
  const points: string[] = []
  const descLower = description.toLowerCase()
  const numSimilar = similarListings.length

  if (description.length > 100) {
    const firstSentence = description.split(/[.!?]/)[0]?.trim()
    if (firstSentence && firstSentence.length > 20 && firstSentence.length < 200) {
      points.push(firstSentence)
    }
  }

  const experienceLabel = getListingExperienceLabel(listing).toLowerCase()
  if (numSimilar === 0) {
    points.push(`One of the few verified ${experienceLabel} options currently listed in the ${city} area`)
  } else if (numSimilar <= 2) {
    points.push(`One of a small number of comparable ${experienceLabel} venues currently listed in ${city}`)
  }

  if (listing.activities.includes("vr")) {
    points.push(`Incorporates technology like VR into the experience for a modern twist`)
  }
  if (descLower.includes("music") || descLower.includes("playlist") || descLower.includes("speaker")) {
    points.push(`Lets you bring your own music or provides a sound system to set the mood while smashing`)
  }
  if (descLower.includes("photo") || descLower.includes("video") || descLower.includes("record")) {
    points.push(`Offers photo or video options so visitors can capture the experience`)
  }
  if (listing.activities.includes("paint-splatter")) {
    points.push(`Features paint splatter or creative destruction options alongside traditional smashing`)
  }
  if (listing.activities.includes("car-smash")) {
    points.push(`Offers large-item destruction like cars or appliances for an amplified experience`)
  }
  if (descLower.includes("custom") || descLower.includes("bring your own")) {
    points.push(`Allows visitors to bring their own items to smash for a personalised session`)
  }

  if (listing.verified) {
    points.push(`A verified listing in our directory, confirming the venue is actively operating`)
  }

  if (points.length < 3) {
    points.push(`Located in ${city}, providing a verified local option for ${experienceLabel}`)
  }

  return points.slice(0, 5)
}

export interface ListingFAQItem {
  question: string
  answer: string
}

export function generateListingFAQs(
  listing: Listing,
  similarListings: Listing[]
): ListingFAQItem[] {
  const faqs: ListingFAQItem[] = []
  const city = listing.city
  const name = listing.name
  const numSimilar = similarListings.length
  const experienceLabel = getListingExperienceLabel(listing)
  const activitySummary = getListingExperienceSummary(listing)

  faqs.push({
    question: `What is ${name}?`,
    answer: `${name} is a verified ${experienceLabel.toLowerCase()} venue${listing.locationType === "mobile-service" ? " serving " : " located in "}${city}${listing.region ? `, ${listing.region}` : ""}. Its confirmed activities are ${activitySummary}. ${listing.description}`,
  })

  const formattedPrice = formatListingPrice(listing)
  if (formattedPrice) {
    faqs.push({
      question: `How much does ${name} cost?`,
      answer: `${name} has a published starting price of ${formattedPrice.replace(/^From /, "")}.${listing.priceNote ? ` ${listing.priceNote}` : ""} Check the venue's website before booking because prices can change.`,
    })
  } else {
    faqs.push({
      question: `How much does ${name} cost?`,
      answer: `Pricing details for ${name} are not currently listed in our directory. We recommend visiting their website directly or calling the venue to ask about their latest rates and available packages.`,
    })
  }

  faqs.push({
    question: `Do I need to book ${name} in advance?`,
    answer:
      listing.onlineBooking === true
        ? `${name} publishes an online booking option. ${listing.walkInsAccepted === true ? "The venue also says walk-ins may be accepted when space is available." : listing.walkInsAccepted === false ? "The venue states that advance booking is required." : "Walk-in availability has not been confirmed in our data."}`
        : `Online booking has not been confirmed in our data. Contact ${name} directly to confirm how to reserve a session.`,
  })

  if (listing.corporatePackages === true || listing.occasions.includes("corporate-team-building")) {
    faqs.push({
      question: `Does ${name} offer group or corporate bookings?`,
      answer: `${name} publishes corporate or team-building options. Contact the venue directly for current capacity, pricing and package details.`,
    })
  } else {
    faqs.push({
      question: `Can I bring a group to ${name}?`,
      answer: listing.groupSizeMax != null
        ? `The largest confirmed booking size in our data is ${listing.groupSizeMax}. ${listing.groupSizeNote ?? "Contact the venue to confirm how many people participate at once."}`
        : `A maximum group size has not been confirmed in our data. Contact ${name} before planning a group visit.`,
    })
  }

  if (numSimilar > 0) {
    const nearest = similarListings[0]
    const nearestPrice = formatListingPrice(nearest)
    const nearestInfo = nearest.city === city
      ? `Other comparable venues in ${city} include ${nearest.name}${nearestPrice ? ` (${nearestPrice.toLowerCase()})` : ""}.`
      : `A nearby alternative is ${nearest.name} in ${nearest.city}${nearestPrice ? ` (${nearestPrice.toLowerCase()})` : ""}.`

    faqs.push({
      question: `Are there similar venues near ${name}?`,
      answer: `Yes, there ${numSimilar === 1 ? "is" : "are"} ${numSimilar} other comparable ${numSimilar === 1 ? "venue" : "venues"} listed near ${city}. ${nearestInfo} Browse the directory to compare activities, prices and booking details.`,
    })
  } else {
    faqs.push({
      question: `Are there similar venues near ${name}?`,
      answer: `${name} is currently one of the few comparable ${experienceLabel.toLowerCase()} options listed in the ${city} area. Check the full UK directory for venues in neighbouring cities.`,
    })
  }

  if (listing.occasions.includes("date-nights")) {
    faqs.push({
      question: `Is ${name} good for couples?`,
      answer: `Yes. ${name} explicitly advertises a date-night option. Check the venue's current package and participant rules before booking.`,
    })
  }

  if (listing.activities.length > 1 && listingHasRageRoom(listing)) {
    faqs.push({
      question: `Does ${name} offer activities other than rage rooms?`,
      answer: `${name} also lists ${listing.activities.slice(1).map(getActivityLabel).join(", ")}. Check the venue's branch-specific booking page for current availability and age rules.`,
    })
  }

  return faqs
}

function generateNearbyRecommendations(
  similarListings: Listing[],
  city: string,
  currentName: string
): string[] {
  if (similarListings.length === 0) {
    return [
      `${city} currently has limited comparable inventory. Browse the full UK directory to find venues in neighbouring cities.`,
    ]
  }

  const recommendations: string[] = []

  for (const similar of similarListings.slice(0, 3)) {
    const priceInfo = formatListingPrice(similar)
      ? ` (${formatListingPrice(similar)?.toLowerCase()})`
      : ""
    const sameCity = similar.city === city
    if (sameCity) {
      recommendations.push(
        `${similar.name}${priceInfo} — another venue in ${city} worth comparing for activities, pricing and packages`
      )
    } else {
      recommendations.push(
        `${similar.name} in ${similar.city}${priceInfo} — a nearby alternative if you're willing to travel`
      )
    }
  }

  if (similarListings.length > 3) {
    recommendations.push(
      `There are ${similarListings.length} other comparable venues near ${city} — browse the directory to compare all options`
    )
  }

  return recommendations
}
