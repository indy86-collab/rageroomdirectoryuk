import { cityToSlug } from "@/lib/location"

export const GETYOURGUIDE_PARTNER_ID = "IZRRCJT"

export const GETYOURGUIDE_SEARCH_URL = "https://www.getyourguide.com/s/"

export const PLANNER_GROUPS = ["couple", "friends", "family", "team"] as const
export const PLANNER_VIBES = [
  "adrenaline",
  "food-drink",
  "relaxed",
  "sightseeing",
] as const
export const PLANNER_TIMINGS = ["before", "after", "full-day"] as const

export type PlannerGroup = (typeof PLANNER_GROUPS)[number]
export type PlannerVibe = (typeof PLANNER_VIBES)[number]
export type PlannerTiming = (typeof PLANNER_TIMINGS)[number]
export type AffiliatePlacement =
  | "city"
  | "listing"
  | "occasion"
  | "home"
  | "near_me"
  | "guide"
  | "activity"

export const PLANNER_LABELS = {
  groups: {
    couple: "Couple",
    friends: "Friends",
    family: "Family",
    team: "Work team",
  } satisfies Record<PlannerGroup, string>,
  vibes: {
    adrenaline: "More adrenaline",
    "food-drink": "Food & drink",
    relaxed: "Something relaxed",
    sightseeing: "See the city",
  } satisfies Record<PlannerVibe, string>,
  timings: {
    before: "Before the smash",
    after: "After the smash",
    "full-day": "Make a full day of it",
  } satisfies Record<PlannerTiming, string>,
}

/**
 * GetYourGuide destination pages convert better than free-text search.
 * Unmapped cities fall back to a location search URL.
 */
const GETYOURGUIDE_DESTINATIONS: Record<string, string> = {
  birmingham: "birmingham-l2525",
  brighton: "brighton-l440",
  bristol: "bristol-l445",
  cardiff: "cardiff-l449",
  edinburgh: "edinburgh-l44",
  glasgow: "glasgow-l438",
  leeds: "leeds-l1023",
  liverpool: "liverpool-l210",
  london: "london-l57",
  manchester: "manchester-l1128",
  newcastle: "newcastle-upon-tyne-l444",
  "newcastle-upon-tyne": "newcastle-upon-tyne-l444",
  nottingham: "nottingham-l145813",
  oxford: "oxford-l441",
  sheffield: "sheffield-l95510",
  york: "york-l436",
}

export const AFFILIATE_CHIP_CITIES = [
  "London",
  "Manchester",
  "Birmingham",
  "Edinburgh",
  "Liverpool",
  "Leeds",
] as const

const COMPETITOR_INVENTORY_TERMS = [
  "rage room",
  "rage-room",
  "smash room",
  "smash-room",
  "axe throwing",
  "axe-throwing",
]

const DEFAULT_ACTIVITY_QUERY = "walking tours and attractions"

const VIBE_QUERIES: Record<PlannerVibe, string> = {
  adrenaline: "adventure tours and outdoor experiences",
  "food-drink": "food tours and tastings",
  relaxed: "boat cruises and relaxing experiences",
  sightseeing: "walking tours and attractions",
}

export type ThemedActivityCard = {
  id: string
  title: string
  description: string
  query: string
}

export const DEFAULT_THEMED_ACTIVITY_CARDS: ThemedActivityCard[] = [
  {
    id: "sightseeing",
    title: "Walking tours & attractions",
    description: "See more of the city around your smash session.",
    query: "walking tours and attractions",
  },
  {
    id: "food-drink",
    title: "Food tours & tastings",
    description: "Add a tasting, food tour or drinks experience.",
    query: "food tours and tastings",
  },
  {
    id: "evening",
    title: "Evening experiences",
    description: "Carry on after the smash with a bookable evening activity.",
    query: "evening experiences",
  },
]

export const OCCASION_AFFILIATE_GROUPS = {
  "stag-parties": "friends",
  "hen-parties": "friends",
  birthdays: "friends",
  "date-night": "couple",
  "kids-families": "family",
} as const satisfies Record<string, PlannerGroup>

export type AffiliateOccasionSlug = keyof typeof OCCASION_AFFILIATE_GROUPS

export function formatGetYourGuideLocation(city: string) {
  return `${city.trim()}, United Kingdom`
}

