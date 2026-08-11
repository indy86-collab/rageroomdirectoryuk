"use client"

import {
  DISCOVERY_SCRIPT,
  ENQUIRY_QUALIFICATION_ITEMS,
  type VenueOwnerWorkspace,
} from "@/lib/corporate-booking-system"
import {
  fieldClass,
  helpClass,
  labelClass,
  sectionClass,
} from "./fieldStyles"

export default function ToolsView({
  workspace,
  onChange,
  mode,
}: {
  workspace: VenueOwnerWorkspace
  onChange: (workspace: VenueOwnerWorkspace) => void
  mode: "tools" | "settings"
}) {
  if (mode === "settings") {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-black uppercase tracking-wide text-white">
            Venue settings
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Policies used in proposals, confirmations and FAQ answers. Leave
            blank rather than inventing details.
          </p>
        </header>
        <div className={`${sectionClass} grid gap-3 sm:grid-cols-2`}>
          {(
            [
              ["businessName", "Venue / business name"],
              ["city", "City / location"],
              ["website", "Website"],
              ["contactEmail", "Contact email"],
              ["telephone", "Telephone"],
              ["address", "Venue address"],
              ["clothingGuidance", "Clothing guidance"],
              ["ppeGuidance", "PPE guidance"],
              ["parkingTravel", "Parking / travel"],
              ["cancellationPolicy", "Cancellation policy"],
              ["ageRequirement", "Age requirement"],
              ["accessibilityNotes", "Accessibility notes"],
              ["privateHirePolicy", "Private hire policy"],
              ["invoicePolicy", "Invoice / PO policy"],
              ["reschedulePolicy", "Reschedule policy"],
              ["nonParticipantPolicy", "Non-participant policy"],
              ["attendeeInstructions", "Attendee instructions"],
              ["depositPolicy", "Deposit policy"],
            ] as const
          ).map(([key, label]) => (
            <div
              key={key}
              className={
                key.includes("Policy") ||
                key.includes("Guidance") ||
                key.includes("Instructions") ||
                key.includes("Notes") ||
                key === "address"
                  ? "sm:col-span-2"
                  : ""
              }
            >
              <label className={labelClass}>{label}</label>
              {key.includes("Policy") ||
              key.includes("Guidance") ||
              key.includes("Instructions") ||
              key.includes("Notes") ||
              key === "address" ? (
                <textarea
                  className={fieldClass}
                  rows={2}
                  value={workspace.venue[key]}
                  onChange={(e) =>
                    onChange({
                      ...workspace,
                      venue: { ...workspace.venue, [key]: e.target.value },
                    })
                  }
                />
              ) : (
                <input
                  className={fieldClass}
                  value={workspace.venue[key]}
                  onChange={(e) =>
                    onChange({
                      ...workspace,
                      venue: { ...workspace.venue, [key]: e.target.value },
                    })
                  }
                />
              )}
            </div>
          ))}
          <div>
            <label className={labelClass}>Max group size</label>
            <input
              type="number"
              className={fieldClass}
              value={workspace.venue.maxGroupSize ?? ""}
              onChange={(e) =>
                onChange({
                  ...workspace,
                  venue: {
                    ...workspace.venue,
                    maxGroupSize: e.target.value
                      ? Number(e.target.value)
                      : null,
                  },
                })
              }
            />
          </div>
          <div>
            <label className={labelClass}>Typical session minutes</label>
            <input
              type="number"
              className={fieldClass}
              value={workspace.venue.typicalSessionMinutes ?? ""}
              onChange={(e) =>
                onChange({
                  ...workspace,
                  venue: {
                    ...workspace.venue,
                    typicalSessionMinutes: e.target.value
                      ? Number(e.target.value)
                      : null,
                  },
                })
              }
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black uppercase tracking-wide text-white">
          Qualification & discovery
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Collect the right booking information before quoting — no sensitive
          attendee health data.
        </p>
      </header>

      <section className={sectionClass}>
        <h2 className="text-lg font-bold text-white">
          Enquiry qualification checklist
        </h2>
        <ul className="mt-4 space-y-2">
          {ENQUIRY_QUALIFICATION_ITEMS.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-zinc-300">
              <input type="checkbox" className="mt-1" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={`${sectionClass} space-y-4`}>
        <h2 className="text-lg font-bold text-white">
          Sales call / discovery script
        </h2>
        <p className={helpClass}>
          Concise questions to quote reliably — not aggressive selling.
        </p>
        {Object.entries(DISCOVERY_SCRIPT).map(([section, lines]) => (
          <div key={section}>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-rage-500">
              {section.replace(/_/g, " ")}
            </h3>
            <ul className="mt-2 space-y-1 text-sm text-zinc-300">
              {lines.map((line) => (
                <li key={line}>• {line}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  )
}
