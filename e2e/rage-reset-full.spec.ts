import { test, expect } from "@playwright/test"

async function startThroughWeapon(page: import("@playwright/test").Page, score = 5) {
  // Dismiss restore prompt if a previous parallel test left storage mid-session
  const resume = page.getByText(/Resume your reset/i)
  if (await resume.isVisible().catch(() => false)) {
    await page.getByRole("button", { name: "Start fresh" }).click()
  }
  await page.getByRole("button", { name: "Start a reset" }).click()
  await expect(page.getByText("How fired up are you?")).toBeVisible({ timeout: 15_000 })
  await page.getByRole("button", { name: String(score), exact: true }).click()
  await page.getByRole("button", { name: "Continue" }).click()
  if (score >= 9) {
    await expect(page.getByRole("alertdialog")).toBeVisible()
    await page.getByRole("button", { name: /I understand/i }).click()
  }
  await page.getByRole("button", { name: "Prefer not to say" }).click()
  await page.getByRole("button", { name: /Office Meltdown/i }).click()
  await page.getByRole("button", { name: /Baseball bat/i }).click()
}

async function completeAcceleratedSession(
  page: import("@playwright/test").Page,
  opts?: { finalScore?: number; initialScore?: number }
) {
  await page.goto("/rage-reset?e2e=1")
  await expect(page.getByRole("heading", { name: "Rage Reset" })).toBeVisible({ timeout: 15_000 })
  const resume = page.getByText(/Resume your reset/i)
  if (await resume.isVisible().catch(() => false)) {
    await page.getByRole("button", { name: "Start fresh" }).click()
  }
  await startThroughWeapon(page, opts?.initialScore ?? 5)

  await expect(page.getByLabel(/Free smash arena/i)).toBeVisible({ timeout: 10_000 })
  await expect(page.getByTestId("controlled-smash-arena")).toBeVisible({ timeout: 15_000 })
  await expect(page.getByText(/Sort the fragments|Rebuild the Room/i)).toBeVisible({
    timeout: 20_000,
  })
  await expect(page.getByText(/How do you feel now/i)).toBeVisible({ timeout: 25_000 })
  const final = opts?.finalScore ?? 4
  await page.getByRole("button", { name: String(final), exact: true }).click()
  await page.getByRole("button", { name: "See results" }).click()
  await expect(page.getByText(/Session complete|Session saved/i)).toBeVisible({ timeout: 10_000 })
}

