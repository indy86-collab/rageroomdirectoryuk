export const DISPLAY_AD_PROVIDERS = ["adsense", "journey", "none"] as const
export type DisplayAdProvider = (typeof DISPLAY_AD_PROVIDERS)[number]

export function resolveDisplayAdProvider(value: string | undefined): DisplayAdProvider {
  const v = value?.trim().toLowerCase()
  return (DISPLAY_AD_PROVIDERS as readonly string[]).includes(v || "") ? (v as DisplayAdProvider) : "adsense"
}

/** Default stays AdSense so behaviour is unchanged until the owner switches. */
export const DISPLAY_AD_PROVIDER = resolveDisplayAdProvider(process.env.NEXT_PUBLIC_DISPLAY_AD_PROVIDER)

/** Exact script src copied from the Journey dashboard; https only. */
export function validJourneyScriptUrl(value: string | undefined): string | null {
  const v = value?.trim()
  if (!v) return null
  try {
    const url = new URL(v)
    return url.protocol === "https:" && !url.username && !url.password ? url.toString() : null
  } catch {
    return null
  }
}

export const JOURNEY_SCRIPT_URL = validJourneyScriptUrl(process.env.NEXT_PUBLIC_JOURNEY_SCRIPT_URL)
