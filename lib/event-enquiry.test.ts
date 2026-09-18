import { describe, expect, it } from "vitest"
import { createEmptyCorporateEvent } from "./corporate-event-builder/defaults"
import { buildEventEnquiry, eventEnquiryMailto } from "./event-enquiry"

describe("event enquiry", () => {
  it("uses the selected budget mode without exporting private workspace fields", () => {
    const event = createEmptyCorporateEvent("private-token")
    Object.assign(event, { location: "Bath", attendeeCount: 20, budgetMode: "per_person", budgetPerPerson: 50,
      totalBudget: 900, organiserName: "Private Name", organiserContact: "private@example.com", bookingReference: "private-ref",
      attendees: [{ name: "Private Attendee", dietaryNotes: "Private health detail" }] })
    const brief = buildEventEnquiry(event)
    expect(brief).toContain("Total budget: £1000")
    expect(brief).toContain("Location: Bath")
    expect(brief).toContain("People: 20")
    expect(brief.toLowerCase()).not.toContain("private")
  })
  it("encodes an editable brief without allowing added email recipients or headers", () => {
    const brief = "London & Leeds?\nB=20 #test"
    const link = new URL(eventEnquiryMailto(brief))
    expect(link.protocol).toBe("mailto:")
    expect(link.pathname).toBe("ukrageroom@gmail.com")
    expect(link.searchParams.get("body")).toBe(brief)
    expect([...link.searchParams.keys()]).toEqual(["subject", "body"])
  })
})
