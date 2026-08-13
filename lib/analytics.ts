"use client"

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
  if (!isGaConfigured()) {
    return
  }

  window.gtag?.("event", eventName, params)
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
  trackEvent("purchase", {
    transaction_id: order.transaction_id,
    currency: order.product.currency,
    value: order.product.price,
    tax: 0,
    shipping: 0,
    items: [productItem(order.product)],
  })
}

/** Outbound venue booking click — no PII. Mark as a GA4 key event. */
export function trackGenerateLead({
  source,
  listingSlug,
  city,
}: {
  source: string
  listingSlug?: string
  city?: string
}) {
  trackEvent("generate_lead", {
    currency: "GBP",
    value: 0,
    lead_source: source.slice(0, 80),
    ...(listingSlug ? { listing_slug: listingSlug.slice(0, 80) } : {}),
    ...(city ? { city: city.slice(0, 80) } : {}),
  })
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
