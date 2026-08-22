"use client"

import { useState } from "react"
import {
  EVENT_CHECKLIST,
  buildCorporateEventPlanPdf,
  buildEventSummaryLines,
  buildEventSummaryTitle,
  buildFeedbackSurvey,
  defaultSchedule,
  downloadPdfBytes,
  planPdfFilename,
  type AttendeeRow,
  type CorporateEvent,
  type RsvpStatus,
  type ScheduleItem,
} from "@/lib/corporate-event-builder"
import { CORPORATE_EVENT_BUILDER_PRODUCT_ID } from "@/lib/corporate-event-builder/types"
import {
  type AnalyticsProduct,
  trackCorporateBuilderPdfDownload,
  trackCorporateBuilderPdfPreview,
} from "@/lib/analytics"
import DigitalCheckoutButton from "@/components/DigitalCheckoutButton"
import CopyButton from "./CopyButton"
import { fieldClass, helpClass, labelClass, sectionClass } from "./fieldStyles"

type StepPlanProps = {
  event: CorporateEvent
  paid: boolean
  productPriceLabel: string
  analyticsProduct: AnalyticsProduct
  toolkitDownloadHref?: string | null
  entitlementSessionId: string
  onChange: (patch: Partial<CorporateEvent>) => void
  onExport?: () => void
  onPlanCompleted?: () => void
}

function newAttendee(): AttendeeRow {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `att_${Date.now()}`
  return {
    id,
    name: "",
    rsvp: "pending",
    dietaryNotes: "",
    accessibilityNote: "",
    travelConfirmed: false,
    paymentRequired: false,
    notes: "",
  }
}

