import type {
  Listing,
  ListingActivity,
  ListingOccasion,
} from "@/types/listing"

export interface ActivityDefinition {
  value: ListingActivity
  slug: string
  label: string
  shortLabel: string
  emoji: string
  description: string
  heroTitle: string
  editorial: {
    whatItIs: string
    sessionFormat: string
    whoItSuits: string
    age: string
    whatToWear: string
    booking: string
    pairing: string
  }
}

export interface OccasionDefinition {
  values: ListingOccasion[]
  slug: string
  label: string
  shortLabel: string
  emoji: string
  description: string
  heroTitle: string
  planning: {
    booking: string
    groupSize: string
    age: string
    pricing: string
    activities: string
  }
}

export const ACTIVITY_DEFINITIONS: ActivityDefinition[] = [
  {
    value: "rage-room",
    slug: "rage-rooms",
    label: "Rage Rooms",
    shortLabel: "Rage Room",
    emoji: "💥",
    description: "Smash breakables in a supervised room with protective equipment provided.",
    heroTitle: "Rage Rooms Near You",
    editorial: {
      whatItIs: "A rage room is a controlled space where you can break supplied items using tools such as bats or sledgehammers. Staff provide a safety briefing and protective equipment before the session starts.",
      sessionFormat: "Most bookings include a briefing, time to change into protective kit and a fixed smashing session. The published duration may describe activity time or the full booking, so check each venue's notes.",
      whoItSuits: "Rage rooms can suit friends, couples, celebrations and work groups looking for a physical shared experience. They are entertainment venues, not a replacement for mental-health treatment.",
      age: "Minimum ages vary by venue and sometimes by package. Where an age has not been verified, ask the venue before including younger participants.",
      whatToWear: "Choose comfortable clothes you can move in and closed-toe shoes. Venues normally supply specialist protective equipment, but confirm footwear and clothing rules when booking.",
      booking: "Advance booking is normally the safest option because venues prepare breakables and allocate private time slots. Use a verified booking link when one is shown.",
      pairing: "Many multi-activity venues pair a smash session with axe throwing, paint splatter, escape rooms or target activities for a longer day out.",
    },
  },
  {
    value: "axe-throwing",
    slug: "axe-throwing",
    label: "Axe Throwing",
    shortLabel: "Axe Throwing",
    emoji: "🪓",
    description: "Find coached axe throwing at verified standalone and multi-activity venues.",
    heroTitle: "Axe Throwing Across the UK",
    editorial: {
      whatItIs: "Axe throwing is a coached target activity where participants throw axes at wooden targets from a marked lane.",
      sessionFormat: "Sessions usually begin with technique and safety coaching before practice throws and optional games. Multi-activity venues may offer combination bookings.",
      whoItSuits: "It works well for friends, competitive groups and team socials looking for a physical, skill-based activity.",
      age: "Age policies are venue and session specific. Confirm the rule for every participant before booking.",
      whatToWear: "Wear closed-toe shoes and clothes that allow free shoulder movement. Avoid loose accessories that could interfere with throwing or protective equipment.",
      booking: "Book ahead, especially for groups or combination sessions, because lane capacity and other activities may have separate availability.",
      pairing: "Where both are genuinely available, axe throwing provides coaching and competition while a rage room adds a high-energy, no-score finish.",
    },
  },
  {
    value: "paint-splatter",
    slug: "paint-splatter",
    label: "Paint & Splatter Rooms",
    shortLabel: "Paint Splatter",
    emoji: "🎨",
    description: "Create colourful chaos in a dedicated paint or splatter room.",
    heroTitle: "Paint & Splatter Rooms Across the UK",
    editorial: {
      whatItIs: "Paint or splatter rooms let participants throw, spray or flick paint in a protected creative space. Every result is different, and some venues let you take a canvas home.",
      sessionFormat: "A typical visit covers protective clothing, a short setup and a timed paint session. At multi-activity venues, separate activities may be booked individually or as a package.",
      whoItSuits: "Paint rooms suit creative groups, birthdays, dates and families who want colourful mess without the impact and noise of a full smash session.",
      age: "Paint experiences set their own age and supervision rules. Confirm paint type, adult supervision and minimum age directly.",
      whatToWear: "Use old clothes and closed-toe shoes even when coveralls are supplied. Ask whether paint can stain hair, footwear or personal items.",
      booking: "Reserve in advance so the venue can prepare paint, canvases and protective kit. Check whether artwork, extra colours or other activity add-ons cost more.",
      pairing: "A splatter session offers a creative contrast to smashing: one activity makes a mess through colour, the other through controlled destruction.",
    },
  },
  {
    value: "car-smash",
    slug: "car-smash",
    label: "Car Smash",
    shortLabel: "Car Smash",
    emoji: "🚗",
    description: "Special sessions or events where participants can safely smash vehicle panels or cars.",
    heroTitle: "Car Smash Experiences",
    editorial: {
      whatItIs: "Car-smash sessions use a vehicle or prepared vehicle panels as the breakable target under venue supervision.",
      sessionFormat: "Formats vary significantly and may be limited events rather than a standard daily package.",
      whoItSuits: "They suit adults looking for a larger-scale version of the classic smash-room experience.",
      age: "Expect stricter age and safety rules than a standard rage room; verify them directly.",
      whatToWear: "Follow the venue's footwear, clothing and protective-equipment instructions exactly.",
      booking: "Availability may be occasional, so confirm the specific car-smash session rather than assuming it is included.",
      pairing: "Where a venue offers both, a standard rage-room booking can provide a more widely available destructive activity at the same location.",
    },
  },
  {
    value: "escape-room",
    slug: "escape-rooms",
    label: "Escape Rooms",
    shortLabel: "Escape Room",
    emoji: "🔐",
    description: "Verified escape-room experiences with a strong connection to destructive or multi-activity venues.",
    heroTitle: "Escape Rooms at High-Energy Activity Venues",
    editorial: {
      whatItIs: "Escape rooms are timed team challenges built around clues, puzzles and a themed objective.",
      sessionFormat: "Escape games commonly run as a separate timed booking with a briefing and debrief. Leave enough time between activities if the venue does not sell a combined package.",
      whoItSuits: "The pairing suits groups that want collaboration and problem-solving as well as a physical activity, particularly birthdays and team socials.",
      age: "Escape-room age guidance can depend on theme and puzzle difficulty, while rage-room rules depend on safety. Check both activities separately.",
      whatToWear: "Comfortable everyday clothing is usually suitable for the escape room; bring closed-toe shoes and follow the rage room's clothing policy too.",
      booking: "Two room-based activities create tighter scheduling, so advance booking is strongly recommended. Confirm whether the activities are sold together or as separate slots.",
      pairing: "Solve first and smash afterwards for a contrast between careful teamwork and a loud, physical finish.",
    },
  },
  {
    value: "archery",
    slug: "archery",
    label: "Archery",
    shortLabel: "Archery",
    emoji: "🏹",
    description: "Archery at selected venues closely aligned with destructive and adrenaline experiences.",
    heroTitle: "Archery at High-Energy Activity Venues",
    editorial: {
      whatItIs: "Archery is a coached target activity using bows and marked shooting lanes.",
      sessionFormat: "Expect a safety briefing, technique guidance and a practice or scoring format.",
      whoItSuits: "It suits groups looking for a calmer precision activity alongside a rage-room session.",
      age: "Bow size, supervision and minimum ages vary, so confirm the archery rule separately.",
      whatToWear: "Wear fitted, comfortable clothing that will not catch the bowstring and closed-toe shoes.",
      booking: "Ask whether archery is available on the same day and whether it is a permanent or seasonal offer.",
      pairing: "Archery adds focus and accuracy before or after the freer physical experience of a rage room.",
    },
  },
  {
    value: "vr",
    slug: "vr",
    label: "Virtual Reality",
    shortLabel: "VR",
    emoji: "🥽",
    description: "Virtual-reality experiences at selected high-energy, multi-activity venues.",
    heroTitle: "Virtual Reality at High-Energy Activity Venues",
    editorial: {
      whatItIs: "Virtual-reality sessions use headsets and tracked controllers for immersive games or experiences.",
      sessionFormat: "VR may be booked by headset, arena or time slot. Allow time for fitting and instructions, and check whether multiplayer capacity matches your group.",
      whoItSuits: "VR gives mixed-interest groups a lower-impact digital option alongside a physical smash session.",
      age: "Headset manufacturers and venues may set their own age guidance. Confirm that separately from the rage-room minimum age.",
      whatToWear: "Wear comfortable clothing and secure glasses or accessories. Closed-toe shoes are still advisable for the wider venue visit.",
      booking: "With limited verified inventory, contact the venue to confirm the current VR format and whether a combined itinerary is available.",
      pairing: "VR provides an immersive, replayable contrast to the tactile one-off experience of smashing real breakables.",
    },
  },
  {
    value: "airsoft-target",
    slug: "target-activities",
    label: "Airsoft & Target Activities",
    shortLabel: "Target Activities",
    emoji: "🎯",
    description: "Selected venues with airsoft or another explicitly published target activity.",
    heroTitle: "Airsoft & Target Activities",
    editorial: {
      whatItIs: "This category covers explicitly published airsoft or target-shooting experiences at selected high-energy venues.",
      sessionFormat: "Sessions usually combine a safety briefing with coached practice, target challenges or scored games. Equipment and lane formats differ by venue.",
      whoItSuits: "It suits competitive friends and groups who want accuracy-based games alongside a smash session.",
      age: "Target activities can have equipment-specific age restrictions. Treat the rage-room age shown on a card as separate information.",
      whatToWear: "Wear closed-toe shoes and practical clothing. Use every item of eye or face protection required by the venue.",
      booking: "Confirm which target activity is currently offered and reserve enough capacity for the whole group before travelling.",
      pairing: "Target activities reward control and accuracy, while the rage room supplies a deliberately less precise finale.",
    },
  },
  {
    value: "mobile-rage-room",
    slug: "mobile-rage-rooms",
    label: "Mobile Rage Rooms",
    shortLabel: "Mobile Rage Room",
    emoji: "🚚",
    description: "Rage-room experiences that travel to events or temporary locations.",
    heroTitle: "Mobile Rage Rooms",
    editorial: {
      whatItIs: "Mobile rage rooms bring a contained smash setup to events or temporary locations rather than operating only from a fixed venue.",
      sessionFormat: "Capacity, setup time, site access and breakable disposal depend on the operator and event location.",
      whoItSuits: "They can suit private events, festivals and organisations that need the activity brought to them.",
      age: "The operator's risk assessment and event policy determine age and supervision requirements.",
      whatToWear: "Follow the operator's closed-toe footwear and protective-equipment requirements.",
      booking: "Mobile experiences require direct planning around date, site and group throughput, so advance enquiries are essential.",
      pairing: "A fixed rage-room venue may be easier for small groups; mobile setups can work better for larger hosted events.",
    },
  },
]

