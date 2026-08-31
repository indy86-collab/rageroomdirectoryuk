import { getDigitalProduct } from "@/lib/digital-products"
import { escapeEmailHtml } from "@/lib/listing-submissions"
import { absoluteUrl } from "@/lib/site-url"

export function buildLeadMagnetEmailHtml({
  firstName,
  downloadUrl,
  marketingOptIn,
}: {
  firstName?: string
  downloadUrl: string
  marketingOptIn: boolean
}) {
  const directoryUrl = absoluteUrl("/listings")
  const hubUrl = absoluteUrl("/digital-downloads")
  const party = getDigitalProduct("rage-room-party-planner")!
  const gift = getDigitalProduct("rage-room-gift-voucher-template-pack")!
  const partyUrl = absoluteUrl(`/digital-downloads/${party.slug}`)
  const giftUrl = absoluteUrl(`/digital-downloads/${gift.slug}`)
  const safeName = firstName?.trim() ? escapeEmailHtml(firstName.trim()) : ""
  const greeting = safeName ? `Hi ${safeName},` : "Hi,"

  const marketingBlock = marketingOptIn
    ? `<div style="margin:28px 0;padding:16px;border:1px solid #e4e4e7;border-radius:8px">
        <p style="margin:0 0 8px;font-weight:700">Organising a group night?</p>
        <p style="margin:0 0 12px">The ${escapeEmailHtml(party.name)} (${escapeEmailHtml(party.priceLabel)}) covers budget, RSVPs and invites.</p>
        <p style="margin:0 0 12px"><a href="${partyUrl}" style="color:#ea580c;font-weight:600">Get the Party Planner — ${escapeEmailHtml(party.priceLabel)}</a></p>
        <p style="margin:0;color:#52525b;font-size:14px">Giving it as a gift? <a href="${giftUrl}" style="color:#ea580c;font-weight:600">Printable voucher templates — ${escapeEmailHtml(gift.priceLabel)}</a></p>
      </div>`
    : ""

  const footer = marketingOptIn
    ? `<p style="color:#52525b;font-size:14px">You’re getting this because you asked for the free prep pack and opted in to planning tips. Reply anytime if you need help.</p>`
    : `<p style="color:#52525b;font-size:14px">You’re getting this because you asked for the free prep pack. This email is transactional. Reply anytime if you need help.</p>`

  return `
      <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;color:#18181b">
        <h1 style="font-size:22px">Your prep pack is ready</h1>
        <p>${greeting}</p>
        <p>Here’s your free Rage Room First Visit Prep Pack — what happens, what to wear, what to ask before you book, and a final arrival checklist.</p>
        <p style="margin:24px 0"><a href="${downloadUrl}" style="display:inline-block;background:#f97316;color:#fff;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:6px">Download Prep Pack (PDF)</a></p>
        ${marketingBlock}
        <p style="margin:16px 0"><a href="${directoryUrl}">Find a rage room near you</a></p>
        <p style="color:#52525b;font-size:14px"><a href="${hubUrl}">Browse other digital guides</a> on RageRoom Directory.</p>
        ${footer}
      </div>
    `
}
