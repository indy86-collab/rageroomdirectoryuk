export type ChecklistDefinition = {
  id: string
  label: string
}

export const EVENT_CHECKLIST: ChecklistDefinition[] = [
  { id: "agree-objective", label: "Agree event objective" },
  { id: "confirm-attendees", label: "Confirm attendee estimate" },
  { id: "set-budget", label: "Set budget" },
  { id: "shortlist-venues", label: "Shortlist venues" },
  { id: "contact-venues", label: "Contact venues" },
  { id: "select-venue", label: "Select venue" },
  { id: "internal-approval", label: "Receive internal approval" },
  { id: "book-venue", label: "Book venue" },
  { id: "send-invitation", label: "Send team invitation" },
  { id: "confirm-rsvps", label: "Confirm RSVPs" },
  { id: "send-reminder", label: "Send final reminder" },
  { id: "attend-event", label: "Attend event" },
  { id: "collect-feedback", label: "Collect feedback" },
]

export function defaultChecklistState() {
  return EVENT_CHECKLIST.map((item) => ({ id: item.id, done: false }))
}
