import { expect, test, type Page } from "@playwright/test"

test.skip(process.env.NEXT_PUBLIC_GYG_CURATED_ENABLED !== "true", "Enable the curated pilot build for these product journeys")

type Event = { name: string; properties: Record<string, string> }
async function setup(page: Page) {
  const analyzerRequests: string[] = []
  page.on("request", request => { if (request.url().includes("widget.getyourguide.com")) analyzerRequests.push(request.url()) })
  await page.route(/getyourguide\.com|googletagmanager\.com|google-analytics\.com|cloudflareinsights\.com|vercel-scripts|_vercel\/insights|googlesyndication|doubleclick/, route => route.fulfill({ contentType: "application/javascript", body: "/* mocked provider: no affiliate traffic */" }))
  await page.addInitScript(() => {
    const events: Event[] = []
    Object.defineProperty(window, "__gygEvents", { value: events })
    window.gtag = ((command: string, name: string, properties: Record<string, string>) => {
      if (command === "event") events.push({ name, properties })
    }) as typeof window.gtag
  })
  return analyzerRequests
}
async function events(page: Page, name: string) {
  return page.evaluate(name => ((window as unknown as { __gygEvents: Event[] }).__gygEvents || []).filter(event => event.name === name), name)
}
const guide = "/guides/best-rage-rooms-manchester"
const analyzer = 'script[data-consent-provider="getyourguide"]'

test("rejected visitors can use attributed links without Analyzer or analytics", async ({ page }) => {
  const requests = await setup(page)
  await page.goto(guide)
  await page.getByRole("button", { name: "Reject analytics" }).click()
  const module = page.getByRole("region", { name: "More to do in Manchester" })
  await module.scrollIntoViewIfNeeded()
  const link = module.locator('[data-affiliate-card]').first()
  await expect(link).toHaveAttribute("href", /-t155085\/\?partner_id=IZRRCJT&cmp=rr2_guide_manchester_general_etihad-tour/)
  await expect(link).toContainText("View dates & prices on GetYourGuide")
  await link.evaluate(element => element.addEventListener("click", event => event.preventDefault(), { capture: true, once: true }))
  await link.click()
  expect(requests).toHaveLength(0)
  expect(await events(page, "affiliate_click")).toEqual([])
  await expect(page.locator(analyzer)).toHaveCount(0)
})

test("consented module and individual cards are measured once when visible; filters retain placement", async ({ page }) => {
  const requests = await setup(page)
  await page.goto(guide)
  await page.getByRole("button", { name: "Accept analytics" }).click()
  await expect.poll(() => requests.length).toBe(1)
  await expect(page.locator(analyzer)).toHaveAttribute("data-gyg-partner-id", "IZRRCJT")
  const module = page.getByRole("region", { name: "More to do in Manchester" })
  const card = module.locator('[data-affiliate-card]').first()
  await card.scrollIntoViewIfNeeded()
  await expect.poll(async () => (await events(page, "affiliate_offer_view")).filter(e => e.properties.product_id === "155085").length).toBe(1)
  await module.getByRole("button", { name: "Personalise these picks" }).click()
  await module.getByLabel("Who is coming?").selectOption("friends")
  await module.getByLabel("When would you go?").selectOption("after")
  await expect(module.getByText("FunnyBoyz bingo & drag cabaret")).toBeVisible()
  await module.getByLabel("Who is coming?").selectOption("family")
  await expect(module.getByText("FunnyBoyz bingo & drag cabaret")).toHaveCount(0)
  await module.getByLabel("What would you enjoy?").selectOption("adrenaline")
  await expect(module.getByRole("status")).toContainText("no verified product")
  await module.getByLabel("What would you enjoy?").selectOption("sightseeing")
  const restored = module.locator('[data-affiliate-card]').first()
  await restored.scrollIntoViewIfNeeded()
  await restored.evaluate(element => element.addEventListener("click", event => event.preventDefault(), { capture: true, once: true }))
  await restored.click()
  const click = (await events(page, "affiliate_click")).at(-1)!
  expect(click.properties.campaign_id).toBe("rr2_guide_manchester_general_etihad-tour")
  expect(click.properties.product_id).toBe("155085")
  expect(click.properties.affiliate_placement).toBe("guide")
  expect((await events(page, "affiliate_offer_view")).filter(e => e.properties.product_id === "155085")).toHaveLength(1)
  expect((await events(page, "affiliate_module_view")).filter(e => e.properties.campaign_id === "rr2_guide_manchester_general_module")).toHaveLength(1)
  expect(requests).toHaveLength(1)
  // Image-less product cards have no broken or unapproved image.
  await expect(module.locator("img")).toHaveCount(0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false)
  await module.screenshot({ path: `test-results/gyg-${test.info().project.name}.png` })
})

