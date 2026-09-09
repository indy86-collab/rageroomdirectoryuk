import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("rageroom:privacy-consent", JSON.stringify({ version: 1, analytics: false, decidedAt: Date.now() })))
})

test("location search preserves the query through filters, reset and reload", async ({ page }) => {
  await page.goto("/search?query=London")
  await expect(page.getByRole("combobox", { name: "City or postcode", exact: true })).toHaveValue("London")
  await expect(page.locator("#venues article").first()).toContainText("Rage Room")
  const toggle = page.getByRole("button", { name: "Filter venues", exact: true })
  if (await toggle.evaluate(el => getComputedStyle(el).pointerEvents !== "none")) await toggle.click()
  await page.getByLabel("Sort by").selectOption("price-asc")
  await expect(page).toHaveURL(/query=London/)
  await expect(page).toHaveURL(/sort=price-asc/)
  await page.reload()
  await expect(page.getByRole("heading", {level: 1})).toHaveText('Search results for "London"')
  if (await toggle.evaluate(el => getComputedStyle(el).pointerEvents !== "none")) await toggle.click()
  await expect(page.getByLabel("Sort by")).toHaveValue("price-asc")
  await page.getByRole("button", { name: "Reset", exact: true }).click()
  await expect(page).toHaveURL(/query=London/)
  await expect(page.getByLabel("Sort by")).toHaveValue("recommended")
  await page.locator("#venues article").nth(0).getByRole("button", {name:"Compare venue"}).click()
  await page.locator("#venues article").nth(1).getByRole("button", {name:"Compare venue"}).click()
  await expect(page.getByRole("heading", {name:"Compare selected venues"})).toBeVisible()
})

test("mobile finder and venue facts precede promotions", async ({ page }) => {
  await page.setViewportSize({width:390,height:844})
  await page.goto("/near-me")
  const postcode = page.getByRole("textbox", {name:"UK postcode",exact:true})
  await expect(postcode).toBeVisible()
  expect((await postcode.boundingBox())!.y).toBeLessThan(650)
  await page.goto("/listing/rage-remedies-romford")
  const price = page.getByText("From £30 per room", {exact:true}).first()
  const signup = page.getByRole("textbox", {name:"Email address",exact:true})
  await expect(price).toBeVisible()
  expect((await price.boundingBox())!.y).toBeLessThan((await signup.boundingBox())!.y)
  await expect(page.getByRole("link",{name:"Book now",exact:true})).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false)
})

test("editorial rage-room guide excludes standalone paint studios", async ({ page }) => {
  const adRequests: string[] = []
  page.on("request", request => {
    if (/googlesyndication\.com|doubleclick\.net/.test(request.url())) adRequests.push(request.url())
  })
  // Fail closed even if the environment safeguard regresses.
  await page.route(/googlesyndication\.com|doubleclick\.net/, route => route.abort())
  await page.goto("/guides/best-rage-rooms-london")
  await expect(page.getByRole("navigation", {name:"On this page"})).toBeVisible()
  await expect(page.locator("main")).not.toContainText("Kedi Studio")
  await expect(page.locator("main")).toContainText("Rage Remedies")
  await expect(page.locator('script[src*="adsbygoogle.js"]')).toHaveCount(0)
  expect(adRequests).toEqual([])
})
