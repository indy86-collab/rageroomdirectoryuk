import { formatGbp } from "./money"
import {
  buildQuoteSchedule,
  calculateQuoteTotals,
  packageInclusionsList,
} from "./quote"
import type {
  CorporateLead,
  CorporatePackage,
  CorporateQuote,
  FaqKey,
  VenueOwnerWorkspace,
  VenueProfile,
} from "./types"

export type MessageTone = "professional" | "friendly" | "concise"

const ADD_POLICY = "Add your venue policy"

function policyOrPlaceholder(value: string) {
  const trimmed = value.trim()
  return trimmed || ADD_POLICY
}

function toneGreeting(tone: MessageTone, contactName: string) {
  const name = contactName.trim() || "there"
  if (tone === "friendly") return `Hi ${name},`
  if (tone === "concise") return `Hello ${name},`
  return `Dear ${name},`
}

function toneSignOff(tone: MessageTone, venue: VenueProfile) {
  const from = venue.businessName.trim() || "the team"
  if (tone === "friendly") return `Thanks,\n${from}`
  if (tone === "concise") return `Regards,\n${from}`
  return `Kind regards,\n${from}`
}

function contactBlock(venue: VenueProfile) {
  const lines = [
    venue.businessName.trim(),
    venue.telephone.trim(),
    venue.contactEmail.trim(),
    venue.website.trim(),
  ].filter(Boolean)
  return lines.join("\n")
}

export function generateEnquiryResponse({
  venue,
  lead,
  pkg,
  estimatedPrice,
  tone = "professional",
}: {
  venue: VenueProfile
  lead: Pick<
    CorporateLead,
    | "company"
    | "contactName"
    | "groupSize"
    | "proposedDate"
    | "preferredTime"
    | "availabilityStatus"
  >
  pkg: CorporatePackage | null
  estimatedPrice: number | null
  tone?: MessageTone
}) {
  const company = lead.company.trim() || "your team"
  const packageName = pkg?.name || "a corporate package"
  const participants = lead.groupSize ? `${lead.groupSize}` : "your group"
  const date = lead.proposedDate || "your preferred date"
  const time = lead.preferredTime || "a time that suits"
  const priceLine =
    estimatedPrice != null && estimatedPrice > 0
      ? `Estimated package total: ${formatGbp(estimatedPrice)} (subject to final numbers and confirmation).`
      : "I can confirm pricing once we lock participant numbers and package details."
  const availability = lead.availabilityStatus.trim()
    ? lead.availabilityStatus.trim()
    : "I will confirm live availability as soon as you reply."
  const deposit = policyOrPlaceholder(venue.depositPolicy)

  const subject = `${venue.businessName || "Rage room"} corporate booking — ${company}`

  const body = [
    toneGreeting(tone, lead.contactName),
    "",
    `Thank you for enquiring about a corporate booking for ${company}.`,
    "",
    `Based on what you shared, we can look after ${participants} participants on ${date} around ${time}, using ${packageName}.`,
    priceLine,
    `Availability: ${availability}`,
    "",
    `Deposit / confirmation: ${deposit}`,
    "",
    "Next step: reply with confirmation of headcount and preferred arrival time, and I will send a booking quote / estimate and proposal.",
    "",
    toneSignOff(tone, venue),
    contactBlock(venue),
  ].join("\n")

  return { subject, body }
}

