import { describe, expect, it } from "vitest"
import {
  defaultCategoriesFromTotal,
  deriveBudgetPerPerson,
  deriveTotalBudget,
  estimateVenueCost,
  remainingContingency,
  sumCategories,
} from "./budget"

describe("corporate event builder budget", () => {
  it("derives total from per-person mode", () => {
    expect(
      deriveTotalBudget({
        mode: "per_person",
        totalBudget: 0,
        budgetPerPerson: 50,
        attendeeCount: 18,
      })
    ).toBe(900)
  })

  it("derives per-person from total mode", () => {
    expect(
      deriveBudgetPerPerson({
        mode: "total",
        totalBudget: 900,
        budgetPerPerson: 0,
        attendeeCount: 18,
      })
    ).toBe(50)
  })

  it("creates category defaults that sum to total", () => {
    const categories = defaultCategoriesFromTotal(900)
    expect(sumCategories(categories)).toBe(900)
    expect(categories.rageRoom).toBe(630)
    expect(categories.foodDrinks).toBe(180)
    expect(categories.travel).toBe(45)
    expect(categories.contingency).toBe(45)
  })

  it("tracks remaining when categories under-allocate", () => {
    expect(
      remainingContingency(900, {
        rageRoom: 630,
        foodDrinks: 180,
        travel: 45,
        contingency: 0,
      })
    ).toBe(45)
  })

  it("estimates venue cost from starting price × attendees", () => {
    expect(estimateVenueCost(45, 18)).toBe(810)
    expect(estimateVenueCost(null, 18)).toBeNull()
  })

  it("handles zero attendees and empty budgets without NaN", () => {
    expect(
      deriveBudgetPerPerson({
        mode: "total",
        totalBudget: 500,
        budgetPerPerson: 0,
        attendeeCount: 0,
      })
    ).toBe(0)
    expect(
      deriveTotalBudget({
        mode: "per_person",
        totalBudget: 0,
        budgetPerPerson: 40,
        attendeeCount: 0,
      })
    ).toBe(0)
    expect(sumCategories(defaultCategoriesFromTotal(0))).toBe(0)
    expect(
      remainingContingency(100.5, {
        rageRoom: 50.25,
        foodDrinks: 25.1,
        travel: 10,
        contingency: 5,
      })
    ).toBe(10.15)
  })
})
