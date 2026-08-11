"use client"

import { useState } from "react"
import {
  computeDashboardStats,
  createId,
  formatGbp,
  LEAD_STAGE_LABELS,
  LEAD_STAGES,
  type CorporateLead,
  type LeadStage,
  type VenueOwnerWorkspace,
} from "@/lib/corporate-booking-system"
import {
  trackCorporateFollowupCompleted,
  trackCorporateLeadCreated,
  trackCorporateLeadMarkedBooked,
} from "@/lib/analytics"
import {
  btnPrimary,
  btnSecondary,
  fieldClass,
  labelClass,
  sectionClass,
} from "./fieldStyles"

function emptyLead(): CorporateLead {
  const now = new Date().toISOString()
  return {
    id: createId(),
    company: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    groupSize: null,
    estimatedValue: null,
    proposedDate: "",
    preferredTime: "",
    stage: "new_lead",
    nextFollowUpDate: "",
    notes: "",
    packageId: null,
    quoteId: null,
    eventPurpose: "",
    availabilityStatus: "",
    createdAt: now,
    updatedAt: now,
  }
}

export default function PipelineView({
  workspace,
  onChange,
}: {
  workspace: VenueOwnerWorkspace
  onChange: (workspace: VenueOwnerWorkspace) => void
}) {
  const [draft, setDraft] = useState<CorporateLead | null>(null)
  const stats = computeDashboardStats(workspace)

  function upsertLead(lead: CorporateLead) {
    const exists = workspace.leads.some((item) => item.id === lead.id)
    const prev = workspace.leads.find((item) => item.id === lead.id)
    const nextLead = { ...lead, updatedAt: new Date().toISOString() }
    const leads = exists
      ? workspace.leads.map((item) => (item.id === lead.id ? nextLead : item))
      : [nextLead, ...workspace.leads]

    if (!exists) trackCorporateLeadCreated()
    if (prev && prev.stage !== "booked" && nextLead.stage === "booked") {
      trackCorporateLeadMarkedBooked()
    }
    if (
      prev &&
      prev.nextFollowUpDate &&
      nextLead.nextFollowUpDate &&
      nextLead.nextFollowUpDate > prev.nextFollowUpDate
    ) {
      trackCorporateFollowupCompleted()
    }

    onChange({ ...workspace, leads })
    setDraft(null)
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-wide text-white">
            Lead pipeline
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Lightweight corporate-booking tracker — not a full CRM. Open:{" "}
            {stats.openOpportunities} · Quoted pipeline:{" "}
            {formatGbp(stats.pipelineValue)} · Booked:{" "}
            {formatGbp(stats.bookedValue)}
          </p>
        </div>
        <button
          type="button"
          className={btnPrimary}
          onClick={() => setDraft(emptyLead())}
        >
          New lead
        </button>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
        {LEAD_STAGES.map((stage) => (
          <div
            key={stage}
            className="min-w-[140px] rounded-md border border-zinc-800 px-3 py-2 text-xs text-zinc-400"
          >
            <div className="font-semibold text-zinc-200">
              {LEAD_STAGE_LABELS[stage]}
            </div>
            <div>{stats.byStage[stage]}</div>
          </div>
        ))}
      </div>

      <div className="hidden gap-2 overflow-x-auto pb-2 lg:flex">
        {LEAD_STAGES.map((stage) => (
          <div
            key={stage}
            className="min-w-[160px] flex-1 rounded-lg border border-zinc-800 bg-[#141414] p-2"
          >
            <p className="px-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
              {LEAD_STAGE_LABELS[stage]} ({stats.byStage[stage]})
            </p>
            <ul className="mt-2 space-y-2">
              {workspace.leads
                .filter((lead) => lead.stage === stage)
                .map((lead) => (
                  <li key={lead.id}>
                    <button
                      type="button"
                      onClick={() => setDraft(lead)}
                      className="w-full rounded-md border border-zinc-800 bg-[#181818] px-2 py-2 text-left text-sm hover:border-zinc-600"
                    >
                      <div className="font-semibold text-white">
                        {lead.company || "Untitled company"}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {lead.groupSize || "?"} people ·{" "}
                        {formatGbp(lead.estimatedValue || 0)}
                      </div>
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="space-y-3 lg:hidden">
        {workspace.leads.length === 0 ? (
          <p className="text-sm text-zinc-500">No leads yet.</p>
        ) : (
          workspace.leads.map((lead) => (
            <button
              key={lead.id}
              type="button"
              onClick={() => setDraft(lead)}
              className={`${sectionClass} w-full text-left`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-white">
                    {lead.company || "Untitled company"}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {LEAD_STAGE_LABELS[lead.stage]} ·{" "}
                    {formatGbp(lead.estimatedValue || 0)}
                  </p>
                </div>
                <span className="text-xs text-zinc-500">
                  {lead.nextFollowUpDate || "No follow-up"}
                </span>
              </div>
            </button>
          ))
        )}
      </div>

      {draft && (
        <div className={`${sectionClass} space-y-3`}>
          <h2 className="text-lg font-bold text-white">
            {workspace.leads.some((l) => l.id === draft.id)
              ? "Edit lead"
              : "New lead"}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ["company", "Company"],
                ["contactName", "Contact name"],
                ["contactEmail", "Contact email"],
                ["contactPhone", "Contact phone"],
                ["proposedDate", "Proposed date"],
                ["preferredTime", "Preferred time"],
                ["nextFollowUpDate", "Next follow-up date"],
                ["eventPurpose", "Event purpose"],
                ["availabilityStatus", "Availability status"],
              ] as const
            ).map(([key, label]) => (
              <div key={key}>
                <label className={labelClass}>{label}</label>
                <input
                  className={fieldClass}
                  type={
                    key.includes("Date")
                      ? "date"
                      : key.includes("Time")
                        ? "time"
                        : "text"
                  }
                  value={draft[key]}
                  onChange={(e) =>
                    setDraft({ ...draft, [key]: e.target.value })
                  }
                />
              </div>
            ))}
            <div>
              <label className={labelClass}>Group size</label>
              <input
                type="number"
                className={fieldClass}
                value={draft.groupSize ?? ""}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    groupSize: e.target.value ? Number(e.target.value) : null,
                  })
                }
              />
            </div>
            <div>
              <label className={labelClass}>Estimated value (£)</label>
              <input
                type="number"
                className={fieldClass}
                value={draft.estimatedValue ?? ""}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    estimatedValue: e.target.value
                      ? Number(e.target.value)
                      : null,
                  })
                }
              />
            </div>
            <div>
              <label className={labelClass}>Stage</label>
              <select
                className={fieldClass}
                value={draft.stage}
                onChange={(e) =>
                  setDraft({ ...draft, stage: e.target.value as LeadStage })
                }
              >
                {LEAD_STAGES.map((stage) => (
                  <option key={stage} value={stage}>
                    {LEAD_STAGE_LABELS[stage]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Package</label>
              <select
                className={fieldClass}
                value={draft.packageId || ""}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    packageId: e.target.value || null,
                  })
                }
              >
                <option value="">Not selected</option>
                {workspace.packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Notes</label>
            <textarea
              className={fieldClass}
              rows={3}
              value={draft.notes}
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className={btnPrimary}
              onClick={() => upsertLead(draft)}
            >
              Save lead
            </button>
            <button
              type="button"
              className={btnSecondary}
              onClick={() => setDraft(null)}
            >
              Cancel
            </button>
            {workspace.leads.some((l) => l.id === draft.id) && (
              <button
                type="button"
                className={btnSecondary}
                onClick={() => {
                  onChange({
                    ...workspace,
                    leads: workspace.leads.filter((l) => l.id !== draft.id),
                  })
                  setDraft(null)
                }}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
