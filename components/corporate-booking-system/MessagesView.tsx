"use client"

import { useMemo, useState } from "react"
import {
  calculateQuoteTotals,
  FAQ_PROMPTS,
  generateBookingConfirmation,
  generateEnquiryResponse,
  generateOutreachMessage,
  generatePostEventMessage,
  generatePreEventReminder,
  resolveFaqAnswer,
  type MessageTone,
  type OutreachVariant,
  type PostEventVariant,
  type VenueOwnerWorkspace,
} from "@/lib/corporate-booking-system"
import CopyButton from "./CopyButton"
import {
  fieldClass,
  helpClass,
  labelClass,
  sectionClass,
} from "./fieldStyles"

export default function MessagesView({
  workspace,
  onChange,
}: {
  workspace: VenueOwnerWorkspace
  onChange: (workspace: VenueOwnerWorkspace) => void
}) {
  const [leadId, setLeadId] = useState(workspace.leads[0]?.id || "")
  const [tone, setTone] = useState<MessageTone>("professional")
  const [outreachVariant, setOutreachVariant] =
    useState<OutreachVariant>("initial")
  const [postVariant, setPostVariant] =
    useState<PostEventVariant>("thank_you")

  const lead = workspace.leads.find((item) => item.id === leadId) || null
  const pkg =
    workspace.packages.find((item) => item.id === lead?.packageId) ||
    workspace.packages[0] ||
    null
  const quote =
    workspace.quotes.find((item) => item.id === lead?.quoteId) ||
    workspace.quotes.find((item) => item.leadId === lead?.id) ||
    null

  const estimatedPrice = useMemo(() => {
    if (!lead || !pkg?.pricePerPerson || !lead.groupSize) return null
    if (quote) {
      return calculateQuoteTotals(quote, pkg.pricePerPerson).total
    }
    return lead.groupSize * pkg.pricePerPerson
  }, [lead, pkg, quote])

  const enquiry = useMemo(() => {
    if (!lead) return null
    return generateEnquiryResponse({
      venue: workspace.venue,
      lead,
      pkg,
      estimatedPrice,
      tone,
    })
  }, [lead, workspace.venue, pkg, estimatedPrice, tone])

  const outreach = generateOutreachMessage({
    venue: workspace.venue,
    variant: outreachVariant,
    contactName: lead?.contactName,
    company: lead?.company || "your team",
  })

  const confirmation =
    lead &&
    generateBookingConfirmation({
      venue: workspace.venue,
      lead,
      quote,
      pkg,
      depositPaid: quote
        ? calculateQuoteTotals(quote, pkg?.pricePerPerson).deposit
        : null,
    })

  const reminder =
    lead &&
    generatePreEventReminder({
      venue: workspace.venue,
      lead,
      quote,
      outstandingPayment: quote
        ? calculateQuoteTotals(quote, pkg?.pricePerPerson).remainingBalance
        : null,
    })

  const postEvent =
    lead &&
    generatePostEventMessage({
      venue: workspace.venue,
      lead,
      variant: postVariant,
    })

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black uppercase tracking-wide text-white">
          Messages & outreach
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Deterministic templates using your venue data. You send messages
          yourself — this system does not automate outreach.
        </p>
      </header>

      <div className={`${sectionClass} grid gap-3 sm:grid-cols-2`}>
        <div>
          <label className={labelClass}>Lead context</label>
          <select
            className={fieldClass}
            value={leadId}
            onChange={(e) => setLeadId(e.target.value)}
          >
            <option value="">Select a lead</option>
            {workspace.leads.map((item) => (
              <option key={item.id} value={item.id}>
                {item.company || "Untitled"} — {item.contactName || "contact"}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Enquiry tone</label>
          <select
            className={fieldClass}
            value={tone}
            onChange={(e) => setTone(e.target.value as MessageTone)}
          >
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="concise">Concise</option>
          </select>
        </div>
      </div>

      <MessageBlock
        title="Corporate enquiry response"
        subject={enquiry?.subject}
        body={enquiry?.body}
        empty="Select a lead to generate an enquiry reply."
      />

      <section className={`${sectionClass} space-y-3`}>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-lg font-bold text-white">Outreach generator</h2>
          <select
            className={fieldClass + " max-w-xs"}
            value={outreachVariant}
            onChange={(e) =>
              setOutreachVariant(e.target.value as OutreachVariant)
            }
          >
            <option value="initial">Initial corporate outreach</option>
            <option value="follow_up_1">Follow-up 1</option>
            <option value="follow_up_2">Follow-up 2</option>
            <option value="christmas">Christmas party</option>
            <option value="summer">Summer social</option>
            <option value="away_day">Team away day</option>
            <option value="employee_reward">Employee reward</option>
            <option value="new_team">New-team social</option>
          </select>
        </div>
        <p className={helpClass}>
          Reusable messages for proactive outreach. Avoid spammy language — you
          choose who receives them.
        </p>
        <MessageBlock
          title=""
          subject={outreach.subject}
          body={outreach.body}
          bare
        />
      </section>

      <MessageBlock
        title="Booking confirmation"
        subject={confirmation ? confirmation.subject : undefined}
        body={confirmation ? confirmation.body : undefined}
        empty="Select a booked lead (or any lead) to draft confirmation copy."
      />

      <MessageBlock
        title="Pre-event reminder"
        subject={reminder ? reminder.subject : undefined}
        body={reminder ? reminder.body : undefined}
        empty="Select a lead to draft a reminder."
      />

      <section className={`${sectionClass} space-y-3`}>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-lg font-bold text-white">Post-event follow-up</h2>
          <select
            className={fieldClass + " max-w-xs"}
            value={postVariant}
            onChange={(e) =>
              setPostVariant(e.target.value as PostEventVariant)
            }
          >
            <option value="thank_you">Thank-you email</option>
            <option value="feedback">Feedback request</option>
            <option value="review">Review request</option>
            <option value="repeat">Repeat booking</option>
            <option value="referral">Referral introduction</option>
          </select>
        </div>
        <MessageBlock
          title=""
          subject={postEvent ? postEvent.subject : undefined}
          body={postEvent ? postEvent.body : undefined}
          empty="Select a lead to draft post-event messages."
          bare
        />
      </section>

      <section className={`${sectionClass} space-y-4`}>
        <h2 className="text-lg font-bold text-white">
          Objection / FAQ response library
        </h2>
        <p className={helpClass}>
          Answers use your configured policies. If missing, we show “Add your
          venue policy” instead of inventing one.
        </p>
        {FAQ_PROMPTS.map((item) => {
          const resolved = resolveFaqAnswer(workspace, item.key)
          return (
            <div key={item.key} className="space-y-2 border-t border-zinc-800 pt-4">
              <p className="text-sm font-semibold text-white">{item.question}</p>
              <textarea
                className={fieldClass}
                rows={3}
                value={workspace.faqResponses[item.key] || ""}
                placeholder={
                  resolved.configured
                    ? resolved.answer
                    : "Add your venue policy"
                }
                onChange={(e) =>
                  onChange({
                    ...workspace,
                    faqResponses: {
                      ...workspace.faqResponses,
                      [item.key]: e.target.value,
                    },
                  })
                }
              />
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-zinc-500">
                  Current answer:{" "}
                  {resolved.configured
                    ? "configured"
                    : "Add your venue policy"}
                </p>
                <CopyButton text={resolved.answer} label="Copy answer" />
              </div>
            </div>
          )
        })}
      </section>
    </div>
  )
}

function MessageBlock({
  title,
  subject,
  body,
  empty,
  bare = false,
}: {
  title: string
  subject?: string
  body?: string
  empty?: string
  bare?: boolean
}) {
  const content = (
    <>
      {!subject && !body ? (
        <p className="text-sm text-zinc-500">{empty}</p>
      ) : (
        <>
          {subject && (
            <p className="text-sm text-zinc-300">
              <span className="text-zinc-500">Subject:</span> {subject}
            </p>
          )}
          <pre className="whitespace-pre-wrap rounded-md border border-zinc-800 bg-[#121212] p-3 font-sans text-sm text-zinc-200">
            {body}
          </pre>
          <CopyButton
            text={[subject ? `Subject: ${subject}` : "", body || ""]
              .filter(Boolean)
              .join("\n\n")}
          />
        </>
      )}
    </>
  )

  if (bare) return <div className="space-y-3">{content}</div>
  return (
    <section className={`${sectionClass} space-y-3`}>
      {title ? <h2 className="text-lg font-bold text-white">{title}</h2> : null}
      {content}
    </section>
  )
}
