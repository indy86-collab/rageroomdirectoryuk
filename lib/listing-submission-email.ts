import "server-only"
import { Resend } from "resend"
import {
  escapeEmailHtml,
  type ListingSubmission,
} from "@/lib/listing-submissions"

function row(label: string, value: string | number | null | string[]) {
  const display = Array.isArray(value) ? value.join("\n") : String(value ?? "")
  if (!display.trim()) return ""
  return `<tr><th style="text-align:left;vertical-align:top;padding:6px 12px 6px 0">${escapeEmailHtml(label)}</th><td style="padding:6px 0;white-space:pre-wrap">${escapeEmailHtml(display)}</td></tr>`
}

export async function sendListingSubmissionEmail(data: ListingSubmission) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn("RESEND_API_KEY missing — listing submission not sent")
    return { sent: false as const, reason: "missing_api_key" as const }
  }

  const resend = new Resend(apiKey)
  const to =
    process.env.LISTING_SUBMISSIONS_TO?.trim() || "ukrageroom@gmail.com"
  const from =
    process.env.EMAIL_FROM || "RageRoom Directory <onboarding@resend.dev>"
  const subject = `[Listing ${data.requestType}] ${data.businessName} — ${data.city}`
  const rows = [
    row("Request", data.requestType),
    row("Listing slug", data.listingSlug),
    row("Business", data.businessName),
    row("Contact", data.contactName),
    row("Work email", data.workEmail),
    row("Website", data.website),
    row("Booking URL", data.bookingUrl),
    row("Phone", data.phone),
    row("City", data.city),
    row("Postcode", data.postcode),
    row("Starting price", data.priceFrom),
    row("Price unit", data.priceUnit),
    row("Minimum age", data.ageMin),
    row("Opening hours", data.openingHours),
    row("Packages", data.packages),
    row("Session lengths", data.sessionLengths.map((value) => `${value} minutes`)),
    row("Group size", [data.groupSizeMin, data.groupSizeMax].filter((value) => value != null).map(String)),
    row("Features", data.features),
    row("Activities", data.activities),
    row("Occasions", data.occasions),
    row("Walk-ins accepted", data.walkInsAccepted == null ? "Not specified" : data.walkInsAccepted ? "Yes" : "No"),
    row("Online booking", data.onlineBooking == null ? "Not specified" : data.onlineBooking ? "Yes" : "No"),
    row("Gift vouchers", data.giftVouchers == null ? "Not specified" : data.giftVouchers ? "Yes" : "No"),
    row("Corporate packages", data.corporatePackages == null ? "Not specified" : data.corporatePackages ? "Yes" : "No"),
    row("Private hire", data.privateHire == null ? "Not specified" : data.privateHire ? "Yes" : "No"),
    row("Accessibility", data.accessibility == null ? "Not specified" : data.accessibility ? "Yes" : "No"),
    row("Media URLs", data.mediaUrls),
    row("Source URLs", data.sourceUrls),
    row("Notes", data.notes),
  ].join("")

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: data.workEmail,
    subject,
    html: `<div style="font-family:system-ui,sans-serif;max-width:760px"><h1 style="font-size:22px">Reviewed listing submission</h1><p>This submission has <strong>not</strong> been published. Verify every factual claim and media permission before editing listings.json.</p><table style="border-collapse:collapse">${rows}</table></div>`,
  })

  if (error) {
    console.error("Listing submission email failed", error)
    return { sent: false as const, reason: "send_failed" as const }
  }
  return { sent: true as const }
}
