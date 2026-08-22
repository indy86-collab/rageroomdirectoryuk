import { createEmptyCorporateEvent } from "./defaults"
import { defaultChecklistState } from "./checklist"
import { defaultCategoriesFromTotal } from "./budget"
import { defaultSchedule } from "./schedule"
import { GUEST_WORKSPACE_ID, type CorporateEvent, type RsvpStatus } from "./types"

const STORAGE_PREFIX = "rr_corporate_event_v1:"

export function storageKeyForSession(sessionId: string) {
  return `${STORAGE_PREFIX}${sessionId}`
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function asNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback
}

function asBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback
}

/** Soft-validate and merge persisted JSON into a complete CorporateEvent. */
export function normalizeCorporateEvent(
  raw: unknown,
  entitlementSessionId: string
): CorporateEvent {
  const base = createEmptyCorporateEvent(entitlementSessionId)
  if (!isRecord(raw)) return base

  const categories = isRecord(raw.categories)
    ? {
        rageRoom: asNumber(raw.categories.rageRoom, base.categories.rageRoom),
        foodDrinks: asNumber(
          raw.categories.foodDrinks,
          base.categories.foodDrinks
        ),
        travel: asNumber(raw.categories.travel, base.categories.travel),
        contingency: asNumber(
          raw.categories.contingency,
          base.categories.contingency
        ),
      }
    : defaultCategoriesFromTotal(asNumber(raw.totalBudget, base.totalBudget))

  const venueShortlist = Array.isArray(raw.venueShortlist)
    ? raw.venueShortlist
        .filter(isRecord)
        .slice(0, 4)
        .map((v) => ({
          listingId: asString(v.listingId),
          name: asString(v.name, "Venue"),
          city: asString(v.city),
          region: asString(v.region),
          price: typeof v.price === "number" ? v.price : null,
          priceNote: typeof v.priceNote === "string" ? v.priceNote : null,
          website: typeof v.website === "string" ? v.website : null,
          listingPath: asString(v.listingPath, "/"),
          groupSizeMin:
            typeof v.groupSizeMin === "number" ? v.groupSizeMin : null,
          groupSizeMax:
            typeof v.groupSizeMax === "number" ? v.groupSizeMax : null,
          hasCorporateGroups: asBoolean(v.hasCorporateGroups),
          notes: asString(v.notes),
        }))
        .filter((v) => v.listingId)
    : []

  const schedule = Array.isArray(raw.schedule)
    ? raw.schedule.filter(isRecord).map((item, index) => ({
        id: asString(item.id, `sched_${index}`),
        time: asString(item.time),
        label: asString(item.label),
        estimated: asBoolean(item.estimated, true),
      }))
    : defaultSchedule(asString(raw.startTime, "16:00"))

  const attendees = Array.isArray(raw.attendees)
    ? raw.attendees.filter(isRecord).map((row, index) => {
        const rsvp: RsvpStatus =
          row.rsvp === "yes" ||
          row.rsvp === "no" ||
          row.rsvp === "maybe" ||
          row.rsvp === "pending"
            ? row.rsvp
            : "pending"
        return {
          id: asString(row.id, `att_${index}`),
          name: asString(row.name),
          rsvp,
          dietaryNotes: asString(row.dietaryNotes),
          accessibilityNote: asString(row.accessibilityNote),
          travelConfirmed: asBoolean(row.travelConfirmed),
          paymentRequired: asBoolean(row.paymentRequired),
          notes: asString(row.notes),
        }
      })
    : []

  const checklistDefaults = defaultChecklistState()
  const rawChecklist = Array.isArray(raw.checklist) ? raw.checklist : []
  const checklist = Array.isArray(raw.checklist)
    ? checklistDefaults.map((item) => {
        const saved = rawChecklist.find(
          (c: unknown) => isRecord(c) && c.id === item.id
        )
        return {
          id: item.id,
          done: isRecord(saved) ? asBoolean(saved.done) : false,
        }
      })
    : checklistDefaults

  const budgetMode = raw.budgetMode === "per_person" ? "per_person" : "total"
  const invitationTone =
    raw.invitationTone === "casual" || raw.invitationTone === "fun"
      ? raw.invitationTone
      : "professional"

  return {
    ...base,
    id: asString(raw.id, base.id),
    entitlementSessionId,
    companyName: asString(raw.companyName),
    organiserName: asString(raw.organiserName),
    organiserContact: asString(raw.organiserContact),
    attendeeCount: Math.max(0, Math.floor(asNumber(raw.attendeeCount, 10))),
    location: asString(raw.location),
    eventDate: asString(raw.eventDate),
    startTime: asString(raw.startTime, "16:00"),
    arrivalTime: asString(raw.arrivalTime, "15:45"),
    purpose: asString(raw.purpose, "Team social") as CorporateEvent["purpose"],
    purposeOther: asString(raw.purposeOther),
    budgetMode,
    totalBudget: asNumber(raw.totalBudget, 900),
    budgetPerPerson: asNumber(raw.budgetPerPerson, 90),
    categories,
    venueShortlist,
    selectedVenueId:
      typeof raw.selectedVenueId === "string" ? raw.selectedVenueId : null,
    selectedVenueName: asString(raw.selectedVenueName),
    selectedVenueAddress: asString(raw.selectedVenueAddress),
    bookingReference: asString(raw.bookingReference),
    travelInfo: asString(raw.travelInfo),
    clothingReminder: asString(raw.clothingReminder, base.clothingReminder),
    rsvpDeadline: asString(raw.rsvpDeadline),
    schedule,
    attendees,
    checklist,
    invitationTone,
    createdAt: asString(raw.createdAt, base.createdAt),
    updatedAt: asString(raw.updatedAt, base.updatedAt),
  }
}

export function loadCorporateEvent(
  sessionId: string
): CorporateEvent | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(storageKeyForSession(sessionId))
    if (!raw) return null
    return normalizeCorporateEvent(JSON.parse(raw), sessionId)
  } catch {
    return null
  }
}

export function saveCorporateEvent(event: CorporateEvent) {
  if (typeof window === "undefined") return
  const payload = {
    ...event,
    updatedAt: new Date().toISOString(),
  }
  window.localStorage.setItem(
    storageKeyForSession(event.entitlementSessionId),
    JSON.stringify(payload)
  )
}

/**
 * After payment, copy the guest workspace into the purchase-scoped key
 * when that key is still empty so the plan is not lost.
 */
export function migrateGuestPlanToSession(
  sessionId: string
): CorporateEvent | null {
  if (typeof window === "undefined") return null
  if (!sessionId || sessionId === GUEST_WORKSPACE_ID) return null
  if (loadCorporateEvent(sessionId)) return loadCorporateEvent(sessionId)
  const guest = loadCorporateEvent(GUEST_WORKSPACE_ID)
  if (!guest) return null
  const migrated: CorporateEvent = {
    ...guest,
    entitlementSessionId: sessionId,
    updatedAt: new Date().toISOString(),
  }
  saveCorporateEvent(migrated)
  return migrated
}

export function resolveCorporateEvent(sessionId: string): CorporateEvent {
  const saved = loadCorporateEvent(sessionId)
  if (saved) return saved
  if (sessionId !== GUEST_WORKSPACE_ID) {
    const migrated = migrateGuestPlanToSession(sessionId)
    if (migrated) return migrated
  }
  return createEmptyCorporateEvent(sessionId)
}
