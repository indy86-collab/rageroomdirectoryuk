import { describe, expect, it } from "vitest"
import {
  calculateMinimumBooking,
  calculatePackageEconomics,
} from "./economics"

describe("package economics", () => {
  it("calculates revenue, costs, contribution and margin", () => {
    const result = calculatePackageEconomics({
      participants: 10,
      sellingPricePerPerson: 50,
      breakablesCost: 80,
      staffCost: 60,
      roomSessionCost: 40,
      refreshmentsCost: 20,
      externalCosts: 0,
      paymentProcessingPercent: 2,
      otherCosts: 0,
      sessionMinutes: 60,
    })

    expect(result.totalRevenue).toBe(500)
    expect(result.paymentProcessingCost).toBe(10)
    expect(result.estimatedVariableCosts).toBe(210)
    expect(result.estimatedContribution).toBe(290)
    expect(result.marginPercent).toBe(58)
    expect(result.revenuePerParticipant).toBe(50)
    expect(result.revenuePerHour).toBe(500)
    expect(result.disclaimer).toMatch(/estimates/i)
  })

  it("handles zero participants safely", () => {
    const result = calculatePackageEconomics({
      participants: 0,
      sellingPricePerPerson: 40,
      breakablesCost: 10,
      staffCost: 10,
      roomSessionCost: 0,
      refreshmentsCost: 0,
      externalCosts: 0,
      paymentProcessingPercent: 0,
      otherCosts: 0,
      sessionMinutes: 0,
    })
    expect(result.totalRevenue).toBe(0)
    expect(result.marginPercent).toBe(0)
    expect(result.revenuePerParticipant).toBe(0)
    expect(result.revenuePerHour).toBeNull()
  })
})

describe("minimum booking calculator", () => {
  it("recommends the higher of margin-based and desired revenue", () => {
    const result = calculateMinimumBooking({
      desiredMinimumRevenue: 400,
      groupSize: 10,
      costEstimate: 200,
      desiredMarginPercent: 50,
    })
    // 200 / (1 - 0.5) = 400
    expect(result.minimumRevenueFromMargin).toBe(400)
    expect(result.recommendedMinimumRevenue).toBe(400)
    expect(result.pricePerPersonForMinimum).toBe(40)
  })

  it("raises recommended minimum when desired revenue is higher", () => {
    const result = calculateMinimumBooking({
      desiredMinimumRevenue: 800,
      groupSize: 10,
      costEstimate: 200,
      desiredMarginPercent: 50,
    })
    expect(result.recommendedMinimumRevenue).toBe(800)
    expect(result.pricePerPersonForMinimum).toBe(80)
  })
})
