"use client"

export function canVibrate(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.vibrate === "function"
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export type HapticPattern = "tap" | "impact" | "break" | "controlled" | "warn" | "success"

const PATTERNS: Record<HapticPattern, number | number[]> = {
  tap: 8,
  impact: [12, 30, 18],
  break: [20, 40, 30, 40, 40],
  controlled: [10, 40, 35],
  warn: [30, 50, 30],
  success: [15, 40, 15, 40, 25],
}

export function triggerHaptic(
  pattern: HapticPattern,
  enabled: boolean
): void {
  if (!enabled || !canVibrate()) return
  try {
    navigator.vibrate(PATTERNS[pattern])
  } catch {
    // unsupported
  }
}
