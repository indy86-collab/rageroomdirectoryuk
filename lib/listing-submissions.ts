import {
  LISTING_ACTIVITIES,
  LISTING_FEATURES,
  LISTING_OCCASIONS,
  LISTING_PRICE_UNITS,
  type ListingActivity,
  type ListingFeature,
  type ListingOccasion,
  type ListingPriceUnit,
} from "@/types/listing"

export const LISTING_REQUEST_TYPES = ["new", "claim", "correction"] as const
export type ListingRequestType = (typeof LISTING_REQUEST_TYPES)[number]

export interface ListingSubmission {
  requestType: ListingRequestType
  listingSlug: string
  businessName: string
  contactName: string
  workEmail: string
  website: string
  bookingUrl: string
  phone: string
  city: string
  postcode: string
  priceFrom: number | null
  priceUnit: ListingPriceUnit | null
  ageMin: number | null
  openingHours: string
  packages: string
  sessionLengths: number[]
  groupSizeMin: number | null
  groupSizeMax: number | null
  features: ListingFeature[]
  activities: ListingActivity[]
  occasions: ListingOccasion[]
  walkInsAccepted: boolean | null
  onlineBooking: boolean | null
  giftVouchers: boolean | null
  corporatePackages: boolean | null
  privateHire: boolean | null
  accessibility: boolean | null
  mediaUrls: string[]
  sourceUrls: string[]
  notes: string
  consent: true
}

export type ListingSubmissionResult =
  | { success: true; data: ListingSubmission }
  | { success: false; errors: string[] }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const POSTCODE_RE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : ""
}

function optionalNumber(value: unknown, min: number, max: number) {
  if (value === "" || value == null) return null
  const number = Number(value)
  return Number.isFinite(number) && number >= min && number <= max
    ? number
    : null
}

function optionalBoolean(value: unknown) {
  if (value === true || value === "true") return true
  if (value === false || value === "false") return false
  return null
}

function url(value: unknown) {
  const candidate = text(value, 500)
  if (!candidate) return ""
  try {
    const parsed = new URL(candidate)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
      ? parsed.toString()
      : ""
  } catch {
    return ""
  }
}

function urlList(value: unknown) {
  const values = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(/\r?\n|,/)
      : []
  return values.map(url).filter(Boolean).slice(0, 10)
}

function numberList(value: unknown) {
  const values = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(/\s*,\s*/)
      : []
  return Array.from(
    new Set(
      values
        .map((item) => Number(item))
        .filter((item) => Number.isInteger(item) && item >= 5 && item <= 180)
    )
  ).sort((a, b) => a - b)
}

export function parseListingSubmission(input: unknown): ListingSubmissionResult {
  if (!input || typeof input !== "object") {
    return { success: false, errors: ["Invalid submission"] }
  }

  const body = input as Record<string, unknown>
  // Honeypot: bots tend to fill this invisible field.
  if (text(body.websiteUrl, 200)) {
    return { success: false, errors: ["Unable to accept this submission"] }
  }

  const requestType = LISTING_REQUEST_TYPES.includes(
    body.requestType as ListingRequestType
  )
    ? (body.requestType as ListingRequestType)
    : "new"
  const workEmail = text(body.workEmail, 200).toLowerCase()
  const websiteInput = text(body.website, 500)
  const bookingInput = text(body.bookingUrl, 500)
  const postcode = text(body.postcode, 20).toUpperCase()
  const features = Array.isArray(body.features)
    ? body.features.filter((feature): feature is ListingFeature =>
        LISTING_FEATURES.includes(feature as ListingFeature)
      )
    : []
  const activities = Array.isArray(body.activities)
    ? body.activities.filter((activity): activity is ListingActivity =>
        LISTING_ACTIVITIES.includes(activity as ListingActivity)
      )
    : []
  const occasions = Array.isArray(body.occasions)
    ? body.occasions.filter((occasion): occasion is ListingOccasion =>
        LISTING_OCCASIONS.includes(occasion as ListingOccasion)
      )
    : []

  const data: ListingSubmission = {
    requestType,
    listingSlug: text(body.listingSlug, 160),
    businessName: text(body.businessName, 160),
    contactName: text(body.contactName, 160),
    workEmail,
    website: url(websiteInput),
    bookingUrl: url(bookingInput),
    phone: text(body.phone, 50),
    city: text(body.city, 100),
    postcode,
    priceFrom: optionalNumber(body.priceFrom, 0, 1000),
    priceUnit: LISTING_PRICE_UNITS.includes(body.priceUnit as ListingPriceUnit)
      ? (body.priceUnit as ListingPriceUnit)
      : null,
    ageMin: optionalNumber(body.ageMin, 1, 100),
    openingHours: text(body.openingHours, 2000),
    packages: text(body.packages, 4000),
    sessionLengths: numberList(body.sessionLengths),
    groupSizeMin: optionalNumber(body.groupSizeMin, 1, 500),
    groupSizeMax: optionalNumber(body.groupSizeMax, 1, 500),
    features,
    activities,
    occasions,
    walkInsAccepted: optionalBoolean(body.walkInsAccepted),
    onlineBooking: optionalBoolean(body.onlineBooking),
    giftVouchers: optionalBoolean(body.giftVouchers),
    corporatePackages: optionalBoolean(body.corporatePackages),
    privateHire: optionalBoolean(body.privateHire),
    accessibility: optionalBoolean(body.accessibility),
    mediaUrls: urlList(body.mediaUrls),
    sourceUrls: urlList(body.sourceUrls),
    notes: text(body.notes, 4000),
    consent: true,
  }

  const errors: string[] = []
  if (!data.businessName) errors.push("Business name is required")
  if (!data.contactName) errors.push("Contact name is required")
  if (!EMAIL_RE.test(data.workEmail)) errors.push("A valid work email is required")
  if (!data.city) errors.push("City is required")
  if (!POSTCODE_RE.test(data.postcode)) errors.push("A valid UK postcode is required")
  if (websiteInput && !data.website) errors.push("Website must be a valid http(s) URL")
  if (bookingInput && !data.bookingUrl) errors.push("Booking link must be a valid http(s) URL")
  if (data.priceFrom != null && data.priceUnit == null) {
    errors.push("Choose whether the starting price is per person, room or group")
  }
  if (requestType !== "new" && !data.listingSlug) {
    errors.push("Choose the listing you want to update")
  }
  if (body.consent !== true) {
    errors.push("Consent is required before we can review the submission")
  }
  if (
    data.groupSizeMin != null &&
    data.groupSizeMax != null &&
    data.groupSizeMin > data.groupSizeMax
  ) {
    errors.push("Minimum group size cannot exceed maximum group size")
  }

  return errors.length ? { success: false, errors } : { success: true, data }
}

export function escapeEmailHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    }
    return entities[character]
  })
}
