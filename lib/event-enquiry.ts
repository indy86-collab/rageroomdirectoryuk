import type { CorporateEvent } from "./corporate-event-builder/types"
import { deriveTotalBudget } from "./corporate-event-builder/budget"

export function buildEventEnquiry(event?: CorporateEvent): string {
  // Deliberately exclude attendees, access tokens, booking references and organiser details.
  return [
    "Hello RageRoom Directory,",
    "I'd like to discuss help planning a group event. Please let me know whether you can help and any fee before starting work.",
    "",
    `Location: ${event?.location || "Please add town or city"}`,
    `People: ${event?.attendeeCount || "Please add group size"}`,
    `Preferred date: ${event?.eventDate || "Please add date or flexibility"}`,
    `Total budget: ${event ? `£${deriveTotalBudget({ mode: event.budgetMode, totalBudget: event.totalBudget, budgetPerPerson: event.budgetPerPerson, attendeeCount: event.attendeeCount })}` : "Please add budget"}`,
    `Occasion: ${event?.purpose || "Please add occasion"}`,
    "Open to activities other than a rage room: Please add yes or no",
  ].join("\n")
}

export function eventEnquiryMailto(brief: string): string {
  return `mailto:ukrageroom@gmail.com?subject=${encodeURIComponent("Group event planning enquiry")}&body=${encodeURIComponent(brief)}`
}
