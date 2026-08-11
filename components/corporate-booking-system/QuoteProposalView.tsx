"use client"

import { useMemo, useState } from "react"
import {
  calculateQuoteTotals,
  createId,
  formatGbp,
  generateProposalDocument,
  type CorporateQuote,
  type VenueOwnerWorkspace,
} from "@/lib/corporate-booking-system"
import {
  trackCorporateProposalGenerated,
  trackCorporateQuoteCreated,
} from "@/lib/analytics"
import CopyButton from "./CopyButton"
import {
  btnPrimary,
  btnSecondary,
  fieldClass,
  helpClass,
  labelClass,
  sectionClass,
} from "./fieldStyles"

function emptyQuote(workspace: VenueOwnerWorkspace): CorporateQuote {
  const now = new Date().toISOString()
  const lead = workspace.leads[0]
  return {
    id: createId(),
    leadId: lead?.id || null,
    company: lead?.company || "",
    contactName: lead?.contactName || "",
    contactEmail: lead?.contactEmail || "",
    participantCount: lead?.groupSize || 10,
    packageId: lead?.packageId || workspace.packages[0]?.id || null,
    date: lead?.proposedDate || "",
    arrivalTime: lead?.preferredTime || "10:00",
    extrasAmount: 0,
    extrasNote: "",
    discountAmount: 0,
    discountNote: "",
    applyVat: Boolean(workspace.venue.vatRegistered),
    vatRatePercent: 20,
    depositPercent: 25,
    depositAmountOverride: null,
    validityDays: 14,
    documentLabel: "Booking Quote / Estimate",
    notes: "",
    createdAt: now,
    updatedAt: now,
  }
}

