import { afterEach, describe, expect, it } from "vitest"
import {
  createLeadDownloadToken,
  isLeadDownloadSession,
  verifyDownloadToken,
} from "@/lib/download-token"
import { FIRST_VISIT_CHECKLIST_PRODUCT_ID } from "@/lib/digital-products"

const ORIGINAL_SECRET = process.env.DOWNLOAD_TOKEN_SECRET

afterEach(() => {
  if (ORIGINAL_SECRET === undefined) {
    delete process.env.DOWNLOAD_TOKEN_SECRET
  } else {
    process.env.DOWNLOAD_TOKEN_SECRET = ORIGINAL_SECRET
  }
})

describe("lead download tokens", () => {
  it("creates and verifies a lead token for the free checklist", () => {
    process.env.DOWNLOAD_TOKEN_SECRET = "test-download-token-secret"
    const token = createLeadDownloadToken(FIRST_VISIT_CHECKLIST_PRODUCT_ID)
    const payload = verifyDownloadToken(token)

    expect(payload).toBeTruthy()
    expect(payload?.kind).toBe("lead")
    expect(payload?.productId).toBe(FIRST_VISIT_CHECKLIST_PRODUCT_ID)
    expect(isLeadDownloadSession(payload!.sessionId)).toBe(true)
  })

  it("rejects lead tokens for paid products", () => {
    process.env.DOWNLOAD_TOKEN_SECRET = "test-download-token-secret"
    expect(() => createLeadDownloadToken("rage-room-party-planner")).toThrow(
      /free products/i
    )
  })
})
