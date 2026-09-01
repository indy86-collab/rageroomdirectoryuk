import { getAllCentroidCitySlugs } from "@/lib/city-centroids"
import type { PlannerGroup } from "@/lib/getyourguide"
import { cityToSlug, regionToSlug, slugToCity } from "@/lib/location"
import { isCompleteUkPostcode, normaliseUkPostcode } from "@/lib/uk-postcode"
import type {
  Listing,
  ListingActivity,
  ListingOccasion,
} from "@/types/listing"
import { LISTING_ACTIVITIES, LISTING_OCCASIONS } from "@/types/listing"

export const EXAMPLE_TRIP_QUERY =
  "Find me a rage room near Birmingham for six people next Saturday. We want something suitable for a birthday and ideally under £35 each."

export const EXAMPLE_TRIP_CHIPS = [
  {
    label: "Birthday in Birmingham",
    query: EXAMPLE_TRIP_QUERY,
  },
  {
    label: "Hen party, Leeds",
    query: "Hen party in Leeds this weekend, rage room plus axe throwing, under £40 each.",
  },
  {
    label: "Stag do, Manchester",
    query: "Stag do in Manchester for 8 people next Saturday, under £40 each.",
  },
] as const

export type TripGuideIntent = "firstVisit" | "party" | "corporate" | "gift"

export type TripLocationKind = "city" | "region" | "postcode"

export type TripLocation = {
  kind: TripLocationKind
  name: string
  slug: string
}

export type TripDate = {
  iso: string
  label: string
}

export type TripQuery = {
  raw: string
  location: TripLocation | null
  groupSize: number | null
  budgetPerPerson: number | null
  occasions: ListingOccasion[]
  activities: ListingActivity[]
  date: TripDate | null
}

export type TripLocationIndexEntry = {
  kind: "city" | "region"
  name: string
  slug: string
}

export type TripQueryOverrides = {
  city?: string
  people?: string
  budget?: string
  occasion?: string
  when?: string
  activity?: string
}

const NUMBER_WORDS: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
  twenty: 20,
}

const NUMBER_WORD_PATTERN = Object.keys(NUMBER_WORDS).join("|")

const POSTCODE_IN_TEXT_RE = /\b[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}\b/i

const WEEKDAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const

const ACTIVITY_ALIASES: Array<{ pattern: RegExp; value: ListingActivity }> = [
  { pattern: /\b(?:rage|smash|anger)[\s-]?rooms?\b/i, value: "rage-room" },
  { pattern: /\baxe[\s-]?throwing\b|\baxes\b/i, value: "axe-throwing" },
  {
    pattern: /\bpaint(?:\s|&)?[\s-]?splatter\b|\bsplatter\b|\bpaint throwing\b/i,
    value: "paint-splatter",
  },
  { pattern: /\bcar[\s-]?smash(?:es|ing)?\b/i, value: "car-smash" },
  { pattern: /\bescape[\s-]?rooms?\b/i, value: "escape-room" },
  { pattern: /\bmobile[\s-]?rage[\s-]?rooms?\b/i, value: "mobile-rage-room" },
]

const OCCASION_ALIASES: Array<{ pattern: RegExp; value: ListingOccasion }> = [
  { pattern: /\bbirthdays?\b|\bbdays?\b/i, value: "birthdays" },
  { pattern: /\bhen(?:s)?(?:\s+do|\s+party|\s+parties)?\b/i, value: "hen-parties" },
  { pattern: /\bstag(?:s)?(?:\s+do|\s+party|\s+parties)?\b/i, value: "stag-parties" },
  {
    pattern: /\b(?:corporate|team[\s-]?building|work(?:s)?\s+(?:do|party|event)|office\s+party)\b/i,
    value: "corporate-team-building",
  },
  { pattern: /\bdate[\s-]?nights?\b|\bcouples?\b/i, value: "date-nights" },
  { pattern: /\bfamil(?:y|ies)\b/i, value: "families" },
  { pattern: /\bkids?\b|\bchildren\b/i, value: "kids" },
]

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function parseNumberToken(token: string) {
  const word = NUMBER_WORDS[token.toLowerCase()]
  if (word) return word
  const numeric = Number.parseInt(token, 10)
  return Number.isFinite(numeric) ? numeric : null
}

