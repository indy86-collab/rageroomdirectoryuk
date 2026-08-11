import "server-only"
import { Resend } from "resend"
import { CORPORATE_BOOKING_SYSTEM_PRODUCT_ID } from "@/lib/corporate-booking-system/types"
import {
  type DigitalProduct,
  FIRST_VISIT_CHECKLIST_PRODUCT_ID,
  getFulfilmentProducts,
  isInteractiveDigitalProduct,
} from "@/lib/digital-products"
import { createDownloadToken, createLeadDownloadToken } from "@/lib/download-token"
import { absoluteUrl } from "@/lib/site-url"

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  return new Resend(apiKey)
}

function getFromAddress() {
  return (
    process.env.EMAIL_FROM ||
    "RageRoom Directory <onboarding@resend.dev>"
  )
}

function sessionCustomerEmail(session: {
  customer_details?: { email?: string | null } | null
  customer_email?: string | null
}) {
  return (
    session.customer_details?.email?.trim() ||
    session.customer_email?.trim() ||
    null
  )
}

export function buildDownloadLinks(
  sessionId: string,
  purchasedProduct: DigitalProduct
) {
  return getFulfilmentProducts(purchasedProduct).map((product) => {
    const token = createDownloadToken({
      sessionId,
      productId: product.id,
    })
    return {
      product,
      url: absoluteUrl(`/download/${token}`),
      label:
        product.contentType === "application/zip"
          ? `Download ${product.shortName || product.name} (ZIP)`
          : `Download ${product.shortName || product.name} (PDF)`,
    }
  })
}

export async function sendPurchaseDownloadEmail({
  sessionId,
  purchasedProduct,
  toEmail,
}: {
  sessionId: string
  purchasedProduct: DigitalProduct
  toEmail: string
}) {
  const resend = getResendClient()
  if (!resend) {
    console.warn("RESEND_API_KEY missing — skipping purchase email")
    return { sent: false as const, reason: "missing_api_key" }
  }

  const links = buildDownloadLinks(sessionId, purchasedProduct)
  const isCorporateBuilder =
    purchasedProduct.id === "corporate-team-building-toolkit"
  const isBookingSystem =
    purchasedProduct.id === CORPORATE_BOOKING_SYSTEM_PRODUCT_ID

  if (!links.length && !isInteractiveDigitalProduct(purchasedProduct)) {
    console.warn("No fulfilment files for purchase email", purchasedProduct.id)
    return { sent: false as const, reason: "no_files" }
  }

  const builderUrl = absoluteUrl(
    `/corporate-event-builder?session_id=${encodeURIComponent(sessionId)}`
  )
  const bookingSystemUrl = absoluteUrl(
    `/venue-owner/corporate-booking-system?session_id=${encodeURIComponent(sessionId)}`
  )

  const linkHtml = isBookingSystem
    ? `<p style="margin:16px 0"><a href="${bookingSystemUrl}" style="display:inline-block;background:#f97316;color:#fff;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:6px">Open Corporate Booking System</a></p>`
    : isCorporateBuilder
      ? `<p style="margin:16px 0"><a href="${builderUrl}" style="display:inline-block;background:#f97316;color:#fff;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:6px">Open Event Builder</a></p>
       ${links
         .map(
           (link) =>
             `<p style="margin:12px 0"><a href="${link.url}" style="color:#ea580c;font-weight:600">Download legacy toolkit PDF (optional, expires in 72 hours)</a></p>`
         )
         .join("")}`
      : links
          .map(
            (link) =>
              `<p style="margin:16px 0"><a href="${link.url}" style="display:inline-block;background:#f97316;color:#fff;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:6px">${link.label}</a></p>`
          )
          .join("")

  const subject = isBookingSystem
    ? `Your Corporate Booking System is ready`
    : isCorporateBuilder
      ? `Your Corporate Event Builder is ready`
      : `Your download: ${purchasedProduct.name}`

  const bodyIntro = isBookingSystem
    ? `<p>Your <strong>${purchasedProduct.name}</strong> is ready. Open the workspace to configure your venue, build corporate packages, create quotes and manage your corporate lead pipeline.</p>
       <p style="color:#52525b;font-size:14px">Bookmark the access link below. Your workspace saves on our servers for this purchase so you can return later.</p>`
    : isCorporateBuilder
      ? `<p>Your <strong>${purchasedProduct.name}</strong> is ready. Open the interactive builder to enter your event details, build the budget, shortlist venues and generate approval and invite messages.</p>
       <p style="color:#52525b;font-size:14px">Bookmark the Event Builder link below to return to your purchase access. Your plan saves in your browser. The optional PDF download link expires in 72 hours.</p>`
      : `<p>Your <strong>${purchasedProduct.name}</strong> is ready.</p>
       <p style="color:#52525b;font-size:14px">These secure links expire in 72 hours. Save a copy of each file after downloading — the files themselves are yours to keep.</p>`

  const { error } = await resend.emails.send({
    from: getFromAddress(),
    to: toEmail,
    subject,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;color:#18181b">
        <h1 style="font-size:22px">Thanks for your purchase</h1>
        ${bodyIntro}
        ${linkHtml}
        <p style="color:#52525b;font-size:14px">Questions? Reply to this email or contact us at <a href="${absoluteUrl("/contact")}">${absoluteUrl("/contact")}</a>.</p>
      </div>
    `,
  })

  if (error) {
    console.error("Purchase email failed", error)
    return { sent: false as const, reason: "send_failed" }
  }

  return { sent: true as const }
}

export async function sendAbandonedCheckoutEmail({
  purchasedProduct,
  toEmail,
}: {
  purchasedProduct: DigitalProduct
  toEmail: string
}) {
  const resend = getResendClient()
  if (!resend) {
    console.warn("RESEND_API_KEY missing — skipping abandoned checkout email")
    return { sent: false as const, reason: "missing_api_key" }
  }

  const productUrl = absoluteUrl(`/digital-downloads/${purchasedProduct.slug}`)
  const cancelUrl = absoluteUrl(
    `/checkout/cancel?product_id=${encodeURIComponent(purchasedProduct.id)}`
  )

  const { error } = await resend.emails.send({
    from: getFromAddress(),
    to: toEmail,
    subject: `Still want ${purchasedProduct.name}?`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;color:#18181b">
        <h1 style="font-size:22px">Your purchase isn’t unlocked yet</h1>
        <p>You started checkout for <strong>${purchasedProduct.name}</strong> (${purchasedProduct.priceLabel}) but didn’t finish payment.</p>
        <p style="margin:24px 0"><a href="${cancelUrl}" style="display:inline-block;background:#f97316;color:#fff;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:6px">Complete purchase — ${purchasedProduct.priceLabel}</a></p>
        <p style="color:#52525b;font-size:14px">Stripe checkout · Instant access after payment · No venue booking included.</p>
        <p style="color:#52525b;font-size:14px"><a href="${productUrl}">View what’s included</a></p>
      </div>
    `,
  })

  if (error) {
    console.error("Abandoned checkout email failed", error)
    return { sent: false as const, reason: "send_failed" }
  }

  return { sent: true as const }
}

