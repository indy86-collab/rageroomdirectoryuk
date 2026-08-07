import path from "path"

export type DigitalProduct = {
  id: string
  slug: string
  name: string
  shortName?: string
  analyticsItemId: string
  itemCategory: "Digital Product"
  priceLabel: string
  unitAmount: number
  /** Pre-sale / compare-at price for strikethrough marketing. */
  compareAtLabel?: string
  compareAtAmount?: number
  currency: "gbp"
  stripeLookupKey: string
  /** Present for single-file products; omitted for bundles. */
  filePath?: string
  downloadFilename?: string
  contentType?: string
  /** Child product IDs fulfilled when this bundle is purchased. */
  bundleProductIds?: string[]
  marketingImage?: string
  /** In-page sample page thumbnails (static PNGs). */
  previewImages?: string[]
  previewPdf?: string
  /** Full pack page count (PDF products) — used in sample unlock copy. */
  pageCount?: number
  /** What the paid pack unlocks beyond the free sample. */
  sampleUnlockHint?: string
  description: string
  includedSections: string[]
  checkoutBlurb: string
}

export function formatGbpFromPence(unitAmount: number) {
  const pounds = unitAmount / 100
  if (Number.isInteger(pounds)) return `£${pounds}`
  return `£${pounds.toFixed(2)}`
}

