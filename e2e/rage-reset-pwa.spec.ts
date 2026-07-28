import { test, expect } from "@playwright/test"

/**
 * Automates what we can about scoped SW behaviour.
 * Full offline play and iOS install still require manual device checks
 * (see docs/rage-reset/device-test-matrix.md and docs/rage-reset/pwa-offline.md).
 */
test.describe("Rage Reset PWA / service worker", () => {
  test("manifest is scoped to /rage-reset", async ({ request }) => {
    const res = await request.get("/rage-reset.webmanifest")
    expect(res.status()).toBe(200)
    const json = await res.json()
    expect(json.scope).toBe("/rage-reset")
    expect(json.start_url).toMatch(/\/rage-reset/)
  })

  test("service worker script registers with /rage-reset scope", async ({ page }) => {
    await page.goto("/rage-reset")
    await expect(page.getByRole("heading", { name: "Rage Reset" })).toBeVisible()

    const info = await page.evaluate(async () => {
      if (!("serviceWorker" in navigator)) return { supported: false }
      const reg = await navigator.serviceWorker.register("/rage-reset-sw.js", {
        scope: "/rage-reset",
      })
      await reg.update().catch(() => undefined)
      return {
        supported: true,
        scope: reg.scope,
        scriptURL: reg.active?.scriptURL || reg.installing?.scriptURL || reg.waiting?.scriptURL,
      }
    })

    expect(info.supported).toBe(true)
    expect(info.scope).toMatch(/\/rage-reset\/?$/)
  })

  test("directory homepage is not controlled by rage-reset SW", async ({ page }) => {
    await page.goto("/rage-reset")
    await page.waitForTimeout(500)
    await page.goto("/")
    const controlled = await page.evaluate(async () => {
      if (!("serviceWorker" in navigator)) return null
      const reg = await navigator.serviceWorker.getRegistration("/")
      const rageReg = await navigator.serviceWorker.getRegistration("/rage-reset")
      return {
        rootScope: reg?.scope ?? null,
        rageScope: rageReg?.scope ?? null,
        controllerUrl: navigator.serviceWorker.controller?.scriptURL ?? null,
      }
    })
    // Homepage should not be under the rage-reset SW controller
    if (controlled?.controllerUrl) {
      expect(controlled.controllerUrl.includes("rage-reset-sw")).toBe(false)
    }
    if (controlled?.rageScope) {
      expect(controlled.rageScope).toMatch(/\/rage-reset\/?$/)
    }
  })
})
