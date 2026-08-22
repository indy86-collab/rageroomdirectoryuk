import { expect, test, type Locator, type Page } from "@playwright/test"

const CONSENT_KEY = "rageroom:privacy-consent"

type AnalyticsEvent = {
  name: string
  properties: Record<string, unknown>
}

function isAnalyticsTrackingRequest(url: string) {
  return /googletagmanager\.com|google-analytics\.com|cloudflareinsights\.com|va\.vercel-scripts\.com|\/_vercel\/insights/.test(
    url
  )
}

function isProviderRequest(url: string) {
  return isAnalyticsTrackingRequest(url) || /googlesyndication\.com|doubleclick\.net/.test(url)
}

async function mockTrackingProviders(page: Page) {
  const requests: string[] = []
  page.on("request", (request) => {
    if (isProviderRequest(request.url())) requests.push(request.url())
  })
  await page.route(
    /googletagmanager\.com|google-analytics\.com|cloudflareinsights\.com|va\.vercel-scripts\.com|\/_vercel\/insights|googlesyndication\.com|doubleclick\.net/,
    (route) => route.abort()
  )
  return requests
}

function analyticsRequests(requests: string[]) {
  return requests.filter(isAnalyticsTrackingRequest)
}

async function setStoredConsent(page: Page, analytics: boolean) {
  await page.addInitScript(
    ({ key, allowed }) => {
      localStorage.setItem(
        key,
        JSON.stringify({ version: 1, analytics: allowed, decidedAt: Date.now() })
      )
    },
    { key: CONSENT_KEY, allowed: analytics }
  )
}

async function installAnalyticsRecorder(page: Page) {
  await page.addInitScript(() => {
    const events: AnalyticsEvent[] = []
    Object.defineProperty(window, "__consentTestEvents", {
      value: events,
      configurable: false,
    })
    Object.defineProperty(window, "gtag", {
      value: (command: string, name: string, properties: Record<string, unknown>) => {
        if (command === "event") events.push({ name, properties })
        if (
          command === "consent" &&
          name === "update" &&
          properties.analytics_storage === "denied"
        ) {
          sessionStorage.setItem("__consent_test_denied", "1")
        }
      },
      configurable: false,
      writable: false,
    })
  })
}

async function recordedEvents(page: Page, name?: string): Promise<AnalyticsEvent[]> {
  return page.evaluate((eventName) => {
    const events = (window as typeof window & {
      __consentTestEvents?: AnalyticsEvent[]
    }).__consentTestEvents ?? []
    return eventName ? events.filter((event) => event.name === eventName) : events
  }, name)
}

async function clickWithoutNavigation(locator: Locator) {
  await locator.evaluate((element) => {
    element.addEventListener("click", (event) => event.preventDefault(), {
      capture: true,
      once: true,
    })
  })
  await locator.click()
}

