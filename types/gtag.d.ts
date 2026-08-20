export {}

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (
      command: "config" | "consent" | "event" | "js",
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void
  }
}
