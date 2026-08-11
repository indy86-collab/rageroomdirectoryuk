import { clampNonNegative, roundMoney } from "./money"
import type { PackageEconomicsInput } from "./types"

export type PackageEconomicsResult = {
  totalRevenue: number
  estimatedVariableCosts: number
  estimatedContribution: number
  marginPercent: number
  revenuePerParticipant: number
  revenuePerHour: number | null
  paymentProcessingCost: number
  /** Estimates based on operator inputs — not accounting advice. */
  disclaimer: string
}

export function calculatePackageEconomics(
  input: PackageEconomicsInput
): PackageEconomicsResult {
  const participants = clampNonNegative(input.participants)
  const price = clampNonNegative(input.sellingPricePerPerson)
  const totalRevenue = roundMoney(participants * price)

  const processingRate = clampNonNegative(input.paymentProcessingPercent) / 100
  const paymentProcessingCost = roundMoney(totalRevenue * processingRate)

  const estimatedVariableCosts = roundMoney(
    clampNonNegative(input.breakablesCost) +
      clampNonNegative(input.staffCost) +
      clampNonNegative(input.roomSessionCost) +
      clampNonNegative(input.refreshmentsCost) +
      clampNonNegative(input.externalCosts) +
      paymentProcessingCost +
      clampNonNegative(input.otherCosts)
  )

  const estimatedContribution = roundMoney(totalRevenue - estimatedVariableCosts)
  const marginPercent =
    totalRevenue > 0
      ? roundMoney((estimatedContribution / totalRevenue) * 100)
      : 0
  const revenuePerParticipant =
    participants > 0 ? roundMoney(totalRevenue / participants) : 0

  const sessionMinutes = clampNonNegative(input.sessionMinutes)
  const revenuePerHour =
    sessionMinutes > 0
      ? roundMoney(totalRevenue / (sessionMinutes / 60))
      : null

  return {
    totalRevenue,
    estimatedVariableCosts,
    estimatedContribution,
    marginPercent,
    revenuePerParticipant,
    revenuePerHour,
    paymentProcessingCost,
    disclaimer:
      "These figures are estimates based on the costs you entered. They are not formal accounting, tax or financial advice.",
  }
}

export type MinimumBookingInput = {
  desiredMinimumRevenue: number
  groupSize: number
  costEstimate: number
  desiredMarginPercent: number
}

export type MinimumBookingResult = {
  minimumRevenueFromMargin: number
  recommendedMinimumRevenue: number
  pricePerPersonForMinimum: number | null
  coversDesiredRevenue: boolean
  disclaimer: string
}

/**
 * Help answer: “What minimum corporate booking should I accept?”
 * Uses desired margin against costs, then takes the higher of that and
 * the operator's stated minimum revenue target.
 */
export function calculateMinimumBooking(
  input: MinimumBookingInput
): MinimumBookingResult {
  const costs = clampNonNegative(input.costEstimate)
  const desiredRevenue = clampNonNegative(input.desiredMinimumRevenue)
  const margin = Math.min(95, clampNonNegative(input.desiredMarginPercent))
  const groupSize = clampNonNegative(input.groupSize)

  const minimumRevenueFromMargin =
    margin >= 100
      ? costs
      : roundMoney(costs / (1 - margin / 100))

  const recommendedMinimumRevenue = roundMoney(
    Math.max(desiredRevenue, minimumRevenueFromMargin)
  )

  const pricePerPersonForMinimum =
    groupSize > 0
      ? roundMoney(recommendedMinimumRevenue / groupSize)
      : null

  return {
    minimumRevenueFromMargin,
    recommendedMinimumRevenue,
    pricePerPersonForMinimum,
    coversDesiredRevenue: recommendedMinimumRevenue >= desiredRevenue,
    disclaimer:
      "Indicative only — based on your inputs. Not accounting or pricing advice.",
  }
}