export function generateProposalDocument({
  workspace,
  lead,
  quote,
  pkg,
}: {
  workspace: VenueOwnerWorkspace
  lead: CorporateLead | null
  quote: CorporateQuote
  pkg: CorporatePackage | null
}) {
  const venue = workspace.venue
  const totals = calculateQuoteTotals(quote, pkg?.pricePerPerson)
  const inclusions = pkg ? packageInclusionsList(pkg) : []
  const schedule = buildQuoteSchedule(
    venue,
    quote.arrivalTime,
    pkg?.smashDurationMinutes
  )
  const company = quote.company.trim() || lead?.company || "your organisation"
  const participants = quote.participantCount || lead?.groupSize || 0

  const sections = [
    {
      title: "Proposed Activity",
      body:
        pkg?.description.trim() ||
        `A structured rage room team social at ${venue.businessName || "our venue"} — a shared entertainment experience for your group.`,
    },
    {
      title: "Group",
      body: `${participants || "TBC"} participants${company ? ` — ${company}` : ""}`,
    },
    {
      title: "Package",
      body: [
        pkg?.name || "Corporate package",
        inclusions.length
          ? inclusions.map((item) => `• ${item}`).join("\n")
          : "Inclusions to be confirmed with the venue.",
      ].join("\n"),
    },
    {
      title: "Schedule",
      body: [
        quote.date ? `Proposed date: ${quote.date}` : "Date: TBC",
        ...schedule.map((row) => `${row.time} — ${row.label}`),
      ].join("\n"),
    },
    {
      title: "Pricing",
      body: [
        `Document: ${quote.documentLabel || "Booking Quote / Estimate"}`,
        `Package subtotal: ${formatGbp(totals.packageSubtotal)}`,
        totals.extras
          ? `Extras: ${formatGbp(totals.extras)}${quote.extrasNote ? ` (${quote.extrasNote})` : ""}`
          : null,
        totals.discount
          ? `Discount: −${formatGbp(totals.discount)}${quote.discountNote ? ` (${quote.discountNote})` : ""}`
          : null,
        totals.vatAmount
          ? `VAT (${quote.vatRatePercent}%): ${formatGbp(totals.vatAmount)}`
          : "VAT: not applied on this estimate",
        `Total: ${formatGbp(totals.total)}`,
        `Deposit: ${formatGbp(totals.deposit)}`,
        `Remaining balance: ${formatGbp(totals.remainingBalance)}`,
        `Valid for ${quote.validityDays} days`,
      ]
        .filter(Boolean)
        .join("\n"),
    },
    {
      title: "What We Provide",
      body: inclusions.length
        ? inclusions.map((item) => `• ${item}`).join("\n")
        : "Add package inclusions in your Corporate Package Builder.",
    },
    {
      title: "What Attendees Need to Know",
      body: [
        `Clothing: ${policyOrPlaceholder(venue.clothingGuidance)}`,
        `PPE: ${policyOrPlaceholder(venue.ppeGuidance)}`,
        `Age requirement: ${policyOrPlaceholder(venue.ageRequirement)}`,
        `Travel / parking: ${policyOrPlaceholder(venue.parkingTravel)}`,
        `Other: ${policyOrPlaceholder(venue.attendeeInstructions)}`,
      ].join("\n"),
    },
    {
      title: "Next Steps",
      body: [
        `Deposit / confirmation: ${policyOrPlaceholder(venue.depositPolicy)}`,
        `Cancellation / rescheduling: ${policyOrPlaceholder(venue.cancellationPolicy)}`,
        `This ${quote.documentLabel || "Booking Quote / Estimate"} is valid for ${quote.validityDays} days.`,
        "Reply to confirm headcount and we will lock the booking.",
      ].join("\n"),
    },
  ]

  const title = `Corporate Event Proposal — ${company}`
  const text = [
    title,
    venue.businessName,
    venue.address || venue.city,
    "",
    ...sections.flatMap((section) => [
      section.title.toUpperCase(),
      section.body,
      "",
    ]),
    contactBlock(venue),
  ].join("\n")

  return { title, sections, text, totals }
}

export type OutreachVariant =
  | "initial"
  | "follow_up_1"
  | "follow_up_2"
  | "christmas"
  | "summer"
  | "away_day"
  | "employee_reward"
  | "new_team"

