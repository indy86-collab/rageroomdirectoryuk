import { PDFDocument } from "pdf-lib"
import { describe, expect, it } from "vitest"
import { createEmptyCorporateEvent } from "./defaults"
import {
  PLAN_PDF_PREVIEW_WATERMARK,
  buildCorporateEventPlanPdf,
  buildPlanPdfSections,
  planPdfFilename,
} from "./plan-pdf"

function fixtureEvent() {
  return {
    ...createEmptyCorporateEvent("guest"),
    companyName: "Acme Engineering",
    organiserName: "Alex Organiser",
    attendeeCount: 18,
    location: "London",
    eventDate: "2026-09-25",
    purpose: "Team social" as const,
    budgetMode: "total" as const,
    totalBudget: 900,
    budgetPerPerson: 50,
    selectedVenueName: "Example Rage Room",
    venueShortlist: [
      {
        listingId: "example",
        name: "Example Rage Room",
        city: "London",
        region: "Greater London",
        price: 45,
        priceNote: null,
        website: null,
        listingPath: "/listing/example",
        groupSizeMin: 8,
        groupSizeMax: 20,
        hasCorporateGroups: true,
        notes: "",
      },
    ],
  }
}

describe("corporate event plan PDF", () => {
  it("includes event title, budget and venues in the structured copy", () => {
    const sections = buildPlanPdfSections(fixtureEvent())
    const text = sections
      .flatMap((section) => [section.heading, ...section.lines])
      .join("\n")

    expect(text).toContain("Event summary")
    expect(text).toContain("People: 18")
    expect(text).toContain("Location: London")
    expect(text).toContain("£900")
    expect(text).toContain("Example Rage Room")
    expect(text).toContain("Approval proposal")
  })

  it("names the file from the company", () => {
    expect(planPdfFilename(fixtureEvent())).toBe(
      "acme-engineering-rage-room-event-plan.pdf"
    )
  })

  it("watermarks preview PDFs and leaves full PDFs clean", async () => {
    const event = fixtureEvent()
    const preview = await buildCorporateEventPlanPdf(event, "preview")
    const full = await buildCorporateEventPlanPdf(event, "full")

    expect(Buffer.from(preview).subarray(0, 4).toString()).toBe("%PDF")
    expect(Buffer.from(full).subarray(0, 4).toString()).toBe("%PDF")

    const previewDoc = await PDFDocument.load(preview)
    const fullDoc = await PDFDocument.load(full)
    expect(previewDoc.getTitle()).toContain("Acme Engineering")
    expect(previewDoc.getSubject()).toBe(PLAN_PDF_PREVIEW_WATERMARK)
    expect(fullDoc.getSubject()).toBe("Full event plan PDF")
    expect(previewDoc.getPageCount()).toBeGreaterThan(0)
    expect(fullDoc.getPageCount()).toBeGreaterThan(0)
  })
})
