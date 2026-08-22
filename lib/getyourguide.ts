import { cityToSlug } from "@/lib/location"

export const GETYOURGUIDE_PARTNER_ID = "IZRRCJT"

export const GETYOURGUIDE_SEARCH_URL = "https://www.getyourguide.com/s/"
export const GETYOURGUIDE_WIDGET_SCRIPT_SRC =
  "https://widget.getyourguide.com/v2/core.js"
export const GETYOURGUIDE_WIDGET_FRAME_HREF =
  "https://widget.getyourguide.com/default/activities.frame"

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
export type AffiliatePlacement = "city" | "listing" | "occasion"

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
  oxford: "oxford-l441",
  york: "york-l436",
}

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

export function getWidgetSearchQuery(
  city: string,
  plan?: {
    group: PlannerGroup
    vibe: PlannerVibe
    timing: PlannerTiming
  }
) {
  return `${getComplementaryActivityQuery(plan)} in ${formatGetYourGuideLocation(city)}`
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

export function getGetYourGuideWidgetDataset(query: string, campaign: string) {
  return {
    "data-gyg-widget": "activities",
    "data-gyg-partner-id": GETYOURGUIDE_PARTNER_ID,
    "data-gyg-locale-code": "en-GB",
    "data-gyg-number-of-items": "3",
    "data-gyg-q": query,
    "data-gyg-cmp": campaign,
    "data-gyg-href": GETYOURGUIDE_WIDGET_FRAME_HREF,
  } as const
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

function isAffiliateOccasionSlug(
  slug: string
): slug is AffiliateOccasionSlug {
  return Object.prototype.hasOwnProperty.call(OCCASION_AFFILIATE_GROUPS, slug)
}

export function isGetYourGuideWidgetScriptPresent() {
  if (typeof document === "undefined") return false
  return Boolean(
    document.querySelector(`script[src="${GETYOURGUIDE_WIDGET_SCRIPT_SRC}"]`)
  )
}

let widgetScriptPromise: Promise<void> | null = null

export function ensureGetYourGuideWidgetScript() {
  if (typeof document === "undefined") return Promise.resolve()
  if (widgetScriptPromise) return widgetScriptPromise
  if (isGetYourGuideWidgetScriptPresent()) {
    widgetScriptPromise = Promise.resolve()
    return widgetScriptPromise
  }

  widgetScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.src = GETYOURGUIDE_WIDGET_SCRIPT_SRC
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => {
      widgetScriptPromise = null
      reject(new Error("Failed to load GetYourGuide widget"))
    }
    document.body.appendChild(script)
  })

  return widgetScriptPromise
}

export function resetGetYourGuideWidgetScriptForTests() {
  widgetScriptPromise = null
}
