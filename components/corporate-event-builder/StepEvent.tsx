"use client"

import {
  EVENT_PURPOSES,
  type CorporateEvent,
  type EventPurpose,
} from "@/lib/corporate-event-builder"
import { fieldClass, helpClass, labelClass, sectionClass } from "./fieldStyles"

type StepEventProps = {
  event: CorporateEvent
  onChange: (patch: Partial<CorporateEvent>) => void
}

export default function StepEvent({ event, onChange }: StepEventProps) {
  return (
    <div className="space-y-4">
      <div className={sectionClass}>
        <h2 className="text-lg font-bold text-white">Company / team</h2>
        <p className={helpClass}>
          Used in your event summary, approval request and invitations.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="companyName">
              Company / team name
            </label>
            <input
              id="companyName"
              className={fieldClass}
              value={event.companyName}
              onChange={(e) => onChange({ companyName: e.target.value })}
              placeholder="Acme Engineering"
              autoComplete="organization"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="organiserName">
              Organiser name
            </label>
            <input
              id="organiserName"
              className={fieldClass}
              value={event.organiserName}
              onChange={(e) => onChange({ organiserName: e.target.value })}
              placeholder="Alex Organiser"
              autoComplete="name"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="attendeeCount">
              Number of attendees
            </label>
            <input
              id="attendeeCount"
              type="number"
              inputMode="numeric"
              min={1}
              className={fieldClass}
              value={event.attendeeCount || ""}
              onChange={(e) =>
                onChange({
                  attendeeCount: Math.max(0, Number(e.target.value) || 0),
                })
              }
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="organiserContact">
              Organiser contact (optional)
            </label>
            <input
              id="organiserContact"
              className={fieldClass}
              value={event.organiserContact}
              onChange={(e) => onChange({ organiserContact: e.target.value })}
              placeholder="email or phone for invites"
              autoComplete="email"
            />
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <h2 className="text-lg font-bold text-white">Event details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="location">
              Preferred city / location
            </label>
            <input
              id="location"
              className={fieldClass}
              value={event.location}
              onChange={(e) => onChange({ location: e.target.value })}
              placeholder="London"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="eventDate">
              Preferred date
            </label>
            <input
              id="eventDate"
              type="date"
              className={fieldClass}
              value={event.eventDate}
              onChange={(e) => onChange({ eventDate: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="startTime">
              Approximate start time
            </label>
            <input
              id="startTime"
              type="time"
              className={fieldClass}
              value={event.startTime}
              onChange={(e) => onChange({ startTime: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="arrivalTime">
              Arrival time
            </label>
            <input
              id="arrivalTime"
              type="time"
              className={fieldClass}
              value={event.arrivalTime}
              onChange={(e) => onChange({ arrivalTime: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="purpose">
              Event purpose
            </label>
            <select
              id="purpose"
              className={fieldClass}
              value={event.purpose}
              onChange={(e) =>
                onChange({ purpose: e.target.value as EventPurpose | "" })
              }
            >
              {EVENT_PURPOSES.map((purpose) => (
                <option key={purpose} value={purpose}>
                  {purpose}
                </option>
              ))}
            </select>
          </div>
          {event.purpose === "Other" && (
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="purposeOther">
                Describe the purpose
              </label>
              <input
                id="purposeOther"
                className={fieldClass}
                value={event.purposeOther}
                onChange={(e) => onChange({ purposeOther: e.target.value })}
              />
            </div>
          )}
        </div>
        <p className={`${helpClass} mt-3`}>
          Rage rooms are entertainment / team-social experiences. Confirm safety,
          age, clothing and accessibility details directly with your chosen venue.
        </p>
      </div>
    </div>
  )
}
