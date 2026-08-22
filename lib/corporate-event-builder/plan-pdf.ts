import { PDFDocument, StandardFonts, rgb, degrees, type PDFFont, type PDFPage } from "pdf-lib"
import { EVENT_CHECKLIST } from "./checklist"
import {
  deriveBudgetPerPerson,
  deriveTotalBudget,
  formatGbp,
} from "./budget"
import {
  buildApprovalProposal,
  buildEventSummaryLines,
  buildEventSummaryTitle,
} from "./templates"
import type { CorporateEvent } from "./types"

export type PlanPdfMode = "preview" | "full"

export const PLAN_PDF_PREVIEW_WATERMARK = "PREVIEW - Unlock full PDF"

const PAGE_WIDTH = 595.28
const PAGE_HEIGHT = 841.89
const MARGIN = 50
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2
const LINE_HEIGHT = 14
const SECTION_GAP = 10
const BODY_SIZE = 10
const TITLE_SIZE = 18
const HEADING_SIZE = 13

export type PlanPdfSection = {
  heading: string
  lines: string[]
}

function budgetLines(event: CorporateEvent) {
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
  return [
    `Total: ${formatGbp(total)}`,
    `Per person: ${formatGbp(perPerson)}`,
    `Rage room: ${formatGbp(event.categories.rageRoom)}`,
    `Food / drinks: ${formatGbp(event.categories.foodDrinks)}`,
    `Travel: ${formatGbp(event.categories.travel)}`,
    `Contingency: ${formatGbp(event.categories.contingency)}`,
  ]
}

function venueLines(event: CorporateEvent) {
  if (!event.venueShortlist.length) {
    return ["No venues shortlisted yet."]
  }
  const lines = event.venueShortlist.map((venue, index) => {
    const price =
      venue.price != null ? ` · from ${formatGbp(venue.price)}` : ""
    return `${index + 1}. ${venue.name} (${venue.city || "UK"})${price}`
  })
  if (event.selectedVenueName.trim()) {
    lines.push(`Selected: ${event.selectedVenueName.trim()}`)
  }
  return lines
}

function scheduleLines(event: CorporateEvent) {
  if (!event.schedule.length) return ["No run sheet items yet."]
  return event.schedule.map(
    (item) =>
      `${item.time || "TBC"} - ${item.label}${item.estimated ? " (estimated)" : ""}`
  )
}

function checklistLines(event: CorporateEvent) {
  return EVENT_CHECKLIST.map((item) => {
    const state = event.checklist.find((row) => row.id === item.id)
    return `${state?.done ? "[x]" : "[ ]"} ${item.label}`
  })
}

function rsvpLines(event: CorporateEvent) {
  if (!event.attendees.length) return ["No attendees tracked yet."]
  return event.attendees.map((row) => {
    const name = row.name.trim() || "Unnamed"
    const extras = [
      row.rsvp,
      row.travelConfirmed ? "travel confirmed" : null,
      row.paymentRequired ? "payment required" : null,
    ].filter(Boolean)
    return `${name} (${extras.join(", ")})`
  })
}

/** Structured plan copy used by the PDF renderer and unit tests. */
export function buildPlanPdfSections(event: CorporateEvent): PlanPdfSection[] {
  return [
    {
      heading: "Event summary",
      lines: buildEventSummaryLines(event),
    },
    {
      heading: "Budget",
      lines: budgetLines(event),
    },
    {
      heading: "Venue shortlist",
      lines: venueLines(event),
    },
    {
      heading: "Run sheet",
      lines: scheduleLines(event),
    },
    {
      heading: "Checklist",
      lines: checklistLines(event),
    },
    {
      heading: "RSVP list",
      lines: rsvpLines(event),
    },
    {
      heading: "Approval proposal",
      lines: buildApprovalProposal(event)
        .replace(/^### /gm, "")
        .replace(/\*\*/g, "")
        .split("\n"),
    },
  ]
}

export function planPdfFilename(event: CorporateEvent) {
  const slug = (event.companyName.trim() || "team")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
  return `${slug || "team"}-rage-room-event-plan.pdf`
}

function wrapLine(text: string, font: PDFFont, size: number, maxWidth: number) {
  const trimmed = text || " "
  if (font.widthOfTextAtSize(trimmed, size) <= maxWidth) {
    return [trimmed]
  }
  const words = trimmed.split(/\s+/)
  const lines: string[] = []
  let current = ""
  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (font.widthOfTextAtSize(next, size) <= maxWidth) {
      current = next
    } else {
      if (current) lines.push(current)
      current = word
    }
  }
  if (current) lines.push(current)
  return lines.length ? lines : [trimmed]
}

