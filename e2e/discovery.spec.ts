import { expect, test } from "@playwright/test"

async function openFilters(page: import("@playwright/test").Page) {
  const toggle = page.getByRole("button", { name: /filter venues/i })
  const isInteractive = await toggle.evaluate(
    (element) => window.getComputedStyle(element).pointerEvents !== "none"
  )
  if (isInteractive && (await toggle.getAttribute("aria-expanded")) === "false") {
    await toggle.click()
  }
}

test.describe("audited discovery routes", () => {
  test("overview, detail and browser-back journeys preserve truthful state", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByRole("main")).toBeVisible()

    await page.goto("/activities")
    await expect(page.getByRole("heading", { level: 1, name: /choose your experience/i })).toBeVisible()
    await page.goto("/occasions")
    await expect(page.getByRole("heading", { level: 1, name: /what are you planning/i })).toBeVisible()

    for (const detail of [
      ["/listing/rage-out-maidstone-maidstone", "Rage Out Maidstone", "£40 per room"],
      ["/listing/smash-space-uk-newcastle", "Smash Space UK", "£49.99 per group"],
      ["/listing/all-the-rage-birmingham", "All The Rage", "Pricing information is not currently available"],
    ] as const) {
      await page.goto(detail[0])
      await expect(page.getByRole("heading", { level: 1, name: detail[1], exact: true })).toBeVisible()
      await expect(page.getByText(detail[2], { exact: false }).first()).toBeVisible()
    }

    await page.goto("/listings")
    await openFilters(page)
    await page.getByLabel("Location").selectOption("Maidstone")
    await expect(page.getByText("1 venue found")).toBeVisible()
    await page.getByRole("link", { name: "View Rage Out Maidstone" }).click()
    await expect(page.getByRole("heading", { level: 1, name: "Rage Out Maidstone" })).toBeVisible()
    await page.goBack()
    await expect(page.getByLabel("Location")).toHaveValue("Maidstone")
    await expect(page.getByText("1 venue found")).toBeVisible()
    await page.getByRole("button", { name: "Reset" }).click()
    await expect(page.getByText("78 venues found")).toBeVisible()
  })

  test("activity and occasion pages expose canonical routes and strict inventory", async ({ page }) => {
    await page.goto("/activities/axe-throwing")
    await expect(page.getByRole("heading", { level: 1, name: /axe throwing/i })).toBeVisible()
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/activities\/axe-throwing$/)
    await expect(page.getByRole("navigation", { name: /breadcrumb/i })).toContainText("Activities")
    const activityCards = page.locator("#venues article")
    expect(await activityCards.count()).toBeGreaterThan(1)
    for (let index = 0; index < await activityCards.count(); index += 1) {
      await expect(activityCards.nth(index)).toContainText("Axe Throwing")
    }

    await page.goto("/occasions/date-night")
    await expect(page.getByRole("heading", { level: 1, name: /date nights/i })).toBeVisible()
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/occasions\/date-night$/)
    await expect(page.getByRole("navigation", { name: /breadcrumb/i })).toContainText("Occasions")
    await expect(page.getByRole("heading", { name: "All The Rage", exact: true })).toHaveCount(0)
  })

  test("location discovery routes use live inventory, canonicals and conservative schema", async ({ page, request }) => {
    await page.goto("/activities/rage-rooms/birmingham")
    await expect(page.getByRole("heading", { level: 1, name: /rage rooms in birmingham/i })).toBeVisible()
    expect(await page.title()).toBe("Rage Rooms in Birmingham | RageRoom Directory")
    await expect(page.getByText("3 verified venues found")).toBeVisible()
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/activities\/rage-rooms\/birmingham$/)
    await expect(page.getByRole("navigation", { name: /breadcrumb/i })).toContainText("Birmingham")
    const schemas = await page.locator('script[type="application/ld+json"]').evaluateAll((nodes) =>
      nodes.map((node) => node.textContent || "")
    )
    expect(schemas.filter((schema) => schema.includes("BreadcrumbList"))).toHaveLength(1)
    expect(schemas.join(" ")).not.toContain("LocalBusiness")

    await page.goto("/occasions/birthdays/birmingham")
    await expect(page.getByRole("heading", { level: 1, name: /birthday parties in birmingham/i })).toBeVisible()
    await expect(page.getByText("3 suitable venues found")).toBeVisible()
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/occasions\/birthdays\/birmingham$/)

    expect((await request.get("/activities/axe-throwing/birmingham")).status()).toBe(404)
    expect((await request.get("/activities/rage-rooms/leicester")).status()).toBe(404)
    expect((await request.get("/occasions/not-an-occasion/birmingham")).status()).toBe(404)
    expect((await request.get("/activities/rage-rooms/not-a-location")).status()).toBe(404)

    await page.goto("/activities/paint-splatter/london")
    await expect(page.getByRole("heading", { level: 1, name: /paint & splatter rooms in london/i })).toBeVisible()
    await expect(page.getByText("4 verified venues found")).toBeVisible()
  })

  test("parents, cities and matching venues link only to eligible location pages", async ({ page }) => {
    await page.goto("/activities/rage-rooms")
    await expect(page.getByRole("link", { name: "Birmingham (3)" })).toHaveAttribute("href", "/activities/rage-rooms/birmingham")
    await expect(page.getByRole("link", { name: "London (3)" })).toHaveAttribute("href", "/activities/rage-rooms/london")
    await expect(page.locator('a[href="/activities/rage-rooms/leicester"]')).toHaveCount(0)

    await page.goto("/occasions/birthdays")
    await expect(page.getByRole("link", { name: "Birmingham (3)" })).toHaveAttribute("href", "/occasions/birthdays/birmingham")

    await page.goto("/city/birmingham")
    const experiences = page.getByRole("navigation", { name: "Experiences available in Birmingham" })
    await expect(experiences.getByRole("link", { name: "Rage Room (3)" })).toHaveAttribute("href", "/activities/rage-rooms/birmingham")
    await expect(experiences.getByRole("link", { name: "Birthdays (3)" })).toHaveAttribute("href", "/occasions/birthdays/birmingham")

    await page.goto("/listing/all-the-rage-birmingham")
    await expect(page.getByRole("link", { name: "Rage Room in Birmingham", exact: true })).toHaveAttribute("href", "/activities/rage-rooms/birmingham")
    await expect(page.getByRole("link", { name: "Birthdays in Birmingham", exact: true })).toHaveAttribute("href", "/occasions/birthdays/birmingham")
  })

  test("activity combinations and location filters stay on a noindex canonical discovery page", async ({ page }) => {
    await page.goto("/activities/rage-rooms?activities=axe-throwing")
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/activities\/rage-rooms$/)
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/)
    await expect(page.getByText("13 verified venues found")).toBeVisible()

    await openFilters(page)
    await page.getByLabel("Location").selectOption("Derby")
    await expect(page.getByText("1 venue found")).toBeVisible()
    await expect(page.getByRole("heading", { name: "Hatchet Harry's", exact: true })).toBeVisible()
    await expect(page).toHaveURL(/activities=rage-room%2Caxe-throwing|activities=axe-throwing/)

    await page.getByRole("button", { name: "Reset" }).click()
    await expect(page.getByText("45 verified venues found")).toBeVisible()
  })

  test("booking CTA uses verified links and otherwise falls back to venue details", async ({ page }) => {
    await page.goto("/activities/axe-throwing")

    const bookable = page.locator("article", { has: page.getByRole("heading", { name: "Axed and Enraged", exact: true }) })
    await expect(bookable.getByRole("link", { name: "Check availability" })).toHaveAttribute("href", /^https:/)
    await expect(bookable.getByRole("link", { name: "View details" })).toHaveAttribute("href", /\/listing\//)

    const fallback = page.locator("article", { has: page.getByRole("heading", { name: "Hatchet Harry's", exact: true }).first() }).first()
    await expect(fallback.getByRole("link", { name: "View venue" })).toHaveAttribute("href", /\/listing\//)
  })

  test("mobile discovery keeps filters compact and comparison usable", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/occasions/birthdays")

    const filterToggle = page.getByRole("button", { name: /filter venues/i })
    await expect(filterToggle).toHaveAttribute("aria-expanded", "false")
    await filterToggle.click()
    await expect(filterToggle).toHaveAttribute("aria-expanded", "true")
    await page.getByLabel("Location").selectOption("Bedford")
    await expect(page.getByText("1 venue found")).toBeVisible()

    const venue = page.locator("article").first()
    await venue.getByRole("button", { name: "Compare venue" }).click()
    await expect(page.getByText("Clear comparison (1/3)")).toBeVisible()
    await expect(page.locator("body")).not.toHaveCSS("overflow-x", "scroll")
  })

  test("venue and guide pages link back into verified discovery", async ({ page }) => {
    await page.goto("/listing/rage-out-maidstone-maidstone")
    await expect(page.getByRole("link", { name: /axe throwing/i }).first()).toHaveAttribute("href", "/activities/axe-throwing")
    await expect(page.getByRole("link", { name: /birthdays/i }).first()).toHaveAttribute("href", "/occasions/birthdays")

    await page.goto("/guides/best-rage-rooms-for-couples")
    await expect(page.getByRole("link", { name: /date-night discovery page/i })).toHaveAttribute("href", "/occasions/date-night")
  })

  test("filters combine with AND semantics and reset to the complete inventory", async ({ page }) => {
    await page.goto("/listings")
    await expect(page.getByText("78 venues found")).toBeVisible()
    await openFilters(page)

    await page.getByRole("checkbox", { name: "Axe Throwing", exact: true }).check()
    const axeCount = Number((await page.getByText(/venues? found/).textContent())?.match(/\d+/)?.[0])
    expect(axeCount).toBeGreaterThan(0)
    expect(axeCount).toBe(24)

    await page.getByRole("checkbox", { name: "Rage Room", exact: true }).check()
    await expect(page.getByText("13 venues found")).toBeVisible()

    await page.getByLabel("Max per-person price").fill("25")
    const constrainedCount = Number((await page.getByText(/venues? found/).textContent())?.match(/\d+/)?.[0])
    expect(constrainedCount).toBeLessThanOrEqual(13)

    await page.getByRole("button", { name: "Reset" }).click()
    await expect(page.getByText("78 venues found")).toBeVisible()
  })

  test("paint discovery covers standalone, combined, city, mobile and comparison journeys", async ({ page }) => {
    await page.goto("/activities/paint-splatter")
    await expect(page.getByText("34 verified venues found")).toBeVisible()
    await expect(page.getByText("34 rage rooms found")).toHaveCount(0)
    await expect(page.getByRole("heading", { name: "Want to smash and paint?" })).toBeVisible()
    await expect(page.getByRole("link", { name: /Apply the Rage Room \+ Paint filter \(12\)/ })).toHaveAttribute(
      "href",
      "/activities/paint-splatter?activities=rage-room#venues"
    )

    await openFilters(page)
    await page.getByLabel("Location").selectOption("Sheffield")
    await expect(page.getByText("2 verified venues found")).toBeVisible()
    await expect(page.getByRole("heading", { name: "Off The Canvas Sheffield", exact: true })).toBeVisible()
    await expect(page.getByRole("heading", { name: "Splatter Central Sheffield", exact: true })).toBeVisible()

    await page.goto("/activities/paint-splatter?activities=rage-room")
    await expect(page.getByText("12 verified venues found")).toBeVisible()
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/)

    await page.goto("/listing/rage-room-events-mobile-uk")
    await expect(page.getByRole("link", { name: "Paint Splatter" }).first()).toBeVisible()

    await page.goto("/activities/paint-splatter")
    for (const name of ["Splatter Art Studio Glasgow", "Escape Time Lichfield"]) {
      await page.locator("article", { has: page.getByRole("heading", { name, exact: true }) })
        .getByRole("button", { name: "Compare venue" })
        .click()
    }
    await expect(page.getByText("Clear comparison (2/3)")).toBeVisible()
    await expect(page.getByRole("columnheader", { name: "Splatter Art Studio Glasgow" })).toBeVisible()
    await expect(page.getByRole("columnheader", { name: "Escape Time Lichfield" })).toBeVisible()
  })

  test("standalone and mobile detail pages use truthful terminology and schema", async ({ page }) => {
    await page.goto("/listing/just-axing-swansea")
    await expect(page.getByRole("heading", { level: 1, name: "Just Axing Swansea" })).toBeVisible()
    await expect(page.getByRole("region", { name: "Activities Available" }).getByRole("link", { name: "Axe Throwing" })).toBeVisible()
    await expect(page.getByText(/this rage room offers/i)).toHaveCount(0)
    await expect(page.getByRole("heading", { name: /first rage room visit/i })).toHaveCount(0)
    await expect(page.getByRole("heading", { name: /build your smash day/i })).toHaveCount(0)
    const fixedSchema = await page.locator('script[type="application/ld+json"]').allTextContents()
    expect(fixedSchema.join(" ")).toContain("LocalBusiness")
    expect(fixedSchema.join(" ")).toContain("SA7 9AG")

    await page.goto("/listing/rage-room-events-mobile-uk")
    await expect(page.getByRole("heading", { level: 1, name: "Rage Room Events" })).toBeVisible()
    const mobileSchema = await page.locator('script[type="application/ld+json"]').allTextContents()
    const businessSchema = mobileSchema.find((schema) => schema.includes('"@id":"https://www.rageroomdirectory.co.uk/listing/rage-room-events-mobile-uk#localbusiness"')) || ""
    expect(businessSchema).toContain('"@type":"Organization"')
    expect(businessSchema).toContain('"areaServed"')
    expect(businessSchema).not.toContain('"address"')
  })

  test("comparison is unique, capped at three, and distinguishes false from unknown", async ({ page }) => {
    await page.goto("/listings")
    for (const name of ["Smash Palace", "Rage Out Maidstone", "All The Rage"]) {
      await page.locator("article", { has: page.getByRole("heading", { name, exact: true }) })
        .getByRole("button", { name: "Compare venue" })
        .click()
    }

    await expect(page.getByText("Clear comparison (3/3)")).toBeVisible()
    const walkInsRow = page.getByRole("row", { name: /Walk-ins accepted/ })
    await expect(walkInsRow).toContainText("No")
    await expect(walkInsRow).toContainText("Yes")
    await expect(walkInsRow).toContainText("Not provided")
    await expect(page.getByRole("button", { name: "Compare venue" }).first()).toBeDisabled()

    const selected = page.locator("article", { has: page.getByRole("heading", { name: "Smash Palace", exact: true }) })
    await selected.getByRole("button", { name: /Added to comparison/ }).click()
    await expect(page.getByText("Clear comparison (2/3)")).toBeVisible()
    await selected.getByRole("button", { name: "Compare venue" }).click()
    await expect(page.getByText("Clear comparison (3/3)")).toBeVisible()
    await expect(page.getByRole("columnheader", { name: "Smash Palace" })).toHaveCount(1)
  })
})
