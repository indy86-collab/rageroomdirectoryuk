export const ENQUIRY_QUALIFICATION_ITEMS = [
  "Company name",
  "Contact person",
  "Email / phone",
  "Number attending",
  "Preferred date",
  "Preferred time",
  "Budget if disclosed",
  "Event purpose",
  "Accessibility requirements to discuss",
  "Private / exclusive booking requested?",
  "Food / drink requirements?",
  "Invoice / PO requirement?",
  "Decision deadline",
] as const

export const DISCOVERY_SCRIPT = {
  introduction: [
    "Thanks for getting in touch about a corporate / team booking.",
    "I can walk through options quickly so we can send an accurate quote.",
    "Is now a good time for a few practical questions?",
  ],
  eventObjective: [
    "What is the main aim of the event — team social, reward, away day, or something else?",
    "Is there a theme or occasion we should plan around?",
  ],
  attendees: [
    "How many people are you expecting?",
    "Is that a firm number or still changing?",
    "Do you need the whole group in one space, or is rotating sessions acceptable?",
  ],
  timing: [
    "Do you have a preferred date and arrival time?",
    "How flexible are those dates?",
    "How long would you like the overall visit to run?",
  ],
  packageRequirements: [
    "Are you looking for a standard corporate package or something more tailored?",
    "Do you need refreshments, photos/video, or meeting space?",
    "Is private / exclusive hire important for your group?",
  ],
  logistics: [
    "Are there any accessibility requirements we should discuss with you in advance?",
    "Will anyone need parking or travel guidance?",
    "Is there a dress code expectation on your side we should note?",
  ],
  purchasing: [
    "Who needs to approve the booking on your side?",
    "Do you need an invoice or purchase order?",
    "What is your decision deadline?",
  ],
  nextAction: [
    "I can send a booking quote / estimate with package options and next steps.",
    "What is the best email for the proposal?",
    "Is there anything else we should include before we send it?",
  ],
} as const

export function discoveryQuestionsFlat() {
  return Object.values(DISCOVERY_SCRIPT).flat()
}