test.describe("consent-aware analytics", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "Chromium audit journeys")

  test("first visit rejects analytics and booking remains usable", async ({ page }) => {
    const requests = await mockTrackingProviders(page)
    await page.goto("/")

    await expect(page.getByTestId("consent-banner")).toBeVisible()
    await expect(page.getByRole("button", { name: "Accept analytics" })).toBeVisible()
    await expect(page.getByRole("button", { name: "Reject analytics" })).toBeVisible()
    await page.waitForTimeout(300)
    expect(analyticsRequests(requests)).toEqual([])

    await page.getByRole("button", { name: "Reject analytics" }).click()
    await expect(page.getByTestId("consent-banner")).toBeHidden()
    await page.goto("/listing/rage-out-maidstone-maidstone")

    await expect(page.locator('iframe[src*="google.com/maps"]')).toHaveCount(0)
    await expect(
      page.getByRole("button", {
        name: "Load interactive map for Rage Out Maidstone — Maidstone",
      })
    ).toBeVisible()
    await expect(
      page.locator('script[src*="widget.getyourguide.com"]')
    ).toHaveCount(0)
    await expect(
      page.getByRole("button", { name: "Show nearby GetYourGuide activities in Maidstone" })
    ).toBeVisible()
    const booking = page.getByRole("link", { name: "Book Your Session →" })
    await expect(booking).toHaveAttribute("href", /^https?:\/\//)
    await clickWithoutNavigation(booking)
    expect(analyticsRequests(requests)).toEqual([])
  })

  test("accept enables a representative typed analytics event", async ({ page }) => {
    await installAnalyticsRecorder(page)
    const requests = await mockTrackingProviders(page)
    await page.goto("/")
    await page.getByRole("button", { name: "Accept analytics" }).click()

    await expect.poll(() => requests.some((url) => url.includes("googletagmanager.com"))).toBe(true)
    await expect.poll(() => requests.some((url) => url.includes("cloudflareinsights.com"))).toBe(true)
    await expect.poll(() => requests.some((url) => /vercel-scripts|_vercel\/insights/.test(url))).toBe(true)

    await page.goto("/listing/rage-out-maidstone-maidstone")
    await expect.poll(async () => (await recordedEvents(page, "venue_view")).length).toBe(1)
  })

  test("withdrawal stops events and cleans removable analytics state", async ({ page }) => {
    await setStoredConsent(page, true)
    await installAnalyticsRecorder(page)
    await mockTrackingProviders(page)
    await page.goto("/listing/rage-out-maidstone-maidstone")
    await expect.poll(async () => (await recordedEvents(page, "venue_view")).length).toBe(1)

    await page.evaluate(() => {
      localStorage.setItem("purchase_tracked_test", "true")
      localStorage.setItem("rage-reset-v1", "essential-progress")
      document.cookie = "_ga=test; path=/; SameSite=Lax"
    })
    await page.getByRole("button", { name: "Privacy settings" }).click()
    const analytics = page.getByRole("checkbox", { name: /Analytics/ })
    await expect(analytics).toBeChecked()
    await analytics.uncheck()
    await Promise.all([
      page.waitForNavigation({ waitUntil: "domcontentloaded" }),
      page.getByRole("button", { name: "Save settings" }).click(),
    ])

    expect(
      await page.evaluate(() => ({
        purchase: localStorage.getItem("purchase_tracked_test"),
        progress: localStorage.getItem("rage-reset-v1"),
        cookies: document.cookie,
        deniedUpdate: sessionStorage.getItem("__consent_test_denied"),
      }))
    ).toEqual({
      purchase: null,
      progress: "essential-progress",
      cookies: "",
      deniedUpdate: "1",
    })

    await clickWithoutNavigation(page.getByRole("link", { name: "Book Your Session →" }))
    expect(await recordedEvents(page, "booking_click")).toEqual([])
  })

  test("returning rejected visitor remains untracked without repeated banner", async ({ page }) => {
    await setStoredConsent(page, false)
    const requests = await mockTrackingProviders(page)
    await page.goto("/listings")
    await expect(page.getByTestId("consent-banner")).toHaveCount(0)
    await expect(page.getByRole("heading", { name: "UK Rage Rooms & Destructive Experiences" })).toBeVisible()
    expect(analyticsRequests(requests)).toEqual([])
  })

  test("returning accepted visitor restores provider initialization", async ({ page }) => {
    await setStoredConsent(page, true)
    const requests = await mockTrackingProviders(page)
    await page.goto("/")
    await expect(page.getByTestId("consent-banner")).toHaveCount(0)
    await expect.poll(() => requests.some((url) => url.includes("googletagmanager.com"))).toBe(true)
    await expect.poll(() => requests.some((url) => url.includes("cloudflareinsights.com"))).toBe(true)
  })

  test("mobile consent UI fits and keeps both primary choices visible", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 })
    await page.goto("/")

    await expect(page.getByRole("button", { name: "Accept analytics" })).toBeVisible()
    await expect(page.getByRole("button", { name: "Reject analytics" })).toBeVisible()
    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    )
    expect(hasHorizontalOverflow).toBe(false)
  })

  test("keyboard users can reject and operate the preferences dialog", async ({ page }) => {
    await page.goto("/")
    const reject = page.getByRole("button", { name: "Reject analytics" })
    await reject.focus()
    await page.keyboard.press("Enter")
    await expect(page.getByTestId("consent-banner")).toHaveCount(0)

    const settings = page.getByRole("button", { name: "Privacy settings" })
    await settings.focus()
    await page.keyboard.press("Enter")
    await expect(page.getByRole("dialog", { name: "Privacy settings" })).toBeVisible()
    await expect(page.getByRole("checkbox", { name: /Analytics/ })).not.toBeChecked()
    await page.keyboard.press("Shift+Tab")
    await expect(page.getByRole("button", { name: "Save settings" })).toBeFocused()
    await page.keyboard.press("Escape")
    await expect(page.getByRole("dialog", { name: "Privacy settings" })).toHaveCount(0)
    await expect(settings).toBeFocused()
  })

  test("privacy settings are accessible from the footer and policy", async ({ page }) => {
    await setStoredConsent(page, false)
    await page.goto("/privacy")
    const controls = page.getByRole("button", { name: "Privacy settings" })
    await expect(controls).toHaveCount(2)
    await controls.last().click()
    await expect(page.getByRole("dialog", { name: "Privacy settings" })).toBeVisible()
  })
})