export default function QuoteProposalView({
  workspace,
  onChange,
  mode,
}: {
  workspace: VenueOwnerWorkspace
  onChange: (workspace: VenueOwnerWorkspace) => void
  mode: "quote" | "proposal"
}) {
  const [quote, setQuote] = useState<CorporateQuote>(
    () => workspace.quotes[0] || emptyQuote(workspace)
  )

  const selectedPackage =
    workspace.packages.find((pkg) => pkg.id === quote.packageId) || null
  const totals = useMemo(
    () => calculateQuoteTotals(quote, selectedPackage?.pricePerPerson),
    [quote, selectedPackage]
  )

  const proposal = useMemo(
    () =>
      generateProposalDocument({
        workspace,
        lead:
          workspace.leads.find((lead) => lead.id === quote.leadId) || null,
        quote,
        pkg: selectedPackage,
      }),
    [workspace, quote, selectedPackage]
  )

  function saveQuote() {
    const exists = workspace.quotes.some((item) => item.id === quote.id)
    const next = { ...quote, updatedAt: new Date().toISOString() }
    const quotes = exists
      ? workspace.quotes.map((item) => (item.id === quote.id ? next : item))
      : [next, ...workspace.quotes]
    if (!exists) trackCorporateQuoteCreated()
    onChange({ ...workspace, quotes })
    setQuote(next)
  }

  function printProposal() {
    trackCorporateProposalGenerated()
    window.print()
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black uppercase tracking-wide text-white">
          {mode === "quote" ? "Quote builder" : "Corporate proposal"}
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Labelled as a booking quote / estimate — not invoicing software.
        </p>
      </header>

      <div className={`${sectionClass} space-y-3 print:hidden`}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={labelClass}>Load lead</label>
            <select
              className={fieldClass}
              value={quote.leadId || ""}
              onChange={(e) => {
                const lead = workspace.leads.find((l) => l.id === e.target.value)
                if (!lead) {
                  setQuote({ ...quote, leadId: null })
                  return
                }
                setQuote({
                  ...quote,
                  leadId: lead.id,
                  company: lead.company,
                  contactName: lead.contactName,
                  contactEmail: lead.contactEmail,
                  participantCount: lead.groupSize || quote.participantCount,
                  packageId: lead.packageId || quote.packageId,
                  date: lead.proposedDate || quote.date,
                  arrivalTime: lead.preferredTime || quote.arrivalTime,
                })
              }}
            >
              <option value="">No lead linked</option>
              {workspace.leads.map((lead) => (
                <option key={lead.id} value={lead.id}>
                  {lead.company || "Untitled"} — {lead.contactName || "contact"}
                </option>
              ))}
            </select>
          </div>
          {(
            [
              ["company", "Company"],
              ["contactName", "Contact"],
              ["contactEmail", "Contact email"],
              ["date", "Date"],
              ["arrivalTime", "Arrival time"],
              ["documentLabel", "Document label"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <label className={labelClass}>{label}</label>
              <input
                className={fieldClass}
                type={
                  key === "date" ? "date" : key === "arrivalTime" ? "time" : "text"
                }
                value={quote[key]}
                onChange={(e) => setQuote({ ...quote, [key]: e.target.value })}
              />
            </div>
          ))}
          <div>
            <label className={labelClass}>Participants</label>
            <input
              type="number"
              className={fieldClass}
              value={quote.participantCount}
              onChange={(e) =>
                setQuote({
                  ...quote,
                  participantCount: Number(e.target.value) || 0,
                })
              }
            />
          </div>
          <div>
            <label className={labelClass}>Package</label>
            <select
              className={fieldClass}
              value={quote.packageId || ""}
              onChange={(e) =>
                setQuote({ ...quote, packageId: e.target.value || null })
              }
            >
              <option value="">Select package</option>
              {workspace.packages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Extras (£)</label>
            <input
              type="number"
              className={fieldClass}
              value={quote.extrasAmount}
              onChange={(e) =>
                setQuote({
                  ...quote,
                  extrasAmount: Number(e.target.value) || 0,
                })
              }
            />
          </div>
          <div>
            <label className={labelClass}>Discount (£)</label>
            <input
              type="number"
              className={fieldClass}
              value={quote.discountAmount}
              onChange={(e) =>
                setQuote({
                  ...quote,
                  discountAmount: Number(e.target.value) || 0,
                })
              }
            />
          </div>
          <div>
            <label className={labelClass}>Deposit %</label>
            <input
              type="number"
              className={fieldClass}
              value={quote.depositPercent}
              onChange={(e) =>
                setQuote({
                  ...quote,
                  depositPercent: Number(e.target.value) || 0,
                })
              }
            />
          </div>
          <div>
            <label className={labelClass}>Validity (days)</label>
            <input
              type="number"
              className={fieldClass}
              value={quote.validityDays}
              onChange={(e) =>
                setQuote({
                  ...quote,
                  validityDays: Number(e.target.value) || 0,
                })
              }
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input
            type="checkbox"
            checked={quote.applyVat}
            onChange={(e) =>
              setQuote({ ...quote, applyVat: e.target.checked })
            }
          />
          Apply VAT ({quote.vatRatePercent}%)
        </label>
        <p className={helpClass}>
          Totals update from package price × participants, extras, discount and
          optional VAT.
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="button" className={btnPrimary} onClick={saveQuote}>
            Save quote
          </button>
          <button
            type="button"
            className={btnSecondary}
            onClick={() => setQuote(emptyQuote(workspace))}
          >
            New blank quote
          </button>
        </div>
      </div>

      <section className={`${sectionClass} space-y-2`}>
        <h2 className="text-lg font-bold text-white">
          {quote.documentLabel || "Booking Quote / Estimate"}
        </h2>
        <dl className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          <div>
            <dt className="text-zinc-500">Subtotal</dt>
            <dd className="font-semibold text-white">
              {formatGbp(totals.packageSubtotal)}
            </dd>
          </div>
          <div>
            <dt className="text-zinc-500">Extras</dt>
            <dd className="font-semibold text-white">
              {formatGbp(totals.extras)}
            </dd>
          </div>
          <div>
            <dt className="text-zinc-500">Discount</dt>
            <dd className="font-semibold text-white">
              −{formatGbp(totals.discount)}
            </dd>
          </div>
          <div>
            <dt className="text-zinc-500">VAT</dt>
            <dd className="font-semibold text-white">
              {formatGbp(totals.vatAmount)}
            </dd>
          </div>
          <div>
            <dt className="text-zinc-500">Total</dt>
            <dd className="text-xl font-black text-white">
              {formatGbp(totals.total)}
            </dd>
          </div>
          <div>
            <dt className="text-zinc-500">Deposit</dt>
            <dd className="font-semibold text-white">
              {formatGbp(totals.deposit)}
            </dd>
          </div>
          <div>
            <dt className="text-zinc-500">Remaining balance</dt>
            <dd className="font-semibold text-white">
              {formatGbp(totals.remainingBalance)}
            </dd>
          </div>
        </dl>
      </section>

      {mode === "proposal" && (
        <section
          className={`${sectionClass} space-y-4 print:border-0 print:bg-white print:text-black`}
        >
          <div className="flex flex-wrap gap-3 print:hidden">
            <CopyButton text={proposal.text} label="Copy proposal" />
            <button type="button" className={btnSecondary} onClick={printProposal}>
              Print / PDF
            </button>
          </div>
          <h2 className="text-2xl font-black text-white print:text-black">
            {proposal.title}
          </h2>
          {proposal.sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-bold uppercase tracking-wide text-rage-500 print:text-black">
                {section.title}
              </h3>
              <pre className="mt-2 whitespace-pre-wrap font-sans text-sm text-zinc-300 print:text-black">
                {section.body}
              </pre>
            </div>
          ))}
        </section>
      )}
    </div>
  )
}
