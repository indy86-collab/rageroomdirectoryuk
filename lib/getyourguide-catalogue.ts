import { cityToSlug } from "@/lib/location"
import { GETYOURGUIDE_PARTNER_ID, buildGetYourGuideBrowseUrl, type PlannerGroup, type PlannerTiming, type PlannerVibe } from "@/lib/getyourguide"

export const GYG_CURATED_ENABLED = process.env.NEXT_PUBLIC_GYG_CURATED_ENABLED === "true"
export const GYG_ANALYZER_ENABLED = process.env.NEXT_PUBLIC_GYG_ANALYZER_ENABLED !== "false"
export type ActivityPlan = { group?: PlannerGroup; vibe?: PlannerVibe; timing?: PlannerTiming }
export type CuratedRecommendation = {
  id: string; productId: string; canonicalUrl: string; city: string; title: string
  location: string; duration: string; audience: string; description: string
  groups: PlannerGroup[]; vibes: PlannerVibe[]; timings: PlannerTiming[]
  adultOnly?: boolean; alcoholRelated?: boolean; status: "active" | "unavailable"
  source: string; verifiedAt: string
  selectionEvidence?: { source: string; checkedAt: string; country: string; countryRank: number }
  image?: { src: string; alt: string; approvedSource: string }
}
const groups: PlannerGroup[] = ["couple", "friends", "family", "team"]
const timings: PlannerTiming[] = ["before", "after", "full-day"]
const bestsellerSource = "https://partner.getyourguide.com/en-us/dashboard/analytics/bestseller-coverage"
const bestsellerEvidence = (countryRank: number) => ({ source: bestsellerSource, checkedAt: "2026-10-20", country: "Britain", countryRank })
const product = (data: Omit<CuratedRecommendation, "source" | "verifiedAt" | "status">): CuratedRecommendation => ({
  ...data, source: data.canonicalUrl, verifiedAt: "2026-10-20", status: "active",
})
// Editorial selections verified on the product pages. No live stock, price or review claims.
// Images must come from an approved affiliate source; text cards are the intentional fallback.
export const GETYOURGUIDE_CATALOGUE: CuratedRecommendation[] = [
  product({ id: "sandbox-vr", productId: "1036747", city: "London",
    canonicalUrl: "https://www.getyourguide.com/london-l57/london-sandbox-vr-immersive-gaming-experiences-t1036747/",
    title: "Sandbox VR full-body gaming", location: "Museum Street, central London", duration: "45 minutes of gameplay",
    audience: "Ages 8+; couples, friends, families and teams", groups, timings, vibes: ["adrenaline"],
    description: "A second interactive challenge for groups who want to keep playing. Allow additional time for the briefing and travel." }),
  product({ id: "london-eye", productId: "170451", city: "London",
    canonicalUrl: "https://www.getyourguide.com/en-gb/london-l57/coca-cola-london-eye-standard-or-fast-track-admission-t170451/",
    title: "London Eye entry ticket", location: "South Bank, central London", duration: "30-minute ride; allow extra time for queues",
    audience: "Families, couples and groups; under-16s need an adult over 18", groups, timings, vibes: ["sightseeing", "relaxed"],
    selectionEvidence: bestsellerEvidence(1),
    description: "A change of pace with skyline views around your venue visit. Check the selected admission option, arrival time and travel route." }),
  product({ id: "etihad-tour", productId: "155085", city: "Manchester",
    canonicalUrl: "https://www.getyourguide.com/manchester-l1128/etihad-stadium-the-manchester-city-stadium-tour-t155085/",
    title: "Manchester City stadium tour", location: "Etihad Stadium, east Manchester", duration: "75 minutes",
    audience: "Football fans; check child ticket and access requirements", groups, timings, vibes: ["sightseeing", "relaxed"],
    description: "Add a stadium visit to a football fan’s day out. Leave time to travel between the stadium and your rage room." }),
  product({ id: "funnyboyz", productId: "887510", city: "Manchester",
    canonicalUrl: "https://www.getyourguide.com/manchester-l1128/manchester-funnyboyz-benidorm-bingo-cabaret-show-t887510/",
    title: "FunnyBoyz bingo & drag cabaret", location: "New York New York, Bloom Street, Manchester", duration: "3 hours",
    audience: "Adult groups; check the selected ticket’s admission rules", groups: ["couple", "friends", "team"], timings: ["after"],
    vibes: ["food-drink", "relaxed"], adultOnly: true, alcoholRelated: true,
    description: "An interactive cabaret option for an adult group’s evening after the physical activities. Check the programme and ticket inclusions." }),
  product({ id: "matrix-vr", productId: "637196", city: "Birmingham",
    canonicalUrl: "https://www.getyourguide.com/birmingham-l2525/matrix-vr-virtual-reality-gaming-experience-session-t637196/",
    title: "MATRIX VR private gaming session", location: "Zellig, Custard Factory, Digbeth", duration: "1 hour",
    audience: "Ages 7+; couples, friends, families and teams", groups, timings, vibes: ["adrenaline"],
    description: "Follow a group session with a private virtual-reality challenge in Digbeth. Check capacity for your party before booking." }),
  product({ id: "edinburgh-castle", productId: "156135", city: "Edinburgh",
    canonicalUrl: "https://www.getyourguide.com/en-gb/edinburgh-l44/edinburgh-castle-history-and-heritage-tour-tickets-incl-t156135/",
    title: "Edinburgh Castle guided history tour", location: "Meet on High Street, Edinburgh Old Town", duration: "1.5 hours",
    audience: "Under-16s need an adult; unsuitable for wheelchair users or mobility impairments", groups, timings, vibes: ["sightseeing"],
    selectionEvidence: bestsellerEvidence(9),
    description: "Pair a city-centre history walk and castle visit with your separate activity. This is an outdoor walking tour, so check access and leave travel time." }),
  product({ id: "vaults-terror", productId: "33266", city: "Edinburgh",
    canonicalUrl: "https://www.getyourguide.com/edinburgh-l44/auld-reekie-s-the-terror-tour-90min-t33266/",
    title: "Late-night underground vaults terror tour", location: "South Bridge vaults, Edinburgh Old Town", duration: "75 minutes",
    audience: "Adults 18+; unsuitable for claustrophobia or mobility impairments", groups: ["couple", "friends", "team"], timings: ["after"],
    vibes: ["sightseeing", "adrenaline"], adultOnly: true,
    description: "A late-night ghost tour for adults who enjoy a scare. Check access restrictions and leave time between the separate bookings." }),
  product({ id: "anfield-tour", productId: "144276", city: "Liverpool",
    canonicalUrl: "https://www.getyourguide.com/anfield-l90021/the-new-lfc-stadium-tour-t144276/",
    title: "Liverpool FC museum & stadium tour", selectionEvidence: bestsellerEvidence(33), location: "Anfield, Liverpool", duration: "1.5 hours",
    audience: "Football fans; check child ticket and access requirements", groups, timings, vibes: ["sightseeing", "relaxed"],
    description: "Combine a football fan’s visit to Anfield with a separate group activity. Allow time for travel and check the tour schedule." }),
]

