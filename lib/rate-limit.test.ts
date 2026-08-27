import { afterEach, describe, expect, it } from "vitest"
import { allowRequest, resetRateLimitState } from "./rate-limit"

describe("rate limiter", () => {
  afterEach(() => {
    resetRateLimitState()
  })

  it("allows traffic under the window and then blocks", () => {
    expect(allowRequest("ip", 2, 1_000, 1_000)).toBe(true)
    expect(allowRequest("ip", 2, 1_000, 1_100)).toBe(true)
    expect(allowRequest("ip", 2, 1_000, 1_200)).toBe(false)
    expect(allowRequest("ip", 2, 1_000, 2_100)).toBe(true)
  })
})
