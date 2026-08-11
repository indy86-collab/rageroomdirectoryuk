import { defaultCategoriesFromTotal } from "./budget"
import { defaultChecklistState } from "./checklist"
import { defaultSchedule } from "./schedule"
import type { CorporateEvent } from "./types"

function newId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`
  }
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export function createEmptyCorporateEvent(
  entitlementSessionId: string
): CorporateEvent {
  const now = new Date().toISOString()
  const totalBudget = 900
  return {
    id: newId("evt"),
    entitlementSessionId,
    companyName: "",
    organiserName: "",
    organiserContact: "",
    attendeeCount: 10,
    location: "",
    eventDate: "",
    startTime: "16:00",
    arrivalTime: "15:45",
    purpose: "Team social",
    purposeOther: "",
    budgetMode: "total",
    totalBudget,
    budgetPerPerson: 90,
    categories: defaultCategoriesFromTotal(totalBudget),
    venueShortlist: [],
    selectedVenueId: null,
    selectedVenueName: "",
    selectedVenueAddress: "",
    bookingReference: "",
    travelInfo: "",
    clothingReminder:
      "Closed-toe shoes and comfortable clothes you can move in. Confirm clothing rules with the venue.",
    rsvpDeadline: "",
    schedule: defaultSchedule("16:00"),
    attendees: [],
    checklist: defaultChecklistState(),
    invitationTone: "professional",
    createdAt: now,
    updatedAt: now,
  }
}

export function touchUpdatedAt(event: CorporateEvent): CorporateEvent {
  return { ...event, updatedAt: new Date().toISOString() }
}