export function generateOutreachMessage({
  venue,
  variant,
  contactName = "",
  company = "your team",
}: {
  venue: VenueProfile
  variant: OutreachVariant
  contactName?: string
  company?: string
}) {
  const venueName = venue.businessName.trim() || "our rage room"
  const city = venue.city.trim() || "our city"
  const greeting = contactName.trim()
    ? `Hello ${contactName.trim()},`
    : "Hello,"

  const subjects: Record<OutreachVariant, string> = {
    initial: `Team social idea in ${city} — ${venueName}`,
    follow_up_1: `Quick follow-up — team activity at ${venueName}`,
    follow_up_2: `Final note — corporate bookings at ${venueName}`,
    christmas: `Christmas party / winter social idea — ${venueName}`,
    summer: `Summer team social idea — ${venueName}`,
    away_day: `Away-day activity idea — ${venueName}`,
    employee_reward: `Employee reward activity — ${venueName}`,
    new_team: `New-team social idea — ${venueName}`,
  }

  const bodies: Record<OutreachVariant, string[]> = {
    initial: [
      greeting,
      "",
      `I work with ${venueName} in ${city}. We host corporate groups for structured smash sessions as a team social / shared entertainment experience.`,
      "",
      `If ${company} is planning a team activity, I can share package options, indicative pricing and availability.`,
      "",
      "Would it be useful if I sent a short overview?",
      "",
      `Kind regards,\n${venueName}`,
    ],
    follow_up_1: [
      greeting,
      "",
      `Just a short follow-up in case my earlier note about a team social at ${venueName} was buried.`,
      "",
      "Happy to send package options if useful — no pressure either way.",
      "",
      `Kind regards,\n${venueName}`,
    ],
    follow_up_2: [
      greeting,
      "",
      `Final polite follow-up from me about corporate bookings at ${venueName}.`,
      "",
      "If timing is better later in the year, feel free to keep this note and reply when useful.",
      "",
      `Kind regards,\n${venueName}`,
    ],
    christmas: [
      greeting,
      "",
      `If ${company} is considering a Christmas party or winter team social, ${venueName} can host a structured group smash session as an alternative to a standard dinner-only plan.`,
      "",
      "I can send package options and December availability on request.",
      "",
      `Kind regards,\n${venueName}`,
    ],
    summer: [
      greeting,
      "",
      `For a summer team social, ${venueName} offers a high-energy group activity that works well as a standalone visit or part of a wider afternoon out.`,
      "",
      "Happy to share package details if helpful.",
      "",
      `Kind regards,\n${venueName}`,
    ],
    away_day: [
      greeting,
      "",
      `If you are building an away day agenda, ${venueName} can provide a timed corporate session that fits between meetings, lunch or other activities.`,
      "",
      "I can outline timings and group capacity if useful.",
      "",
      `Kind regards,\n${venueName}`,
    ],
    employee_reward: [
      greeting,
      "",
      `${venueName} hosts employee reward / recognition groups looking for a shared entertainment experience rather than a formal workshop.`,
      "",
      "I can send package options sized to your group.",
      "",
      `Kind regards,\n${venueName}`,
    ],
    new_team: [
      greeting,
      "",
      `For a new-team social, ${venueName} offers an easy icebreaker-style group session — practical, timed and suitable for mixed experience levels.`,
      "",
      "Happy to share what a typical booking looks like.",
      "",
      `Kind regards,\n${venueName}`,
    ],
  }

  return {
    subject: subjects[variant],
    body: bodies[variant].join("\n"),
  }
}