export const OCCASION_DEFINITIONS: OccasionDefinition[] = [
  {
    values: ["birthdays"],
    slug: "birthdays",
    label: "Birthday Rage Rooms",
    shortLabel: "Birthdays",
    emoji: "🎂",
    description: "Compare venues that advertise birthday sessions or party packages.",
    heroTitle: "Rage Rooms for Birthday Parties",
    planning: {
      booking: "Ask whether the booking is private, what breakables are included and whether there is space for cake, food or guests who are not smashing.",
      groupSize: "Check the number who can participate at once, not just total venue capacity. Larger parties may rotate through shorter sessions.",
      age: "Use the venue's verified minimum age where available and confirm adult supervision, waivers and any package-specific restrictions.",
      pricing: "Compare the published price unit carefully: per-person, per-room and per-group prices are not interchangeable.",
      activities: "Multi-activity venues can extend the party with paint splatter, axe throwing, escape rooms or target activities where verified.",
    },
  },
  {
    values: ["stag-parties"],
    slug: "stag-parties",
    label: "Stag Party Rage Rooms",
    shortLabel: "Stag Parties",
    emoji: "🍻",
    description: "Find high-energy smash experiences suitable for stag groups.",
    heroTitle: "Rage Rooms for Stag Parties",
    planning: {
      booking: "Confirm the venue's alcohol policy, arrival time and late-arrival rules. Safety briefings normally require participants to be sober.",
      groupSize: "For a large stag group, ask how many people smash simultaneously and how long a full rotation will take.",
      age: "Most stag groups are adults, but every participant still needs to meet the venue's safety and footwear rules.",
      pricing: "Look for a clear group total and included breakables before comparing packages; headline prices may use different units.",
      activities: "Axe throwing, escape rooms and target activities can add competition before the rage-room session.",
    },
  },
  {
    values: ["hen-parties"],
    slug: "hen-parties",
    label: "Hen Party Rage Rooms",
    shortLabel: "Hen Parties",
    emoji: "✨",
    description: "Discover rage rooms that welcome hen parties and celebration groups.",
    heroTitle: "Rage Rooms for Hen Parties",
    planning: {
      booking: "Confirm private-session options, changing space, arrival times and whether decorations or a chosen playlist are allowed.",
      groupSize: "Ask how the group is split across rooms or rotations so nobody spends most of the booking waiting.",
      age: "All participants must meet the venue's activity rules; check footwear and protective-kit sizing in advance.",
      pricing: "Compare the full group cost and inclusions, especially extra breakables, photos or combination activities.",
      activities: "Paint splatter can add a creative option, while axe throwing or target games add a competitive element.",
    },
  },
  {
    values: ["corporate-team-building"],
    slug: "corporate-team-building",
    label: "Corporate & Team-Building Rage Rooms",
    shortLabel: "Corporate",
    emoji: "💼",
    description: "Shortlist venues with team-building, work-social or corporate group options.",
    heroTitle: "Corporate Rage Room Team Building",
    planning: {
      booking: "Ask for a written package outline covering timings, exclusivity, invoicing, cancellation terms and any meeting or refreshment space.",
      groupSize: "Check participant throughput as well as maximum capacity. Rotations can work well when paired with another activity.",
      age: "Work groups still need accessible safety equipment and alternatives for anyone who cannot or does not want to participate.",
      pricing: "Where prices are characterised, compare the same unit and ask whether VAT, facilitation or exclusive hire is included.",
      activities: "Axe throwing, escape rooms and target activities can create structured team rotations around the rage room.",
    },
  },
  {
    values: ["date-nights"],
    slug: "date-night",
    label: "Rage Room Date Nights",
    shortLabel: "Date Night",
    emoji: "❤️",
    description: "Find couple-friendly smash sessions and two-person packages.",
    heroTitle: "Rage Rooms for Date Nights",
    planning: {
      booking: "Look for a private two-person slot, a clear session length and enough time around the booking for travel or dinner plans.",
      groupSize: "A venue that accepts two people is more useful than a large-group package; verify minimum booking numbers.",
      age: "Both people must meet the venue's minimum age and clothing rules. Do not assume a couples package changes the safety policy.",
      pricing: "Check whether the displayed figure covers both people, one person or the room before comparing options.",
      activities: "Paint splatter offers a creative pairing, while axe throwing adds friendly competition to the date.",
    },
  },
  {
    values: ["kids", "families"],
    slug: "kids-families",
    label: "Rage Rooms for Kids & Families",
    shortLabel: "Kids & Families",
    emoji: "👨‍👩‍👧‍👦",
    description: "Compare age limits and family-suitable sessions before booking.",
    heroTitle: "Rage Rooms for Kids & Families",
    planning: {
      booking: "Contact the venue before booking to confirm the exact package, supervision ratio, consent forms and whether adults participate or observe.",
      groupSize: "Family sessions may limit the number of children in the room at once. Check total capacity and rotation time.",
      age: "Age rules are the deciding factor here. Only venues with verified family or kids suitability are included, but package-level limits can still differ.",
      pricing: "Ask whether protective equipment, all breakables and accompanying adults are included in the stated price.",
      activities: "Paint splatter or selected target activities may offer a lower-impact alternative, subject to each venue's published age rules.",
    },
  },
]

