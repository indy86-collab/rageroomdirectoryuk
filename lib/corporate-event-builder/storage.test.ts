import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { createEmptyCorporateEvent } from "./defaults"
import { GUEST_WORKSPACE_ID } from "./types"
import {
  loadCorporateEvent,
  migrateGuestPlanToSession,
  resolveCorporateEvent,
  saveCorporateEvent,
  storageKeyForSession,
} from "./storage"

const memory = new Map<string, string>()

function installLocalStorage() {
  const localStorage = {
    getItem(key: string) {
      return memory.has(key) ? memory.get(key)! : null
    },
    setItem(key: string, value: string) {
      memory.set(key, value)
    },
    clear() {
      memory.clear()
    },
  }
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { localStorage },
  })
}

describe("corporate event builder storage", () => {
  beforeEach(() => {
    memory.clear()
    installLocalStorage()
  })

  afterEach(() => {
    memory.clear()
  })

  it("keys guest and paid workspaces separately", () => {
    expect(storageKeyForSession(GUEST_WORKSPACE_ID)).toBe(
      "rr_corporate_event_v1:guest"
    )
    expect(storageKeyForSession("cs_test_123")).toBe(
      "rr_corporate_event_v1:cs_test_123"
    )
  })

  it("migrates a guest plan into an empty paid session", () => {
    const guest = {
      ...createEmptyCorporateEvent(GUEST_WORKSPACE_ID),
      companyName: "Acme Engineering",
    }
    saveCorporateEvent(guest)

    const migrated = migrateGuestPlanToSession("cs_paid")
    expect(migrated?.companyName).toBe("Acme Engineering")
    expect(migrated?.entitlementSessionId).toBe("cs_paid")
    expect(loadCorporateEvent("cs_paid")?.companyName).toBe("Acme Engineering")
  })

  it("does not overwrite an existing paid session with guest data", () => {
    saveCorporateEvent({
      ...createEmptyCorporateEvent(GUEST_WORKSPACE_ID),
      companyName: "Guest Co",
    })
    saveCorporateEvent({
      ...createEmptyCorporateEvent("cs_paid"),
      companyName: "Paid Co",
    })

    const resolved = resolveCorporateEvent("cs_paid")
    expect(resolved.companyName).toBe("Paid Co")
  })
})
