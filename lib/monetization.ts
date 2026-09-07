/**
 * Optional commercial modules are disabled during the AdSense review period.
 * Product pages remain available to visitors who navigate to them directly.
 */
export const THIRD_PARTY_AFFILIATE_LINKS_ENABLED =
  process.env.NEXT_PUBLIC_AFFILIATE_LINKS_ENABLED === "true"

export const EDITORIAL_PRODUCT_PROMOS_ENABLED =
  process.env.NEXT_PUBLIC_EDITORIAL_PRODUCT_PROMOS_ENABLED === "true"
