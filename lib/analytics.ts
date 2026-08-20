"use client"

import { isAnalyticsConsentGranted } from "@/lib/consent"

export type AnalyticsProduct = {
  item_id: string
  item_name: string
  item_category: "Digital Product"
  price: number
  currency: "GBP"
}

export type AnalyticsOrder = {
  transaction_id: string
  product: AnalyticsProduct
}

export const DIRECTORY_PAGE_TYPES = [
  "homepage",
  "venue",
  "city",
  "activity",
  "occasion",
  "activity_location",
  "occasion_location",
  "comparison",
  "search_results",
  "guide",
] as const

export type DirectoryPageType = (typeof DIRECTORY_PAGE_TYPES)[number]

export const DIRECTORY_CTA_PLACEMENTS = [
  "venue_card",
  "venue_hero",
  "venue_booking_section",
  "venue_pricing",
  "venue_contact",
  "comparison_table",
  "activity_results",
  "occasion_results",
  "location_results",
  "homepage_featured",
  "near_me_results",
  "listing_owner_panel",
] as const

export type DirectoryCtaPlacement = (typeof DIRECTORY_CTA_PLACEMENTS)[number]

export const DIRECTORY_FILTER_TYPES = [
  "activity",
  "occasion",
  "city",
  "price",
  "age",
  "group_size",
  "rating",
  "online_booking",
  "corporate",
  "verified",
  "distance",
  "sort",
] as const

export type DirectoryFilterType = (typeof DIRECTORY_FILTER_TYPES)[number]

export type DirectoryDiscoveryContext = {
  pageType: DirectoryPageType
  activity?: string
  occasion?: string
  discoveryLocation?: string
}

type VenueActionProperties = {
  venueSlug: string
  venueCity?: string
  pageType: DirectoryPageType
  sourcePath: string
  ctaPlacement: DirectoryCtaPlacement
  activity?: string
  occasion?: string
  discoveryLocation?: string
  comparisonContext?: "active"
}

export type DirectoryEventMap = {
  venue_view: {
    venueSlug: string
    venueCity: string
    sourcePath?: string
  }
  booking_click: VenueActionProperties
  website_click: VenueActionProperties
  phone_click: VenueActionProperties
  claim_listing_click: VenueActionProperties
  compare_add: {
    venueSlug: string
    sourcePageType: DirectoryPageType
    sourcePath: string
  }
  compare_remove: {
    venueSlug: string
    sourcePageType: DirectoryPageType
    sourcePath: string
  }
  compare_open: {
    venueCount: number
    sourcePageType: DirectoryPageType
    sourcePath: string
  }
  filter_apply: {
    filterType: DirectoryFilterType
    filterValue: string
    filterAction: "add" | "remove" | "set"
    pageType: DirectoryPageType
    sourcePath: string
    distanceFilterUsed?: boolean
  }
  filter_clear: {
    pageType: DirectoryPageType
    sourcePath: string
    filterCount: number
  }
  activity_discovery_click: {
    sourcePageType: DirectoryPageType
    sourcePath: string
    destinationIdentifier: string
    destinationPath: string
  }
  occasion_discovery_click: {
    sourcePageType: DirectoryPageType
    sourcePath: string
    destinationIdentifier: string
    destinationPath: string
  }
  location_discovery_click: {
    sourcePageType: DirectoryPageType
    sourcePath: string
    destinationIdentifier: string
    destinationPath: string
  }
}

export type DirectoryEventName = keyof DirectoryEventMap

