import { describe, expect, it, beforeEach, afterEach, vi } from "vitest"
import { deleteAllRageResetData, loadStorage, saveStorage } from "./storage"
import { STORAGE_KEY } from "./types"

describe("data deletion", () => {
  const store = new Map<string, string>()

  beforeEach(() => {
    store.clear()
    vi.stubGlobal("window", {
      localStorage: {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => store.set(k, v),
        removeItem: (k: string) => store.delete(k),
      },
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("deletes all Rage Reset data immediately", () => {
    saveStorage({
      version: 1,
      settings: { soundEnabled: false, hapticsEnabled: false, reducedEffects: true },
      progression: {
        calmEnergy: 99,
        completedSessions: 5,
        unlockedRooms: ["office-meltdown", "kitchen-chaos"],
        unlockedWeapons: ["baseball-bat", "rubber-chicken"],
        currentResetStreak: 3,
        weaponEffectsUnlocked: [],
        cooldownEverCompleted: true,
        sessionsSinceLastPromo: 2,
        installPromptShown: true,
      },
      history: [],
      activeSession: {
        state: "free-smash",
        startedAt: new Date().toISOString(),
      },
    })
    expect(store.has(STORAGE_KEY)).toBe(true)
    store.set("rage-reset-seen", "1")
    deleteAllRageResetData()
    expect(store.has(STORAGE_KEY)).toBe(false)
    expect(store.has("rage-reset-seen")).toBe(false)
    const fresh = loadStorage()
    expect(fresh.progression.completedSessions).toBe(0)
    expect(fresh.settings.soundEnabled).toBe(true)
    expect(fresh.activeSession).toBeUndefined()
  })
})
