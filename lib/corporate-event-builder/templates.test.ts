import { describe, expect, it } from "vitest"
import { createEmptyCorporateEvent } from "./defaults"
import {
  buildApprovalEmail,
  buildChatInvite,
  buildEventSummaryLines,
  buildTeamInvitation,
  buildVenueEnquiryQuestions,
} from "./templates"

describe("corporate event builder templates", () => {
  const event = {
    ...createEmptyCorporateEvent("cs_test"),
    companyName: "Acme Engineering",
    organiserName: "Alex Organiser",
    attendeeCount: 18,
    location: "London",
    eventDate: "2026-09-25",
    startTime: "16:00",
    arrivalTime: "15:45",
    purpose: "Team social" as const,
    budgetMode: "total" as const,
    totalBudget: 900,
    budgetPerPerson: 50,
    selectedVenueName: "Example Rage Room",
  }

  it("builds a summary from event inputs", () => {
    const lines = buildEventSummaryLines(event)
    expect(lines.join("\n")).toContain("People: 18")
    expect(lines.join("\n")).toContain("Location: London")
    expect(lines.join("\n")).toContain("£900")
    expect(lines.join("\n")).toContain("£50")
    expect(lines.join("\n")).toContain("Team social")
  })

  it("includes attendee count in venue enquiry questions", () => {
    const questions = buildVenueEnquiryQuestions(event)
    expect(questions[0]).toContain("18 people")
    expect(questions.some((q) => q.includes("VAT invoice"))).toBe(true)
  })

  it("generates approval email without wellbeing claims", () => {
    const { subject, body } = buildApprovalEmail(event)
    expect(subject).toMatch(/Rage Room Event/i)
    expect(body).toContain("London")
    expect(body).toContain("18")
    expect(body.toLowerCase()).not.toMatch(/mental health|therapy|wellbeing|anxiety/)
  })

  it("generates invitation and chat versions with venue deferral", () => {
    const invite = buildTeamInvitation(event)
    expect(invite.body).toContain("Example Rage Room")
    expect(invite.body).toContain("follow the instructions they provide")
    const chat = buildChatInvite(event)
    expect(chat.split("\n").length).toBeLessThanOrEqual(6)
    expect(chat).toContain("RSVP")
  })
})
