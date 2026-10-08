import voucherData from "@/data/gift-vouchers.json"
import {
  AWIN_MERCHANTS,
  AWIN_MERCHANT_INFO,
  buildAwinDeepLink,
  isAwinMerchantConfigured,
  isMerchantDestination,
  merchantLandingUrl,
  readAwinConfig,
  type AwinConfig,
  type AwinMerchant,
} from "@/lib/awin"

export type GiftVoucherProduct = {
  id: string
  merchant: AwinMerchant
  title: string
  url: string
  /** Directory listing slug when the voucher is for that exact venue. */
  venueSlug?: string | null
  city?: string | null
  region?: string | null
  /** Voucher redeemable at several UK locations. */
  nationwide?: boolean
  people?: number | null
}

export type GiftVoucherMatch = "venue" | "city" | "region" | "nationwide" | "browse"

export type GiftVoucherOffer = {
  id: string
  merchant: AwinMerchant
  merchantName: string
  title: string
  href: string
  match: GiftVoucherMatch
  people?: number | null
  location?: string | null
}

export const GIFT_VOUCHER_PRODUCTS = voucherData as GiftVoucherProduct[]

const same = (a?: string | null, b?: string | null) =>
  Boolean(a && b && a.trim().toLowerCase() === b.trim().toLowerCase())

export function validateGiftVoucherProducts(products: GiftVoucherProduct[]): string[] {
  const errors: string[] = []
  const ids = new Set<string>()
  for (const p of products) {
    if (!p.id || ids.has(p.id)) errors.push(`duplicate or missing id: ${p.id}`)
    ids.add(p.id)
    if (!(AWIN_MERCHANTS as readonly string[]).includes(p.merchant)) errors.push(`${p.id}: unknown merchant`)
    else if (!isMerchantDestination(p.merchant, p.url)) errors.push(`${p.id}: url is not on the merchant domain`)
    if (!p.title?.trim()) errors.push(`${p.id}: missing title`)
    if (!p.venueSlug && !p.city && !p.region && !p.nationwide) errors.push(`${p.id}: no location`)
  }
  return errors
}

const MATCH_ORDER: GiftVoucherMatch[] = ["venue", "city", "region", "nationwide"]

/**
 * Venue → city → region → nationwide product vouchers, then merchant-level
 * browse links. Only merchants configured in Awin are returned.
 */
export function selectGiftVoucherOffers(
  context: { venueSlug?: string | null; city?: string | null; region?: string | null; placement: string },
  limit = 3,
  config: AwinConfig = readAwinConfig(),
  products: GiftVoucherProduct[] = GIFT_VOUCHER_PRODUCTS
): GiftVoucherOffer[] {
  const matchOf = (p: GiftVoucherProduct): GiftVoucherMatch | null =>
    context.venueSlug && p.venueSlug === context.venueSlug ? "venue"
      : same(p.city, context.city) ? "city"
      : same(p.region, context.region) ? "region"
      : p.nationwide ? "nationwide"
      : null

  const clickref = (id: string) => `${context.placement}_${id}`
  const offers: GiftVoucherOffer[] = []
  const ranked = products
    .map((p) => ({ p, match: matchOf(p) }))
    .filter((x): x is { p: GiftVoucherProduct; match: Exclude<GiftVoucherMatch, "browse"> } => x.match !== null)
    .sort((a, b) => MATCH_ORDER.indexOf(a.match) - MATCH_ORDER.indexOf(b.match))

  for (const { p, match } of ranked) {
    const href = buildAwinDeepLink(config, p.merchant, p.url, clickref(p.id))
    if (!href) continue
    offers.push({
      id: p.id, merchant: p.merchant, merchantName: AWIN_MERCHANT_INFO[p.merchant].name,
      title: p.title, href, match, people: p.people ?? null,
      location: p.nationwide ? "Multiple UK locations" : p.city || p.region || null,
    })
    if (offers.length >= limit) return offers
  }

  for (const merchant of AWIN_MERCHANTS) {
    if (offers.length >= limit) break
    if (!isAwinMerchantConfigured(config, merchant)) continue
    if (offers.some((o) => o.merchant === merchant)) continue
    const id = `browse-${merchant}`
    const href = buildAwinDeepLink(config, merchant, merchantLandingUrl(config, merchant), clickref(id))
    if (!href) continue
    offers.push({
      id, merchant, merchantName: AWIN_MERCHANT_INFO[merchant].name,
      title: `Browse experience gifts at ${AWIN_MERCHANT_INFO[merchant].name}`, href, match: "browse",
    })
  }
  return offers
}
