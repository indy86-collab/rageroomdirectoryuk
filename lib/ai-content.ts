import type { Listing } from "@/types/listing"
import { formatListingPrice, getActivityLabel } from "@/lib/discovery"

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

  if (hasDescription) {
    const cleanDesc = description.substring(0, 250).trim()
    const ellipsis = description.length > 250 ? "..." : ""
    return `${name} is a rage room venue located in ${city}${regionInfo}. ${cleanDesc}${ellipsis} The venue offers destruction therapy sessions${priceInfo}, providing visitors with an outlet for stress relief in a supervised setting.`
  }

  const variant = hashCode(name) % 4
  const summaries = [
    `${name} is a rage room experience based in ${city}${regionInfo}${priceInfo}. The venue provides destruction sessions where visitors can break items in a controlled environment.`,
    `Located in ${city}${regionInfo}, ${name} offers rage room sessions${priceInfo}. Check the venue's published rules and package details before booking.`,
    `${name} brings the rage room concept to ${city}${regionInfo}. During a session${priceInfo}, participants suit up in protective gear and use tools to destroy everyday objects like crockery, glass, and electronics. Staff supervise throughout to ensure the experience is both safe and satisfying.`,
    `Based in ${city}${regionInfo}, ${name} runs destruction therapy sessions${priceInfo} in a purpose-built rage room. Visitors choose from smashing tools, are kitted out with full safety gear, and spend their session breaking items as a form of stress relief and entertainment.`,
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
    highlights.push(`This venue has been verified by the RageRoom Directory team as an active, operating rage room`)
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
    highlights.push(`Also publishes: ${listing.activities.slice(1).map(getActivityLabel).join(", ")}`)
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

  if (numSimilar === 0) {
    points.push(`One of the few rage room options in the ${city} area, serving local demand for destruction therapy`)
  } else if (numSimilar <= 2) {
    points.push(`One of a small number of rage rooms operating in ${city}, giving visitors limited but focused options to choose from`)
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
    points.push(`Located in ${city}, providing a local option for destruction therapy without having to travel far`)
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

  faqs.push({
    question: `What is ${name}?`,
    answer: `${name} is a rage room venue located in ${city}${listing.region ? `, ${listing.region}` : ""}. ${listing.description}`,
  })

  const formattedPrice = formatListingPrice(listing)
  if (formattedPrice) {
    faqs.push({
      question: `How much does ${name} cost?`,
      answer: `${name} has a published rage-room starting price of ${formattedPrice.replace(/^From /, "")}.${listing.priceNote ? ` ${listing.priceNote}` : ""} Check the venue's website before booking because prices can change.`,
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
      ? `Other rage rooms in ${city} include ${nearest.name}${nearestPrice ? ` (${nearestPrice.toLowerCase()})` : ""}.`
      : `A nearby alternative is ${nearest.name} in ${nearest.city}${nearestPrice ? ` (${nearestPrice.toLowerCase()})` : ""}.`

    faqs.push({
      question: `Are there other rage rooms near ${name}?`,
      answer: `Yes, there are ${numSimilar} other rage room${numSimilar === 1 ? "" : "s"} listed in our directory near ${city}. ${nearestInfo} Browse our ${city} listings to compare venues, prices, and features before booking.`,
    })
  } else {
    faqs.push({
      question: `Are there other rage rooms near ${name}?`,
      answer: `${name} is currently one of the few rage room options in the ${city} area. If you're willing to travel, check our full UK directory to find venues in neighbouring cities.`,
    })
  }

  if (listing.occasions.includes("date-nights")) {
    faqs.push({
      question: `Is ${name} good for couples?`,
      answer: `Yes. ${name} explicitly advertises a date-night option. Check the venue's current package and participant rules before booking.`,
    })
  }

  if (listing.activities.length > 1) {
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
      `${city} currently has limited rage room options. Browse our full UK directory to find venues in neighbouring cities.`,
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
        `${similar.name}${priceInfo} — another rage room in ${city} worth comparing for pricing and packages`
      )
    } else {
      recommendations.push(
        `${similar.name} in ${similar.city}${priceInfo} — a nearby alternative if you're willing to travel`
      )
    }
  }

  if (similarListings.length > 3) {
    recommendations.push(
      `There are ${similarListings.length} other rage rooms near ${city} — browse our directory to compare all options`
    )
  }

  return recommendations
}
