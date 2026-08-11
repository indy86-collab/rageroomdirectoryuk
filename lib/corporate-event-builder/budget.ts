import type { BudgetCategories, BudgetMode } from "./types"

export function roundMoney(value: number) {
  if (!Number.isFinite(value)) return 0
  return Math.round(value * 100) / 100
}

export function deriveTotalBudget({
  mode,
  totalBudget,
  budgetPerPerson,
  attendeeCount,
}: {
  mode: BudgetMode
  totalBudget: number
  budgetPerPerson: number
  attendeeCount: number
}) {
  if (mode === "per_person") {
    return roundMoney(Math.max(0, budgetPerPerson) * Math.max(0, attendeeCount))
  }
  return roundMoney(Math.max(0, totalBudget))
}

export function deriveBudgetPerPerson({
  mode,
  totalBudget,
  budgetPerPerson,
  attendeeCount,
}: {
  mode: BudgetMode
  totalBudget: number
  budgetPerPerson: number
  attendeeCount: number
}) {
  if (mode === "per_person") {
    return roundMoney(Math.max(0, budgetPerPerson))
  }
  const attendees = Math.max(0, attendeeCount)
  if (attendees <= 0) return 0
  return roundMoney(Math.max(0, totalBudget) / attendees)
}

export function sumCategories(categories: BudgetCategories) {
  return roundMoney(
    categories.rageRoom +
      categories.foodDrinks +
      categories.travel +
      categories.contingency
  )
}

/** Split a total into sensible default category allocations. */
export function defaultCategoriesFromTotal(total: number): BudgetCategories {
  const safe = Math.max(0, total)
  const rageRoom = roundMoney(safe * 0.7)
  const foodDrinks = roundMoney(safe * 0.2)
  const travel = roundMoney(safe * 0.05)
  const contingency = roundMoney(safe - rageRoom - foodDrinks - travel)
  return { rageRoom, foodDrinks, travel, contingency }
}

export function remainingContingency(
  totalBudget: number,
  categories: BudgetCategories
) {
  return roundMoney(totalBudget - sumCategories(categories))
}

export function formatGbp(amount: number) {
  const safe = Number.isFinite(amount) ? amount : 0
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: Number.isInteger(safe) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(safe)
}

export function estimateVenueCost(
  startingPrice: number | null,
  attendeeCount: number
): number | null {
  if (startingPrice == null || !Number.isFinite(startingPrice)) return null
  if (attendeeCount <= 0) return null
  return roundMoney(startingPrice * attendeeCount)
}
