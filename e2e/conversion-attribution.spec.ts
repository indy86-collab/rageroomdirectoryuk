import { expect, test, type Locator, type Page } from "@playwright/test"

type CapturedEvent = {
  name: string
  properties: Record<string, string | number | boolean>
}

async function installAnalyticsRecorder(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem(
      "rageroom:privacy-consent",
      JSON.stringify({ version: 1, analytics: true, decidedAt: Date.now() })
    )
    const events: Array<{ name: string; properties: Record<string, unknown> }> = []
    Object.defineProperty(window, "__directoryAnalyticsEvents", {
      value: events,
      configurable: false,
    })
    Object.defineProperty(window, "gtag", {
      value: (command: string, name: string, properties: Record<string, unknown>) => {
        if (command === "event") events.push({ name, properties })
      },
      configurable: false,
      writable: false,
    })
  })
}

async function capturedEvents(page: Page, name?: string): Promise<CapturedEvent[]> {
  return page.evaluate((eventName) => {
    const events = (window as typeof window & {
      __directoryAnalyticsEvents?: CapturedEvent[]
    }).__directoryAnalyticsEvents ?? []
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

test.describe("directory conversion attribution", () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googletagmanager\.com|google-analytics\.com|cloudflareinsights\.com|va\.vercel-scripts\.com|\/_vercel\/insights/,
      (route) => route.abort()
    )
    await installAnalyticsRecorder(page)
  })

  test("venue view and outbound actions are distinct, single and PII-safe", async ({ page }) => {
    await page.goto("/listing/rage-out-maidstone-maidstone")
    await expect(page.getByRole("heading", { level: 1, name: "Rage Out Maidstone" })).toBeVisible()

    await expect.poll(async () => (await capturedEvents(page, "venue_view")).length).toBe(1)
    expect((await capturedEvents(page, "venue_view"))[0].properties).toMatchObject({
      venueSlug: "rage-out-maidstone-maidstone",
      venueCity: "Maidstone",
    })

    await clickWithoutNavigation(page.getByRole("link", { name: "Book Your Session →" }))
    const bookingEvents = await capturedEvents(page, "booking_click")
    expect(bookingEvents).toHaveLength(1)
    expect(bookingEvents[0].properties).toMatchObject({
      venueSlug: "rage-out-maidstone-maidstone",
      pageType: "venue",
      ctaPlacement: "venue_hero",
      sourcePath: "/listing/rage-out-maidstone-maidstone",
    })

    await clickWithoutNavigation(page.getByRole("link", { name: "rageout.co.uk/" }))
    expect(await capturedEvents(page, "website_click")).toHaveLength(1)
    expect(await capturedEvents(page, "booking_click")).toHaveLength(1)

    await clickWithoutNavigation(page.locator('a[href^="tel:"]'))
    const phoneEvents = await capturedEvents(page, "phone_click")
    expect(phoneEvents).toHaveLength(1)
    expect(phoneEvents[0].properties).toMatchObject({
      venueSlug: "rage-out-maidstone-maidstone",
      ctaPlacement: "venue_contact",
    })
    expect(phoneEvents[0].properties).not.toHaveProperty("phone")
    expect(phoneEvents[0].properties).not.toHaveProperty("phoneNumber")

    await clickWithoutNavigation(page.getByRole("link", { name: "Claim this listing" }))
    expect((await capturedEvents(page, "claim_listing_click"))[0].properties).toMatchObject({
      venueSlug: "rage-out-maidstone-maidstone",
      venueCity: "Maidstone",
      pageType: "venue",
      ctaPlacement: "listing_owner_panel",
    })

    expect(JSON.stringify(await capturedEvents(page))).not.toMatch(/latitude|longitude|person@|\+44 1622/)
    expect(await capturedEvents(page, "venue_view")).toHaveLength(1)
  })

  test("result booking, comparison and filters carry stable attribution", async ({ page }) => {
    await page.goto("/activities/axe-throwing")
    const booking = page
      .locator("article", {
        has: page.getByRole("heading", { name: "Axed and Enraged", exact: true }),
      })
      .getByRole("link", { name: "Check availability" })
    await clickWithoutNavigation(booking)
    expect((await capturedEvents(page, "booking_click"))[0].properties).toMatchObject({
      pageType: "activity",
      ctaPlacement: "activity_results",
      activity: "axe-throwing",
    })

    await page.goto("/listings")
    const cards = page.locator("#venues article")
    await cards.nth(0).getByRole("button", { name: "Compare venue" }).click()
    await cards.nth(1).getByRole("button", { name: "Compare venue" }).click()
    await expect(page.getByRole("heading", { name: "Compare selected venues" })).toBeVisible()
    expect(await capturedEvents(page, "compare_add")).toHaveLength(2)
    expect(await capturedEvents(page, "compare_open")).toHaveLength(1)

    await cards.nth(0).getByRole("button", { name: /Added to comparison/ }).click()
    expect(await capturedEvents(page, "compare_remove")).toHaveLength(1)

    const filters = page.getByRole("button", { name: /filter venues/i })
    const filtersAreInteractive = await filters.evaluate(
      (element) => window.getComputedStyle(element).pointerEvents !== "none"
    )
    if (filtersAreInteractive && (await filters.getAttribute("aria-expanded")) === "false") {
      await filters.click()
    }
    await page.getByLabel("Location").selectOption("Maidstone")
    expect((await capturedEvents(page, "filter_apply")).at(-1)?.properties).toMatchObject({
      filterType: "city",
      filterValue: "maidstone",
      filterAction: "set",
      pageType: "search_results",
    })
    await page.getByRole("button", { name: "Reset" }).click()
    expect(await capturedEvents(page, "filter_clear")).toHaveLength(1)
  })

  test("activity and occasion hubs emit curated discovery transitions", async ({ page }) => {
    await page.goto("/activities")
    const activityLink = page.getByRole("link", { name: /Axe Throwing/ }).first()
    await clickWithoutNavigation(activityLink)
    expect((await capturedEvents(page, "activity_discovery_click"))[0].properties).toMatchObject({
      sourcePageType: "activity",
      destinationIdentifier: "axe-throwing",
      destinationPath: "/activities/axe-throwing",
    })

    await page.goto("/occasions")
    const occasionLink = page.locator('a[href="/occasions/birthdays"]', {
      has: page.getByRole("heading", { name: "Birthday Rage Rooms" }),
    })
    await clickWithoutNavigation(occasionLink)
    expect((await capturedEvents(page, "occasion_discovery_click"))[0].properties).toMatchObject({
      sourcePageType: "occasion",
      destinationIdentifier: "birthdays",
      destinationPath: "/occasions/birthdays",
    })
  })

  test("inventory-backed location navigation emits normalized location context", async ({ page }) => {
    await page.goto("/activities/rage-rooms")
    const locationLink = page.getByRole("link", { name: "Birmingham (3)" })
    await clickWithoutNavigation(locationLink)
    expect((await capturedEvents(page, "location_discovery_click"))[0].properties).toMatchObject({
      sourcePageType: "activity",
      sourcePath: "/activities/rage-rooms",
      destinationIdentifier: "birmingham",
      destinationPath: "/activities/rage-rooms/birmingham",
    })
  })
})
