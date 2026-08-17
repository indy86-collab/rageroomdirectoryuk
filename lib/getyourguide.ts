export const GETYOURGUIDE_PARTNER_ID = "IZRRCJT"

const GETYOURGUIDE_SEARCH_URL = "https://www.getyourguide.com/s/"

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

export type ActivityRecommendation = {
  id: "vibe" | "group" | "timing"
  eyebrow: string
  title: string
  description: string
  query: string
}

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

const VIBE_RECOMMENDATIONS: Record<
  PlannerVibe,
  Omit<ActivityRecommendation, "id" | "eyebrow">
> = {
  adrenaline: {
    title: "Keep the adrenaline going",
    description: "Find another energetic experience to add to your smash session.",
    query: "adventure and adrenaline activities",
  },
  "food-drink": {
    title: "Add a food or drink experience",
    description: "Browse tastings, food tours and other bookable local experiences.",
    query: "food and drink experiences",
  },
  relaxed: {
    title: "Wind down afterwards",
    description: "Balance the smash with a calmer, easy-going local experience.",
    query: "relaxing experiences",
  },
  sightseeing: {
    title: "See more of the city",
    description: "Discover tours and attractions that fit around your rage room visit.",
    query: "sightseeing tours and attractions",
  },
}

const GROUP_RECOMMENDATIONS: Record<
  PlannerGroup,
  Omit<ActivityRecommendation, "id" | "eyebrow">
> = {
  couple: {
    title: "Make it a memorable date",
    description: "Explore experiences suited to two people spending the day together.",
    query: "couples activities and date experiences",
  },
  friends: {
    title: "Something the whole group can enjoy",
    description: "Keep everyone involved with another social group experience.",
    query: "fun group activities for friends",
  },
  family: {
    title: "Find a family-friendly follow-up",
    description: "Browse activities designed for different ages and family groups.",
    query: "family friendly activities",
  },
  team: {
    title: "Extend the team day",
    description: "Find a shared experience for colleagues before heading home.",
    query: "team and group activities",
  },
}

const TIMING_RECOMMENDATIONS: Record<
  PlannerTiming,
  Omit<ActivityRecommendation, "id" | "eyebrow">
> = {
  before: {
    title: "Start the day nearby",
    description: "Browse daytime activities that could work before your booked session.",
    query: "morning and daytime activities",
  },
  after: {
    title: "Carry on into the evening",
    description: "Explore bookable evening experiences after you finish smashing.",
    query: "evening activities",
  },
  "full-day": {
    title: "Build a full day out",
    description: "Discover longer experiences and attractions for a complete itinerary.",
    query: "day tours and full day activities",
  },
}

/**
 * Build a location-aware GetYourGuide affiliate search URL.
 *
 * The partner ID is intentionally public: GetYourGuide requires it in every
 * outbound URL so referred bookings can be attributed to the publisher.
 */
export function buildGetYourGuideUrl(city: string, query?: string) {
  const url = new URL(GETYOURGUIDE_SEARCH_URL)

  const location = `${city.trim()}, United Kingdom`
  url.searchParams.set("q", query ? `${query} in ${location}` : location)
  url.searchParams.set("partner_id", GETYOURGUIDE_PARTNER_ID)

  return url.toString()
}

export function getActivityRecommendations({
  group,
  vibe,
  timing,
}: {
  group: PlannerGroup
  vibe: PlannerVibe
  timing: PlannerTiming
}): ActivityRecommendation[] {
  return [
    {
      id: "vibe",
      eyebrow: "Best match for your vibe",
      ...VIBE_RECOMMENDATIONS[vibe],
    },
    {
      id: "group",
      eyebrow: `Picked for: ${PLANNER_LABELS.groups[group]}`,
      ...GROUP_RECOMMENDATIONS[group],
    },
    {
      id: "timing",
      eyebrow: PLANNER_LABELS.timings[timing],
      ...TIMING_RECOMMENDATIONS[timing],
    },
  ]
}
