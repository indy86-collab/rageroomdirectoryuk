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