export const MIN_ACTIVITY_PAGE_LISTINGS = 2
export const MIN_OCCASION_PAGE_LISTINGS = 2

export function getActivityDefinition(slug: string) {
  return ACTIVITY_DEFINITIONS.find((activity) => activity.slug === slug)
}

export function getOccasionDefinition(slug: string) {
  return OCCASION_DEFINITIONS.find((occasion) => occasion.slug === slug)
}

export function getActivityLabel(activity: ListingActivity) {
  return ACTIVITY_DEFINITIONS.find((item) => item.value === activity)?.shortLabel ?? activity
}

export function listingHasRageRoom(
  listing: Pick<Listing, "activities">
) {
  return listing.activities.includes("rage-room")
}

export function getListingPrimaryActivity(
  listing: Pick<Listing, "activities">
) {
  const value = listingHasRageRoom(listing)
    ? "rage-room"
    : listing.activities[0]
  return ACTIVITY_DEFINITIONS.find((activity) => activity.value === value)
}

export function getListingExperienceLabel(
  listing: Pick<Listing, "activities">
) {
  const primary = getListingPrimaryActivity(listing)
  return primary?.shortLabel ?? "Activity"
}

export function getListingExperienceSummary(
  listing: Pick<Listing, "activities">
) {
  return listing.activities.map(getActivityLabel).join(", ")
}

