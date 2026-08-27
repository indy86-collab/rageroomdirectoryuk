import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "rageroom:privacy-consent",
      JSON.stringify({ version: 1, analytics: false, decidedAt: Date.now() })
    )
    const store = { value: "" }
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          store.value = text
        },
        readText: async () => store.value,
      },
    })
  })
})

async function assertNoHorizontalOverflow(page: import("@playwright/test").Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(overflow).toBeLessThanOrEqual(1)
}

test.describe("UK Rage Room Report 2026", () => {
  test("flagship report is an indexable research publication with citation and dataset access", async ({
    page,
    request,
  }) => {
    test.setTimeout(60_000)
    const html = await (await request.get("/uk-rage-room-report-2026")).text()
    expect(html).toContain("UK Rage Room Report 2026")
    expect(html).toMatch(/currently tracks \d+ verified listings/)
    expect(html).toContain("Cite this report")
    expect(html).toContain("/uk-rage-room-report-2026/data.csv")
    expect(html).toContain('"@type":"Article"')
    expect(html).toContain('"@type":"Dataset"')
    expect(html).not.toContain("rageroom.co.uk")
    expect(html).not.toMatch(/noindex/)

    await page.goto("/uk-rage-room-report-2026")
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /\/uk-rage-room-report-2026$/
    )
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("UK Rage Room Report 2026")
    await expect(page.getByRole("heading", { name: "Executive summary" })).toBeVisible()
    await expect(page.getByRole("heading", { name: "Cite this report" })).toBeVisible()
    await expect(page.getByRole("heading", { name: "Methodology" })).toBeVisible()
    await expect(page.getByRole("link", { name: /Download the aggregate CSV/i })).toHaveAttribute(
      "href",
      "/uk-rage-room-report-2026/data.csv"
    )
    await expect(page.getByRole("button", { name: "Copy citation" })).toBeVisible()
    await assertNoHorizontalOverflow(page)
  })

  test("citation button copies plain-text attribution", async ({ page }) => {
    await page.goto("/uk-rage-room-report-2026")
    await page.getByRole("button", { name: "Copy citation" }).click()
    await expect(page.getByRole("button", { name: "Copied" })).toBeVisible()
    const text = await page.evaluate(() => navigator.clipboard.readText())
    expect(text).toContain("RageRoom Directory, UK Rage Room Report 2026")
    expect(text).toContain("https://www.rageroomdirectory.co.uk/uk-rage-room-report-2026")
    expect(text).not.toContain("<a")
  })

  test("aggregate dataset download stays private-data-free", async ({ request }) => {
    const response = await request.get("/uk-rage-room-report-2026/data.csv")
    expect(response.status()).toBe(200)
    expect(response.headers()["content-type"]).toMatch(/text\/csv/)
    const csv = await response.text()
    expect(csv).toContain("category,metric,value")
    expect(csv).toContain("verified_listings")
    expect(csv).toContain("per_person_average_gbp")
    expect(csv).not.toMatch(/@gmail\.com|bookingUrl|googlePlaceId|streetAddress/i)
  })
})

test.describe("Insights research hub and directory callouts", () => {
  test("insights hub and price research remain distinct from the live prices guide", async ({ page }) => {
    test.setTimeout(60_000)
    await page.goto("/insights")
    await expect(page.getByRole("heading", { level: 1 })).toContainText("UK Rage Room Statistics")
    await expect(page.getByRole("heading", { name: /How many rage rooms does RageRoom Directory track/i })).toBeVisible()
    await expect(page.getByRole("link", { name: /UK Rage Room Report 2026/ }).first()).toBeVisible()

    await page.goto("/insights/rage-room-prices")
    await expect(page.getByRole("heading", { name: /How much does a rage room cost in the UK/i })).toBeVisible()
    await expect(page.getByRole("link", { name: "UK prices hub", exact: true })).toBeVisible()
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/insights\/rage-room-prices$/)
  })

  test("representative directory pages surface research callouts", async ({ page }) => {
    test.setTimeout(60_000)
    await page.goto("/city/london")
    await expect(page.getByText(/fixed-location venues with London as their city/i)).toBeVisible()
    await expect(page.getByRole("link", { name: /See how London compares with other UK cities/i })).toHaveAttribute(
      "href",
      "/insights/rage-rooms-by-city"
    )

    await page.goto("/activities/axe-throwing")
    await expect(page.getByText(/verified directory dataset currently offer axe throwing/i)).toBeVisible()
    await expect(page.getByRole("link", { name: /See how this activity appears across the dataset/i })).toHaveAttribute(
      "href",
      "/insights/rage-room-activities"
    )

    await page.goto("/occasions/birthdays")
    await expect(page.getByText(/advertise suitability for birthdays/i)).toBeVisible()
    await expect(page.getByRole("link", { name: /Read the UK Rage Room Report 2026/i })).toHaveAttribute(
      "href",
      "/uk-rage-room-report-2026"
    )
  })
})
