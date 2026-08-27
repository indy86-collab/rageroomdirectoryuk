const COMPLETE_UK_POSTCODE_RE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i

export function isCompleteUkPostcode(value: string) {
  return COMPLETE_UK_POSTCODE_RE.test(value.trim())
}

export function normaliseUkPostcode(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, " ")
}
