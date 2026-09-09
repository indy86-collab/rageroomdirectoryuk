/**
 * Commercial modules are visible by default on relevant planning journeys.
 * They are separate from AdSense and can still be disabled per environment.
 */
export const THIRD_PARTY_AFFILIATE_LINKS_ENABLED =
  process.env.NEXT_PUBLIC_AFFILIATE_LINKS_ENABLED !== "false"

export const EDITORIAL_PRODUCT_PROMOS_ENABLED =
  process.env.NEXT_PUBLIC_EDITORIAL_PRODUCT_PROMOS_ENABLED !== "false"
