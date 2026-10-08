/**
 * Awin deep links for experience-gift merchants. Every value comes from the
 * owner's approved Awin account; an unconfigured merchant produces no link.
 */
export const AWIN_MERCHANTS = ["virginexperiencedays", "buyagift", "redletterdays"] as const
export type AwinMerchant = (typeof AWIN_MERCHANTS)[number]

export const AWIN_MERCHANT_INFO: Record<AwinMerchant, { name: string; hosts: string[]; homepage: string }> = {
  virginexperiencedays: {
    name: "Virgin Experience Days",
    hosts: ["virginexperiencedays.co.uk"],
    homepage: "https://www.virginexperiencedays.co.uk/",
  },
  buyagift: { name: "Buyagift", hosts: ["buyagift.co.uk"], homepage: "https://www.buyagift.co.uk/" },
  redletterdays: { name: "Red Letter Days", hosts: ["redletterdays.co.uk"], homepage: "https://www.redletterdays.co.uk/" },
}

export type AwinConfig = {
  publisherId?: string | null
  merchantIds: Partial<Record<AwinMerchant, string | null | undefined>>
  /** Optional approved landing page per merchant (e.g. an adrenaline or rage-room category). */
  landingUrls?: Partial<Record<AwinMerchant, string | null | undefined>>
}

// Literal process.env reads so Next.js inlines NEXT_PUBLIC values at build time.
export function readAwinConfig(): AwinConfig {
  return {
    publisherId: process.env.NEXT_PUBLIC_AWIN_PUBLISHER_ID,
    merchantIds: {
      virginexperiencedays: process.env.NEXT_PUBLIC_AWIN_MID_VIRGIN_EXPERIENCE_DAYS,
      buyagift: process.env.NEXT_PUBLIC_AWIN_MID_BUYAGIFT,
      redletterdays: process.env.NEXT_PUBLIC_AWIN_MID_RED_LETTER_DAYS,
    },
    landingUrls: {
      virginexperiencedays: process.env.NEXT_PUBLIC_AWIN_LANDING_VIRGIN_EXPERIENCE_DAYS,
      buyagift: process.env.NEXT_PUBLIC_AWIN_LANDING_BUYAGIFT,
      redletterdays: process.env.NEXT_PUBLIC_AWIN_LANDING_RED_LETTER_DAYS,
    },
  }
}

const NUMERIC_ID = /^\d{1,12}$/

export function isAwinMerchantConfigured(config: AwinConfig, merchant: AwinMerchant): boolean {
  return NUMERIC_ID.test(config.publisherId?.trim() || "") &&
    NUMERIC_ID.test(config.merchantIds[merchant]?.trim() || "")
}

/** Destination must be https on the merchant's own domain. */
export function isMerchantDestination(merchant: AwinMerchant, destination: string): boolean {
  try {
    const url = new URL(destination)
    if (url.protocol !== "https:" || url.username || url.password) return false
    const host = url.hostname.toLowerCase()
    return AWIN_MERCHANT_INFO[merchant].hosts.some((h) => host === h || host.endsWith(`.${h}`))
  } catch {
    return false
  }
}

export function buildAwinDeepLink(
  config: AwinConfig,
  merchant: AwinMerchant,
  destination: string,
  clickref?: string
): string | null {
  if (!isAwinMerchantConfigured(config, merchant)) return null
  if (!isMerchantDestination(merchant, destination)) return null
  const url = new URL("https://www.awin1.com/cread.php")
  url.searchParams.set("awinmid", config.merchantIds[merchant]!.trim())
  url.searchParams.set("awinaffid", config.publisherId!.trim())
  if (clickref) url.searchParams.set("clickref", clickref.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 50))
  url.searchParams.set("ued", destination)
  return url.toString()
}

/** Landing page for a merchant-level "browse" link: approved override, else homepage. */
export function merchantLandingUrl(config: AwinConfig, merchant: AwinMerchant): string {
  const override = config.landingUrls?.[merchant]?.trim()
  return override && isMerchantDestination(merchant, override) ? override : AWIN_MERCHANT_INFO[merchant].homepage
}
