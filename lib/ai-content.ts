import type { Listing } from "@/types/listing"

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
  const price = listing.price ? `£${listing.price.toFixed(0)}` : null
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
  const priceInfo = price ? ` with sessions starting from ${price} per person` : ""
  const regionInfo = region ? ` in the ${region} region` : ""

  if (hasDescription) {
    const cleanDesc = description.substring(0, 250).trim()
    const ellipsis = description.length > 250 ? "..." : ""
    return `${name} is a rage room venue located in ${city}${regionInfo}. ${cleanDesc}${ellipsis} The venue offers destruction therapy sessions${priceInfo}, providing visitors with an outlet for stress relief in a supervised setting.`
  }

  const variant = hashCode(name) % 4
  const summaries = [
    `${name} is a rage room experience based in ${city}${regionInfo}${priceInfo}. The venue provides supervised destruction therapy sessions where visitors can break items in a controlled environment, making it suitable for stress relief, celebrations, corporate outings, and anyone looking for an unconventional activity.`,
    `Located in ${city}${regionInfo}, ${name} offers rage room sessions${priceInfo}. Visitors book a time slot, receive safety equipment, and are given a selection of items to smash in a purpose-built room. The experience is designed as a physical outlet for stress and is popular for birthdays, team events, and date nights.`,
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
    highlights.push(`Sessions start from ${price} per person — check the venue's website for their full range of packages`)
  }

  if (verified) {
    highlights.push(`This venue has been verified by the RageRoom Directory team as an active, operating rage room`)
  }

  if (descLower.includes("team") || descLower.includes("corporate") || descLower.includes("group")) {
    highlights.push(`Offers group and team-building options — a popular choice for corporate away days and celebrations`)
  }

  if (descLower.includes("couple") || descLower.includes("date")) {
    highlights.push(`Couples sessions available, making it a unique date night option in ${city}`)
  }

  if (descLower.includes("birthday") || descLower.includes("party") || descLower.includes("hen") || descLower.includes("stag")) {
    highlights.push(`Hosts birthday parties and special celebrations with tailored packages`)
  }

  if (descLower.includes("axe") || descLower.includes("archery") || descLower.includes("escape")) {
    highlights.push(`Offers additional activities beyond rage room sessions for a fuller experience`)
  }

  if (hasWebsite) {
    highlights.push(`Online booking available through their website for easy session planning`)
  }

  if (hasPhone && !hasWebsite) {
    highlights.push(`Direct phone booking available for arranging sessions and asking questions`)
  }

  if (highlights.length < 4) {
    highlights.push(`All necessary safety equipment and breakable items provided — just turn up and smash`)
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

  if (price && numSimilar > 0) {
    const avgPrice = similarListings
      .filter(l => l.price)
      .reduce((sum, l) => sum + (l.price || 0), 0) / Math.max(similarListings.filter(l => l.price).length, 1)
    
    if (listing.price && avgPrice > 0) {
      if (listing.price < avgPrice * 0.9) {
        points.push(`Competitively priced compared to other rage rooms in the ${city} area`)
      } else if (listing.price > avgPrice * 1.1) {
        points.push(`Positioned as a premium experience among ${city}'s rage room options`)
      }
    }
  }

  if (numSimilar === 0) {
    points.push(`One of the few rage room options in the ${city} area, serving local demand for destruction therapy`)
  } else if (numSimilar <= 2) {
    points.push(`One of a small number of rage rooms operating in ${city}, giving visitors limited but focused options to choose from`)
  }

  if (descLower.includes("vr") || descLower.includes("virtual")) {
    points.push(`Incorporates technology like VR into the experience for a modern twist`)
  }
  if (descLower.includes("music") || descLower.includes("playlist") || descLower.includes("speaker")) {
    points.push(`Lets you bring your own music or provides a sound system to set the mood while smashing`)
  }
  if (descLower.includes("photo") || descLower.includes("video") || descLower.includes("record")) {
    points.push(`Offers photo or video options so visitors can capture the experience`)
  }
  if (descLower.includes("paint") || descLower.includes("splatter")) {
    points.push(`Features paint splatter or creative destruction options alongside traditional smashing`)
  }
  if (descLower.includes("car") || descLower.includes("vehicle")) {
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
  const price = listing.price
  const descLower = (listing.description || "").toLowerCase()
  const numSimilar = similarListings.length

  faqs.push({
    question: `What is ${name}?`,
    answer: `${name} is a rage room venue located in ${city}${listing.region ? `, ${listing.region}` : ""}. It offers destruction therapy sessions where visitors are given safety equipment and a selection of items to smash in a controlled, supervised environment. Sessions are suitable for stress relief, celebrations, group events, and anyone looking for an unconventional activity.`,
  })

  if (price) {
    const similarWithPrice = similarListings.filter(l => l.price)
    const avgPrice = similarWithPrice.length > 0
      ? similarWithPrice.reduce((sum, l) => sum + (l.price || 0), 0) / similarWithPrice.length
      : null

    let comparison = ""
    if (avgPrice && price < avgPrice * 0.9) {
      comparison = ` This is below the average starting price of around £${Math.round(avgPrice)} for rage rooms in the ${city} area, making it a competitively priced option.`
    } else if (avgPrice && price > avgPrice * 1.1) {
      comparison = ` This is above the average starting price of around £${Math.round(avgPrice)} in the ${city} area, suggesting a more premium experience.`
    } else if (avgPrice) {
      comparison = ` This is in line with the average starting price of around £${Math.round(avgPrice)} for rage rooms in the ${city} area.`
    }

    faqs.push({
      question: `How much does ${name} cost?`,
      answer: `Sessions at ${name} start from £${price.toFixed(0)} per person.${comparison} Most rage rooms offer several package tiers, so visit the venue's website to see their full and current pricing.`,
    })
  } else {
    faqs.push({
      question: `How much does ${name} cost?`,
      answer: `Pricing details for ${name} are not currently listed in our directory. We recommend visiting their website directly or calling the venue to ask about their latest rates and available packages.`,
    })
  }

  faqs.push({
    question: `Do I need to book ${name} in advance?`,
    answer: `We recommend booking in advance, especially for weekend sessions. ${name} ${listing.website ? "accepts bookings through their website" : "can be contacted directly to arrange a session"}. Walk-in availability is not guaranteed, and popular time slots can fill up quickly.`,
  })

  if (descLower.includes("group") || descLower.includes("team") || descLower.includes("corporate")) {
    faqs.push({
      question: `Does ${name} offer group or corporate bookings?`,
      answer: `Yes, based on the venue's description, ${name} caters to groups and corporate events. Group rage room sessions are popular for team building, stag and hen parties, and birthday celebrations. Contact the venue directly for group rates and to discuss specific requirements for larger bookings.`,
    })
  } else {
    faqs.push({
      question: `Can I bring a group to ${name}?`,
      answer: `Most rage rooms, including ${name}, accommodate groups of varying sizes. Whether it's a birthday party, a team outing, or a group of friends, it's best to contact the venue to check their maximum capacity and any group packages they may offer.`,
    })
  }

  if (numSimilar > 0) {
    const nearest = similarListings[0]
    const nearestInfo = nearest.city === city
      ? `Other rage rooms in ${city} include ${nearest.name}${nearest.price ? ` (from £${nearest.price.toFixed(0)})` : ""}.`
      : `A nearby alternative is ${nearest.name} in ${nearest.city}${nearest.price ? ` (from £${nearest.price.toFixed(0)})` : ""}.`

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

  if (descLower.includes("couple") || descLower.includes("date")) {
    faqs.push({
      question: `Is ${name} good for couples?`,
      answer: `Yes, ${name} mentions couples-friendly options in their description. Rage rooms are increasingly popular as a unique date night activity — they're fun, memorable, and offer a shared experience that's very different from a typical night out.`,
    })
  }

  if (descLower.includes("axe") || descLower.includes("archery") || descLower.includes("escape") || descLower.includes("paint")) {
    faqs.push({
      question: `Does ${name} offer activities other than rage rooms?`,
      answer: `Based on the venue's description, ${name} appears to offer additional activities alongside their rage room sessions. These may include axe throwing, archery, escape rooms, or paint splatter experiences. Check their website for the full list of available activities and combo packages.`,
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
    const priceInfo = similar.price ? ` (from £${similar.price.toFixed(0)})` : ""
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
