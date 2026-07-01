import path from "path"

export type DigitalProduct = {
  id: string
  slug: string
  name: string
  shortName?: string
  priceLabel: string
  unitAmount: number
  currency: "gbp"
  stripeLookupKey: string
  filePath: string
  downloadFilename: string
  contentType: string
  marketingImage?: string
  previewPdf?: string
  description: string
  includedSections: string[]
}

export const digitalProducts: Record<string, DigitalProduct> = {
  "rage-room-party-planner": {
    id: "rage-room-party-planner",
    slug: "rage-room-party-planner-pack",
    name: "Rage Room Party Planner Pack",
    priceLabel: "£7",
    unitAmount: 700,
    currency: "gbp",
    stripeLookupKey: "rage_room_party_planner_pack_gbp_700",
    filePath: path.join(
      process.cwd(),
      "private/digital-downloads/rage-room-party-planner-pack.pdf"
    ),
    downloadFilename: "rage-room-party-planner-pack.pdf",
    contentType: "application/pdf",
    description:
      "A printable UK planning kit for rage room birthdays, date nights, breakup nights, group nights, stag and hen activities, and friends' nights out.",
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
    priceLabel: "£19",
    unitAmount: 1900,
    currency: "gbp",
    stripeLookupKey: "corporate_rage_room_team_building_toolkit_gbp_1900",
    filePath: path.join(
      process.cwd(),
      "private/digital-downloads/corporate-rage-room-team-building-toolkit.pdf"
    ),
    downloadFilename: "corporate-rage-room-team-building-toolkit.pdf",
    contentType: "application/pdf",
    description:
      "A professional planning pack for HR teams, office managers, founders and team leads planning a rage room team-building event.",
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
  "rage-room-gift-voucher-template-pack": {
    id: "rage-room-gift-voucher-template-pack",
    slug: "rage-room-gift-voucher-template-pack",
    name: "Rage Room Gift Voucher Template Pack",
    shortName: "Gift Voucher Template Pack",
    priceLabel: "£5",
    unitAmount: 500,
    currency: "gbp",
    stripeLookupKey: "rage_room_gift_voucher_template_pack_gbp_500",
    filePath: path.join(
      process.cwd(),
      "private/digital-downloads/rage-room-gift-voucher-template-pack.zip"
    ),
    downloadFilename: "rage-room-gift-voucher-template-pack.zip",
    contentType: "application/zip",
    marketingImage: "/digital-products/rage-room-gift-voucher-template-pack-mockup.png",
    previewPdf: "/digital-products/rage-room-gift-voucher-template-pack-preview.pdf",
    description:
      "A premium printable and digital gift voucher template pack for giving a rage room experience as a birthday, date night, breakup, best friend, holiday or generic experience gift.",
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