export function usesCompetitorInventoryQuery(query: string) {
  const lower = query.toLowerCase()
  return COMPETITOR_INVENTORY_TERMS.some((term) => lower.includes(term))
}

export function getComplementaryActivityQuery(plan?: {
  group: PlannerGroup
  vibe: PlannerVibe
  timing: PlannerTiming
}) {
  if (!plan) return DEFAULT_ACTIVITY_QUERY

  const parts = [VIBE_QUERIES[plan.vibe]]
  if (plan.timing === "after") parts.push("evening experiences")
  if (plan.timing === "full-day") parts.push("day tours")
  if (plan.group === "couple") parts.push("couples experiences")
  if (plan.group === "family") parts.push("family friendly tours")
  return parts.join(" and ")
}

export function getThemedActivityCards(plan?: {
  group: PlannerGroup
  vibe: PlannerVibe
  timing: PlannerTiming
}): ThemedActivityCard[] {
  if (!plan) return DEFAULT_THEMED_ACTIVITY_CARDS

  const primary: ThemedActivityCard = {
    id: "best-match",
    title: "Best match for your plan",
    description:
      "Personalised from who you are going with, the mood you want and when you have time.",
    query: getComplementaryActivityQuery(plan),
  }

  const overlapId =
    plan.vibe === "food-drink"
      ? "food-drink"
      : plan.vibe === "sightseeing"
        ? "sightseeing"
        : plan.timing === "after"
          ? "evening"
          : null

  const rest = DEFAULT_THEMED_ACTIVITY_CARDS.filter(
    (card) => card.id !== overlapId
  )

  return [primary, ...rest].slice(0, 3)
}

export function getGetYourGuideDestinationSlug(city: string) {
  return GETYOURGUIDE_DESTINATIONS[cityToSlug(city)] ?? null
}

export function buildAffiliateCampaign({
  placement,
  occasionSlug,
  personalised = false,
}: {
  placement: AffiliatePlacement
  occasionSlug?: string
  personalised?: boolean
}) {
  if (personalised) return "rageroom_planner"
  if (placement === "occasion") {
    const slug = (occasionSlug ?? "unknown")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
    return `rageroom_occasion_${slug}`
  }
  if (placement === "listing") return "rageroom_listing"
  if (placement === "home") return "rageroom_home"
  if (placement === "near_me") return "rageroom_near_me"
  if (placement === "guide") return "rageroom_guide"
  if (placement === "activity") return "rageroom_activity"
  return "rageroom_city"
}

/**
 * Build a location-aware GetYourGuide affiliate search URL.
 *
 * The partner ID is intentionally public: GetYourGuide requires it in every
 * outbound URL so referred bookings can be attributed to the publisher.
 */
export function buildGetYourGuideUrl(
  city: string,
  {
    query,
    campaign,
  }: {
    query?: string
    campaign: string
  }
) {
  const url = new URL(GETYOURGUIDE_SEARCH_URL)
  const location = formatGetYourGuideLocation(city)
  url.searchParams.set("q", query ? `${query} in ${location}` : location)
  url.searchParams.set("partner_id", GETYOURGUIDE_PARTNER_ID)
  url.searchParams.set("cmp", campaign)
  return url.toString()
}

export function buildGetYourGuideBrowseUrl(city: string, campaign: string) {
  const destination = getGetYourGuideDestinationSlug(city)
  if (!destination) return buildGetYourGuideUrl(city, { campaign })

  const url = new URL(`https://www.getyourguide.com/${destination}/`)
  url.searchParams.set("partner_id", GETYOURGUIDE_PARTNER_ID)
  url.searchParams.set("cmp", campaign)
  return url.toString()
}

export function getOccasionPlannerGroup(occasionSlug: string): PlannerGroup | null {
  if (isAffiliateOccasionSlug(occasionSlug)) {
    return OCCASION_AFFILIATE_GROUPS[occasionSlug]
  }
  return null
}

export function shouldShowAffiliateOnOccasion(occasionSlug: string) {
  return getOccasionPlannerGroup(occasionSlug) !== null
}

export function shouldShowAffiliateOnActivity(activitySlug: string) {
  return activitySlug === "rage-rooms"
}

function isAffiliateOccasionSlug(
  slug: string
): slug is AffiliateOccasionSlug {
  return Object.prototype.hasOwnProperty.call(OCCASION_AFFILIATE_GROUPS, slug)
}
