export type GiftSeason = { id: "christmas" | "valentines" | "fathers-day"; headline: string; copy: string }

function ukDateParts(now: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London", year: "numeric", month: "numeric", day: "numeric",
  }).formatToParts(now)
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value)
  return { year: get("year"), month: get("month"), day: get("day") }
}

/** UK Father's Day is the third Sunday of June. */
export function ukFathersDay(year: number): number {
  const firstDow = new Date(Date.UTC(year, 5, 1)).getUTCDay()
  return 1 + ((7 - firstDow) % 7) + 14
}

/** Gift-buying windows, evaluated on the UK calendar date. */
export function getGiftSeason(now: Date = new Date()): GiftSeason | null {
  const { year, month, day } = ukDateParts(now)
  if (month === 11 || (month === 12 && day <= 24)) {
    return { id: "christmas", headline: "Christmas gift sorted: a rage room voucher",
      copy: "Experience vouchers arrive by email, so they work as a last-minute present too." }
  }
  if ((month === 1 && day >= 25) || (month === 2 && day <= 14)) {
    return { id: "valentines", headline: "Valentine's for couples who'd rather smash than dine",
      copy: "Rage rooms for two make a memorable date. Compare vouchers and venues." }
  }
  if (month === 6 && day <= ukFathersDay(year)) {
    return { id: "fathers-day", headline: "Father's Day gift: let Dad smash something",
      copy: "Experience vouchers for rage rooms and smash sessions across the UK." }
  }
  return null
}
