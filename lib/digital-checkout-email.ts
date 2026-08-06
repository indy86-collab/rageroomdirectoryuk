/** Browser-only storage for prefilling Stripe Checkout after lead magnet capture. */
export const DIGITAL_CHECKOUT_EMAIL_KEY = "rr_digital_checkout_email"

export function storeDigitalCheckoutEmail(email: string) {
  if (typeof window === "undefined") return
  const trimmed = email.trim().toLowerCase()
  if (!trimmed) return
  try {
    window.localStorage.setItem(DIGITAL_CHECKOUT_EMAIL_KEY, trimmed)
  } catch {
    // Ignore quota / private mode failures.
  }
}

export function readDigitalCheckoutEmail(): string | undefined {
  if (typeof window === "undefined") return undefined
  try {
    const value = window.localStorage.getItem(DIGITAL_CHECKOUT_EMAIL_KEY)?.trim()
    return value || undefined
  } catch {
    return undefined
  }
}