test.describe("Rage Reset accelerated full session", () => {
  test.beforeEach(async ({ page }) => {
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

  test("complete session reaches results and history", async ({ page }) => {
    await completeAcceleratedSession(page)
    await expect(page.getByRole("button", { name: "Reset again" })).toBeVisible()
    await expect(page.getByRole("button", { name: "Share result" })).toBeVisible()
    await expect(page.getByRole("button", { name: "View progress" })).toBeVisible()

    // History persisted
    const historyLen = await page.evaluate(() => {
      const raw = localStorage.getItem("rage-reset-v1")
      if (!raw) return 0
      return JSON.parse(raw).history?.length ?? 0
    })
    expect(historyLen).toBeGreaterThan(0)

    // Restart another session
    await page.getByRole("button", { name: "Reset again" }).click()
    await expect(page.getByText("How fired up are you?")).toBeVisible()
  })

  test("high initial score safety flow", async ({ page }) => {
    await page.goto("/rage-reset?e2e=1")
    await page.getByRole("button", { name: "Start a reset" }).click()
    await page.getByRole("button", { name: "10", exact: true }).click()
    await page.getByRole("button", { name: "Continue" }).click()
    await expect(page.getByRole("alertdialog")).toBeVisible()
    await expect(page.getByText(/emergency services/i)).toBeVisible()
    await page.getByRole("button", { name: /I understand/i }).click()
    await expect(page.getByText(/What set you off/i)).toBeVisible()
  })

  test("high final score safety suppresses commercial CTAs", async ({ page }) => {
    await completeAcceleratedSession(page, { initialScore: 5, finalScore: 10 })
    await expect(page.getByText(/Session saved|emergency services|support/i).first()).toBeVisible()
    await expect(page.getByText(/Want to try a real rage-room/i)).toHaveCount(0)
    await expect(page.getByRole("button", { name: "Share result" })).toHaveCount(0)
    await expect(page.getByRole("button", { name: "Reset again" })).toBeVisible()
  })

  test("ordinary session CTA frequency cap", async ({ page }) => {
    test.setTimeout(60_000)
    // Seed two prior ordinary completions so the next one hits the cap (PROMO_FREQUENCY_CAP = 3)
    await page.addInitScript(() => {
      localStorage.setItem(
        "rage-reset-v1",
        JSON.stringify({
          version: 1,
          settings: { soundEnabled: false, hapticsEnabled: false, reducedEffects: true },
          progression: {
            calmEnergy: 20,
            completedSessions: 2,
            unlockedRooms: ["office-meltdown", "kitchen-chaos"],
            unlockedWeapons: ["baseball-bat", "rubber-chicken"],
            currentResetStreak: 1,
            weaponEffectsUnlocked: [],
            cooldownEverCompleted: true,
            sessionsSinceLastPromo: 2,
            installPromptShown: false,
          },
          history: [],
        })
      )
      sessionStorage.setItem("__rage_reset_e2e_cleared", "1")
    })
    await completeAcceleratedSession(page, { finalScore: 3 })
    await expect(page.getByText(/Want to try a real rage-room/i)).toBeVisible({ timeout: 5_000 })
  })

  test("refresh restore and restart instead of restore", async ({ page }) => {
    await page.goto("/rage-reset?e2e=1")
    await startThroughWeapon(page)
    await expect(page.getByLabel(/Free smash arena/i)).toBeVisible()
    await page.waitForFunction(() => {
      const raw = window.localStorage.getItem("rage-reset-v1")
      if (!raw) return false
      try {
        const state = JSON.parse(raw)?.activeSession?.state
        return state === "free-smash" || state === "controlled-smash"
      } catch {
        return false
      }
    })
    await page.reload()
    await expect(page.getByText(/Resume your reset/i)).toBeVisible()
    await page.getByRole("button", { name: "Resume" }).click()
    await expect(
      page
        .getByLabel(/Free smash arena|Controlled smash/i)
        .or(page.getByText(/Sort the fragments|Rebuild the Room/i))
    ).toBeVisible({ timeout: 10_000 })

    await page.reload()
    await expect(page.getByText(/Resume your reset/i)).toBeVisible()
    await page.getByRole("button", { name: "Start fresh" }).click()
    await expect(page.getByRole("heading", { name: "Rage Reset" })).toBeVisible()
  })

  test("reduced-motion, sound-disabled, haptic-disabled still playable", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/rage-reset?e2e=1")
    await page.getByRole("button", { name: /Mute sound|Sound/i }).first().click()
    await page.getByRole("button", { name: /Haptics|Off/i }).first().click()
    await startThroughWeapon(page)
    await expect(page.getByLabel(/Free smash arena/i)).toBeVisible()
  })

  test("local data deletion", async ({ page }) => {
    await page.goto("/rage-reset?e2e=1")
    await page.getByRole("button", { name: "Local stats" }).click()
    await page.getByRole("button", { name: "Delete my Rage Reset data" }).click()
    await page.getByRole("button", { name: "Confirm delete" }).click()
    await expect(page.getByRole("heading", { name: "Rage Reset" })).toBeVisible()
  })

  test("corrupt local storage recovers", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("rage-reset-v1", "{not-json")
    })
    await page.goto("/rage-reset?e2e=1")
    await expect(page.getByRole("heading", { name: "Rage Reset" })).toBeVisible()
    await page.getByRole("button", { name: "Start a reset" }).click()
    await expect(page.getByText("How fired up are you?")).toBeVisible()
  })

  test("returning user unlock state", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        "rage-reset-v1",
        JSON.stringify({
          version: 1,
          settings: { soundEnabled: true, hapticsEnabled: true, reducedEffects: false },
          progression: {
            calmEnergy: 40,
            completedSessions: 3,
            unlockedRooms: ["office-meltdown", "kitchen-chaos", "technology-breakdown"],
            unlockedWeapons: ["baseball-bat", "rubber-chicken"],
            currentResetStreak: 2,
            weaponEffectsUnlocked: [],
            cooldownEverCompleted: true,
            sessionsSinceLastPromo: 1,
            installPromptShown: false,
          },
          history: [],
        })
      )
    })
    await page.goto("/rage-reset?e2e=1")
    await page.getByRole("button", { name: "Progress" }).click()
    await expect(page.getByText(/Kitchen Chaos/i)).toBeVisible()
    await expect(page.getByText(/Technology Breakdown/i)).toBeVisible()
  })

  test("progress screen available from welcome", async ({ page }) => {
    await page.goto("/rage-reset?e2e=1")
    await page.getByRole("button", { name: "Progress" }).click()
    await expect(page.getByText(/Local progress/i)).toBeVisible()
  })
})