export function getCheckoutSessionEmail(session: {
  customer_details?: { email?: string | null } | null
  customer_email?: string | null
}) {
  return sessionCustomerEmail(session)
}

export function buildFirstTimerChecklistDownloadUrl() {
  const token = createLeadDownloadToken(FIRST_VISIT_CHECKLIST_PRODUCT_ID)
  return absoluteUrl(`/download/${token}`)
}

export async function sendLeadMagnetEmail({
  toEmail,
  firstName,
  marketingOptIn = false,
  downloadUrl,
}: {
  toEmail: string
  firstName?: string
  /** Only add to Resend Audience when the user opts in separately. */
  marketingOptIn?: boolean
  downloadUrl: string
}) {
  const resend = getResendClient()
  if (!resend) {
    console.warn("RESEND_API_KEY missing — skipping lead magnet email")
    return { sent: false as const, reason: "missing_api_key" as const }
  }

  const directoryUrl = absoluteUrl("/listings")
  const hubUrl = absoluteUrl("/digital-downloads")
  const greeting = firstName?.trim()
    ? `Hi ${firstName.trim()},`
    : "Hi,"

  const audienceId = process.env.RESEND_AUDIENCE_ID?.trim()
  if (audienceId && marketingOptIn) {
    try {
      await resend.contacts.create({
        email: toEmail,
        audienceId,
        firstName: firstName?.trim() || undefined,
        unsubscribed: false,
      })
    } catch (error) {
      // Contact may already exist — still send the checklist email.
      console.warn("Lead magnet audience contact create skipped", error)
    }
  }

  const { error } = await resend.emails.send({
    from: getFromAddress(),
    to: toEmail,
    subject: "Your Rage Room First-Timer Checklist",
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;color:#18181b">
        <h1 style="font-size:22px">Your checklist is ready</h1>
        <p>${greeting}</p>
        <p>Here’s your free Rage Room First-Timer Checklist — what to wear, what to bring, what to check with the venue, and what to expect.</p>
        <p style="margin:24px 0"><a href="${downloadUrl}" style="display:inline-block;background:#f97316;color:#fff;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:6px">Download Checklist (PDF)</a></p>
        <p style="margin:16px 0"><a href="${directoryUrl}">Find a rage room near you</a></p>
        <p style="color:#52525b;font-size:14px"><a href="${hubUrl}">Browse other digital guides</a> on RageRoom Directory.</p>
        <p style="color:#52525b;font-size:14px">You’re getting this because you asked for the free checklist. This email is transactional. Reply anytime if you need help.</p>
      </div>
    `,
  })

  if (error) {
    console.error("Lead magnet email failed", error)
    return { sent: false as const, reason: "send_failed" as const }
  }

  return { sent: true as const, downloadUrl }
}
