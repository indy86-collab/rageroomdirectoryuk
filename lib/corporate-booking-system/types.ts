/** Rage Room Corporate Booking System — venue-owner workspace types. */

export const CORPORATE_BOOKING_SYSTEM_PRODUCT_ID =
  "rage-room-corporate-booking-system" as const

export const LEAD_STAGES = [
  "new_lead",
  "contacted",
  "replied",
  "quote_sent",
  "follow_up",
  "tentative",
  "booked",
  "lost",
] as const

export type LeadStage = (typeof LEAD_STAGES)[number]

export const LEAD_STAGE_LABELS: Record<LeadStage, string> = {
  new_lead: "New Lead",
  contacted: "Contacted",
  replied: "Replied",
  quote_sent: "Quote Sent",
  follow_up: "Follow-Up",
  tentative: "Tentative",
  booked: "Booked",
  lost: "Lost",
}

export const OPEN_LEAD_STAGES: LeadStage[] = [
  "new_lead",
  "contacted",
  "replied",
  "quote_sent",
  "follow_up",
  "tentative",
]

export const PACKAGE_TIERS = ["essential", "plus", "premium", "custom"] as const
export type PackageTier = (typeof PACKAGE_TIERS)[number]

export const WORKFLOW_STEPS = [
  { id: "lead", label: "Lead" },
  { id: "qualify", label: "Qualify" },
  { id: "package", label: "Package" },
  { id: "quote", label: "Quote" },
  { id: "proposal", label: "Proposal" },
  { id: "follow_up", label: "Follow-up" },
  { id: "booked", label: "Booked" },
  { id: "event", label: "Event" },
  { id: "feedback", label: "Feedback / Repeat" },
] as const

export type AppView =
  | "dashboard"
  | "setup"
  | "packages"
  | "economics"
  | "pipeline"
  | "quote"
  | "proposal"
  | "outreach"
  | "messages"
  | "tools"
  | "settings"

export type VenueProfile = {
  businessName: string
  city: string
  website: string
  contactEmail: string
  telephone: string
  maxGroupSize: number | null
  typicalSessionMinutes: number | null
  vatRegistered: boolean | null
  publicStartingPrice: number | null
  typicalCorporatePrice: number | null
  address: string
  clothingGuidance: string
  ppeGuidance: string
  parkingTravel: string
  cancellationPolicy: string
  ageRequirement: string
  accessibilityNotes: string
  privateHirePolicy: string
  invoicePolicy: string
  reschedulePolicy: string
  nonParticipantPolicy: string
  attendeeInstructions: string
  depositPolicy: string
  listingId: string | null
  listingSlug: string | null
}

export type CorporatePackage = {
  id: string
  tier: PackageTier
  name: string
  participantMin: number | null
  participantMax: number | null
  smashDurationMinutes: number | null
  breakablesNote: string
  ppeIncluded: boolean
  exclusiveArea: boolean
  refreshments: string
  photosVideo: string
  meetingSpace: string
  otherInclusions: string
  pricePerPerson: number | null
  minimumBookingValue: number | null
  description: string
}

export type PackageEconomicsInput = {
  participants: number
  sellingPricePerPerson: number
  breakablesCost: number
  staffCost: number
  roomSessionCost: number
  refreshmentsCost: number
  externalCosts: number
  paymentProcessingPercent: number
  otherCosts: number
  sessionMinutes: number
}

export type CorporateLead = {
  id: string
  company: string
  contactName: string
  contactEmail: string
  contactPhone: string
  groupSize: number | null
  estimatedValue: number | null
  proposedDate: string
  preferredTime: string
  stage: LeadStage
  nextFollowUpDate: string
  notes: string
  packageId: string | null
  quoteId: string | null
  eventPurpose: string
  availabilityStatus: string
  createdAt: string
  updatedAt: string
}

export type CorporateQuote = {
  id: string
  leadId: string | null
  company: string
  contactName: string
  contactEmail: string
  participantCount: number
  packageId: string | null
  date: string
  arrivalTime: string
  extrasAmount: number
  extrasNote: string
  discountAmount: number
  discountNote: string
  applyVat: boolean
  vatRatePercent: number
  depositPercent: number
  depositAmountOverride: number | null
  validityDays: number
  documentLabel: string
  notes: string
  createdAt: string
  updatedAt: string
}

export type FaqKey =
  | "price_objection"
  | "whole_team"
  | "corporate_suitable"
  | "invoice"
  | "reschedule"
  | "what_to_wear"
  | "private_hire"
  | "non_participant"

export type VenueOwnerWorkspace = {
  id: string
  sessionId: string
  productId: string
  setupCompleted: boolean
  setupStep: number
  venue: VenueProfile
  packages: CorporatePackage[]
  leads: CorporateLead[]
  quotes: CorporateQuote[]
  faqResponses: Partial<Record<FaqKey, string>>
  economicsDraft: PackageEconomicsInput
  createdAt: string
  updatedAt: string
}

export type DashboardStats = {
  openOpportunities: number
  pipelineValue: number
  quotesAwaitingResponse: number
  followUpsDue: number
  bookingsWon: number
  bookedValue: number
  conversionCount: number
  byStage: Record<LeadStage, number>
}
