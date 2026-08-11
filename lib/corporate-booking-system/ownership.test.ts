import { describe, expect, it } from "vitest"
import { createEmptyWorkspace } from "./defaults"
import { normalizeWorkspace } from "./normalize"
import { CORPORATE_BOOKING_SYSTEM_PRODUCT_ID } from "./types"

describe("corporate booking workspace ownership lock", () => {
  it("ignores client-supplied workspace id, session id and product id", () => {
    const authorized = createEmptyWorkspace("cs_authorized")
    const attackerPayload = {
      ...createEmptyWorkspace("cs_attacker"),
      id: "ws_attacker",
      sessionId: "cs_attacker",
      productId: "corporate-team-building-toolkit",
      venue: {
        ...createEmptyWorkspace("cs_attacker").venue,
        businessName: "Hijacked Venue",
      },
    }

    const normalized = normalizeWorkspace(attackerPayload)
    const secured = {
      ...normalized,
      id: authorized.id,
      sessionId: authorized.sessionId,
      productId: CORPORATE_BOOKING_SYSTEM_PRODUCT_ID,
      createdAt: authorized.createdAt,
    }

    expect(secured.id).toBe(authorized.id)
    expect(secured.sessionId).toBe("cs_authorized")
    expect(secured.productId).toBe(CORPORATE_BOOKING_SYSTEM_PRODUCT_ID)
    expect(secured.venue.businessName).toBe("Hijacked Venue")
    expect(secured.createdAt).toBe(authorized.createdAt)
  })
})