export function eligibleRecommendations(city: string, plan: ActivityPlan = {}, catalogue = GETYOURGUIDE_CATALOGUE) {
  return catalogue.filter(p => p.status === "active" && cityToSlug(p.city) === cityToSlug(city)
    && (!p.adultOnly || (!!plan.group && plan.group !== "family"))
    && (!plan.group || p.groups.includes(plan.group))
    && (!plan.vibe || p.vibes.includes(plan.vibe))
    && (!plan.timing || p.timings.includes(plan.timing))
    && (!p.alcoholRelated || plan.timing === "after"))
    .slice(0, 2)
}

const segment = (value: string) => value.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "") || "uk"
export function getYourGuideCampaign(context: { placement: string; city: string; occasion?: string; recommendationId: string }) {
  // Bound each segment separately: different recommendation IDs must not be truncated away.
  return ["rr2", segment(context.placement).slice(0, 20), segment(context.city).slice(0, 22),
    segment(context.occasion || "general").slice(0, 18), segment(context.recommendationId).slice(0, 30)].join("_")
}
export function curatedProductUrl(product: CuratedRecommendation, campaign: string) {
  const url = new URL(product.canonicalUrl)
  if (url.protocol !== "https:" || url.hostname !== "www.getyourguide.com" || !url.pathname.endsWith(`-t${product.productId}/`)) {
    throw new Error("Invalid GetYourGuide product destination")
  }
  url.search = ""
  url.searchParams.set("partner_id", GETYOURGUIDE_PARTNER_ID)
  url.searchParams.set("cmp", campaign)
  return url.toString()
}
export function cityBrowseOffer(city: string, placement: string, occasion?: string) {
  const campaign = getYourGuideCampaign({ city, placement, occasion, recommendationId: "browse-all" })
  return { campaign, href: buildGetYourGuideBrowseUrl(city, campaign) }
}
