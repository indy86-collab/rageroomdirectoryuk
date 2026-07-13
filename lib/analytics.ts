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
  return Boolean(
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID &&
      typeof window !== "undefined" &&
      typeof window.gtag === "function"
  )
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