export function generateBookingConfirmation({
  venue,
  lead,
  quote,
  pkg,
  depositPaid,
}: {
  venue: VenueProfile
  lead: CorporateLead
  quote: CorporateQuote | null
  pkg: CorporatePackage | null
  depositPaid: number | null
}) {
  const totals = quote
    ? calculateQuoteTotals(quote, pkg?.pricePerPerson)
    : null
  const deposit =
    depositPaid != null
      ? depositPaid
      : totals?.deposit ?? null
  const outstanding =
    totals && deposit != null
      ? Math.max(0, totals.total - deposit)
      : totals?.remainingBalance ?? null

  const subject = `Booking confirmation — ${lead.company || "your corporate event"}`
  const body = [
    `Dear ${lead.contactName.trim() || "there"},`,
    "",
    `This confirms your corporate booking at ${venue.businessName || "our venue"}.`,
    "",
    `Company: ${lead.company || "TBC"}`,
    `Date: ${lead.proposedDate || quote?.date || "TBC"}`,
    `Arrival time: ${quote?.arrivalTime || lead.preferredTime || "TBC"}`,
    `Number attending: ${lead.groupSize || quote?.participantCount || "TBC"}`,
    `Package: ${pkg?.name || "Corporate package"}`,
    totals ? `Total: ${formatGbp(totals.total)}` : null,
    deposit != null ? `Deposit paid / due: ${formatGbp(deposit)}` : null,
    outstanding != null
      ? `Outstanding amount: ${formatGbp(outstanding)}`
      : null,
    `Venue address: ${policyOrPlaceholder(venue.address)}`,
    "",
    "Attendee instructions:",
    policyOrPlaceholder(venue.attendeeInstructions),
    `Clothing: ${policyOrPlaceholder(venue.clothingGuidance)}`,
    `PPE: ${policyOrPlaceholder(venue.ppeGuidance)}`,
    "",
    `Cancellation / rescheduling: ${policyOrPlaceholder(venue.cancellationPolicy)}`,
    "",
    "Contact:",
    contactBlock(venue),
    "",
    "We look forward to hosting your team.",
    "",
    `Kind regards,\n${venue.businessName || "The team"}`,
  ]
    .filter((line) => line !== null)
    .join("\n")

  return { subject, body }
}

export function generatePreEventReminder({
  venue,
  lead,
  quote,
  outstandingPayment,
}: {
  venue: VenueProfile
  lead: CorporateLead
  quote: CorporateQuote | null
  outstandingPayment: number | null
}) {
  const subject = `Reminder — upcoming visit to ${venue.businessName || "our venue"}`
  const body = [
    `Dear ${lead.contactName.trim() || "there"},`,
    "",
    `A quick reminder about your upcoming corporate booking.`,
    "",
    `Date / time: ${lead.proposedDate || quote?.date || "TBC"} ${quote?.arrivalTime || lead.preferredTime || ""}`.trim(),
    `Arrival time: ${quote?.arrivalTime || lead.preferredTime || "TBC"}`,
    `Please confirm attendee count: currently ${lead.groupSize || quote?.participantCount || "TBC"}`,
    `Venue address: ${policyOrPlaceholder(venue.address)}`,
    `Clothing: ${policyOrPlaceholder(venue.clothingGuidance)}`,
    `PPE: ${policyOrPlaceholder(venue.ppeGuidance)}`,
    `Parking / travel: ${policyOrPlaceholder(venue.parkingTravel)}`,
    outstandingPayment != null && outstandingPayment > 0
      ? `Outstanding payment: ${formatGbp(outstandingPayment)}`
      : "Outstanding payment: none noted on this reminder — confirm with us if unsure.",
    "",
    "Contact:",
    contactBlock(venue),
    "",
    `Kind regards,\n${venue.businessName || "The team"}`,
  ].join("\n")

  return { subject, body }
}

export type PostEventVariant =
  | "thank_you"
  | "feedback"
  | "review"
  | "repeat"
  | "referral"