export const digitalProducts: Record<string, DigitalProduct> = {
  "rage-room-party-planner": {
    id: "rage-room-party-planner",
    slug: "rage-room-party-planner-pack",
    name: "Rage Room Party Planner Pack",
    analyticsItemId: "rage_party_planner_pack",
    itemCategory: "Digital Product",
    priceLabel: "£5.60",
    unitAmount: 560,
    compareAtLabel: "£7",
    compareAtAmount: 700,
    currency: "gbp",
    stripeLookupKey: "rage_room_party_planner_pack_gbp_560",
    filePath: path.join(
      process.cwd(),
      "private/digital-downloads/rage-room-party-planner-pack.pdf"
    ),
    downloadFilename: "rage-room-party-planner-pack.pdf",
    contentType: "application/pdf",
    marketingImage: "/digital-products/rage-room-party-planner-pack-cover.png",
    previewImages: [
      "/digital-products/rage-room-party-planner-pack-page-1.png?v=4",
      "/digital-products/rage-room-party-planner-pack-page-2.png?v=4",
      "/digital-products/rage-room-party-planner-pack-page-3.png?v=4",
    ],
    previewPdf: "/digital-products/rage-room-party-planner-pack-sample.pdf?v=5",
    pageCount: 15,
    sampleUnlockHint:
      "Sample preview (2 pages) — full pack unlocks all 15 planning pages.",
    description:
      "A printable UK planning kit for rage room birthdays, date nights, breakup nights, group nights, stag and hen activities, and friends' nights out.",
    checkoutBlurb:
      "Limited-time 20% demand drop already applied. Instant PDF planning pack only — not a venue booking.",
    includedSections: [
      "Event snapshot",
      "Planning timeline",
      "Budget planner",
      "Venue scorecard",
      "Booking questions",
      "RSVP tracker",
      "Invitation templates",
      "What-to-wear and safety checklist",
      "Itinerary/travel planner",
      "Food and after-party planner",
      "Photo/video shot list",
      "Smash night games",
      "Mini invites",
      "Final booking checklist",
    ],
  },
  "corporate-team-building-toolkit": {
    id: "corporate-team-building-toolkit",
    slug: "corporate-rage-room-team-building-toolkit",
    name: "Corporate Rage Room Team-Building Toolkit",
    shortName: "Corporate Team-Building Toolkit",
    analyticsItemId: "corporate_team_building_pack",
    itemCategory: "Digital Product",
    priceLabel: "£15.20",
    unitAmount: 1520,
    compareAtLabel: "£19",
    compareAtAmount: 1900,
    currency: "gbp",
    stripeLookupKey: "corporate_rage_room_team_building_toolkit_gbp_1520",
    filePath: path.join(
      process.cwd(),
      "private/digital-downloads/corporate-rage-room-team-building-toolkit.pdf"
    ),
    downloadFilename: "corporate-rage-room-team-building-toolkit.pdf",
    contentType: "application/pdf",
    marketingImage:
      "/digital-products/corporate-rage-room-team-building-toolkit-cover.png",
    previewImages: [
      "/digital-products/corporate-rage-room-team-building-toolkit-page-1.png?v=4",
      "/digital-products/corporate-rage-room-team-building-toolkit-page-2.png?v=4",
      "/digital-products/corporate-rage-room-team-building-toolkit-page-3.png?v=4",
    ],
    previewPdf:
      "/digital-products/corporate-rage-room-team-building-toolkit-sample.pdf?v=5",
    pageCount: 16,
    sampleUnlockHint:
      "Sample preview (2 pages) — full pack unlocks all 16 HR-ready pages.",
    description:
      "A professional planning pack for HR teams, office managers, founders and team leads planning a rage room team-building event.",
    checkoutBlurb:
      "Limited-time 20% demand drop already applied. Instant PDF toolkit only — not a venue booking.",
    includedSections: [
      "Why rage rooms work",
      "Internal planning checklist",
      "Venue comparison scorecard",
      "Budget approval worksheet",
      "Internal approval email",
      "Staff invite email",
      "Event schedule / run sheet",
      "Safety questions for the venue",
      "Group size and session plan",
      "Risk and logistics checklist",
      "Post-event feedback form",
      "Team reflection worksheet",
      "ROI and goals worksheet",
      "Final booking checklist",
    ],
  },
  "rage-room-first-visit-prep": {
    id: "rage-room-first-visit-prep",
    slug: "rage-room-first-visit-prep-pack",
    name: "Rage Room First Visit Prep Pack",
    shortName: "First Visit Prep Pack",
    analyticsItemId: "rage_first_visit_prep_pack",
    itemCategory: "Digital Product",
    priceLabel: "£4",
    unitAmount: 400,
    compareAtLabel: "£5",
    compareAtAmount: 500,
    currency: "gbp",
    stripeLookupKey: "rage_room_first_visit_prep_pack_gbp_400",
    filePath: path.join(
      process.cwd(),
      "private/digital-downloads/rage-room-first-visit-prep-pack.pdf"
    ),
    downloadFilename: "rage-room-first-visit-prep-pack.pdf",
    contentType: "application/pdf",
    marketingImage: "/digital-products/rage-room-first-visit-prep-pack-cover.png",
    previewImages: [
      "/digital-products/rage-room-first-visit-prep-pack-page-1.png?v=4",
      "/digital-products/rage-room-first-visit-prep-pack-page-2.png?v=4",
      "/digital-products/rage-room-first-visit-prep-pack-page-3.png?v=4",
    ],
    previewPdf: "/digital-products/rage-room-first-visit-prep-pack-sample.pdf?v=5",
    pageCount: 12,
    sampleUnlockHint:
      "Sample preview (2 pages) — full pack unlocks all 12 first-visit pages.",
    description:
      "A printable UK first-timer kit covering what happens, what to wear, can-I-take-part checks, venue questions, waiver tips and a final arrival checklist.",
    checkoutBlurb:
      "Limited-time 20% demand drop already applied. Instant PDF prep pack only — not a venue booking.",
    includedSections: [
      "Quick start",
      "What happens step-by-step",
      "What to wear and bring",
      "Can I take part? self-check",
      "Venue questions before booking",
      "Booking snapshot",
      "Waiver and arrival checklist",
      "Day-of timeline",
      "Common first-timer mistakes",
      "After your session prompts",
      "Final prep checklist",
    ],
  },
  "rage-room-gift-voucher-template-pack": {
    id: "rage-room-gift-voucher-template-pack",
    slug: "rage-room-gift-voucher-template-pack",
    name: "Rage Room Gift Voucher Template Pack",
    shortName: "Gift Voucher Template Pack",
    analyticsItemId: "rage_gift_voucher_pack",
    itemCategory: "Digital Product",
    priceLabel: "£4",
    unitAmount: 400,
    compareAtLabel: "£5",
    compareAtAmount: 500,
    currency: "gbp",
    stripeLookupKey: "rage_room_gift_voucher_template_pack_gbp_400",
    filePath: path.join(
      process.cwd(),
      "private/digital-downloads/rage-room-gift-voucher-template-pack.zip"
    ),
    downloadFilename: "rage-room-gift-voucher-template-pack.zip",
    contentType: "application/zip",
    marketingImage: "/digital-products/rage-room-gift-voucher-template-pack-mockup.png",
    previewImages: [
      "/digital-products/rage-room-gift-voucher-template-pack-page-1.png?v=4",
      "/digital-products/rage-room-gift-voucher-template-pack-page-2.png?v=4",
      "/digital-products/rage-room-gift-voucher-template-pack-page-3.png?v=4",
    ],
    previewPdf:
      "/digital-products/rage-room-gift-voucher-template-pack-sample.pdf?v=5",
    sampleUnlockHint:
      "Sample preview — full pack unlocks 8 themes across print + digital formats.",
    description:
      "A premium printable and digital gift voucher template pack for giving a rage room experience as a birthday, date night, breakup, best friend, holiday or generic experience gift.",
    checkoutBlurb:
      "Limited-time 20% demand drop already applied. Instant ZIP of DIY gift voucher templates only — not a venue booking.",
    includedSections: [
      "Birthday voucher",
      "Date night voucher",
      "Breakup reset voucher",
      "Stress relief voucher",
      "Best friend voucher",
      "You deserve this voucher",
      "Holiday voucher",
      "Generic experience gift voucher",
      "A4 printable versions",
      "A5 printable versions",
      "Mobile-friendly digital versions",
      "Square social-sharing versions",
      "Blank versions",
      "Gift note template",
      "How to redeem insert",
      "Envelope insert",
      "Mini gift tag",
      "Preview catalogue",
    ],
  },
  "party-gift-bundle": {
    id: "party-gift-bundle",
    slug: "party-planner-gift-voucher-bundle",
    name: "Party Planner + Gift Voucher Bundle",
    shortName: "Party + Gift Bundle",
    analyticsItemId: "party_gift_bundle",
    itemCategory: "Digital Product",
    priceLabel: "£7.20",
    unitAmount: 720,
    compareAtLabel: "£9",
    compareAtAmount: 900,
    currency: "gbp",
    stripeLookupKey: "party_gift_bundle_gbp_720",
    bundleProductIds: [
      "rage-room-party-planner",
      "rage-room-gift-voucher-template-pack",
    ],
    marketingImage: "/digital-products/party-planner-gift-voucher-bundle-cover.png",
    previewImages: [
      "/digital-products/rage-room-party-planner-pack-page-1.png?v=4",
      "/digital-products/rage-room-gift-voucher-template-pack-page-1.png?v=4",
      "/digital-products/rage-room-party-planner-pack-page-3.png?v=4",
    ],
    description:
      "Bundle the Rage Room Party Planner Pack and Gift Voucher Template Pack — plan the night and present the experience as a polished gift.",
    checkoutBlurb:
      "Limited-time 20% demand drop already applied. Instant downloads only — not a venue booking. Party Planner PDF + DIY Gift Voucher ZIP.",
    includedSections: [
      "Rage Room Party Planner Pack (PDF)",
      "Rage Room Gift Voucher Template Pack (ZIP)",
    ],
  },
}