export function getOccasionLabel(occasion: ListingOccasion) {
  return (
    OCCASION_DEFINITIONS.find((item) => item.values.includes(occasion))?.shortLabel ?? occasion
  )
}

export function matchesOccasionDefinition(listing: Listing, definition: OccasionDefinition) {
  return definition.values.some((occasion) => listing.occasions.includes(occasion))
}

export function formatGroupSize(listing: Listing) {
  if (listing.groupSizeMin != null && listing.groupSizeMax != null) {
    return `${listing.groupSizeMin}–${listing.groupSizeMax}`
  }
  if (listing.groupSizeMax != null) return `Up to ${listing.groupSizeMax}`
  if (listing.groupSizeMin != null) return `${listing.groupSizeMin}+`
  return null
}

export function formatPriceAmount(price: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: Number.isInteger(price) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(price)
}

export function formatListingPrice(
  listing: Pick<Listing, "price" | "priceUnit">,
  options?: { includeFrom?: boolean }
) {
  if (listing.price == null || listing.priceUnit == null) return null
  const unit = {
    "per-person": "per person",
    "per-room": "per room",
    "per-group": "per group",
  }[listing.priceUnit]
  return `${options?.includeFrom === false ? "" : "From "}${formatPriceAmount(listing.price)} ${unit}`
}

export function getCharacterisedPriceRange(listings: Listing[]) {
  const prices = listings
    .filter((listing) => listing.priceUnit === "per-person" && listing.price != null)
    .map((listing) => listing.price as number)

  if (prices.length === 0) return null
  return {
    count: prices.length,
    minimum: Math.min(...prices),
    maximum: Math.max(...prices),
  }
}

export function pluraliseVenue(count: number) {
  return `${count} ${count === 1 ? "venue" : "venues"}`
}

export function getListingHref(listing: Pick<Listing, "id" | "slug">) {
  return `/listing/${listing.slug || listing.id}`
}

export function getListingPrimaryAction(
  listing: Pick<Listing, "id" | "slug" | "bookingUrl">
) {
  return listing.bookingUrl
    ? { kind: "booking" as const, href: listing.bookingUrl, label: "Check availability" }
    : { kind: "details" as const, href: getListingHref(listing), label: "View venue" }
}

export function getActivityCombinationHref(activitySlug: string, relatedActivity: ListingActivity) {
  return `/activities/${activitySlug}?activities=${relatedActivity}#venues`
}
