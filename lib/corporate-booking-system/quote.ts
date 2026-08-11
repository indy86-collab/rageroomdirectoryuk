import { clampNonNegative, roundMoney } from "./money"
import type { CorporatePackage, CorporateQuote, VenueProfile } from "./types"

export type QuoteTotals = {
  packageSubtotal: number
  extras: number
  discount: number
  netBeforeVat: number
  vatAmount: number
  total: number
  deposit: number
  remainingBalance: number
}

export function calculateQuoteTotals(
  quote: Pick<
    CorporateQuote,
    | "participantCount"
    | "extrasAmount"
    | "discountAmount"
    | "applyVat"
    | "vatRatePercent"
    | "depositPercent"
    | "depositAmountOverride"
  >,
  packagePricePerPerson: number | null | undefined
): QuoteTotals {
  const participants = clampNonNegative(quote.participantCount)
  const ppp = clampNonNegative(packagePricePerPerson ?? 0)
  const packageSubtotal = roundMoney(participants * ppp)
  const extras = clampNonNegative(quote.extrasAmount)
  const discount = clampNonNegative(quote.discountAmount)
  const netBeforeVat = roundMoney(Math.max(0, packageSubtotal + extras - discount))

  const vatRate = clampNonNegative(quote.vatRatePercent) / 100
  const vatAmount = quote.applyVat ? roundMoney(netBeforeVat * vatRate) : 0
  const total = roundMoney(netBeforeVat + vatAmount)

  const deposit =
    quote.depositAmountOverride != null &&
    Number.isFinite(quote.depositAmountOverride)
      ? roundMoney(clampNonNegative(quote.depositAmountOverride))
      : roundMoney(total * (clampNonNegative(quote.depositPercent) / 100))

  const remainingBalance = roundMoney(Math.max(0, total - deposit))

  return {
    packageSubtotal,
    extras,
    discount,
    netBeforeVat,
    vatAmount,
    total,
    deposit,
    remainingBalance,
  }
}

export function buildQuoteSchedule(
  venue: VenueProfile,
  arrivalTime: string,
  smashDurationMinutes: number | null | undefined
) {
  const duration =
    smashDurationMinutes ?? venue.typicalSessionMinutes ?? 60
  const start = arrivalTime.trim() || "10:00"
  const [h, m] = start.split(":").map((part) => Number(part))
  if (!Number.isFinite(h) || !Number.isFinite(m)) {
    return [
      { time: start, label: "Arrive / briefing" },
      { time: "—", label: `Smash session (~${duration} mins)` },
      { time: "—", label: "Debrief / photos / departure" },
    ]
  }

  const arrival = h * 60 + m
  const briefingEnd = arrival + 15
  const smashEnd = briefingEnd + duration
  const depart = smashEnd + 15

  const fmt = (mins: number) => {
    const hh = Math.floor(mins / 60) % 24
    const mm = mins % 60
    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`
  }

  return [
    { time: fmt(arrival), label: "Arrive / briefing" },
    { time: fmt(briefingEnd), label: `Smash session (~${duration} mins)` },
    { time: fmt(smashEnd), label: "Debrief / photos" },
    { time: fmt(depart), label: "Departure" },
  ]
}

export function packageInclusionsList(pkg: CorporatePackage): string[] {
  const items: string[] = []
  if (pkg.smashDurationMinutes) {
    items.push(`${pkg.smashDurationMinutes}-minute smash session`)
  }
  if (pkg.breakablesNote.trim()) items.push(pkg.breakablesNote.trim())
  if (pkg.ppeIncluded) items.push("PPE included")
  if (pkg.exclusiveArea) items.push("Exclusive / private area")
  if (pkg.refreshments.trim()) items.push(pkg.refreshments.trim())
  if (pkg.photosVideo.trim()) items.push(pkg.photosVideo.trim())
  if (pkg.meetingSpace.trim()) items.push(pkg.meetingSpace.trim())
  if (pkg.otherInclusions.trim()) {
    pkg.otherInclusions
      .split(/\n|,/)
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((s) => items.push(s))
  }
  return items
}
