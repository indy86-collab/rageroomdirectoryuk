/**
 * Rage Reset — original visual identity for the next game renderer.
 * Deep navy industrial room + warm orange / electric teal accents.
 */

export const RR_COLORS = {
  navyDeep: "#0B1220",
  navyMid: "#152238",
  charcoal: "#1C2433",
  wall: "#243044",
  wallTrim: "#3A4A63",
  floor: "#2A2118",
  floorHighlight: "#3D3226",
  desk: "#5C4030",
  deskTop: "#6E4E3A",
  wood: "#8B5E3C",
  metal: "#8B95A5",
  metalDark: "#4A5568",
  plastic: "#C5CEDA",
  screen: "#1E3A5F",
  screenLit: "#38BDF8",
  paper: "#F4EDE0",
  ceramic: "#E8D5C4",
  glass: "#A8D4E8",
  accentOrange: "#F97316",
  accentTeal: "#2DD4BF",
  accentGold: "#FBBF24",
  controlled: "#5EEAD4",
  heatCool: "#34D399",
  heatWarm: "#FBBF24",
  heatHot: "#EF4444",
  crack: "rgba(15, 20, 30, 0.85)",
  shadow: "rgba(0, 0, 0, 0.45)",
  outline: "#0A0F18",
  hudPanel: "rgba(11, 18, 32, 0.78)",
  hudBorder: "rgba(45, 212, 191, 0.35)",
  feedbackCrack: "#FDBA74",
  feedbackSmash: "#FB7185",
  feedbackPerfect: "#5EEAD4",
  feedbackHeavy: "#FBBF24",
  feedbackControl: "#A78BFA",
} as const

export const RR_LIGHT = {
  /** Key light from upper-left */
  keyAngle: -0.55,
  ambient: 0.72,
  highlight: 0.28,
} as const

export const RR_LAYOUT = {
  /** Logical design size (portrait mobile). */
  designWidth: 390,
  designHeight: 844,
  /** Desktop max stage width — avoid ultra-wide empty stretch. */
  maxStageWidth: 480,
  maxStageHeight: 920,
  hudTopReserve: 0.11,
  hudBottomReserve: 0.16,
  weaponForegroundY: 0.78,
} as const

export type EffectIntensity = "full" | "reduced" | "minimal"

export function particleBudget(intensity: EffectIntensity): number {
  if (intensity === "minimal") return 8
  if (intensity === "reduced") return 18
  return 48
}

export function shakeLimit(intensity: EffectIntensity): number {
  if (intensity === "minimal") return 0
  if (intensity === "reduced") return 4
  return 14
}
