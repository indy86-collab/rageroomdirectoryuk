"use client"

import { useEffect, useRef } from "react"
import {
  buildChatInvite,
  buildFinalReminder,
  buildTeamInvitation,
  type CorporateEvent,
  type InvitationTone,
} from "@/lib/corporate-event-builder"
import CopyButton from "./CopyButton"
import { fieldClass, helpClass, labelClass, sectionClass } from "./fieldStyles"

type StepInviteProps = {
  event: CorporateEvent
  onChange: (patch: Partial<CorporateEvent>) => void
  onGenerated?: () => void
}

const tones: { id: InvitationTone; label: string }[] = [
  { id: "professional", label: "Professional" },
  { id: "casual", label: "Casual" },
  { id: "fun", label: "Fun" },
]

export default function StepInvite({
  event,
  onChange,
  onGenerated,
}: StepInviteProps) {
  const invite = buildTeamInvitation(event)
  const chat = buildChatInvite(event)
  const reminder = buildFinalReminder(event)
  const tracked = useRef(false)

  useEffect(() => {
    if (!tracked.current) {
      tracked.current = true
      onGenerated?.()
    }
  }, [onGenerated])

  return (
    <div className="space-y-4">
      <div className={sectionClass}>
        <h2 className="text-lg font-bold text-white">Invitation details</h2>
        <p className={helpClass}>
          Fill these to personalise invites and reminders. Venue-specific safety
          rules should come from the venue.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="selectedVenueName">
              Venue name
            </label>
            <input
              id="selectedVenueName"
              className={fieldClass}
              value={event.selectedVenueName}
              onChange={(e) => onChange({ selectedVenueName: e.target.value })}
              placeholder="Selected or shortlisted venue"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="rsvpDeadline">
              RSVP deadline
            </label>
            <input
              id="rsvpDeadline"
              className={fieldClass}
              value={event.rsvpDeadline}
              onChange={(e) => onChange({ rsvpDeadline: e.target.value })}
              placeholder="e.g. 10 September"
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="selectedVenueAddress">
              Venue address
            </label>
            <input
              id="selectedVenueAddress"
              className={fieldClass}
              value={event.selectedVenueAddress}
              onChange={(e) =>
                onChange({ selectedVenueAddress: e.target.value })
              }
              placeholder="Optional — confirm with venue"
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="clothingReminder">
              Clothing reminder
            </label>
            <input
              id="clothingReminder"
              className={fieldClass}
              value={event.clothingReminder}
              onChange={(e) => onChange({ clothingReminder: e.target.value })}
            />
          </div>
        </div>
        <div className="mt-4">
          <p className={labelClass}>Tone</p>
          <div className="flex flex-wrap gap-2">
            {tones.map((tone) => (
              <button
                key={tone.id}
                type="button"
                onClick={() => onChange({ invitationTone: tone.id })}
                className={`min-h-[40px] rounded-md border px-3 py-2 text-sm font-semibold ${
                  event.invitationTone === tone.id
                    ? "border-rage-500 bg-rage-500/15 text-white"
                    : "border-zinc-700 text-zinc-300"
                }`}
              >
                {tone.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-white">Team invitation email</h2>
          <CopyButton
            text={`Subject: ${invite.subject}\n\n${invite.body}`}
            label="Copy invitation"
          />
        </div>
        <div className="mt-4 rounded-md border border-zinc-800 bg-[#121212] p-4 text-sm text-zinc-200">
          <p className="mb-3">
            <span className="text-zinc-500">Subject:</span> {invite.subject}
          </p>
          <pre className="whitespace-pre-wrap leading-relaxed">{invite.body}</pre>
        </div>
      </div>

      <div className={sectionClass}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white">
              Slack / Teams / WhatsApp
            </h2>
            <p className={helpClass}>Short version for chat channels.</p>
          </div>
          <CopyButton text={chat} label="Copy chat invite" />
        </div>
        <pre className="mt-4 whitespace-pre-wrap rounded-md border border-zinc-800 bg-[#121212] p-4 text-sm text-zinc-200">
          {chat}
        </pre>
      </div>

      <div className={sectionClass}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white">
              Final reminder (24–48 hours before)
            </h2>
            <p className={helpClass}>
              Add booking reference and travel notes below if you have them.
            </p>
          </div>
          <CopyButton
            text={`Subject: ${reminder.subject}\n\n${reminder.body}`}
            label="Copy reminder"
          />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="bookingReference">
              Booking reference
            </label>
            <input
              id="bookingReference"
              className={fieldClass}
              value={event.bookingReference}
              onChange={(e) => onChange({ bookingReference: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="travelInfo">
              Travel information
            </label>
            <input
              id="travelInfo"
              className={fieldClass}
              value={event.travelInfo}
              onChange={(e) => onChange({ travelInfo: e.target.value })}
              placeholder="Parking / station / meetup point"
            />
          </div>
        </div>
        <pre className="mt-4 whitespace-pre-wrap rounded-md border border-zinc-800 bg-[#121212] p-4 text-sm text-zinc-200">
          {`Subject: ${reminder.subject}\n\n${reminder.body}`}
        </pre>
      </div>
    </div>
  )
}
