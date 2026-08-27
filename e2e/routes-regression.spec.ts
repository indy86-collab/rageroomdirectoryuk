import { test, expect } from "@playwright/test"
import { ROUTE_INVENTORY } from "../lib/rage-reset/routeInventory"

function assertNoRouteGroupInPublicUrl(url: string) {
  expect(url.includes("/(site)")).toBe(false)
  expect(url.includes("/(rage-reset)")).toBe(false)
  expect(url.includes("%28site%29")).toBe(false)
  expect(url.includes("%28rage-reset%29")).toBe(false)
}

test.describe("Public route regression after (site)/(rage-reset) migration", () => {
  for (const route of ROUTE_INVENTORY) {
    test(`${route.path} returns ${route.expectStatus} without route-group leakage`, async ({
      page,
      request,
    }) => {
      expect(route.path.includes("(site)")).toBe(false)
      expect(route.path.includes("(rage-reset)")).toBe(false)

      const res = await request.get(route.path)
      expect(res.status(), route.path).toBe(route.expectStatus)

      if (route.group === "meta") {
        const body = await res.text()
        expect(body.includes("/(site)")).toBe(false)
        expect(body.includes("/(rage-reset)")).toBe(false)
        if (route.path === "/sitemap.xml") {
          expect(body).toContain("/rage-reset")
        }
        return
      }

      await page.goto(route.path)
      assertNoRouteGroupInPublicUrl(page.url())

      // Public location / canonical must not expose route groups.
      // Next may still reference app/(site)/ in internal chunk module paths — that is OK.
      const canonical = await page.locator('link[rel="canonical"]').first().getAttribute("href")
      if (canonical) {
        assertNoRouteGroupInPublicUrl(canonical)
      }

      const title = await page.title()
      expect(title.length).toBeGreaterThan(0)

      if (route.requireHeaderFooter) {
        await expect(page.locator("header").first()).toBeVisible()
        await expect(page.locator("footer").first()).toBeVisible()
      }

      if (route.requireNoHeaderFooter) {
        const headerCount = await page.locator("header").count()
        const footerCount = await page.locator("footer").count()
        expect(headerCount).toBe(0)
        expect(footerCount).toBe(0)
        if (route.group === "game") {
          await expect(page.getByRole("heading", { name: "Rage Reset" })).toBeVisible()
          await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
            "href",
            /\/rage-reset\/?$/
          )
        }
        if (route.group === "embed") {
          await expect(
            page.getByRole("heading", { name: "Find a Rage Room Near You" })
          ).toBeVisible()
        }
      }
    })
  }

  test("city and region sample pages resolve", async ({ request }) => {
    const city = await request.get("/city/london")
    expect([200, 301, 308]).toContain(city.status())

    const region = await request.get("/region/london")
    expect([200, 301, 308, 404]).toContain(region.status())
  })

  test("robots allows indexing and points at sitemap", async ({ request }) => {
    const res = await request.get("/robots.txt")
    expect(res.status()).toBe(200)
    const body = await res.text()
    expect(body.toLowerCase()).toContain("sitemap")
    expect(body).not.toContain("Disallow: /rage-reset")
  })

  test("sitemap includes /rage-reset with weekly cadence", async ({ request }) => {
    const res = await request.get("/sitemap.xml")
    expect(res.status()).toBe(200)
    const body = await res.text()
    expect(body).toMatch(/\/rage-reset<\/loc>/)
    expect(body).toMatch(/rage-reset[\s\S]{0,200}weekly|weekly[\s\S]{0,200}rage-reset/i)
  })
})
