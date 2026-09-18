import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.route(/googlesyndication\.com|doubleclick\.net|googletagmanager\.com|google-analytics\.com|cloudflareinsights\.com/, route => route.abort())
})

test("group occasion has attributed relevant offers without replacing venue discovery", async ({ page }) => {
  await page.goto("/occasions/birthdays")
  const offers = page.getByRole("region", { name: "Make a day of your group outing" })
  await expect(offers).toBeVisible()
  await expect(offers).toContainText("Sponsored links")
  const links = offers.locator('a[rel~="sponsored"]')
  expect(await links.count()).toBeGreaterThan(0)
  const href = await links.first().getAttribute("href")
  expect(href).toContain("partner_id=IZRRCJT")
  expect(href).toContain("cmp=rageroom_group")
  await expect(page.getByRole("region", { name: "Filtered venues" })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false)
})

test("corporate enquiry is reviewable and honest about email delivery", async ({ page }) => {
  await page.goto("/corporate-rage-room-team-building-uk")
  const enquiry = page.getByRole("region", { name: "Group event planning enquiry" })
  await enquiry.getByRole("button", { name: "Prepare an enquiry" }).click()
  const draft = enquiry.getByRole("textbox", { name: "Review your enquiry" })
  await expect(draft).toHaveValue(/Please add town or city/)
  await draft.fill("Manchester, 18 people, £1200 budget")
  const href = await enquiry.getByRole("link", { name: "Open email draft" }).getAttribute("href")
  expect(new URL(href!).searchParams.get("body")).toBe("Manchester, 18 people, £1200 budget")
  await expect(enquiry).toContainText("nothing is sent until you send the email")
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false)
})

test("a city without local venues offers explicit alternatives", async ({ page }) => {
  await page.goto("/city/oxford")
  const alternatives = page.getByRole("region", { name: "A different experience could fit your plan" })
  await expect(alternatives).toBeVisible()
  await expect(alternatives.getByRole("link", { name: "Compare axe throwing" })).toHaveAttribute("href", "/activities/axe-throwing")
  await expect(alternatives).toContainText("search suggestions")
})
