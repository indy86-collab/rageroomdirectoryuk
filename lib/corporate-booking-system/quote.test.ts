import { describe, expect, it } from "vitest"
import { calculateQuoteTotals } from "./quote"

describe("quote totals", () => {
  it("calculates subtotal, extras, discount, VAT, deposit and balance", () => {
    const totals = calculateQuoteTotals(
      {
        participantCount: 12,
        extrasAmount: 40,
        discountAmount: 20,
        applyVat: true,
        vatRatePercent: 20,
        depositPercent: 25,
        depositAmountOverride: null,
      },
      50
    )

    // 12 * 50 = 600; +40 -20 = 620; VAT 124; total 744; deposit 186
    expect(totals.packageSubtotal).toBe(600)
    expect(totals.extras).toBe(40)
    expect(totals.discount).toBe(20)
    expect(totals.netBeforeVat).toBe(620)
    expect(totals.vatAmount).toBe(124)
    expect(totals.total).toBe(744)
    expect(totals.deposit).toBe(186)
    expect(totals.remainingBalance).toBe(558)
  })

  it("skips VAT when not applied and respects deposit override", () => {
    const totals = calculateQuoteTotals(
      {
        participantCount: 8,
        extrasAmount: 0,
        discountAmount: 0,
        applyVat: false,
        vatRatePercent: 20,
        depositPercent: 50,
        depositAmountOverride: 100,
      },
      40
    )

    expect(totals.total).toBe(320)
    expect(totals.vatAmount).toBe(0)
    expect(totals.deposit).toBe(100)
    expect(totals.remainingBalance).toBe(220)
  })

  it("handles zero participants, zero deposit and negative inputs safely", () => {
    const totals = calculateQuoteTotals(
      {
        participantCount: 0,
        extrasAmount: -10,
        discountAmount: -5,
        applyVat: true,
        vatRatePercent: 20,
        depositPercent: 0,
        depositAmountOverride: null,
      },
      45.555
    )

    expect(totals.packageSubtotal).toBe(0)
    expect(totals.extras).toBe(0)
    expect(totals.discount).toBe(0)
    expect(totals.vatAmount).toBe(0)
    expect(totals.total).toBe(0)
    expect(totals.deposit).toBe(0)
    expect(totals.remainingBalance).toBe(0)
  })

  it("rounds decimal package prices sensibly", () => {
    const totals = calculateQuoteTotals(
      {
        participantCount: 3,
        extrasAmount: 10.125,
        discountAmount: 1.1,
        applyVat: false,
        vatRatePercent: 20,
        depositPercent: 10,
        depositAmountOverride: null,
      },
      33.333
    )

    expect(totals.packageSubtotal).toBe(100)
    expect(totals.extras).toBe(10.125)
    expect(totals.discount).toBe(1.1)
    expect(totals.total).toBe(109.03)
    expect(totals.deposit).toBe(10.9)
    expect(totals.remainingBalance).toBe(98.13)
  })
})
