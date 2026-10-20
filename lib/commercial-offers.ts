import { buildGetYourGuideUrl } from "./getyourguide"
import { GYG_CURATED_ENABLED, eligibleRecommendations, curatedProductUrl, getYourGuideCampaign, cityBrowseOffer, type CuratedRecommendation } from "./getyourguide-catalogue"

export type CommercialIntent = "group" | "alternatives" | "gift"
export type CommercialOffer = { id: string; provider: string; title: string; description: string; href: string; campaign?: string; city?: string; product?: CuratedRecommendation }

// Paste complete approved tracking URLs. Do not alter signed network parameters.
export function approvedPartnerUrl(value: string | undefined): string | null {
  if (!value?.trim()) return null
  try {
    const url = new URL(value.trim())
    if (url.protocol !== "https:" || url.username || url.password) return null
    return url.toString()
  } catch { return null }
}

export function commercialOffers(intent: CommercialIntent, city?: string, placement: string = intent): CommercialOffer[] {
  const offers: CommercialOffer[] = []
  const party = approvedPartnerUrl(process.env.NEXT_PUBLIC_BOOKAPARTY_AFFILIATE_URL)
  const virgin = approvedPartnerUrl(process.env.NEXT_PUBLIC_VIRGIN_EXPERIENCES_AFFILIATE_URL)
  const buyagift = approvedPartnerUrl(process.env.NEXT_PUBLIC_BUYAGIFT_AFFILIATE_URL)
  if (intent === "group" && party) offers.push({
    id: "group-activities", provider: "bookaparty", title: "Explore group activities",
    description: "Browse birthday, hen and stag activities on Book a Party. Choose your city and check the group total.", href: party,
  })
  if (intent !== "group") {
    if (virgin) offers.push({ id: "experience-gifts", provider: "virginexperiencedays", title: "Explore experience gifts",
      description: "Browse Virgin Experience Days for an alternative day out. Check locations and voucher restrictions before buying.", href: virgin })
    if (buyagift) offers.push({ id: "gift-options", provider: "buyagift", title: "Compare gift experiences",
      description: "Explore Buyagift experiences. Confirm participating locations, dates and any supplements with the retailer.", href: buyagift })
  }
  if (GYG_CURATED_ENABLED && intent !== "gift") {
    if (city) {
      for (const product of eligibleRecommendations(city, intent === "group" ? { group: "friends", timing: "after" } : {})) {
        const campaign = getYourGuideCampaign({ city, placement, occasion: intent, recommendationId: product.id })
        offers.push({ id: product.id, provider: "getyourguide", title: product.title, description: product.description,
          href: curatedProductUrl(product, campaign), campaign, product })
      }
      const browse = cityBrowseOffer(city, placement, intent)
      offers.push({ id: "browse-all", provider: "getyourguide", title: `Browse local experiences in ${city}`,
        description: "Compare local alternatives. Check each experience’s location, dates and admission rules.", ...browse })
    } else if (intent === "group" && !party) {
      for (const destination of ["London", "Manchester", "Birmingham"]) {
        const browse = cityBrowseOffer(destination, placement, intent)
        offers.push({ id: `browse-${destination.toLowerCase()}`, provider: "getyourguide", title: `Browse local experiences in ${destination}`,
          description: "Choose your city, then check the activity’s group and age requirements.", city: destination, ...browse })
      }
    }
    return offers
  }
  if (city && intent !== "gift") {
    const choices = intent === "group"
      ? [{ id: "group-food", title: "Food experiences for your group", query: "food experiences for groups" },
         { id: "group-games", title: "Escape games and group activities", query: "escape rooms and group activities" }]
      : [{ id: "alternative-games", title: "Escape rooms and immersive games", query: "escape rooms and immersive games" },
         { id: "alternative-creative", title: "Creative workshops", query: "creative art workshops" }]
    for (const choice of choices) offers.push({ ...choice, provider: "getyourguide",
      description: `Search GetYourGuide in ${city}. These are search suggestions; check results for location, availability and group or age limits.`,
      href: buildGetYourGuideUrl(city, { query: choice.query, campaign: getYourGuideCampaign({ city, placement, occasion: intent, recommendationId: choice.id }) }),
    })
  }
  if (!city && intent === "group" && !party) {
    for (const destination of ["London", "Manchester", "Birmingham"]) offers.push({
      id: `group-${destination.toLowerCase()}`, city: destination, provider: "getyourguide", title: `Group activities in ${destination}`,
      description: "Browse activities for a shared day out. Check results for your date, headcount and budget.",
      href: buildGetYourGuideUrl(destination, { query: "group activities and food experiences", campaign: getYourGuideCampaign({ city: destination, placement, occasion: intent, recommendationId: "browse-all" }) }),
    })
  }
  return offers
}
