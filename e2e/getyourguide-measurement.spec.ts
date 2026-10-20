import { expect, test } from "@playwright/test"

test.skip(process.env.NEXT_PUBLIC_GYG_CURATED_ENABLED === "true", "Measurement-first presentation only")

test("measurement rollout retains existing links with city campaigns and consent-controlled Analyzer", async ({ page }) => {
  const requests: string[] = []
  page.on("request", request => { if (request.url().includes("widget.getyourguide.com")) requests.push(request.url()) })
  await page.route(/getyourguide\.com|googletagmanager|google-analytics|cloudflareinsights|vercel-scripts|_vercel\/insights|googlesyndication|doubleclick/, route => route.fulfill({ contentType: "application/javascript", body: "/* mocked provider */" }))
  await page.goto("/guides/best-rage-rooms-manchester")
  const offers = page.locator('[data-affiliate-module]').first()
  const link = offers.locator('a[rel~="sponsored"]').first()
  await expect(link).toHaveAttribute("href", /partner_id=IZRRCJT&cmp=rr2_guide_manchester_general_/)
  await expect(page.locator('script[data-consent-provider="getyourguide"]')).toHaveCount(0)
  await page.getByRole("button", { name: "Accept analytics" }).click()
  await expect.poll(() => requests.length).toBe(1)
  await expect(page.locator('script[data-consent-provider="getyourguide"]')).toHaveAttribute("data-gyg-partner-id", "IZRRCJT")
  await offers.getByRole("button", { name: "Personalise these picks" }).click()
  await offers.getByRole("button", { name: "Friends", exact: true }).click()
  await offers.getByRole("button", { name: "More adrenaline", exact: true }).click()
  await offers.getByRole("button", { name: "After the smash", exact: true }).click()
  await expect(offers.locator('a[rel~="sponsored"]').first()).toHaveAttribute("href", /cmp=rr2_guide_manchester_general_/)
  expect(requests).toHaveLength(1)
})
