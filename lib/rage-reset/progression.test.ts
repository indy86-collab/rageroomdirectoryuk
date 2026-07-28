import { describe, expect, it } from "vitest"
import {
  calculateSessionCalmEnergy,
  calculateResetStreak,
  roomsUnlockedForSessions,
  shouldShowDirectoryPromo,
  moodChangeCopy,
} from "./progression"
import {
  getDailyChallengeForDate,
  evaluateDailyChallenge,
  localDateKey,
} from "./dailyChallenge"
import {
  parseStorage,
  trimHistory,
  createDefaultStorage,
} from "./storage"
import type { SessionHistoryEntry } from "./types"

describe("Calm Energy calculations", () => {
  it("awards energy for completion, strikes, cooldown and low heat", () => {
    const energy = calculateSessionCalmEnergy({
      completedFullSession: true,
      controlledStrikes: 5,
      cooldownCompleted: true,
      cooldownSkipped: false,
      maxHeatReached: 50,
      dailyChallengeCompleted: true,
    })
    expect(energy).toBeGreaterThanOrEqual(25 + 40 + 20 + 10 + 5 + 15)
  })

  it("does not award extra for anger score (score not an input)", () => {
    const a = calculateSessionCalmEnergy({
      completedFullSession: true,
      controlledStrikes: 0,
      cooldownCompleted: false,
      cooldownSkipped: true,
      maxHeatReached: 100,
      dailyChallengeCompleted: false,
    })
    expect(a).toBe(25)
  })
})

describe("unlock progression", () => {
  it("unlocks kitchen after 1 and tech after 3", () => {
    expect(roomsUnlockedForSessions(0)).toEqual(["office-meltdown"])
    expect(roomsUnlockedForSessions(1)).toContain("kitchen-chaos")
    expect(roomsUnlockedForSessions(3)).toContain("technology-breakdown")
  })
})

describe("streak calculation", () => {
  it("starts at 1 and increments on consecutive days", () => {
    const day1 = calculateResetStreak(undefined, 0, new Date("2026-07-01T12:00:00"))
    expect(day1.streak).toBe(1)
    const day2 = calculateResetStreak(day1.dateKey, day1.streak, new Date("2026-07-02T12:00:00"))
    expect(day2.streak).toBe(2)
    const gap = calculateResetStreak(day2.dateKey, day2.streak, new Date("2026-07-05T12:00:00"))
    expect(gap.streak).toBe(1)
  })

  it("does not double-count same day", () => {
    const a = calculateResetStreak("2026-07-27", 4, new Date("2026-07-27T18:00:00"))
    expect(a.streak).toBe(4)
  })
})

describe("daily challenge generation", () => {
  it("is deterministic for a local date", () => {
    const a = getDailyChallengeForDate(new Date(2026, 6, 27))
    const b = getDailyChallengeForDate(new Date(2026, 6, 27))
    expect(a.id).toBe(b.id)
  })

  it("evaluates challenge rules without rewarding anger", () => {
    expect(
      evaluateDailyChallenge("full-reset", {
        reachedMaxHeat: true,
        controlledStrikes: 0,
        cooldownCompleted: false,
        completedFullSession: true,
        weaponId: "baseball-bat",
        roomId: "office-meltdown",
      })
    ).toBe(true)
    expect(
      evaluateDailyChallenge("use-rubber-chicken", {
        reachedMaxHeat: false,
        controlledStrikes: 2,
        cooldownCompleted: true,
        completedFullSession: true,
        weaponId: "rubber-chicken",
        roomId: "office-meltdown",
      })
    ).toBe(true)
  })

  it("formats local date keys", () => {
    expect(localDateKey(new Date(2026, 0, 5))).toBe("2026-01-05")
  })
})

describe("history trimming and corrupt storage", () => {
  it("trims history older than seven days", () => {
    const now = new Date("2026-07-27T12:00:00Z")
    const entries: SessionHistoryEntry[] = [
      {
        id: "old",
        startedAt: "2026-07-01T12:00:00Z",
        completedAt: "2026-07-01T12:05:00Z",
        initialScore: 5,
        finalScore: 3,
        roomId: "office-meltdown",
        weaponId: "baseball-bat",
        objectsDestroyed: 1,
        bestCombo: 1,
        controlledStrikes: 1,
        cooldownCompleted: true,
        cooldownSkipped: false,
        calmEnergyEarned: 10,
        maxHeatReached: 20,
        smashScore: 10,
      },
      {
        id: "new",
        startedAt: "2026-07-26T12:00:00Z",
        completedAt: "2026-07-26T12:05:00Z",
        initialScore: 5,
        finalScore: 3,
        roomId: "office-meltdown",
        weaponId: "baseball-bat",
        objectsDestroyed: 1,
        bestCombo: 1,
        controlledStrikes: 1,
        cooldownCompleted: true,
        cooldownSkipped: false,
        calmEnergyEarned: 10,
        maxHeatReached: 20,
        smashScore: 10,
      },
    ]
    const trimmed = trimHistory(entries, now, 7)
    expect(trimmed.map((e) => e.id)).toEqual(["new"])
  })

  it("handles corrupt local storage safely", () => {
    expect(parseStorage(null).version).toBe(1)
    expect(parseStorage({ version: 99 }).version).toBe(1)
    expect(parseStorage("nope").version).toBe(1)
    const ok = parseStorage(createDefaultStorage())
    expect(ok.progression.unlockedRooms).toContain("office-meltdown")
  })
})

describe("promotion frequency and high-intensity suppression", () => {
  it("caps promo frequency", () => {
    expect(
      shouldShowDirectoryPromo({
        initialScore: 4,
        finalScore: 3,
        sessionsSinceLastPromo: 2,
      })
    ).toBe(false)
    expect(
      shouldShowDirectoryPromo({
        initialScore: 4,
        finalScore: 3,
        sessionsSinceLastPromo: 3,
      })
    ).toBe(true)
  })

  it("suppresses promo for high-intensity sessions", () => {
    expect(
      shouldShowDirectoryPromo({
        initialScore: 9,
        finalScore: 4,
        sessionsSinceLastPromo: 10,
      })
    ).toBe(false)
    expect(
      shouldShowDirectoryPromo({
        initialScore: 4,
        finalScore: 10,
        sessionsSinceLastPromo: 10,
      })
    ).toBe(false)
  })
})

describe("mood copy", () => {
  it("uses neutral non-medical language", () => {
    expect(moodChangeCopy(8, 6)).toContain("less fired up")
    expect(moodChangeCopy(5, 5)).toContain("okay")
    expect(moodChangeCopy(4, 7)).toContain("more fired up")
  })
})
