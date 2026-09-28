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
  await expect(page.getByRole("button", { name: "Add to basket" })).toHaveCount(5)
})

test("homepage showcases digital guides and opens a pack", async ({ page }) => {
  await page.goto("/")
  await dismissPrivacyBanner(page)
  const showcase = page.getByRole("region", { name: "Planning packs" })
  await expect(showcase).toBeVisible()
  await expect(showcase.getByRole("link", { name: "Browse the guides" })).toHaveAttribute("href", "/digital-downloads")
  await expect(showcase.getByRole("link", { name: /Gift vouchers/ })).toBeVisible()
  await expect(showcase.getByRole("link", { name: /First visit/ })).toBeVisible()
  await showcase.getByRole("link", { name: /Gift vouchers/ }).click()
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
  await expect(page.getByRole("button", { name: "Add to basket" })).toHaveCount(5)
  await expect(page.getByText("AI mockup · sample pending")).toHaveCount(0)
  await expect(page.getByText("Original artwork · concept")).toHaveCount(0)
  const shirt = page.locator("article#smash-crew")
  await shirt.getByLabel("Size / finish").selectOption("Black / L")
  await shirt.getByLabel("Quantity").selectOption("2")
  await expect(shirt).toContainText("£4.99 UK delivery per order.")
  await shirt.getByRole("button", { name: "Add to basket" }).click()
  await page.locator("article#reset").getByRole("button", { name: "Add to basket" }).click()
  await page.getByRole("link", { name: "Basket (3)", exact: true }).click()
  const basket = page.getByRole("region", { name: "Your basket" })
  await expect(basket).toContainText("£57.97")
  await expect(basket).toContainText("£62.96")
  await basket.getByRole("button", { name: /Checkout with Stripe/ }).click()
  await expect(page).toHaveURL(/checkout=mocked/)
  expect(checkoutPosts).toEqual([
    expect.objectContaining({
      items: [{ productId: "smash-crew", variant: "Black / L", quantity: 2 }, { productId: "reset", variant: "Black / 11oz", quantity: 1 }],
    }),
  ])
})

test("shop shows prices, artwork views and working policies", async ({ page }) => {
  await page.goto("/shop")
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Wear it. Smash it.")
  await dismissPrivacyBanner(page)
  const shirt = page.locator("article#smash-crew")
  await shirt.getByRole("button", { name: "View artwork" }).click()
  await expect(shirt.getByAltText("Smash Club original print artwork")).toBeVisible()
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


test("basket keeps separate sizes, persists and supports quantity edits and removal", async ({ page }) => {
  await page.goto("/shop")
  await dismissPrivacyBanner(page)
  const shirt = page.locator("article#smash-crew")
  await shirt.getByRole("button", { name: "Add to basket" }).click()
  await shirt.getByLabel("Size / finish").selectOption("Black / L")
  await shirt.getByRole("button", { name: "Add to basket" }).click()
  await page.reload()
  await page.getByRole("link", { name: "Basket (2)", exact: true }).click()
  const basket = page.getByRole("region", { name: "Your basket" })
  await expect(basket.getByRole("listitem")).toHaveCount(2)
  await basket.getByLabel("Quantity for Smash Club (Black / S)", { exact: true }).selectOption("2")
  await expect(page.getByRole("link", { name: "Basket (3)", exact: true })).toBeVisible()
  await expect(basket).toContainText("£64.96")
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await basket.screenshot({ path: `test-results/basket-${test.info().project.name}.png` })
  await basket.getByRole("button", { name: "Remove Smash Club (Black / S)", exact: true }).click()
  await basket.getByRole("button", { name: "Remove Smash Club (Black / L)", exact: true }).click()
  await expect(basket).toContainText("Your basket is empty")
  await expect(basket.getByRole("button", { name: /Checkout/ })).toBeDisabled()
})

test("cancelled and failed checkouts retain the basket and allow retry", async ({ page }) => {
  const posts: { requestId: string }[] = []
  await page.route("**/api/checkout/shop", async route => {
    posts.push(route.request().postDataJSON())
    await route.fulfill({ status: 502, contentType: "application/json", body: JSON.stringify({ error: "Please try again." }) })
  })
  await page.goto("/shop")
  await dismissPrivacyBanner(page)
  await page.locator("article#reset").getByRole("button", { name: "Add to basket" }).click()
  await page.goto("/shop?cancelled=1#basket")
  const basket = page.getByRole("region", { name: "Your basket" })
  await expect(basket.getByRole("listitem")).toHaveCount(1)
  await basket.getByRole("button", { name: /Checkout with Stripe/ }).click()
  await expect(basket.getByRole("alert")).toHaveText("Please try again.")
  await basket.getByRole("button", { name: /Checkout with Stripe/ }).click()
  await expect.poll(() => posts.length).toBe(2)
  expect(posts[0].requestId).toBe(posts[1].requestId)
  await expect(basket).toContainText("£22.98")
})
