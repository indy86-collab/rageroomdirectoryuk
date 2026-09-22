import { test, expect } from "@playwright/test"

async function dismissPrivacyBanner(page: import("@playwright/test").Page) {
  const reject = page.getByRole("button", { name: "Reject analytics", exact: true })
  if (await reject.isVisible()) await reject.click()
}

function mockShopCheckout(page: import("@playwright/test").Page) {
  return page.route("**/api/checkout/shop", async (route) => {
    if (route.request().method() !== "POST") return route.fallback()
    const origin = new URL(route.request().url()).origin
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ url: `${origin}/shop?checkout=mocked` }),
    })
  })
}

test("homepage announces the smash collection and opens the shop", async ({ page }) => {
  await page.goto("/")
  await dismissPrivacyBanner(page)
  const announcement = page.getByRole("region", { name: "The smash collection" })
  await expect(announcement).toBeVisible()
  await expect(announcement.getByRole("link", { name: "Shop the collection" })).toHaveAttribute("href", "/shop")
  await announcement.getByRole("link", { name: "Shop the collection" }).click()
  await expect(page).toHaveURL(/\/shop/)
  await expect(page.getByRole("button", { name: /Buy with Stripe|Try test checkout/ })).toHaveCount(5)
})

test("homepage showcases digital guides and opens a pack", async ({ page }) => {
  await page.goto("/")
  await dismissPrivacyBanner(page)
  const showcase = page.getByRole("region", { name: "Plan it. Gift it. Arrive ready." })
  await expect(showcase).toBeVisible()
  await expect(showcase.getByRole("link", { name: "See all digital guides" })).toHaveAttribute("href", "/digital-downloads")
  await expect(showcase.getByRole("link", { name: /Gift Voucher Template Pack/ })).toBeVisible()
  await expect(showcase.getByRole("link", { name: /First Visit Prep Pack/ })).toBeVisible()
  await expect(showcase.getByRole("link", { name: /save £1.99/i })).toBeVisible()
  await showcase.getByRole("link", { name: /Gift Voucher Template Pack/ }).click()
  await expect(page).toHaveURL(/\/digital-downloads\/rage-room-gift-voucher-template-pack/)
})

test("shop checkout posts the selected variant and opens Stripe", async ({ page }) => {
  const checkoutPosts: unknown[] = []
  await mockShopCheckout(page)
  page.on("request", (request) => {
    if (request.url().includes("/api/checkout/shop") && request.method() === "POST") {
      checkoutPosts.push(request.postDataJSON())
    }
  })
  await page.goto("/shop")
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Wear it. Smash it.")
  await dismissPrivacyBanner(page)
  await expect(page.getByRole("button", { name: /Buy with Stripe|Try test checkout/ })).toHaveCount(5)
  await expect(page.getByText("AI mockup · sample pending")).toHaveCount(0)
  await expect(page.getByText("Original artwork · concept")).toHaveCount(0)
  const shirt = page.locator("article#smash-crew")
  await shirt.getByLabel("Size / finish").selectOption("Black / L")
  await shirt.getByLabel("Quantity").selectOption("2")
  await expect(shirt).toContainText("£49.96 total · includes £9.98 UK delivery")
  await shirt.getByRole("button", { name: /Buy with Stripe|Try test checkout/ }).click()
  await expect(page).toHaveURL(/checkout=mocked/)
  expect(checkoutPosts).toEqual([
    expect.objectContaining({
      productId: "smash-crew",
      variant: "Black / L",
      quantity: 2,
    }),
  ])
})

test("shop shows prices, artwork views and working policies", async ({ page }) => {
  await page.goto("/shop")
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Wear it. Smash it.")
  await dismissPrivacyBanner(page)
  const shirt = page.locator("article#smash-crew")
  await shirt.getByRole("button", { name: "View artwork" }).click()
  await expect(shirt.getByAltText("Smash Crew original print artwork")).toBeVisible()
  await shirt.getByRole("button", { name: "On the product" }).click()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  for (const img of await page.locator("article img").all()) {
    await img.scrollIntoViewIfNeeded()
    await expect(img).toHaveJSProperty("complete", true)
  }
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({ path: `test-results/shop-${test.info().project.name}.png`, fullPage: test.info().project.name === "chromium" })
  await page.getByRole("link", { name: "Delivery & returns", exact: true }).click()
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Delivery & returns")
  await expect(page.locator("main")).not.toContainText("we do not accept orders")
  await page.goto("/shop/success?session_id=invalid")
  await expect(page.getByRole("heading", { level: 1 })).toContainText("couldn’t confirm payment")
})
