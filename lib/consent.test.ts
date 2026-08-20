import { afterEach, describe, expect, it, vi } from "vitest"
import {
  CONSENT_MAX_AGE_MS,
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
  clearAnalyticsStorage,
  isAnalyticsConsentGranted,
  parseConsentPreferences,
  writeConsentPreferences,
} from "./consent"

describe("consent preferences", () => {
  afterEach(() => vi.unstubAllGlobals())

  it("treats a fresh visitor as undecided and analytics disabled", () => {
    vi.stubGlobal("window", {
      localStorage: { getItem: vi.fn(() => null) },
    })
    expect(parseConsentPreferences(null)).toBeNull()
    expect(isAnalyticsConsentGranted()).toBe(false)
  })

  it("accepts a current, unexpired decision", () => {
    const now = 2_000_000
    expect(
      parseConsentPreferences(
        JSON.stringify({ version: CONSENT_VERSION, analytics: true, decidedAt: now - 1 }),
        now
      )
    ).toEqual({ version: CONSENT_VERSION, analytics: true, decidedAt: now - 1 })
  })

  it("requests a fresh choice for stale versions, expiry or malformed data", () => {
    const now = CONSENT_MAX_AGE_MS + 10_000
    expect(
      parseConsentPreferences(
        JSON.stringify({ version: 0, analytics: true, decidedAt: now - 1 }),
        now
      )
    ).toBeNull()
    expect(
      parseConsentPreferences(
        JSON.stringify({ version: CONSENT_VERSION, analytics: false, decidedAt: 1 }),
        now
      )
    ).toBeNull()
    expect(parseConsentPreferences("not-json", now)).toBeNull()
  })

  it("stores only version, analytics choice and timestamp", () => {
    const setItem = vi.fn()
    const dispatchEvent = vi.fn()
    vi.stubGlobal("CustomEvent", class {
      constructor(public type: string, public init: unknown) {}
    })
    vi.stubGlobal("window", {
      localStorage: { setItem },
      dispatchEvent,
    })

    writeConsentPreferences(false, 1234)

    expect(setItem).toHaveBeenCalledWith(
      CONSENT_STORAGE_KEY,
      JSON.stringify({ version: CONSENT_VERSION, analytics: false, decidedAt: 1234 })
    )
    expect(dispatchEvent).toHaveBeenCalledOnce()
  })

  it("keeps an accepted current-page decision when storage is blocked", () => {
    vi.stubGlobal("CustomEvent", class {
      constructor(public type: string, public init: unknown) {}
    })
    vi.stubGlobal("window", {
      localStorage: {
        getItem: vi.fn(() => { throw new Error("blocked") }),
        setItem: vi.fn(() => { throw new Error("blocked") }),
      },
      dispatchEvent: vi.fn(),
    })

    writeConsentPreferences(true, 1234)
    expect(isAnalyticsConsentGranted()).toBe(true)
  })

  it("removes analytics state without deleting essential feature storage", () => {
    const values = new Map([
      ["purchase_tracked_session", "true"],
      [CONSENT_STORAGE_KEY, "decision"],
      ["rage-reset-v1", "progress"],
    ])
    const localStorage = {
      get length() { return values.size },
      key: vi.fn((index: number) => Array.from(values.keys())[index] ?? null),
      removeItem: vi.fn((key: string) => values.delete(key)),
    }
    vi.stubGlobal("window", {
      localStorage,
      location: { hostname: "rageroomdirectory.co.uk" },
    })
    vi.stubGlobal("document", { cookie: "_ga=abc; essential=value" })

    clearAnalyticsStorage()

    expect(values.has("purchase_tracked_session")).toBe(false)
    expect(values.get(CONSENT_STORAGE_KEY)).toBe("decision")
    expect(values.get("rage-reset-v1")).toBe("progress")
  })
})