export default function StepPlan({
  event,
  paid,
  productPriceLabel,
  analyticsProduct,
  toolkitDownloadHref,
  entitlementSessionId,
  onChange,
  onExport,
  onPlanCompleted,
}: StepPlanProps) {
  const summaryTitle = buildEventSummaryTitle(event)
  const summaryLines = buildEventSummaryLines(event)
  const feedback = buildFeedbackSurvey(event)
  const doneCount = event.checklist.filter((c) => c.done).length
  const [pdfBusy, setPdfBusy] = useState<"preview" | "full" | null>(null)
  const [pdfError, setPdfError] = useState<string | null>(null)

  function updateSchedule(index: number, patch: Partial<ScheduleItem>) {
    const schedule = event.schedule.map((item, i) =>
      i === index ? { ...item, ...patch } : item
    )
    onChange({ schedule })
  }

  function updateAttendee(id: string, patch: Partial<AttendeeRow>) {
    onChange({
      attendees: event.attendees.map((row) =>
        row.id === id ? { ...row, ...patch } : row
      ),
    })
  }

  function toggleChecklist(id: string) {
    const checklist = event.checklist.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item
    )
    onChange({ checklist })
    if (checklist.every((item) => item.done)) {
      onPlanCompleted?.()
    }
  }

  function handlePrint() {
    if (!paid) return
    onExport?.()
    window.print()
  }

  async function handlePdf(mode: "preview" | "full") {
    setPdfError(null)
    setPdfBusy(mode)
    try {
      if (mode === "full") {
        const params = new URLSearchParams({
          session_id: entitlementSessionId,
        })
        const accessRes = await fetch(
          `/api/corporate-event-builder/access?${params}`
        )
        if (!accessRes.ok) {
          throw new Error("We could not confirm this purchase yet.")
        }
      }
      const bytes = await buildCorporateEventPlanPdf(event, mode)
      const name =
        mode === "preview"
          ? planPdfFilename(event).replace(".pdf", "-preview.pdf")
          : planPdfFilename(event)
      downloadPdfBytes(bytes, name)
      if (mode === "preview") {
        trackCorporateBuilderPdfPreview()
      } else {
        trackCorporateBuilderPdfDownload()
        onExport?.()
      }
    } catch (error) {
      setPdfError(
        error instanceof Error ? error.message : "Unable to create the PDF."
      )
    } finally {
      setPdfBusy(null)
    }
  }

  const printable = [
    summaryTitle,
    "",
    ...summaryLines,
    "",
    "Run sheet",
    ...event.schedule.map(
      (item) =>
        `${item.time || "TBC"} – ${item.label}${item.estimated ? " (estimated)" : ""}`
    ),
    "",
    `Checklist progress: ${doneCount}/${EVENT_CHECKLIST.length}`,
  ].join("\n")

  return (
    <div className="space-y-4">
      <div className={sectionClass} id="event-summary-print">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white">{summaryTitle}</h2>
            <p className={helpClass}>
              Preview your plan on screen first. Download a clean PDF when you
              are happy with it.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={pdfBusy !== null}
              onClick={() => handlePdf("preview")}
              className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-zinc-700 px-3 text-sm font-semibold text-zinc-100 disabled:opacity-50"
            >
              {pdfBusy === "preview" ? "Preparing preview…" : "Preview PDF"}
            </button>
            {paid ? (
              <>
                <CopyButton
                  text={printable}
                  label="Copy summary"
                  onCopied={onExport}
                />
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-zinc-700 px-3 text-sm font-semibold text-zinc-100"
                >
                  Print summary
                </button>
                <button
                  type="button"
                  disabled={pdfBusy !== null}
                  onClick={() => handlePdf("full")}
                  className="btn-rage inline-flex min-h-[44px] items-center justify-center px-3 text-sm disabled:opacity-50"
                >
                  {pdfBusy === "full"
                    ? "Preparing PDF…"
                    : "Download event plan PDF"}
                </button>
              </>
            ) : null}
          </div>
        </div>
        {pdfError ? (
          <p className="mt-3 text-sm text-red-300">{pdfError}</p>
        ) : null}
        <ul className="mt-4 space-y-1 text-sm text-zinc-200">
          {summaryLines.map((line) => (
            <li key={line}>
              <strong className="text-white">{line.split(":")[0]}:</strong>
              {line.includes(":") ? line.slice(line.indexOf(":") + 1) : ""}
            </li>
          ))}
        </ul>
      </div>

      {!paid ? (
        <div className={`${sectionClass} border-rage-500/30`}>
          <h2 className="text-lg font-bold text-white">
            Happy with this plan?
          </h2>
          <p className={`${helpClass} mt-1`}>
            Unlock a clean PDF of this event plan plus the 16-page printable
            toolkit. The builder stays free.
          </p>
          <div className="mt-4 max-w-md">
            <DigitalCheckoutButton
              productId={CORPORATE_EVENT_BUILDER_PRODUCT_ID}
              analyticsProduct={analyticsProduct}
              checkoutSource="builder_plan"
              returnTo="builder"
              collectEmail
            >
              Unlock full PDF — {productPriceLabel}
            </DigitalCheckoutButton>
          </div>
        </div>
      ) : toolkitDownloadHref ? (
        <div className={sectionClass}>
          <h2 className="text-lg font-bold text-white">Toolkit PDF</h2>
          <p className={`${helpClass} mt-1`}>
            Prefer printable worksheets as well? Download the original 16-page
            toolkit (link valid for 72 hours after payment).
          </p>
          <a
            href={toolkitDownloadHref}
            className="mt-3 inline-flex min-h-[44px] items-center text-sm font-semibold text-rage-500 hover:text-rage-400"
          >
            Download toolkit PDF
          </a>
        </div>
      ) : null}

      <div className={sectionClass}>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white">Event run sheet</h2>
            <p className={helpClass}>
              Timings are estimates — venues operate differently. Confirm on
              booking.
            </p>
          </div>
          <button
            type="button"
            className="text-sm font-semibold text-rage-500 hover:text-rage-400"
            onClick={() =>
              onChange({ schedule: defaultSchedule(event.startTime || "16:00") })
            }
          >
            Rebuild from start time
          </button>
        </div>
        <div className="mt-4 space-y-2">
          {event.schedule.map((item, index) => (
            <div
              key={item.id}
              className="grid gap-2 sm:grid-cols-[120px_1fr_auto]"
            >
              <input
                type="time"
                className={fieldClass}
                value={item.time}
                onChange={(e) => updateSchedule(index, { time: e.target.value })}
                aria-label={`Time for ${item.label}`}
              />
              <input
                className={fieldClass}
                value={item.label}
                onChange={(e) => updateSchedule(index, { label: e.target.value })}
                aria-label="Schedule item"
              />
              <label className="inline-flex min-h-[44px] items-center gap-2 text-xs text-zinc-400">
                <input
                  type="checkbox"
                  checked={item.estimated}
                  onChange={(e) =>
                    updateSchedule(index, { estimated: e.target.checked })
                  }
                />
                Estimated
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className={sectionClass}>
        <h2 className="text-lg font-bold text-white">
          Event checklist ({doneCount}/{EVENT_CHECKLIST.length})
        </h2>
        <ul className="mt-4 space-y-2">
          {EVENT_CHECKLIST.map((item) => {
            const state = event.checklist.find((c) => c.id === item.id)
            return (
              <li key={item.id}>
                <label className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-md border border-zinc-800 bg-[#121212] px-3 py-2 text-sm text-zinc-200">
                  <input
                    type="checkbox"
                    checked={Boolean(state?.done)}
                    onChange={() => toggleChecklist(item.id)}
                    className="h-4 w-4 accent-orange-500"
                  />
                  <span className={state?.done ? "text-zinc-500 line-through" : ""}>
                    {item.label}
                  </span>
                </label>
              </li>
            )
          })}
        </ul>
      </div>

      <div className={sectionClass}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white">RSVP tracker</h2>
            <p className={helpClass}>
              Stored in this browser only. Keep dietary/accessibility notes
              minimal — do not collect medical details.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              onChange({ attendees: [...event.attendees, newAttendee()] })
            }
            className="inline-flex min-h-[44px] items-center rounded-md border border-zinc-700 px-3 text-sm font-semibold text-zinc-100"
          >
            Add attendee
          </button>
        </div>
        {event.attendees.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-500">No attendees tracked yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {event.attendees.map((row) => (
              <div
                key={row.id}
                className="grid gap-2 rounded-md border border-zinc-800 bg-[#121212] p-3 sm:grid-cols-2"
              >
                <div>
                  <label className={labelClass}>Name</label>
                  <input
                    className={fieldClass}
                    value={row.name}
                    onChange={(e) =>
                      updateAttendee(row.id, { name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className={labelClass}>RSVP</label>
                  <select
                    className={fieldClass}
                    value={row.rsvp}
                    onChange={(e) =>
                      updateAttendee(row.id, {
                        rsvp: e.target.value as RsvpStatus,
                      })
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="maybe">Maybe</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Dietary notes</label>
                  <input
                    className={fieldClass}
                    value={row.dietaryNotes}
                    onChange={(e) =>
                      updateAttendee(row.id, { dietaryNotes: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className={labelClass}>Accessibility note</label>
                  <input
                    className={fieldClass}
                    value={row.accessibilityNote}
                    onChange={(e) =>
                      updateAttendee(row.id, {
                        accessibilityNote: e.target.value,
                      })
                    }
                  />
                </div>
                <label className="inline-flex items-center gap-2 text-sm text-zinc-300">
                  <input
                    type="checkbox"
                    checked={row.travelConfirmed}
                    onChange={(e) =>
                      updateAttendee(row.id, {
                        travelConfirmed: e.target.checked,
                      })
                    }
                  />
                  Travel confirmed
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-zinc-300">
                  <input
                    type="checkbox"
                    checked={row.paymentRequired}
                    onChange={(e) =>
                      updateAttendee(row.id, {
                        paymentRequired: e.target.checked,
                      })
                    }
                  />
                  Payment required
                </label>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Notes</label>
                  <input
                    className={fieldClass}
                    value={row.notes}
                    onChange={(e) =>
                      updateAttendee(row.id, { notes: e.target.value })
                    }
                  />
                </div>
                <button
                  type="button"
                  className="text-left text-sm font-semibold text-zinc-500 hover:text-rage-500 sm:col-span-2"
                  onClick={() =>
                    onChange({
                      attendees: event.attendees.filter((a) => a.id !== row.id),
                    })
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={sectionClass}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white">Feedback survey</h2>
            <p className={helpClass}>
              Short post-event questions you can paste into a form or email.
            </p>
          </div>
          <CopyButton text={feedback.body} label="Copy survey" />
        </div>
        <pre className="mt-4 whitespace-pre-wrap rounded-md border border-zinc-800 bg-[#121212] p-4 text-sm text-zinc-200">
          {feedback.body}
        </pre>
      </div>
    </div>
  )
}
