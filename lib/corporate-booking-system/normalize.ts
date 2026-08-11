import {
  createEmptyWorkspace,
  defaultEconomicsInput,
  emptyVenueProfile,
} from "./defaults"
import { createId } from "./id"
import {
  CORPORATE_BOOKING_SYSTEM_PRODUCT_ID,
  LEAD_STAGES,
  PACKAGE_TIERS,
  type CorporateLead,
  type CorporatePackage,
  type CorporateQuote,
  type LeadStage,
  type PackageTier,
  type VenueOwnerWorkspace,
  type VenueProfile,
} from "./types"

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback
}

function asNumberOrNull(value: unknown) {
  if (value == null || value === "") return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

function asBooleanOrNull(value: unknown) {
  if (typeof value === "boolean") return value
  return null
}

function asBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback
}

function normalizeVenue(raw: unknown): VenueProfile {
  const base = emptyVenueProfile()
  if (!raw || typeof raw !== "object") return base
  const v = raw as Partial<VenueProfile>
  return {
    ...base,
    businessName: asString(v.businessName),
    city: asString(v.city),
    website: asString(v.website),
    contactEmail: asString(v.contactEmail),
    telephone: asString(v.telephone),
    maxGroupSize: asNumberOrNull(v.maxGroupSize),
    typicalSessionMinutes: asNumberOrNull(v.typicalSessionMinutes) ?? 60,
    vatRegistered: asBooleanOrNull(v.vatRegistered),
    publicStartingPrice: asNumberOrNull(v.publicStartingPrice),
    typicalCorporatePrice: asNumberOrNull(v.typicalCorporatePrice),
    address: asString(v.address),
    clothingGuidance: asString(v.clothingGuidance),
    ppeGuidance: asString(v.ppeGuidance),
    parkingTravel: asString(v.parkingTravel),
    cancellationPolicy: asString(v.cancellationPolicy),
    ageRequirement: asString(v.ageRequirement),
    accessibilityNotes: asString(v.accessibilityNotes),
    privateHirePolicy: asString(v.privateHirePolicy),
    invoicePolicy: asString(v.invoicePolicy),
    reschedulePolicy: asString(v.reschedulePolicy),
    nonParticipantPolicy: asString(v.nonParticipantPolicy),
    attendeeInstructions: asString(v.attendeeInstructions),
    depositPolicy: asString(v.depositPolicy),
    listingId: asString(v.listingId || "") || null,
    listingSlug: asString(v.listingSlug || "") || null,
  }
}

function normalizePackage(raw: unknown): CorporatePackage | null {
  if (!raw || typeof raw !== "object") return null
  const p = raw as Partial<CorporatePackage>
  const tier = PACKAGE_TIERS.includes(p.tier as PackageTier)
    ? (p.tier as PackageTier)
    : "custom"
  return {
    id: asString(p.id) || createId(),
    tier,
    name: asString(p.name) || "Corporate package",
    participantMin: asNumberOrNull(p.participantMin),
    participantMax: asNumberOrNull(p.participantMax),
    smashDurationMinutes: asNumberOrNull(p.smashDurationMinutes),
    breakablesNote: asString(p.breakablesNote),
    ppeIncluded: asBoolean(p.ppeIncluded, true),
    exclusiveArea: asBoolean(p.exclusiveArea, false),
    refreshments: asString(p.refreshments),
    photosVideo: asString(p.photosVideo),
    meetingSpace: asString(p.meetingSpace),
    otherInclusions: asString(p.otherInclusions),
    pricePerPerson: asNumberOrNull(p.pricePerPerson),
    minimumBookingValue: asNumberOrNull(p.minimumBookingValue),
    description: asString(p.description),
  }
}

