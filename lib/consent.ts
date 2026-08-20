export const CONSENT_STORAGE_KEY = "rageroom:privacy-consent"
export const CONSENT_VERSION = 1 as const
export const CONSENT_MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000
export const CONSENT_CHANGE_EVENT = "rageroom:consent-changed"
export const OPEN_PRIVACY_SETTINGS_EVENT = "rageroom:open-privacy-settings"
export const ANALYTICS_READY_EVENT = "rageroom:analytics-ready"

export type ConsentPreferences = {
  version: typeof CONSENT_VERSION
  analytics: boolean
  decidedAt: number
}

let inMemoryPreferences: ConsentPreferences | null | undefined

export function parseConsentPreferences(
  raw: string | null,
  now = Date.now()
): ConsentPreferences | null {
  if (!raw) return null

  try {
    const value = JSON.parse(raw) as Partial<ConsentPreferences>
    if (
      value.version !== CONSENT_VERSION ||
      typeof value.analytics !== "boolean" ||
      typeof value.decidedAt !== "number" ||
      !Number.isFinite(value.decidedAt) ||
      value.decidedAt > now ||
      now - value.decidedAt > CONSENT_MAX_AGE_MS
    ) {
      return null
    }

    return {
      version: CONSENT_VERSION,
      analytics: value.analytics,
      decidedAt: value.decidedAt,
    }
  } catch {
    return null
  }
}

export function readConsentPreferences(now = Date.now()) {
  if (typeof window === "undefined") return null

  try {
    const stored = parseConsentPreferences(
      window.localStorage.getItem(CONSENT_STORAGE_KEY),
      now
    )
    inMemoryPreferences = stored
    return stored
  } catch {
    return inMemoryPreferences ?? null
  }
}

export function writeConsentPreferences(analytics: boolean, now = Date.now()) {
  const preferences: ConsentPreferences = {
    version: CONSENT_VERSION,
    analytics,
    decidedAt: now,
  }
  inMemoryPreferences = preferences

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(
        CONSENT_STORAGE_KEY,
        JSON.stringify(preferences)
      )
    } catch {
      // A decision still applies for this page when storage is unavailable.
    }

    window.dispatchEvent(
      new CustomEvent<ConsentPreferences>(CONSENT_CHANGE_EVENT, {
        detail: preferences,
      })
    )
  }

  return preferences
}

export function isAnalyticsConsentGranted() {
  return readConsentPreferences()?.analytics === true
}

const ANALYTICS_COOKIE_PREFIXES = ["_ga", "_gid", "_gat", "_gac_"]

export function clearAnalyticsStorage() {
  if (typeof window === "undefined" || typeof document === "undefined") return

  try {
    for (let index = window.localStorage.length - 1; index >= 0; index -= 1) {
      const key = window.localStorage.key(index)
      if (key?.startsWith("purchase_tracked_")) {
        window.localStorage.removeItem(key)
      }
    }
  } catch {
    // Storage cleanup is best-effort when a browser blocks storage access.
  }

  const cookieNames = document.cookie
    .split(";")
    .map((cookie) => cookie.split("=", 1)[0]?.trim())
    .filter(
      (name): name is string =>
        Boolean(name) &&
        ANALYTICS_COOKIE_PREFIXES.some((prefix) => name.startsWith(prefix))
    )

  const hostname = window.location.hostname
  const domains = ["", hostname, `.${hostname}`]
  if (hostname.endsWith("rageroomdirectory.co.uk")) {
    domains.push("rageroomdirectory.co.uk", ".rageroomdirectory.co.uk")
  }

  for (const name of cookieNames) {
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${
        domain ? `; domain=${domain}` : ""
      }; SameSite=Lax`
    }
  }
}

export function denyGoogleConsent() {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return

  window.gtag("consent", "update", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  })
}
