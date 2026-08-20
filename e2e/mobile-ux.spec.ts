import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "rageroom:privacy-consent",
      JSON.stringify({ version: 1, analytics: false, decidedAt: Date.now() })
    )
  })
})

async function hasHorizontalOverflow(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const root = document.documentElement
    return root.scrollWidth > root.clientWidth + 1
  })
}

test.describe("mobile-first directory UX", () => {
  test("homepage keeps search reachable and does not overflow", async ({ page, isMobile }) => {
    await page.goto("/")

    await expect(page.getByLabel("Find a Rage Room near you")).toBeVisible()
    await expect(page.getByRole("button", { name: "Search" })).toBeVisible()
    expect(await hasHorizontalOverflow(page)).toBeFalsy()

    if (isMobile) {
      await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible()
      await page.getByRole("button", { name: "Open menu" }).click()
      await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible()
      await expect(page.getByRole("link", { name: "Find a Rage Room" }).last()).toBeVisible()
      await page.getByRole("button", { name: "Close menu" }).click()
      await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toHaveCount(0)
    }

    await page.getByLabel("Find a Rage Room near you").fill("London")
    await page.getByRole("button", { name: "Search" }).click()
    await expect(page).toHaveURL(/\/search\?query=London/, { timeout: 15_000 })
    expect(await hasHorizontalOverflow(page)).toBeFalsy()
  })

  test("listing pages keep a one-tap book action on small screens", async ({ page, isMobile }) => {
    await page.goto("/listing/rage-out-maidstone-maidstone")

    await expect(page.getByRole("heading", { level: 1, name: "Rage Out Maidstone" })).toBeVisible()
    await expect(page.getByRole("link", { name: "Book Your Session →" })).toBeVisible()
    expect(await hasHorizontalOverflow(page)).toBeFalsy()

    if (isMobile) {
      await expect(page.getByRole("link", { name: "Book now" })).toBeVisible()
    }
  })

  test("filters collapse on mobile and still apply a city filter", async ({ page, isMobile }) => {
    await page.goto("/listings")
    expect(await hasHorizontalOverflow(page)).toBeFalsy()

    const toggle = page.getByRole("button", { name: /filter venues/i })
    const isInteractive = await toggle.evaluate(
      (element) => window.getComputedStyle(element).pointerEvents !== "none"
    )
    if (isInteractive && (await toggle.getAttribute("aria-expanded")) === "false") {
      await toggle.click()
    }

    await page.getByLabel("Location").selectOption("Maidstone")
    await expect(page.getByText("1 venue found")).toBeVisible()

    if (isMobile) {
      await page.getByRole("button", { name: /see 1 venue/i }).click()
      await expect(toggle).toHaveAttribute("aria-expanded", "false")
    }
  })
})