const DIRECTORY_EVENT_PROPERTIES: {
  [EventName in DirectoryEventName]: readonly (keyof DirectoryEventMap[EventName])[]
} = {
  venue_view: ["venueSlug", "venueCity", "sourcePath"],
  booking_click: [
    "venueSlug",
    "venueCity",
    "pageType",
    "sourcePath",
    "ctaPlacement",
    "activity",
    "occasion",
    "discoveryLocation",
    "comparisonContext",
  ],
  website_click: [
    "venueSlug",
    "venueCity",
    "pageType",
    "sourcePath",
    "ctaPlacement",
    "activity",
    "occasion",
    "discoveryLocation",
    "comparisonContext",
  ],
  phone_click: [
    "venueSlug",
    "venueCity",
    "pageType",
    "sourcePath",
    "ctaPlacement",
    "activity",
    "occasion",
    "discoveryLocation",
    "comparisonContext",
  ],
  claim_listing_click: [
    "venueSlug",
    "venueCity",
    "pageType",
    "sourcePath",
    "ctaPlacement",
    "activity",
    "occasion",
    "discoveryLocation",
    "comparisonContext",
  ],
  compare_add: ["venueSlug", "sourcePageType", "sourcePath"],
  compare_remove: ["venueSlug", "sourcePageType", "sourcePath"],
  compare_open: ["venueCount", "sourcePageType", "sourcePath"],
  filter_apply: [
    "filterType",
    "filterValue",
    "filterAction",
    "pageType",
    "sourcePath",
    "distanceFilterUsed",
  ],
  filter_clear: ["pageType", "sourcePath", "filterCount"],
  activity_discovery_click: [
    "sourcePageType",
    "sourcePath",
    "destinationIdentifier",
    "destinationPath",
  ],
  occasion_discovery_click: [
    "sourcePageType",
    "sourcePath",
    "destinationIdentifier",
    "destinationPath",
  ],
  location_discovery_click: [
    "sourcePageType",
    "sourcePath",
    "destinationIdentifier",
    "destinationPath",
  ],
}

type GtagEventParams = Record<
  string,
  string | number | boolean | null | undefined | Array<Record<string, unknown>>
>

function isGaConfigured() {
  return typeof window !== "undefined" && typeof window.gtag === "function"
}

function productItem(product: AnalyticsProduct) {
  return {
    item_id: product.item_id,
    item_name: product.item_name,
    item_category: product.item_category,
    price: product.price,
    quantity: 1,
  }
}

export function trackEvent(eventName: string, params: GtagEventParams = {}) {
  if (!isAnalyticsConsentGranted() || !isGaConfigured()) {
    return false
  }

  window.gtag?.("event", eventName, params)
  return true
}

function cleanDirectoryString(value: string, maximumLength = 120) {
  return value.trim().slice(0, maximumLength)
}

