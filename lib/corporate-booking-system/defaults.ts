import { createId } from "./id"
import type {
  CorporatePackage,
  PackageEconomicsInput,
  PackageTier,
  VenueOwnerWorkspace,
  VenueProfile,
} from "./types"
import { CORPORATE_BOOKING_SYSTEM_PRODUCT_ID } from "./types"

export function emptyVenueProfile(): VenueProfile {
  return {
    businessName: "",
    city: "",
    website: "",
    contactEmail: "",
    telephone: "",
    maxGroupSize: null,
    typicalSessionMinutes: 60,
    vatRegistered: null,
    publicStartingPrice: null,
    typicalCorporatePrice: null,
    address: "",
    clothingGuidance: "",
    ppeGuidance: "",
    parkingTravel: "",
    cancellationPolicy: "",
    ageRequirement: "",
    accessibilityNotes: "",
    privateHirePolicy: "",
    invoicePolicy: "",
    reschedulePolicy: "",
    nonParticipantPolicy: "",
    attendeeInstructions: "",
    depositPolicy: "",
    listingId: null,
    listingSlug: null,
  }
}

export function defaultEconomicsInput(): PackageEconomicsInput {
  return {
    participants: 12,
    sellingPricePerPerson: 45,
    breakablesCost: 80,
    staffCost: 60,
    roomSessionCost: 0,
    refreshmentsCost: 0,
    externalCosts: 0,
    paymentProcessingPercent: 1.5,
    otherCosts: 0,
    sessionMinutes: 60,
  }
}

export function createDefaultPackage(
  tier: PackageTier,
  overrides: Partial<CorporatePackage> = {}
): CorporatePackage {
  const names: Record<PackageTier, string> = {
    essential: "Essential Corporate",
    plus: "Corporate Plus",
    premium: "Premium Corporate",
    custom: "Custom Package",
  }

  return {
    id: createId(),
    tier,
    name: names[tier],
    participantMin: tier === "essential" ? 6 : tier === "plus" ? 10 : 12,
    participantMax: tier === "premium" ? 30 : 20,
    smashDurationMinutes: tier === "premium" ? 90 : 60,
    breakablesNote: "",
    ppeIncluded: true,
    exclusiveArea: tier !== "essential",
    refreshments: tier === "essential" ? "" : "Soft drinks",
    photosVideo: tier === "premium" ? "Group photo included" : "",
    meetingSpace: tier === "premium" ? "Briefing space if available" : "",
    otherInclusions: "",
    pricePerPerson: tier === "essential" ? 40 : tier === "plus" ? 50 : 65,
    minimumBookingValue:
      tier === "essential" ? 240 : tier === "plus" ? 500 : 780,
    description: "",
    ...overrides,
  }
}

export function createEmptyWorkspace(
  sessionId: string,
  workspaceId = createId()
): VenueOwnerWorkspace {
  const now = new Date().toISOString()
  return {
    id: workspaceId,
    sessionId,
    productId: CORPORATE_BOOKING_SYSTEM_PRODUCT_ID,
    setupCompleted: false,
    setupStep: 1,
    venue: emptyVenueProfile(),
    packages: [
      createDefaultPackage("essential"),
      createDefaultPackage("plus"),
      createDefaultPackage("premium"),
    ],
    leads: [],
    quotes: [],
    faqResponses: {},
    economicsDraft: defaultEconomicsInput(),
    createdAt: now,
    updatedAt: now,
  }
}

export function touchWorkspace(
  workspace: VenueOwnerWorkspace
): VenueOwnerWorkspace {
  return { ...workspace, updatedAt: new Date().toISOString() }
}

export function isVenueProfileReady(venue: VenueProfile) {
  return Boolean(
    venue.businessName.trim() &&
      venue.city.trim() &&
      venue.contactEmail.trim()
  )
}
