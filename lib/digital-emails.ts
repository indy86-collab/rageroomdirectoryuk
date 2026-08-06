import "server-only"
import { Resend } from "resend"
import {
  type DigitalProduct,
  getFulfilmentProducts,
} from "@/lib/digital-products"
import { createDownloadToken } from "@/lib/download-token"
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
  if (!links.length) {
    console.warn("No fulfilment files for purchase email", purchasedProduct.id)
    return { sent: false as const, reason: "no_files" }
  }

  const linkHtml = links
    .map(
      (link) =>
        `<p style="margin:16px 0"><a href="${link.url}" style="display:inline-block;background:#f97316;color:#fff;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:6px">${link.label}</a></p>`
    )
    .join("")

  const { error } = await resend.emails.send({
    from: getFromAddress(),
    to: toEmail,
    subject: `Your download: ${purchasedProduct.name}`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;color:#18181b">
        <h1 style="font-size:22px">Thanks for your purchase</h1>
        <p>Your <strong>${purchasedProduct.name}</strong> is ready.</p>
        ${linkHtml}
        <p style="color:#52525b;font-size:14px">These secure links expire in 72 hours. Save a copy of each file after downloading — the files themselves are yours to keep.</p>
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
        <h1 style="font-size:22px">Your download isn’t unlocked yet</h1>
        <p>You started checkout for <strong>${purchasedProduct.name}</strong> (${purchasedProduct.priceLabel}) but didn’t finish payment.</p>
        <p style="margin:24px 0"><a href="${cancelUrl}" style="display:inline-block;background:#f97316;color:#fff;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:6px">Complete purchase — ${purchasedProduct.priceLabel}</a></p>
        <p style="color:#52525b;font-size:14px">Stripe checkout · Instant download · No venue booking required.</p>
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

const LEAD_MAGNET_PDF_PATH =
  "/digital-products/rage-room-first-visit-prep-pack-sample.pdf?v=5&source=lead-magnet"

export async function sendLeadMagnetEmail({
  toEmail,
}: {
  toEmail: string
}) {
  const resend = getResendClient()
  if (!resend) {
    console.warn("RESEND_API_KEY missing — skipping lead magnet email")
    return { sent: false as const, reason: "missing_api_key" as const }
  }

  const downloadUrl = absoluteUrl(LEAD_MAGNET_PDF_PATH)
  const firstVisitUrl = absoluteUrl(
    "/digital-downloads/rage-room-first-visit-prep-pack"
  )
  const partyUrl = absoluteUrl("/digital-downloads/rage-room-party-planner-pack")
  const hubUrl = absoluteUrl("/digital-downloads")

  const audienceId = process.env.RESEND_AUDIENCE_ID?.trim()
  if (audienceId) {
    try {
      await resend.contacts.create({
        email: toEmail,
        audienceId,
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
    subject: "Your free rage room first-visit checklist",
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;color:#18181b">
        <h1 style="font-size:22px">Your free checklist is ready</h1>
        <p>Here’s a free sample from our First Visit Prep Pack — use it to arrive ready for your first smash session.</p>
        <p style="margin:24px 0"><a href="${downloadUrl}" style="display:inline-block;background:#f97316;color:#fff;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:6px">Download free checklist (PDF)</a></p>
        <p>Want the full printable pack (what happens, what to wear, venue questions, arrival checklist)?</p>
        <p style="margin:16px 0"><a href="${firstVisitUrl}">First Visit Prep Pack — £5</a></p>
        <p style="margin:16px 0"><a href="${partyUrl}">Planning a group night? Party Planner Pack — £7</a></p>
        <p style="color:#52525b;font-size:14px"><a href="${hubUrl}">Browse all digital guides</a></p>
        <p style="color:#52525b;font-size:14px">You’re getting this because you asked for the free checklist on RageRoom Directory. Reply anytime to unsubscribe.</p>
      </div>
    `,
  })

  if (error) {
    console.error("Lead magnet email failed", error)
    return { sent: false as const, reason: "send_failed" as const }
  }

  return { sent: true as const, downloadUrl }
}
