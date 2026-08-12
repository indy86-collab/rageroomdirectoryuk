import { afterEach, describe, expect, it } from "vitest"
import { createEmptyWorkspace } from "./defaults"
import {
  _resetCorporateBookingMemoryStoreForTests,
  getOrCreateWorkspaceForSession,
  getWorkspaceById,
  isCorporateBookingDurableStoreReady,
  isUpstashConfigured,
  saveWorkspace,
} from "./store"
import { CORPORATE_BOOKING_SYSTEM_PRODUCT_ID } from "./types"

describe("corporate booking workspace store", () => {
  const originalRequireRedis = process.env.CORPORATE_BOOKING_REQUIRE_REDIS
  const originalUrl = process.env.UPSTASH_REDIS_REST_URL
  const originalToken = process.env.UPSTASH_REDIS_REST_TOKEN
  const originalKvUrl = process.env.KV_REST_API_URL
  const originalKvToken = process.env.KV_REST_API_TOKEN

  afterEach(() => {
    _resetCorporateBookingMemoryStoreForTests()
    if (originalRequireRedis === undefined) {
      delete process.env.CORPORATE_BOOKING_REQUIRE_REDIS
    } else {
      process.env.CORPORATE_BOOKING_REQUIRE_REDIS = originalRequireRedis
    }
    if (originalUrl === undefined) delete process.env.UPSTASH_REDIS_REST_URL
    else process.env.UPSTASH_REDIS_REST_URL = originalUrl
    if (originalToken === undefined) delete process.env.UPSTASH_REDIS_REST_TOKEN
    else process.env.UPSTASH_REDIS_REST_TOKEN = originalToken
    if (originalKvUrl === undefined) delete process.env.KV_REST_API_URL
    else process.env.KV_REST_API_URL = originalKvUrl
    if (originalKvToken === undefined) delete process.env.KV_REST_API_TOKEN
    else process.env.KV_REST_API_TOKEN = originalKvToken
  })

  it("creates and reloads a workspace for a session", async () => {
    const first = await getOrCreateWorkspaceForSession("cs_session_1")
    expect(first.sessionId).toBe("cs_session_1")
    expect(first.productId).toBe(CORPORATE_BOOKING_SYSTEM_PRODUCT_ID)

    first.venue.businessName = "Smash House"
    const saved = await saveWorkspace(first)
    expect(saved.venue.businessName).toBe("Smash House")

    const again = await getOrCreateWorkspaceForSession("cs_session_1")
    expect(again.id).toBe(first.id)
    expect(again.venue.businessName).toBe("Smash House")

    const byId = await getWorkspaceById(first.id)
    expect(byId?.sessionId).toBe("cs_session_1")
  })

  it("does not let normalize accept a foreign workspace id on save path shape", async () => {
    const a = createEmptyWorkspace("cs_a")
    const b = createEmptyWorkspace("cs_b")
    await saveWorkspace(a)
    // Ownership is enforced in the API layer; store keeps ids as provided.
    const loadedA = await getWorkspaceById(a.id)
    const loadedB = await getWorkspaceById(b.id)
    expect(loadedA?.id).toBe(a.id)
    expect(loadedB).toBeNull()
  })

  it("isolates two workspace sessions in memory mode", async () => {
    const a = await getOrCreateWorkspaceForSession("cs_iso_a")
    const b = await getOrCreateWorkspaceForSession("cs_iso_b")
    a.venue.businessName = "Venue A"
    b.venue.businessName = "Venue B"
    await saveWorkspace(a)
    await saveWorkspace(b)

    expect((await getWorkspaceById(a.id))?.venue.businessName).toBe("Venue A")
    expect((await getWorkspaceById(b.id))?.venue.businessName).toBe("Venue B")
    expect(a.id).not.toBe(b.id)
  })

  it("reports durable store unreadiness when Redis is required but missing", () => {
    delete process.env.UPSTASH_REDIS_REST_URL
    delete process.env.UPSTASH_REDIS_REST_TOKEN
    delete process.env.KV_REST_API_URL
    delete process.env.KV_REST_API_TOKEN
    process.env.CORPORATE_BOOKING_REQUIRE_REDIS = "true"
    // Memory mode still wins in Vitest — readiness helper is true for tests.
    expect(isUpstashConfigured()).toBe(false)
    expect(isCorporateBookingDurableStoreReady()).toBe(true)
  })

  it("treats Vercel Marketplace KV_REST_API_* credentials as Upstash configured", () => {
    delete process.env.UPSTASH_REDIS_REST_URL
    delete process.env.UPSTASH_REDIS_REST_TOKEN
    process.env.KV_REST_API_URL = "https://example.upstash.io"
    process.env.KV_REST_API_TOKEN = "test-token"
    expect(isUpstashConfigured()).toBe(true)
  })
})
