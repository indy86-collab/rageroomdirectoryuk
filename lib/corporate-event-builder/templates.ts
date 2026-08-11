import {
  deriveBudgetPerPerson,
  deriveTotalBudget,
  formatGbp,
  sumCategories,
} from "./budget"
import { formatScheduleLines } from "./schedule"
import type { CorporateEvent, InvitationTone } from "./types"

function purposeLabel(event: CorporateEvent) {
  if (event.purpose === "Other" && event.purposeOther.trim()) {
    return event.purposeOther.trim()
  }
  return event.purpose || "Team event"
}

function activityLabel(event: CorporateEvent) {
  const purpose = purposeLabel(event).toLowerCase()
  return `Rage room ${purpose}`
}

function teamLabel(event: CorporateEvent) {
  return event.companyName.trim() || "Team"
}

function venueLabel(event: CorporateEvent) {
  return event.selectedVenueName.trim() || "TBC — shortlisted venue"
}

function dateLabel(event: CorporateEvent) {
  if (!event.eventDate) return "TBC"
  const parsed = new Date(`${event.eventDate}T12:00:00`)
  if (Number.isNaN(parsed.getTime())) return event.eventDate
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function budgetSummary(event: CorporateEvent) {
  const total = deriveTotalBudget({
    mode: event.budgetMode,
    totalBudget: event.totalBudget,
    budgetPerPerson: event.budgetPerPerson,
    attendeeCount: event.attendeeCount,
  })
  const perPerson = deriveBudgetPerPerson({
    mode: event.budgetMode,
    totalBudget: event.totalBudget,
    budgetPerPerson: event.budgetPerPerson,
    attendeeCount: event.attendeeCount,
  })
  return {
    total,
    perPerson,
    allocated: sumCategories(event.categories),
  }
}

export function buildEventSummaryTitle(event: CorporateEvent) {
  return `${teamLabel(event)} Rage Room Event`
}

export function buildEventSummaryLines(event: CorporateEvent) {
  const { total, perPerson } = budgetSummary(event)
  return [
    `People: ${event.attendeeCount || "TBC"}`,
    `Location: ${event.location.trim() || "TBC"}`,
    `Target date: ${dateLabel(event)}`,
    `Budget: ${formatGbp(total)}`,
    `Budget per person: ${formatGbp(perPerson)}`,
    `Purpose: ${purposeLabel(event)}`,
  ]
}

export function buildVenueEnquiryQuestions(event: CorporateEvent): string[] {
  const count = event.attendeeCount > 0 ? String(event.attendeeCount) : "our group"
  const date = dateLabel(event)

  return [
    `Can you accommodate ${count} people on ${date}?`,
    "Would the group be split across sessions or rooms?",
    "What is the total price including VAT?",
    "Is PPE included in the quoted price?",
    "What is the session length, and when should we arrive?",
    "Do you offer private or exclusive group bookings?",
    "What is your cancellation / rescheduling policy?",
    "Can you provide a VAT invoice for a company booking?",
    "Are there accessibility considerations we should know about?",
    "Is parking available, or what is the nearest public transport?",
    "Can food or drinks be arranged nearby, or do you have any partner recommendations?",
  ]
}

export function buildApprovalProposal(event: CorporateEvent) {
  const { total, perPerson } = budgetSummary(event)
  const schedule = formatScheduleLines(event.schedule)
  const purpose =
    event.purpose === "Team building"
      ? "A team activity outside the office intended to give the group a shared entertainment experience."
      : `A ${purposeLabel(event).toLowerCase()} outside the office intended to give the team an informal shared experience.`

  return [
    "### Team Event Proposal",
    "",
    `**Activity:** ${activityLabel(event)}`,
    `**Location:** ${event.location.trim() || "TBC"}`,
    `**Proposed date:** ${dateLabel(event)}`,
    `**Attendees:** ${event.attendeeCount || "TBC"}`,
    `**Estimated budget:** ${formatGbp(total)} / ${formatGbp(perPerson)} per employee`,
    "",
    "### Purpose",
    "",
    purpose,
    "",
    "### Proposed Schedule",
    "",
    schedule || "Timings to be confirmed with the selected venue.",
    "",
    "### Cost",
    "",
    `- Rage room allocation: ${formatGbp(event.categories.rageRoom)}`,
    `- Food / drinks: ${formatGbp(event.categories.foodDrinks)}`,
    `- Travel: ${formatGbp(event.categories.travel)}`,
    `- Contingency: ${formatGbp(event.categories.contingency)}`,
    `- Total: ${formatGbp(total)}`,
    "",
    "### Venue shortlist",
    "",
    event.venueShortlist.length
      ? event.venueShortlist
          .map((v, i) => `${i + 1}. ${v.name} (${v.city})`)
          .join("\n")
      : "Shortlist in progress — final venue to be confirmed within budget.",
    "",
    "### Approval Requested",
    "",
    "Approval to proceed with final venue selection and booking within the proposed budget.",
    "",
    "Note: RageRoom Directory is a planning directory, not the venue operator. Final prices, availability, safety rules and booking terms must be confirmed directly with the selected venue.",
  ].join("\n")
}

export function buildApprovalEmail(event: CorporateEvent) {
  const { total, perPerson } = budgetSummary(event)
  const subject = `Team Social Proposal – Rage Room Event`
  const body = [
    "Hi,",
    "",
    `I'd like to propose a rage room ${purposeLabel(event).toLowerCase()} for the team.`,
    "",
    `Location: ${event.location.trim() || "TBC"}`,
    `Proposed date: ${dateLabel(event)}`,
    `Attendees: ${event.attendeeCount || "TBC"}`,
    `Estimated budget: ${formatGbp(total)} (${formatGbp(perPerson)} per person)`,
    "",
    event.venueShortlist.length
      ? `Shortlisted venues: ${event.venueShortlist.map((v) => v.name).join(", ")}`
      : "I'm shortlisting venues now and will confirm the final choice within budget.",
    "",
    "Please can I have approval to proceed with venue selection and booking within this budget?",
    "",
    "Thanks,",
    event.organiserName.trim() || "[Your name]",
  ].join("\n")

  return { subject, body }
}

function invitationOpening(tone: InvitationTone, event: CorporateEvent) {
  const team = teamLabel(event)
  if (tone === "fun") {
    return `You're invited to smash things (safely) with ${team}.`
  }
  if (tone === "casual") {
    return `You're invited to a rage room team event with ${team}.`
  }
  return `You are invited to a team rage room event for ${team}.`
}

export function buildTeamInvitation(event: CorporateEvent) {
  const tone = event.invitationTone
  const venue = venueLabel(event)
  const clothing =
    event.clothingReminder.trim() ||
    "Wear closed-toe shoes and comfortable clothes you can move in. Follow any clothing guidance from the venue."
  const contact = event.organiserContact.trim() || event.organiserName.trim() || "[organiser contact]"

  const subject =
    tone === "fun"
      ? `You're invited: rage room team event`
      : `Team invitation: rage room event`

  const body = [
    invitationOpening(tone, event),
    "",
    `Date: ${dateLabel(event)}`,
    `Time: ${event.startTime.trim() || "TBC"}`,
    `Arrive by: ${event.arrivalTime.trim() || "TBC (confirm with venue)"}`,
    `Venue: ${venue}`,
    event.selectedVenueAddress.trim()
      ? `Address: ${event.selectedVenueAddress.trim()}`
      : null,
    event.rsvpDeadline.trim()
      ? `RSVP by: ${event.rsvpDeadline.trim()}`
      : "Please RSVP so we can finalise numbers.",
    "",
    `What to wear: ${clothing}`,
    "",
    "Safety and session rules are set by the venue — please follow the instructions they provide on the day.",
    "",
    `Questions? Contact ${contact}.`,
  ]
    .filter((line): line is string => line != null)
    .join("\n")

  return { subject, body }
}

export function buildChatInvite(event: CorporateEvent) {
  const venue = venueLabel(event)
  const lines = [
    `Team rage room event — ${dateLabel(event)}`,
    `Time: ${event.startTime.trim() || "TBC"} · Arrive: ${event.arrivalTime.trim() || "TBC"}`,
    `Venue: ${venue}`,
    event.rsvpDeadline.trim()
      ? `RSVP by ${event.rsvpDeadline.trim()}`
      : "Please RSVP",
    "Wear closed-toe shoes; follow venue instructions on the day.",
  ]
  return lines.join("\n")
}

export function buildFinalReminder(event: CorporateEvent) {
  const venue = venueLabel(event)
  const clothing =
    event.clothingReminder.trim() ||
    "Closed-toe shoes and comfortable clothes. Confirm any venue-specific rules."
  const contact =
    event.organiserContact.trim() || event.organiserName.trim() || "[organiser]"

  const subject = `Reminder: team rage room event — ${dateLabel(event)}`
  const body = [
    "Quick reminder about our team rage room event.",
    "",
    `Date: ${dateLabel(event)}`,
    `Arrive by: ${event.arrivalTime.trim() || event.startTime.trim() || "TBC"}`,
    `Venue: ${venue}`,
    event.selectedVenueAddress.trim()
      ? `Address: ${event.selectedVenueAddress.trim()}`
      : null,
    event.bookingReference.trim()
      ? `Booking reference: ${event.bookingReference.trim()}`
      : null,
    event.travelInfo.trim() ? `Travel: ${event.travelInfo.trim()}` : null,
    "",
    `What to wear: ${clothing}`,
    "",
    "Please follow the venue's safety briefing and staff instructions on the day.",
    "",
    `Organiser: ${contact}`,
  ]
    .filter((line): line is string => line != null)
    .join("\n")

  return { subject, body }
}

export function buildFeedbackSurvey(event: CorporateEvent) {
  const title = `${teamLabel(event)} — post-event feedback`
  const body = [
    title,
    "",
    "1. Overall rating (1–5):",
    "",
    "2. Would you recommend this activity for another team event? (Yes / No / Maybe)",
    "",
    "3. What worked well?",
    "",
    "4. What could be improved?",
    "",
    "5. Optional comment:",
    "",
    "Thanks — your answers help us plan better team events. Please avoid sharing medical or sensitive personal information.",
  ].join("\n")
  return { title, body }
}
