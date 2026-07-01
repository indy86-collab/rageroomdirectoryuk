import path from "path"

export type DigitalProduct = {
  id: string
  slug: string
  name: string
  priceLabel: string
  unitAmount: number
  currency: "gbp"
  stripeLookupKey: string
  filePath: string
  downloadFilename: string
  description: string
  includedSections: string[]
}

export const digitalProducts = {
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
} satisfies Record<string, DigitalProduct>

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