function uniqueActivities(values: ListingActivity[]) {
  return [...new Set(values)]
}

function uniqueOccasions(values: ListingOccasion[]) {
  return [...new Set(values)]
}

export function buildTripLocationIndex(listings: Listing[]): TripLocationIndexEntry[] {
  const cities = new Map<string, TripLocationIndexEntry>()
  const regions = new Map<string, TripLocationIndexEntry>()

  for (const listing of listings) {
    if (listing.locationType === "mobile-service") continue
    const cityName = listing.city.trim()
    if (cityName && cityName.toLowerCase() !== "uk-wide") {
      const slug = cityToSlug(cityName)
      if (!cities.has(slug)) {
        cities.set(slug, { kind: "city", name: cityName, slug })
      }
    }
    const regionName = listing.region.trim()
    if (regionName && regionName.toLowerCase() !== "united kingdom") {
      const slug = regionToSlug(regionName)
      if (!regions.has(slug)) {
        regions.set(slug, { kind: "region", name: regionName, slug })
      }
    }
  }

  for (const slug of getAllCentroidCitySlugs()) {
    if (cities.has(slug)) continue
    cities.set(slug, { kind: "city", name: slugToCity(slug), slug })
  }

  return [...cities.values(), ...regions.values()].sort(
    (left, right) =>
      right.name.length - left.name.length || left.name.localeCompare(right.name)
  )
}

function findPostcode(text: string): TripLocation | null {
  const match = text.match(POSTCODE_IN_TEXT_RE)
  if (!match || !isCompleteUkPostcode(match[0])) return null
  const postcode = normaliseUkPostcode(match[0])
  return {
    kind: "postcode",
    name: postcode,
    slug: postcode.replace(/\s+/g, "").toLowerCase(),
  }
}

function findNamedLocation(
  text: string,
  index: TripLocationIndexEntry[]
): TripLocation | null {
  const haystack = text.toLowerCase()
  for (const entry of index) {
    if (entry.name.trim().length < 3) continue
    const namePattern = new RegExp(`\\b${escapeRegExp(entry.name.toLowerCase())}\\b`, "i")
    const slugPattern = new RegExp(
      `\\b${escapeRegExp(entry.slug.replace(/-/g, "[\\s-]+"))}\\b`,
      "i"
    )
    if (namePattern.test(haystack) || slugPattern.test(haystack)) {
      return { kind: entry.kind, name: entry.name, slug: entry.slug }
    }
  }
  return null
}

function parseGroupSize(text: string) {
  const peopleMatch = text.match(
    new RegExp(
      `\\b(${NUMBER_WORD_PATTERN}|\\d{1,2})\\s*(?:people|persons|person|guests|of us)\\b`,
      "i"
    )
  )
  if (peopleMatch) return parseNumberToken(peopleMatch[1])

  const partyMatch = text.match(
    new RegExp(`\\b(?:party of|group of)\\s+(${NUMBER_WORD_PATTERN}|\\d{1,2})\\b`, "i")
  )
  if (partyMatch) return parseNumberToken(partyMatch[1])

  const forMatch = text.match(
    new RegExp(`\\bfor\\s+(${NUMBER_WORD_PATTERN}|\\d{1,2})\\b`, "i")
  )
  if (forMatch) return parseNumberToken(forMatch[1])

  return null
}

function parseBudget(text: string) {
  const underMatch = text.match(
    /(?:under|below|less than|max(?:imum)?|up to|ideally under)\s*£?\s*(\d{1,3})\b/i
  )
  if (underMatch) return Number.parseInt(underMatch[1], 10)

  const poundMatch = text.match(/£\s*(\d{1,3})(?:\s*(?:each|pp|per person|a head))?/i)
  if (poundMatch) return Number.parseInt(poundMatch[1], 10)

  return null
}

