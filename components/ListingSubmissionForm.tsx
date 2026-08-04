"use client"

import { FormEvent, useState } from "react"
import { LISTING_FEATURES } from "@/types/listing"

const FEATURE_LABELS: Record<(typeof LISTING_FEATURES)[number], string> = {
  "byo-smashables": "Bring your own smashables",
  "corporate-groups": "Corporate groups",
  "birthday-parties": "Birthday parties",
  "hen-stag-parties": "Hen and stag groups",
  couples: "Couples",
  "mobile-experience": "Mobile experience",
  "accessible-venue": "Accessible venue",
  "video-recording": "Session video available",
}

export default function ListingSubmissionForm({
  initialListingSlug = "",
  initialRequestType = "new",
}: {
  initialListingSlug?: string
  initialRequestType?: "new" | "claim" | "correction"
}) {
  const [status, setStatus] = useState<
    { type: "idle" | "loading" | "success" | "error"; message?: string }
  >({ type: "idle" })

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const payload = Object.fromEntries(formData.entries()) as Record<string, unknown>
    payload.features = formData.getAll("features")
    payload.consent = formData.get("consent") === "on"
    setStatus({ type: "loading" })

    try {
      const response = await fetch("/api/listing-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const result = (await response.json()) as { error?: string; message?: string }
      if (!response.ok) throw new Error(result.error || "Unable to send submission")
      setStatus({ type: "success", message: result.message })
      form.reset()
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Unable to send submission",
      })
    }
  }

  const inputClass =
    "mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white placeholder:text-zinc-600 focus:border-orange-500 focus:outline-none"
  const labelClass = "text-sm font-semibold text-zinc-200"

  return (
    <form onSubmit={submit} className="space-y-6" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          Request type
          <select name="requestType" defaultValue={initialRequestType} className={inputClass}>
            <option value="new">Add a new venue</option>
            <option value="claim">Claim an existing listing</option>
            <option value="correction">Correct an existing listing</option>
          </select>
        </label>
        <label className={labelClass}>
          Existing listing slug
          <input
            name="listingSlug"
            defaultValue={initialListingSlug}
            placeholder="venue-name-city"
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Business name *
          <input name="businessName" required maxLength={160} className={inputClass} />
        </label>
        <label className={labelClass}>
          Your name *
          <input name="contactName" required maxLength={160} className={inputClass} />
        </label>
        <label className={labelClass}>
          Work email *
          <input name="workEmail" type="email" required maxLength={200} className={inputClass} />
        </label>
        <label className={labelClass}>
          Phone
          <input name="phone" type="tel" maxLength={50} className={inputClass} />
        </label>
        <label className={labelClass}>
          City *
          <input name="city" required maxLength={100} className={inputClass} />
        </label>
        <label className={labelClass}>
          UK postcode *
          <input name="postcode" required maxLength={20} className={inputClass} />
        </label>
        <label className={labelClass}>
          Website
          <input name="website" type="url" placeholder="https://" className={inputClass} />
        </label>
        <label className={labelClass}>
          Direct booking link
          <input name="bookingUrl" type="url" placeholder="https://" className={inputClass} />
        </label>
        <label className={labelClass}>
          Starting price per person (£)
          <input name="priceFrom" type="number" min="0" max="1000" step="0.01" className={inputClass} />
        </label>
        <label className={labelClass}>
          Minimum age
          <input name="ageMin" type="number" min="1" max="100" className={inputClass} />
        </label>
        <label className={labelClass}>
          Session lengths in minutes
          <input name="sessionLengths" placeholder="15, 30, 60" className={inputClass} />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className={labelClass}>
            Min group size
            <input name="groupSizeMin" type="number" min="1" max="500" className={inputClass} />
          </label>
          <label className={labelClass}>
            Max group size
            <input name="groupSizeMax" type="number" min="1" max="500" className={inputClass} />
          </label>
        </div>
      </div>

      <label className={labelClass}>
        Opening hours
        <textarea name="openingHours" rows={3} placeholder="Monday: closed&#10;Tuesday: 17:00–22:00" className={inputClass} />
      </label>
      <label className={labelClass}>
        Packages
        <textarea name="packages" rows={4} placeholder="Package name, price, duration and what is included" className={inputClass} />
      </label>

      <fieldset>
        <legend className={labelClass}>Suitable for / available features</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {LISTING_FEATURES.map((feature) => (
            <label key={feature} className="flex items-center gap-2 text-sm text-zinc-300">
              <input name="features" type="checkbox" value={feature} className="accent-orange-500" />
              {FEATURE_LABELS[feature]}
            </label>
          ))}
        </div>
      </fieldset>

      <label className={labelClass}>
        Authorised photo or video URLs
        <textarea name="mediaUrls" rows={3} placeholder="One URL per line. Do not submit media you cannot authorise us to use." className={inputClass} />
      </label>
      <label className={labelClass}>
        Source URLs
        <textarea name="sourceUrls" rows={3} placeholder="Pages that confirm prices, ages, packages or opening hours" className={inputClass} />
      </label>
      <label className={labelClass}>
        Additional notes
        <textarea name="notes" rows={4} className={inputClass} />
      </label>

      <div className="absolute -left-[10000px]" aria-hidden="true">
        <label>
          Leave this field empty
          <input name="websiteUrl" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="flex items-start gap-3 text-sm text-zinc-300">
        <input name="consent" type="checkbox" required className="mt-1 accent-orange-500" />
        <span>
          I confirm the information is accurate and I have permission to share any submitted media. I understand every change is manually reviewed before publication.
        </span>
      </label>

      {status.type === "success" && (
        <p role="status" className="rounded-md border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-300">
          {status.message}
        </p>
      )}
      {status.type === "error" && (
        <p role="alert" className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          {status.message}
        </p>
      )}

      <button
        type="submit"
        disabled={status.type === "loading"}
        className="btn-rage inline-flex min-h-[44px] items-center justify-center px-6 text-sm uppercase tracking-wider disabled:cursor-wait disabled:opacity-60"
      >
        {status.type === "loading" ? "Sending…" : "Send for editorial review"}
      </button>
    </form>
  )
}
