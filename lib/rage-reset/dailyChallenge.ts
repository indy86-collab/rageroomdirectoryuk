export type DailyChallengeId =
  | "no-max-heat"
  | "five-controlled-strikes"
  | "perfect-cooldown"
  | "full-reset"
  | "use-rubber-chicken"
  | "technology-room"

export interface DailyChallengeDefinition {
  id: DailyChallengeId
  title: string
  description: string
}

export const DAILY_CHALLENGES: DailyChallengeDefinition[] = [
  {
    id: "no-max-heat",
    title: "Keep your cool",
    description: "Complete a session without reaching maximum heat.",
  },
  {
    id: "five-controlled-strikes",
    title: "Five calm strikes",
    description: "Land five correctly timed controlled strikes.",
  },
  {
    id: "perfect-cooldown",
    title: "Clean sort",
    description: "Finish the cool-down without an incorrect placement.",
  },
  {
    id: "full-reset",
    title: "Full reset",
    description: "Complete a full Rage Reset session.",
  },
  {
    id: "use-rubber-chicken",
    title: "Chicken champion",
    description: "Complete a session using the rubber chicken.",
  },
  {
    id: "technology-room",
    title: "Tech takedown",
    description: "Complete the Technology Breakdown room.",
  },
]

/** Local YYYY-MM-DD key. */
export function localDateKey(date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

/** Deterministic daily challenge from local date. */
export function getDailyChallengeForDate(date = new Date()): DailyChallengeDefinition {
  const key = localDateKey(date)
  const hash = hashString(key)
  const index = hash % DAILY_CHALLENGES.length
  return DAILY_CHALLENGES[index]
}

function hashString(input: string): number {
  let h = 0
  for (let i = 0; i < input.length; i += 1) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0
  }
  return h
}

export function evaluateDailyChallenge(
  challengeId: DailyChallengeId,
  session: {
    reachedMaxHeat: boolean
    controlledStrikes: number
    cooldownCompleted: boolean
    cooldownHadIncorrect?: boolean
    completedFullSession: boolean
    weaponId: string | null
    roomId: string | null
  }
): boolean {
  switch (challengeId) {
    case "no-max-heat":
      return session.completedFullSession && !session.reachedMaxHeat
    case "five-controlled-strikes":
      return session.controlledStrikes >= 5
    case "perfect-cooldown":
      return session.cooldownCompleted && !session.cooldownHadIncorrect
    case "full-reset":
      return session.completedFullSession
    case "use-rubber-chicken":
      return session.completedFullSession && session.weaponId === "rubber-chicken"
    case "technology-room":
      return session.completedFullSession && session.roomId === "technology-breakdown"
    default:
      return false
  }
}