test("Analyzer stays off on non-offer pages and stops after consent withdrawal", async ({ page }) => {
  const requests = await setup(page)
  await page.goto("/privacy")
  await page.getByRole("button", { name: "Accept analytics" }).click()
  await expect(page.locator('script[data-consent-provider="ga4"]')).toHaveCount(1)
  await expect(page.locator(analyzer)).toHaveCount(0)
  expect(requests).toHaveLength(0)
  await page.goto(guide)
  await expect.poll(() => requests.length).toBe(1)
  await page.getByRole("button", { name: "Privacy settings", exact: true }).click()
  await page.getByRole("checkbox", { name: /Analytics/ }).uncheck()
  await Promise.all([page.waitForEvent("load"), page.getByRole("button", { name: "Save settings" }).click()])
  await expect(page.locator(analyzer)).toHaveCount(0)
  await expect(page.getByRole("region", { name: "More to do in Manchester" })).toBeVisible()
  expect(requests).toHaveLength(1)
})

test("venue booking information precedes affiliate offers", async ({ page }) => {
  await setup(page)
  await page.goto("/listing/rage-out-maidstone-maidstone")
  await page.getByRole("button", { name: "Reject analytics" }).click()
  const booking = page.getByRole("heading", { name: "Booking & Visit Information" })
  const module = page.getByRole("region", { name: "More to do in Maidstone" })
  expect(await booking.evaluate((element) => !!(element.compareDocumentPosition(document.querySelector('[data-affiliate-module]')!) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true)
  await expect(page.getByRole("link", { name: "Check availability →" })).toHaveAttribute("href", /^https?:/)
  await expect(module.getByRole("link", { name: /Browse local experiences/ })).toHaveAttribute("href", /partner_id=IZRRCJT/)
})

test("module exposure does not count an off-screen product card", async ({ page }) => {
  await setup(page)
  await page.goto(guide)
  await page.getByRole("button", { name: "Accept analytics" }).click()
  const module = page.getByRole("region", { name: "More to do in Manchester" })
  const style = await page.addStyleTag({ content: '[data-affiliate-module] a[href*="-t155085/"] { margin-top: 850px; }' })
  await module.evaluate(element => element.scrollIntoView({ block: "start" }))
  await expect.poll(async () => (await events(page, "affiliate_module_view")).filter(e => e.properties.affiliate_placement === "guide").length).toBe(1)
  expect((await events(page, "affiliate_offer_view")).filter(e => e.properties.product_id === "155085")).toHaveLength(0)
  await style.evaluate(element => element.parentNode?.removeChild(element))
  await module.locator('a[href*="-t155085/"]').scrollIntoViewIfNeeded()
  await expect.poll(async () => (await events(page, "affiliate_offer_view")).filter(e => e.properties.product_id === "155085").length).toBe(1)
})

test("client navigation to a page without offers resets the Analyzer context", async ({ page }) => {
  const requests = await setup(page)
  await page.goto(guide)
  await page.getByRole("button", { name: "Accept analytics" }).click()
  await expect.poll(() => requests.length).toBe(1)
  await Promise.all([
    page.waitForEvent("load"),
    page.getByRole("link", { name: "Privacy", exact: true }).click(),
  ])
  await expect(page).toHaveURL(/\/privacy$/)
  await expect(page.locator(analyzer)).toHaveCount(0)
  await expect(page.locator('script[data-consent-provider="ga4"]')).toHaveCount(1)
  expect(requests).toHaveLength(1)
})

test("report-selected products support London comparison and Edinburgh family outings", async ({ page }) => {
  await setup(page)
  await page.goto("/guides/best-rage-rooms-london")
  await page.getByRole("button", { name: "Reject analytics" }).click()
  const london = page.getByRole("region", { name: "More to do in London" })
  await expect(london.getByText("About GetYourGuide", { exact: true })).toBeVisible()
  await expect(london.locator('a[href*="-t"]')).toHaveCount(2)
  await expect(london.locator('a[href*="-t170451/"]')).toContainText("allow extra time for queues")
  await page.goto("/guides/best-rage-rooms-edinburgh")
  const edinburgh = page.getByRole("region", { name: "More to do in Edinburgh" })
  await edinburgh.getByRole("button", { name: "Personalise these picks" }).click()
  await edinburgh.getByLabel("Who is coming?").selectOption("family")
  await expect(edinburgh.locator('a[href*="-t"]')).toHaveCount(1)
  await expect(edinburgh.locator('a[href*="-t156135/"]')).toContainText("Edinburgh Castle guided history tour")
  await expect(edinburgh.locator('a[href*="-t33266/"]')).toHaveCount(0)
  await edinburgh.screenshot({ path: `test-results/gyg-review-${test.info().project.name}.png` })
})
