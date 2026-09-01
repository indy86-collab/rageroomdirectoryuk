import { describe, expect, it } from "vitest"
import listingsData from "@/data/listings.json"
import { getCityDirectoryInsight, getActivityDirectoryInsight, getOccasionDirectoryInsight, getRegionDirectoryInsight } from "./directory-insights"
import { buildExecutiveFindings, insightAnswers } from "./insights-copy"
import { buildInsightsStats } from "./insights-stats"
import type { Listing } from "@/types/listing"

const stats = buildInsightsStats(listingsData as Listing[])

describe("directory insight callouts", () => {
  it("explains London city-field counts without contradicting directory routing", () => {
    const callout = getCityDirectoryInsight(stats, "london", "London")
    expect(callout.statement).toContain("4 fixed-location venues with London as their city")
    expect(callout.statement).toMatch(/nearby or canonical region matches/)
    expect(callout.href).toBe("/insights/rage-rooms-by-city")
  })

  it("uses dataset-absence language for cities without a fixed listing", () => {
    const callout = getCityDirectoryInsight(stats, "nottingham", "Nottingham")
    expect(callout.statement).toContain("no verified fixed-location listing recorded for Nottingham")
    expect(callout.statement).not.toMatch(/there are no rage rooms in Nottingham/i)
    expect(callout.href).toBe("/insights/rage-rooms-by-city")
  })

  it("links activity and occasion pages to research, not a second directory", () => {
    expect(getActivityDirectoryInsight(stats, "axe-throwing")).toMatchObject({
      href: "/insights/rage-room-activities",
    })
    expect(getActivityDirectoryInsight(stats, "axe-throwing")?.statement).toContain("axe throwing")
    expect(getOccasionDirectoryInsight(stats, "birthdays")).toMatchObject({
      href: "/uk-rage-room-report-2026",
    })
    expect(getRegionDirectoryInsight(stats, "london", "London")?.href).toBe(
      "/insights/rage-rooms-by-region"
    )
  })
})

describe("flagship report copy", () => {
  it("generates executive findings from the current dataset", () => {
    const findings = buildExecutiveFindings(stats)
    expect(findings.length).toBeGreaterThanOrEqual(5)
    expect(findings.length).toBeLessThanOrEqual(8)
    expect(findings[0]).toContain(`${stats.verifiedListings} verified listings`)
    expect(findings.join(" ")).toContain("per-person")
    expect(findings.join(" ")).not.toMatch(/largest in the UK|complete list of every/i)
  })

  it("answers citation-friendly questions with current calculated values", () => {
    const answers = insightAnswers(stats)
    expect(answers.howManyRageRooms).toContain(`${stats.rageRooms} verified listings offering rage-room experiences`)
    expect(answers.howManyRageRooms).toContain(`dataset of ${stats.verifiedListings}`)
    expect(answers.howMuch).toContain("£11")
    expect(answers.howMuch).toContain("£45")
    expect(answers.howMuch).toContain("average of £29")
    expect(answers.topCity).toContain("Birmingham")
    expect(answers.publishedPrices).toContain(`${stats.pricing.usable} of ${stats.verifiedListings}`)
    expect(answers.citation("https://www.rageroomdirectory.co.uk/uk-rage-room-report-2026")).toContain(
      "UK Rage Room Report 2026"
    )
  })
})
