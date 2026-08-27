import { expect, test } from "@playwright/test"

const INSIGHT_ROUTES = [
  "/insights",
  "/insights/rage-room-prices",
  "/insights/rage-rooms-by-city",
  "/insights/rage-rooms-by-region",
  "/insights/rage-room-activities",
] as const

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "rageroom:privacy-consent",
      JSON.stringify({ version: 1, analytics: false, decidedAt: Date.now() })
    )
  })
})

test.describe("insights, badge and finder distribution surfaces", () => {
  test("insights hub and subpages are indexable research pages", async ({ page }) => {
    test.setTimeout(60_000)
    for (const path of INSIGHT_ROUTES) {
      await page.goto(path)
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        new RegExp(`${path.replaceAll("/", "\\/")}$`)
      )
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
        "content",
        new RegExp(`https://www\\.rageroomdirectory\\.co\\.uk${path.replaceAll("/", "\\/")}$`)
      )
      expect(await page.locator('meta[name="robots"]').count()).toBe(0)
      const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents()
      expect(jsonLd.join("\n")).toContain('"@type":"Article"')
      expect(jsonLd.join("\n")).toContain('"@type":"BreadcrumbList"')
      expect(jsonLd.join("\n")).not.toContain('"@type":"Dataset"')
      expect(jsonLd.join("\n")).not.toContain("aggregateRating")
      expect(jsonLd.join("\n")).not.toContain("rageroom.co.uk")
    }

    await page.goto("/insights")
    await expect(page.getByRole("heading", { level: 1 })).toContainText("UK Rage Room Statistics")
    await expect(page.getByRole("heading", { name: "Methodology" })).toBeVisible()
    await expect(page.getByText(/recorded city field/i).first()).toBeVisible()
    await expect(page.getByRole("button", { name: "Copy statistic" }).first()).toBeVisible()
  })

  test("badge and publisher pages stay indexable with qualified embed snippets", async ({ page }) => {
    await page.goto("/for-venues/badge")
    await expect(page.getByRole("heading", { level: 1, name: "Listed on RageRoom Directory" })).toBeVisible()
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/for-venues\/badge$/)
    const badgeEmbed = page.locator("#badge-embed")
    await expect(badgeEmbed).toBeVisible()
    await expect(badgeEmbed).toHaveValue(/rel="nofollow noopener"/)
    await expect(badgeEmbed).toHaveValue(/https:\/\/www\.rageroomdirectory\.co\.uk\/listing\//)
    await expect(badgeEmbed).not.toHaveValue(/rageroom\.co\.uk/)

    await page.goto("/for-publishers")
    await expect(page.getByRole("heading", { level: 1, name: "Rage Room Finder Widget" })).toBeVisible()
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/for-publishers$/)
    const widgetEmbed = page.locator("#widget-embed")
    await expect(widgetEmbed).toHaveValue(/<iframe /)
    await expect(widgetEmbed).not.toHaveValue(/<a /)
  })

  test("listing promote section generates the same qualified badge HTML", async ({ page }) => {
    await page.goto("/listing/rage-out-maidstone-maidstone")
    const promote = page.getByText("Promote your RageRoom listing")
    await promote.scrollIntoViewIfNeeded()
    await promote.click()
    const badgeEmbed = page.locator("#badge-embed")
    await expect(badgeEmbed).toBeVisible()
    await expect(badgeEmbed).toHaveValue(/rel="nofollow noopener"/)
    await expect(badgeEmbed).toHaveValue(
      /https:\/\/www\.rageroomdirectory\.co\.uk\/listing\/rage-out-maidstone-maidstone/
    )
  })

  test("badge SVGs render without tracking code", async ({ request }) => {
    for (const path of [
      "/badges/listed-on-rageroom-compact.svg",
      "/badges/listed-on-rageroom-standard.svg",
    ]) {
      const response = await request.get(path)
      expect(response.status()).toBe(200)
      const body = await response.text()
      expect(body).toContain('viewBox="')
      expect(body).toContain("Listed on RageRoom Directory")
      expect(body).not.toContain("<script")
      expect(body).not.toContain("gtag")
      expect(body).not.toContain("analytics")
    }
  })

  test("embed route is noindex and works inside an iframe", async ({ page, request, baseURL }) => {
    test.setTimeout(90_000)
    const embed = await request.get("/embed/rage-room-finder")
    expect(embed.headers()["x-frame-options"] ?? "").toBe("")
    expect(embed.headers()["content-security-policy"] ?? "").toMatch(/frame-ancestors \*/)

    await page.goto("/embed/rage-room-finder")
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/i)
    await expect(page.getByRole("heading", { name: "Find a Rage Room Near You" })).toBeVisible()
    await expect(page.getByRole("link", { name: "RageRoom Directory" })).toHaveAttribute(
      "rel",
      "nofollow noopener"
    )

    async function mountFinder(src: string) {
      await page.setContent(
        `<!doctype html><title>Host</title><iframe data-testid="finder" src="${src}" style="width:360px;height:560px;border:0"></iframe>`
      )
      return page.frameLocator('[data-testid="finder"]')
    }

    const frame = await mountFinder(`${baseURL}/embed/rage-room-finder`)
    await expect(frame.getByRole("heading", { name: "Find a Rage Room Near You" })).toBeVisible()
    await expect(frame.getByText("Powered by")).toBeVisible()
    await expect(frame.getByRole("link", { name: "RageRoom Directory" })).toBeVisible()

    const untitled = await mountFinder(`${baseURL}/embed/rage-room-finder?title=0`)
    await expect(untitled.getByRole("heading", { name: "Find a Rage Room Near You" })).toHaveCount(0)
    await expect(untitled.getByText("Powered by")).toBeVisible()

    const birmingham = await mountFinder(`${baseURL}/embed/rage-room-finder?location=birmingham`)
    await expect(birmingham.getByLabel("Postcode or town / city")).toHaveValue(/Birmingham/i)
    await expect(birmingham.getByRole("link", { name: /Birmingham/ })).toBeVisible()

    const invalidCity = await mountFinder(`${baseURL}/embed/rage-room-finder?location=atlantis`)
    await expect(invalidCity.getByLabel("Postcode or town / city")).toHaveValue("")
    await expect(invalidCity.getByRole("button", { name: "Find venues" })).toBeVisible()

    const search = await mountFinder(`${baseURL}/embed/rage-room-finder`)
    const input = search.getByLabel("Postcode or town / city")
    await input.fill("not a postcode zz")
    await input.press("Enter")
    await expect(search.getByText(/could not match that location/i)).toBeVisible()

    await input.fill("SW1A 1AA")
    await input.press("Enter")
    const firstVenue = search.locator('a[href*="/listing/"]').first()
    await expect(firstVenue).toBeVisible({ timeout: 20_000 })
    const [popup] = await Promise.all([page.waitForEvent("popup"), firstVenue.click()])
    await expect(popup).toHaveURL(/\/listing\//)
  })
})
