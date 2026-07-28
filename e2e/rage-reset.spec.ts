import { test, expect } from "@playwright/test"

async function startThroughWeapon(page: import("@playwright/test").Page) {
  await page.goto("/rage-reset")
  await expect(page.getByRole("heading", { name: "Rage Reset" })).toBeVisible()
  await page.getByRole("button", { name: "Start a reset" }).click()
  await expect(page.getByText("How fired up are you?")).toBeVisible()
  await page.getByRole("button", { name: "5", exact: true }).click()
  await page.getByRole("button", { name: "Continue" }).click()
  await page.getByRole("button", { name: "Prefer not to say" }).click()
  await page.getByRole("button", { name: /Office Meltdown/i }).click()
  await page.getByRole("button", { name: /Baseball bat/i }).click()
}

test.describe("Rage Reset flows", () => {
  test.beforeEach(async ({ page }) => {
    // Clear only on first document load of each test — avoid wiping mid-test reloads.
    await page.addInitScript(() => {
      const key = "__rage_reset_e2e_cleared"
      if (!sessionStorage.getItem(key)) {
        localStorage.removeItem("rage-reset-v1")
        localStorage.removeItem("rage-reset-seen")
        sessionStorage.removeItem("rage-reset-sw-reloaded")
        sessionStorage.removeItem("rage-reset-defer-sw")
        sessionStorage.removeItem("rage-reset-sw-pending-reload")
        sessionStorage.setItem(key, "1")
      }
    })
  })

  test("first-time welcome and start", async ({ page }) => {
    await page.goto("/rage-reset")
    await expect(page.getByRole("heading", { name: "Rage Reset" })).toBeVisible()
    await expect(
      page.getByText(/casual entertainment game, not therapy/i)
    ).toBeVisible()
    await page.getByRole("button", { name: "Start a reset" }).click()
    await expect(page.getByText("How fired up are you?")).toBeVisible()
  })

  test("high initial-score safety flow", async ({ page }) => {
    await page.goto("/rage-reset")
    await page.getByRole("button", { name: "Start a reset" }).click()
    await page.getByRole("button", { name: "10", exact: true }).click()
    await page.getByRole("button", { name: "Continue" }).click()
    await expect(page.getByRole("alertdialog")).toBeVisible()
    await expect(page.getByText(/emergency services/i)).toBeVisible()
    await page.getByRole("button", { name: /I understand/i }).click()
    await expect(page.getByText(/What set you off/i)).toBeVisible()
  })

  test("sound-disabled and reduced-motion still playable", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/rage-reset")
    await page.getByRole("button", { name: /Mute sound|Sound/i }).first().click()
    await startThroughWeapon(page)
    await expect(page.getByLabel(/Free smash arena/i)).toBeVisible()
  })

  test("refresh recovery prompt", async ({ page }) => {
    await page.goto("/rage-reset")
    await page.evaluate(() => window.localStorage.clear())
    await page.getByRole("button", { name: "Start a reset" }).click()
    await page.getByRole("button", { name: "5", exact: true }).click()
    await page.getByRole("button", { name: "Continue" }).click()
    await page.getByRole("button", { name: "Prefer not to say" }).click()
    await page.getByRole("button", { name: /Office Meltdown/i }).click()
    await page.getByRole("button", { name: /Baseball bat/i }).click()
    await expect(page.getByLabel(/Free smash arena/i)).toBeVisible()
    // Wait for active session persistence
    await page.waitForFunction(() => {
      const raw = window.localStorage.getItem("rage-reset-v1")
      if (!raw) return false
      try {
        const data = JSON.parse(raw)
        return data?.activeSession?.state === "free-smash"
      } catch {
        return false
      }
    })
    await page.reload()
    await expect(page.getByText(/Resume your reset/i)).toBeVisible()
    await page.getByRole("button", { name: "Start fresh" }).click()
    await expect(page.getByRole("heading", { name: "Rage Reset" })).toBeVisible()
  })

  test("local data deletion", async ({ page }) => {
    await page.goto("/rage-reset")
    await page.getByRole("button", { name: "Local stats" }).click()
    await page.getByRole("button", { name: "Delete my Rage Reset data" }).click()
    await page.getByRole("button", { name: "Confirm delete" }).click()
    await expect(page.getByRole("heading", { name: "Rage Reset" })).toBeVisible()
  })

  test("mobile touch reaches free smash", async ({ page }) => {
    await startThroughWeapon(page)
    const canvas = page.getByLabel(/Free smash arena/i)
    await expect(canvas).toBeVisible()
    const box = await canvas.boundingBox()
    if (box) {
      await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2)
    }
  })
})