export type DigitalProductId = keyof typeof digitalProducts

export function getDigitalProduct(productId: string) {
  return digitalProducts[productId as DigitalProductId] ?? null
}

export function getDigitalProductBySlug(slug: string) {
  return (
    Object.values(digitalProducts).find((product) => product.slug === slug) ??
    null
  )
}

export function getDigitalProductAnalytics(product: DigitalProduct) {
  return {
    item_id: product.analyticsItemId,
    item_name: product.name,
    item_category: product.itemCategory,
    price: product.unitAmount / 100,
    currency: product.currency.toUpperCase() as "GBP",
  }
}

/** Single-file products fulfilled for a purchase (bundle expands to children). */
export function getFulfilmentProducts(product: DigitalProduct): DigitalProduct[] {
  if (!product.bundleProductIds?.length) {
    return product.filePath ? [product] : []
  }

  return product.bundleProductIds
    .map((id) => getDigitalProduct(id))
    .filter((child): child is DigitalProduct => Boolean(child?.filePath))
}

export function isProductCoveredBySession(
  purchasedProduct: DigitalProduct,
  downloadProductId: string
) {
  if (purchasedProduct.id === downloadProductId) {
    return Boolean(purchasedProduct.filePath)
  }

  return Boolean(purchasedProduct.bundleProductIds?.includes(downloadProductId))
}
