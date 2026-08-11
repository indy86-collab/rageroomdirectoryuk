/** Structured content for the free Rage Room First-Timer Checklist. */

export type ChecklistSection = {
  id: string
  title: string
  intro?: string
  items: string[]
}

export const FIRST_TIMER_CHECKLIST_TITLE = "Rage Room First-Timer Checklist"

export const FIRST_TIMER_CHECKLIST_TAGLINE =
  "Everything you need before your first smash session — in one quick checklist."

export const FIRST_TIMER_CHECKLIST_NOTE =
  "Venue rules differ. Use this as a prep aid, then confirm details with your chosen rage room."

export const FIRST_TIMER_CHECKLIST_SECTIONS: ChecklistSection[] = [
  {
    id: "before-you-book",
    title: "Before you book",
    intro: "Confirm these with the venue before you pay a deposit.",
    items: [
      "Minimum age (and any under-18 rules or guardian requirements)",
      "Session duration and how long you should allow on-site",
      "What’s included (PPE, breakables, briefing time)",
      "Whether breakables are provided or if you can bring items",
      "Maximum / recommended group size for your booking",
      "Accessibility needs and venue access",
      "Cancellation and rescheduling policy",
    ],
  },
  {
    id: "what-to-wear",
    title: "What to wear",
    intro: "Comfortable clothes for physical activity; verify venue-specific PPE rules.",
    items: [
      "Closed-toe footwear (trainers or boots — usually required)",
      "Comfortable clothing you can move in",
      "Expect venue PPE (overalls, gloves, eye protection, etc.)",
      "Avoid loose jewellery, open-toe shoes, and anything unsuitable for active sessions",
      "Ask the venue if they have clothing or footwear rules before you go",
    ],
  },
  {
    id: "before-you-leave",
    title: "Before you leave home",
    items: [
      "Booking confirmation (email, reference, or ticket)",
      "Photo ID if the venue requires it",
      "Travel plan and parking / public transport details",
      "Arrival time (many venues want you early for briefing)",
      "Venue phone number or contact details saved on your phone",
    ],
  },
  {
    id: "what-to-expect",
    title: "What to expect",
    intro:
      "A typical first-timer journey looks like this — individual venues may differ.",
    items: [
      "Arrival",
      "Check-in",
      "Safety briefing / PPE",
      "Smash session",
      "Finish / debrief",
    ],
  },
  {
    id: "questions-to-ask",
    title: "Quick questions to ask your venue",
    intro: "Handy prompts if you’re booking or confirming details.",
    items: [
      "What is the minimum age and do under-18s need a guardian?",
      "How long is the session, and when should we arrive?",
      "Is PPE included, and what should we wear underneath?",
      "Are breakables included, and can we bring anything?",
      "How many people can smash at once in our room?",
      "What is your cancellation or reschedule policy?",
      "Is there parking or a recommended station / bus stop?",
      "Do you need ID, a waiver, or anything completed in advance?",
    ],
  },
]

export const FIRST_TIMER_CHECKLIST_FILENAME =
  "rage-room-first-timer-checklist.pdf"

/** Legacy paid pack filename kept for historical Stripe download fulfilment. */
export const FIRST_VISIT_LEGACY_PACK_FILENAME =
  "rage-room-first-visit-prep-pack.pdf"