export function generatePostEventMessage({
  venue,
  lead,
  variant,
}: {
  venue: VenueProfile
  lead: CorporateLead
  variant: PostEventVariant
}) {
  const company = lead.company.trim() || "your team"
  const venueName = venue.businessName.trim() || "our venue"
  const greeting = `Dear ${lead.contactName.trim() || "there"},`

  const map: Record<PostEventVariant, { subject: string; body: string }> = {
    thank_you: {
      subject: `Thank you — ${company} at ${venueName}`,
      body: [
        greeting,
        "",
        `Thank you for bringing ${company} to ${venueName}. We hope the group had a strong shared experience.`,
        "",
        "If you need anything for expenses, feedback or a future booking, just reply to this email.",
        "",
        `Kind regards,\n${venueName}`,
      ].join("\n"),
    },
    feedback: {
      subject: `Quick feedback request — ${venueName}`,
      body: [
        greeting,
        "",
        `When you have a moment, we would value brief feedback on what worked well for ${company} and what we could improve for corporate groups.`,
        "",
        "A few lines by reply is perfect.",
        "",
        `Kind regards,\n${venueName}`,
      ].join("\n"),
    },
    review: {
      subject: `Review request — ${venueName}`,
      body: [
        greeting,
        "",
        `If ${company} enjoyed the visit, a short public review helps other organisers understand what to expect.`,
        "",
        "Only if you are comfortable doing so — no pressure.",
        "",
        `Kind regards,\n${venueName}`,
      ].join("\n"),
    },
    repeat: {
      subject: `Future team booking — ${venueName}`,
      body: [
        greeting,
        "",
        `If ${company} plans another team social later this year, we can hold similar package options or suggest a seasonal variant.`,
        "",
        "Happy to send availability when you have rough dates.",
        "",
        `Kind regards,\n${venueName}`,
      ].join("\n"),
    },
    referral: {
      subject: `Introduction for another team — ${venueName}`,
      body: [
        greeting,
        "",
        `If a colleague in another team or office is looking for a group activity, feel free to forward this note or introduce us by email.`,
        "",
        `${venueName} hosts corporate groups for structured smash sessions as a team social / entertainment experience.`,
        "",
        `Kind regards,\n${venueName}`,
      ].join("\n"),
    },
  }

  return map[variant]
}

export const FAQ_PROMPTS: { key: FaqKey; question: string }[] = [
  {
    key: "price_objection",
    question: "It's more expensive than expected.",
  },
  {
    key: "whole_team",
    question: "Can you accommodate our whole team together?",
  },
  {
    key: "corporate_suitable",
    question: "Is this suitable for corporate groups?",
  },
  { key: "invoice", question: "Can you invoice us?" },
  { key: "reschedule", question: "Can we reschedule?" },
  { key: "what_to_wear", question: "What do attendees need to wear?" },
  { key: "private_hire", question: "Do you offer private hire?" },
  {
    key: "non_participant",
    question: "What happens if someone doesn't want to participate?",
  },
]

/** Resolve FAQ answer from operator-defined policies — never invent venue policy. */
export function resolveFaqAnswer(
  workspace: VenueOwnerWorkspace,
  key: FaqKey
): { answer: string; configured: boolean } {
  const custom = workspace.faqResponses[key]?.trim()
  if (custom) return { answer: custom, configured: true }

  const venue = workspace.venue
  const mapped: Partial<Record<FaqKey, string>> = {
    invoice: venue.invoicePolicy,
    reschedule: venue.reschedulePolicy,
    what_to_wear: venue.clothingGuidance,
    private_hire: venue.privateHirePolicy,
    non_participant: venue.nonParticipantPolicy,
    whole_team: venue.maxGroupSize
      ? `Our current maximum group size on file is ${venue.maxGroupSize}. We can discuss rotating sessions if you need a larger group.`
      : "",
    corporate_suitable:
      "We host corporate groups for team socials and shared entertainment experiences. Final suitability depends on your group size, timing and package choice.",
    price_objection: "",
  }

  const fromVenue = mapped[key]?.trim()
  if (fromVenue) return { answer: fromVenue, configured: true }

  return { answer: ADD_POLICY, configured: false }
}