function drawWatermark(page: PDFPage, font: PDFFont) {
  page.drawText(PLAN_PDF_PREVIEW_WATERMARK, {
    x: 80,
    y: 280,
    size: 28,
    font,
    color: rgb(0.85, 0.35, 0.12),
    rotate: degrees(32),
    opacity: 0.22,
  })
}

export async function buildCorporateEventPlanPdf(
  event: CorporateEvent,
  mode: PlanPdfMode
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create()
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const sections = buildPlanPdfSections(event)
  const title = buildEventSummaryTitle(event)
  pdf.setTitle(title)
  pdf.setSubject(
    mode === "preview" ? PLAN_PDF_PREVIEW_WATERMARK : "Full event plan PDF"
  )

  let page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT])
  let y = PAGE_HEIGHT - MARGIN

  const ensureSpace = (needed: number) => {
    if (y - needed < MARGIN + 24) {
      page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT])
      y = PAGE_HEIGHT - MARGIN
      if (mode === "preview") drawWatermark(page, bold)
    }
  }

  if (mode === "preview") drawWatermark(page, bold)

  page.drawText("Corporate Rage Room Event Plan", {
    x: MARGIN,
    y,
    size: 11,
    font: bold,
    color: rgb(0.85, 0.35, 0.12),
  })
  y -= 22
  page.drawText(title, {
    x: MARGIN,
    y,
    size: TITLE_SIZE,
    font: bold,
    color: rgb(0.1, 0.1, 0.1),
  })
  y -= 18
  page.drawText(
    "Planning aid only. Confirm prices, availability and rules with the venue.",
    {
      x: MARGIN,
      y,
      size: 8,
      font,
      color: rgb(0.4, 0.4, 0.4),
    }
  )
  y -= 22

  for (const section of sections) {
    ensureSpace(LINE_HEIGHT * 3)
    page.drawText(section.heading, {
      x: MARGIN,
      y,
      size: HEADING_SIZE,
      font: bold,
      color: rgb(0.12, 0.12, 0.12),
    })
    y -= LINE_HEIGHT + 2

    for (const raw of section.lines) {
      const wrapped = wrapLine(raw, font, BODY_SIZE, CONTENT_WIDTH)
      for (const line of wrapped) {
        ensureSpace(LINE_HEIGHT)
        page.drawText(line, {
          x: MARGIN,
          y,
          size: BODY_SIZE,
          font,
          color: rgb(0.2, 0.2, 0.2),
        })
        y -= LINE_HEIGHT
      }
    }
    y -= SECTION_GAP
  }

  const pages = pdf.getPages()
  pages.forEach((pdfPage, index) => {
    pdfPage.drawText(`Page ${index + 1} of ${pages.length}`, {
      x: MARGIN,
      y: 28,
      size: 8,
      font,
      color: rgb(0.45, 0.45, 0.45),
    })
    pdfPage.drawText("RageRoom Directory — not a venue booking", {
      x: PAGE_WIDTH - MARGIN - 190,
      y: 28,
      size: 8,
      font,
      color: rgb(0.45, 0.45, 0.45),
    })
  })

  return pdf.save()
}

export function downloadPdfBytes(bytes: Uint8Array, filename: string) {
  if (typeof window === "undefined") return
  const copy = new Uint8Array(bytes.byteLength)
  copy.set(bytes)
  const blob = new Blob([copy], { type: "application/pdf" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