function normalizeLead(raw: unknown): CorporateLead | null {
  if (!raw || typeof raw !== "object") return null
  const l = raw as Partial<CorporateLead>
  const stage = LEAD_STAGES.includes(l.stage as LeadStage)
    ? (l.stage as LeadStage)
    : "new_lead"
  const now = new Date().toISOString()
  return {
    id: asString(l.id) || createId(),
    company: asString(l.company),
    contactName: asString(l.contactName),
    contactEmail: asString(l.contactEmail),
    contactPhone: asString(l.contactPhone),
    groupSize: asNumberOrNull(l.groupSize),
    estimatedValue: asNumberOrNull(l.estimatedValue),
    proposedDate: asString(l.proposedDate),
    preferredTime: asString(l.preferredTime),
    stage,
    nextFollowUpDate: asString(l.nextFollowUpDate),
    notes: asString(l.notes),
    packageId: asString(l.packageId || "") || null,
    quoteId: asString(l.quoteId || "") || null,
    eventPurpose: asString(l.eventPurpose),
    availabilityStatus: asString(l.availabilityStatus),
    createdAt: asString(l.createdAt, now),
    updatedAt: asString(l.updatedAt, now),
  }
}

function normalizeQuote(raw: unknown): CorporateQuote | null {
  if (!raw || typeof raw !== "object") return null
  const q = raw as Partial<CorporateQuote>
  const now = new Date().toISOString()
  return {
    id: asString(q.id) || createId(),
    leadId: asString(q.leadId || "") || null,
    company: asString(q.company),
    contactName: asString(q.contactName),
    contactEmail: asString(q.contactEmail),
    participantCount: Number(q.participantCount) || 0,
    packageId: asString(q.packageId || "") || null,
    date: asString(q.date),
    arrivalTime: asString(q.arrivalTime),
    extrasAmount: Number(q.extrasAmount) || 0,
    extrasNote: asString(q.extrasNote),
    discountAmount: Number(q.discountAmount) || 0,
    discountNote: asString(q.discountNote),
    applyVat: asBoolean(q.applyVat, false),
    vatRatePercent: Number(q.vatRatePercent) || 20,
    depositPercent: Number(q.depositPercent) || 25,
    depositAmountOverride: asNumberOrNull(q.depositAmountOverride),
    validityDays: Number(q.validityDays) || 14,
    documentLabel: asString(q.documentLabel, "Booking Quote / Estimate"),
    notes: asString(q.notes),
    createdAt: asString(q.createdAt, now),
    updatedAt: asString(q.updatedAt, now),
  }
}

export function normalizeWorkspace(raw: unknown): VenueOwnerWorkspace {
  if (!raw || typeof raw !== "object") {
    return createEmptyWorkspace("unknown")
  }

  const w = raw as Partial<VenueOwnerWorkspace>
  const sessionId = asString(w.sessionId, "unknown")
  const base = createEmptyWorkspace(sessionId, asString(w.id) || undefined)
  const economics = {
    ...defaultEconomicsInput(),
    ...(w.economicsDraft && typeof w.economicsDraft === "object"
      ? w.economicsDraft
      : {}),
  }

  return {
    ...base,
    id: asString(w.id) || base.id,
    sessionId,
    productId: CORPORATE_BOOKING_SYSTEM_PRODUCT_ID,
    setupCompleted: asBoolean(w.setupCompleted, false),
    setupStep: Number(w.setupStep) || 1,
    venue: normalizeVenue(w.venue),
    packages: Array.isArray(w.packages)
      ? w.packages
          .map(normalizePackage)
          .filter((p): p is CorporatePackage => Boolean(p))
      : base.packages,
    leads: Array.isArray(w.leads)
      ? w.leads.map(normalizeLead).filter((l): l is CorporateLead => Boolean(l))
      : [],
    quotes: Array.isArray(w.quotes)
      ? w.quotes
          .map(normalizeQuote)
          .filter((q): q is CorporateQuote => Boolean(q))
      : [],
    faqResponses:
      w.faqResponses && typeof w.faqResponses === "object"
        ? w.faqResponses
        : {},
    economicsDraft: economics,
    createdAt: asString(w.createdAt, base.createdAt),
    updatedAt: asString(w.updatedAt, base.updatedAt),
  }
}