function parseActivities(text: string): ListingActivity[] {
  const found: ListingActivity[] = []
  for (const alias of ACTIVITY_ALIASES) {
    if (alias.pattern.test(text)) found.push(alias.value)
  }
  return uniqueActivities(found.length ? found : ["rage-room"])
}

function parseOccasions(text: string): ListingOccasion[] {
  const found: ListingOccasion[] = []
  for (const alias of OCCASION_ALIASES) {
    if (alias.pattern.test(text)) found.push(alias.value)
  }
  return uniqueOccasions(found)
}

function startOfLocalDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function addDays(date: Date, days: number) {
  const next = startOfLocalDay(date)
  next.setDate(next.getDate() + days)
  return next
}

function forthcomingWeekday(now: Date, weekday: number, skipToday: boolean) {
  const today = startOfLocalDay(now)
  const delta = (weekday - today.getDay() + 7) % 7
  if (delta === 0 && skipToday) return addDays(today, 7)
  return addDays(today, delta)
}

export function formatTripDateLabel(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date)
}

export function toTripDate(date: Date): TripDate {
  const day = startOfLocalDay(date)
  const iso = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(
    day.getDate()
  ).padStart(2, "0")}`
  return { iso, label: formatTripDateLabel(day) }
}

export function parseTripDate(text: string, now: Date): TripDate | null {
  const normalised = text.toLowerCase()

  if (/\btomorrow\b/.test(normalised)) return toTripDate(addDays(now, 1))
  if (/\btoday\b/.test(normalised)) return toTripDate(now)

  const weekend = normalised.match(/\b(this|next)?\s*weekend\b/)
  if (weekend) {
    const skipToday = weekend[1] === "next" && now.getDay() === 6
    return toTripDate(forthcomingWeekday(now, 6, skipToday))
  }

  for (let weekday = 0; weekday < WEEKDAYS.length; weekday += 1) {
    const name = WEEKDAYS[weekday]
    const match = normalised.match(new RegExp(`\\b(this|next)?\\s*${name}s?\\b`))
    if (!match) continue
    const skipToday = match[1] === "next"
    return toTripDate(forthcomingWeekday(now, weekday, skipToday))
  }

  return null
}

function parseWhenParam(value: string | undefined, now: Date): TripDate | null {
  if (!value) return null
  const isoMatch = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (isoMatch) {
    const date = new Date(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3]))
    if (!Number.isNaN(date.getTime())) return toTripDate(date)
  }
  return parseTripDate(value, now)
}

export function parseTripQuery(
  raw: string,
  options?: { locations?: TripLocationIndexEntry[]; now?: Date }
): TripQuery {
  const text = raw.trim()
  const now = options?.now ?? new Date()
  const locations = options?.locations ?? []
  if (!text) {
    return {
      raw: "",
      location: null,
      groupSize: null,
      budgetPerPerson: null,
      occasions: [],
      activities: ["rage-room"],
      date: null,
    }
  }

  const postcode = findPostcode(text)
  const named = findNamedLocation(text, locations)

  return {
    raw: text,
    location: postcode ?? named,
    groupSize: parseGroupSize(text),
    budgetPerPerson: parseBudget(text),
    occasions: parseOccasions(text),
    activities: parseActivities(text),
    date: parseTripDate(text, now),
  }
}

function isListingOccasion(value: string): value is ListingOccasion {
  return (LISTING_OCCASIONS as readonly string[]).includes(value)
}

function isListingActivity(value: string): value is ListingActivity {
  return (LISTING_ACTIVITIES as readonly string[]).includes(value)
}

export function applyTripOverrides(
  parsed: TripQuery,
  overrides: TripQueryOverrides,
  locations: TripLocationIndexEntry[]
): TripQuery {
  const next: TripQuery = {
    ...parsed,
    occasions: [...parsed.occasions],
    activities: [...parsed.activities],
  }

  const city = overrides.city?.trim()
  if (city) {
    const slug = cityToSlug(city)
    const match =
      locations.find((entry) => entry.slug === slug) ??
      locations.find((entry) => entry.name.toLowerCase() === city.toLowerCase())
    next.location = match
      ? { kind: match.kind, name: match.name, slug: match.slug }
      : { kind: "city", name: city, slug }
  }

  if (overrides.people != null && overrides.people !== "") {
    const people = Number.parseInt(overrides.people, 10)
    next.groupSize = Number.isFinite(people) && people > 0 ? people : null
  }

  if (overrides.budget != null && overrides.budget !== "") {
    const budget = Number.parseInt(overrides.budget, 10)
    next.budgetPerPerson = Number.isFinite(budget) && budget > 0 ? budget : null
  }

  if (overrides.occasion) {
    next.occasions = isListingOccasion(overrides.occasion) ? [overrides.occasion] : []
  }

  if (overrides.activity && isListingActivity(overrides.activity)) {
    next.activities = [overrides.activity]
  }

  if (overrides.when != null) {
    next.date = overrides.when ? parseWhenParam(overrides.when, new Date()) : null
  }

  return next
}

export function tripQueryFromSearchParams(
  searchParams: TripQueryOverrides & { query?: string },
  options?: { locations?: TripLocationIndexEntry[]; now?: Date }
) {
  const parsed = parseTripQuery(searchParams.query ?? "", options)
  return applyTripOverrides(parsed, searchParams, options?.locations ?? [])
}

export function buildFindHref(query: string, overrides: TripQueryOverrides = {}) {
  const params = new URLSearchParams()
  const trimmed = query.trim()
  if (trimmed) params.set("query", trimmed)
  if (overrides.city) params.set("city", overrides.city)
  if (overrides.people) params.set("people", overrides.people)
  if (overrides.budget) params.set("budget", overrides.budget)
  if (overrides.occasion) params.set("occasion", overrides.occasion)
  if (overrides.when) params.set("when", overrides.when)
  if (overrides.activity) params.set("activity", overrides.activity)
  const encoded = params.toString()
  return encoded ? `/find?${encoded}` : "/find"
}

export function tripGuideIntent(query: TripQuery): TripGuideIntent {
  const haystack = query.raw.toLowerCase()
  if (/\bgift|\bvoucher|\bpresent\b/.test(haystack)) return "gift"
  if (query.occasions.includes("corporate-team-building")) return "corporate"
  if (
    query.occasions.some((occasion) =>
      ["birthdays", "hen-parties", "stag-parties"].includes(occasion)
    )
  ) {
    return "party"
  }
  return "firstVisit"
}

export function tripPlannerGroup(query: TripQuery): PlannerGroup {
  if (query.occasions.includes("corporate-team-building")) return "team"
  if (query.occasions.includes("families") || query.occasions.includes("kids")) return "family"
  if (query.occasions.includes("date-nights") || query.groupSize === 2) return "couple"
  return "friends"
}

export function summariseTripQuery(query: TripQuery) {
  const parts: string[] = []
  if (query.location) {
    parts.push(
      query.location.kind === "postcode" ? query.location.name : `Near ${query.location.name}`
    )
  }
  if (query.groupSize) parts.push(`${query.groupSize} people`)
  if (query.occasions[0] === "birthdays") parts.push("birthday")
  else if (query.occasions[0] === "hen-parties") parts.push("hen party")
  else if (query.occasions[0] === "stag-parties") parts.push("stag do")
  else if (query.occasions[0] === "corporate-team-building") parts.push("work group")
  else if (query.occasions[0]) parts.push(query.occasions[0].replace(/-/g, " "))
  if (query.budgetPerPerson) parts.push(`under £${query.budgetPerPerson}`)
  if (query.date) parts.push(query.date.label)
  return parts
}