function cleanDirectoryPath(value: string) {
  const pathOnly = value.trim().split(/[?#]/, 1)[0]
  return pathOnly.startsWith("/") ? pathOnly.slice(0, 160) : ""
}

function cleanDirectoryProperties<EventName extends DirectoryEventName>(
  eventName: EventName,
  properties: DirectoryEventMap[EventName]
) {
  const clean: Record<string, string | number | boolean> = {}

  for (const propertyName of DIRECTORY_EVENT_PROPERTIES[eventName]) {
    const value = properties[propertyName]
    if (typeof value === "string") {
      const cleaned =
        propertyName === "sourcePath" || propertyName === "destinationPath"
          ? cleanDirectoryPath(value)
          : cleanDirectoryString(value)
      if (cleaned) clean[propertyName as string] = cleaned
    } else if (typeof value === "number" && Number.isFinite(value)) {
      clean[propertyName as string] = value
    } else if (typeof value === "boolean") {
      clean[propertyName as string] = value
    }
  }

  return clean
}

/**
 * The directory's typed GA4 contract. Runtime allow-lists prevent accidental
 * additions such as coordinates, phone numbers, query strings or form data.
 */
export function trackDirectoryEvent<EventName extends DirectoryEventName>(
  eventName: EventName,
  properties: DirectoryEventMap[EventName]
) {
  trackEvent(eventName, cleanDirectoryProperties(eventName, properties))
}

/** Current route only: never includes query parameters, hashes or arbitrary search text. */
export function getDirectorySourcePath() {
  return typeof window === "undefined" ? "" : window.location.pathname.slice(0, 160)
}

/** Same-origin referrer route only. External referrers and their query strings are omitted. */
export function getSafeDirectoryReferrerPath() {
  if (typeof window === "undefined" || typeof document === "undefined" || !document.referrer) {
    return undefined
  }

  try {
    const referrer = new URL(document.referrer)
    return referrer.origin === window.location.origin
      ? referrer.pathname.slice(0, 160)
      : undefined
  } catch {
    return undefined
  }
}

export function trackViewItem(product: AnalyticsProduct) {
  trackEvent("view_item", {
    currency: product.currency,
    value: product.price,
    items: [productItem(product)],
  })
}

export function trackSelectItem(
  product: AnalyticsProduct,
  listName = "Digital Products"
) {
  trackEvent("select_item", {
    item_list_name: listName,
    items: [productItem(product)],
  })
}

export function trackViewItemList(
  products: AnalyticsProduct[],
  listName = "Digital Products"
) {
  if (!products.length) {
    return
  }

  trackEvent("view_item_list", {
    item_list_name: listName,
    items: products.map((product, index) => ({
      ...productItem(product),
      index,
    })),
  })
}

export function trackBeginCheckout(product: AnalyticsProduct) {
  trackEvent("begin_checkout", {
    currency: product.currency,
    value: product.price,
    items: [productItem(product)],
  })
}

export function trackCheckoutCancelView(product: AnalyticsProduct) {
  trackEvent("checkout_cancel_view", {
    currency: product.currency,
    value: product.price,
    items: [productItem(product)],
  })
}

export function trackCheckoutResumeClick(product: AnalyticsProduct) {
  trackEvent("checkout_resume_click", {
    currency: product.currency,
    value: product.price,
    items: [productItem(product)],
  })
}

export function trackPurchase(order: AnalyticsOrder) {
  return trackEvent("purchase", {
    transaction_id: order.transaction_id,
    currency: order.product.currency,
    value: order.product.price,
    tax: 0,
    shipping: 0,
    items: [productItem(order.product)],
  })
}

type AffiliateEventParams = {
  provider: string
  placement: string
  city: string
  listingSlug?: string
  recommendationId?: string
  plannerGroup?: string
  plannerVibe?: string
  plannerTiming?: string
}

function affiliateEventParams({
  provider,
  placement,
  city,
  listingSlug,
  recommendationId,
  plannerGroup,
  plannerVibe,
  plannerTiming,
}: AffiliateEventParams) {
  return {
    affiliate_provider: provider.slice(0, 80),
    affiliate_placement: placement.slice(0, 80),
    city: city.slice(0, 80),
    ...(listingSlug ? { listing_slug: listingSlug.slice(0, 80) } : {}),
    ...(recommendationId
      ? { recommendation_id: recommendationId.slice(0, 80) }
      : {}),
    ...(plannerGroup ? { planner_group: plannerGroup.slice(0, 80) } : {}),
    ...(plannerVibe ? { planner_vibe: plannerVibe.slice(0, 80) } : {}),
    ...(plannerTiming ? { planner_timing: plannerTiming.slice(0, 80) } : {}),
  }
}

/** Affiliate offer visibility and outbound click events — no PII. */
export function trackAffiliateOfferView(params: AffiliateEventParams) {
  trackEvent("affiliate_offer_view", affiliateEventParams(params))
}

export function trackAffiliateClick(params: AffiliateEventParams) {
  trackEvent("affiliate_click", affiliateEventParams(params))
}

export function trackAffiliatePlannerStart(params: AffiliateEventParams) {
  trackEvent("affiliate_planner_start", affiliateEventParams(params))
}

export function trackAffiliatePlannerAnswer(
  params: AffiliateEventParams & { step: string; choice: string }
) {
  trackEvent("affiliate_planner_answer", {
    ...affiliateEventParams(params),
    planner_step: params.step.slice(0, 80),
    planner_choice: params.choice.slice(0, 80),
  })
}

export function trackAffiliatePlannerComplete(params: AffiliateEventParams) {
  trackEvent("affiliate_planner_complete", affiliateEventParams(params))
}

export function trackProductDownload(
  product: AnalyticsProduct,
  fileName: string
) {
  trackEvent("file_download", {
    product_id: product.item_id,
    product_name: product.item_name,
    file_name: fileName,
    currency: product.currency,
    value: product.price,
  })
}

/** First-timer checklist lead-magnet funnel (no PII). */
export function trackFirstVisitChecklistView(source?: string) {
  trackEvent("first_visit_checklist_view", {
    lead_magnet: "first_visit_checklist",
    ...(source ? { lead_source: source } : {}),
  })
}

export function trackFirstVisitChecklistCtaClick(source?: string) {
  trackEvent("first_visit_checklist_cta_click", {
    lead_magnet: "first_visit_checklist",
    ...(source ? { lead_source: source } : {}),
  })
}

export function trackFirstVisitChecklistEmailSubmit(source?: string) {
  trackEvent("first_visit_checklist_email_submit", {
    lead_magnet: "first_visit_checklist",
    ...(source ? { lead_source: source } : {}),
  })
}

export function trackFirstVisitChecklistSuccess(source?: string) {
  trackEvent("first_visit_checklist_success", {
    lead_magnet: "first_visit_checklist",
    ...(source ? { lead_source: source } : {}),
  })
}

export function trackFirstVisitChecklistDownload(source?: string) {
  trackEvent("first_visit_checklist_download", {
    lead_magnet: "first_visit_checklist",
    ...(source ? { lead_source: source } : {}),
  })
}

export function trackFirstVisitChecklistFindVenueClick(source?: string) {
  trackEvent("first_visit_checklist_find_venue_click", {
    lead_magnet: "first_visit_checklist",
    ...(source ? { lead_source: source } : {}),
  })
}

/** Corporate Event Builder funnel (no PII — never send names, emails, or message bodies). */
const CORPORATE_BUILDER_PRODUCT = "corporate_event_builder"

export function trackCorporateEventBuilderView(source?: string) {
  trackEvent("corporate_event_builder_view", {
    product: CORPORATE_BUILDER_PRODUCT,
    ...(source ? { source } : {}),
  })
}

export function trackCorporateBuilderCheckoutClick(source?: string) {
  trackEvent("corporate_builder_checkout_click", {
    product: CORPORATE_BUILDER_PRODUCT,
    ...(source ? { source } : {}),
  })
}

export function trackCorporateBuilderPurchaseSuccess() {
  trackEvent("corporate_builder_purchase_success", {
    product: CORPORATE_BUILDER_PRODUCT,
  })
}

export function trackCorporateBuilderStarted() {
  trackEvent("corporate_builder_started", {
    product: CORPORATE_BUILDER_PRODUCT,
  })
}

export function trackCorporateBuilderBudgetCompleted() {
  trackEvent("corporate_builder_budget_completed", {
    product: CORPORATE_BUILDER_PRODUCT,
  })
}

export function trackCorporateBuilderVenueAdded() {
  trackEvent("corporate_builder_venue_added", {
    product: CORPORATE_BUILDER_PRODUCT,
  })
}

export function trackCorporateBuilderApprovalGenerated() {
  trackEvent("corporate_builder_approval_generated", {
    product: CORPORATE_BUILDER_PRODUCT,
  })
}

export function trackCorporateBuilderInvitationGenerated() {
  trackEvent("corporate_builder_invitation_generated", {
    product: CORPORATE_BUILDER_PRODUCT,
  })
}

export function trackCorporateBuilderPlanCompleted() {
  trackEvent("corporate_builder_plan_completed", {
    product: CORPORATE_BUILDER_PRODUCT,
  })
}

export function trackCorporateBuilderExport() {
  trackEvent("corporate_builder_export", {
    product: CORPORATE_BUILDER_PRODUCT,
  })
}

/** Corporate Booking System funnel (venue owners — never send customer PII). */
const CORPORATE_BOOKING_SYSTEM_PRODUCT = "corporate_booking_system"

export function trackCorporateBookingSystemView(source?: string) {
  trackEvent("corporate_booking_system_view", {
    product: CORPORATE_BOOKING_SYSTEM_PRODUCT,
    ...(source ? { source } : {}),
  })
}

export function trackCorporateBookingSystemCheckoutClick(source?: string) {
  trackEvent("corporate_booking_system_checkout_click", {
    product: CORPORATE_BOOKING_SYSTEM_PRODUCT,
    ...(source ? { source } : {}),
  })
}

export function trackCorporateBookingSystemPurchaseSuccess() {
  trackEvent("corporate_booking_system_purchase_success", {
    product: CORPORATE_BOOKING_SYSTEM_PRODUCT,
  })
}

export function trackCorporateBookingSystemSetupStarted() {
  trackEvent("corporate_booking_system_setup_started", {
    product: CORPORATE_BOOKING_SYSTEM_PRODUCT,
  })
}

export function trackCorporatePackageCreated() {
  trackEvent("corporate_package_created", {
    product: CORPORATE_BOOKING_SYSTEM_PRODUCT,
  })
}

export function trackCorporateLeadCreated() {
  trackEvent("corporate_lead_created", {
    product: CORPORATE_BOOKING_SYSTEM_PRODUCT,
  })
}

export function trackCorporateQuoteCreated() {
  trackEvent("corporate_quote_created", {
    product: CORPORATE_BOOKING_SYSTEM_PRODUCT,
  })
}

export function trackCorporateProposalGenerated() {
  trackEvent("corporate_proposal_generated", {
    product: CORPORATE_BOOKING_SYSTEM_PRODUCT,
  })
}

export function trackCorporateFollowupCompleted() {
  trackEvent("corporate_followup_completed", {
    product: CORPORATE_BOOKING_SYSTEM_PRODUCT,
  })
}

export function trackCorporateLeadMarkedBooked() {
  trackEvent("corporate_lead_marked_booked", {
    product: CORPORATE_BOOKING_SYSTEM_PRODUCT,
  })
}
