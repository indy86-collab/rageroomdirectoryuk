/** Corporate Rage Room Event Builder — client-persisted event plan. */

export const CORPORATE_EVENT_BUILDER_PRODUCT_ID =
  "corporate-team-building-toolkit" as const

export const EVENT_PURPOSES = [
  "Team social",
  "Team building",
  "Employee reward",
  "Christmas party",
  "Away day",
  "New team / onboarding",
  "Celebration",
  "Other",
] as const

export type EventPurpose = (typeof EVENT_PURPOSES)[number]

export type BudgetMode = "total" | "per_person"

export type InvitationTone = "professional" | "casual" | "fun"

export type RsvpStatus = "pending" | "yes" | "no" | "maybe"

export type BudgetCategories = {
  rageRoom: number
  foodDrinks: number
  travel: number
  contingency: number
}

export type VenueShortlistItem = {
  listingId: string
  name: string
  city: string
  region: string
  price: number | null
  priceNote: string | null
  website: string | null
  listingPath: string
  groupSizeMin: number | null
  groupSizeMax: number | null
  hasCorporateGroups: boolean
  notes: string
}

export type ScheduleItem = {
  id: string
  time: string
  label: string
  estimated: boolean
}

export type AttendeeRow = {
  id: string
  name: string
  rsvp: RsvpStatus
  dietaryNotes: string
  accessibilityNote: string
  travelConfirmed: boolean
  paymentRequired: boolean
  notes: string
}

export type ChecklistItemState = {
  id: string
  done: boolean
}

export type CorporateEvent = {
  id: string
  entitlementSessionId: string
  companyName: string
  organiserName: string
  organiserContact: string
  attendeeCount: number
  location: string
  eventDate: string
  startTime: string
  arrivalTime: string
  purpose: EventPurpose | ""
  purposeOther: string
  budgetMode: BudgetMode
  totalBudget: number
  budgetPerPerson: number
  categories: BudgetCategories
  venueShortlist: VenueShortlistItem[]
  selectedVenueId: string | null
  selectedVenueName: string
  selectedVenueAddress: string
  bookingReference: string
  travelInfo: string
  clothingReminder: string
  rsvpDeadline: string
  schedule: ScheduleItem[]
  attendees: AttendeeRow[]
  checklist: ChecklistItemState[]
  invitationTone: InvitationTone
  createdAt: string
  updatedAt: string
}

export type VenueSearchResult = {
  id: string
  name: string
  city: string
  region: string
  price: number | null
  priceNote: string | null
  website: string | null
  listingPath: string
  groupSizeMin: number | null
  groupSizeMax: number | null
  hasCorporateGroups: boolean
  sessionLengths: number[] | null
}

export const BUILDER_STEPS = [
  { id: "event", label: "Your Event" },
  { id: "budget", label: "Budget" },
  { id: "venues", label: "Venues" },
  { id: "approval", label: "Approval" },
  { id: "invite", label: "Invite Team" },
  { id: "plan", label: "Event Plan" },
] as const

export type BuilderStepId = (typeof BUILDER_STEPS)[number]["id"]
