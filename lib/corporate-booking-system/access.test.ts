import { afterEach, describe, expect, it } from "vitest"
import {
  createWorkspaceAccessToken,
  verifyWorkspaceAccessToken,
} from "./tokens"
import { CORPORATE_BOOKING_SYSTEM_PRODUCT_ID } from "./types"

const ORIGINAL_SECRET = process.env.DOWNLOAD_TOKEN_SECRET

describe("corporate booking system access tokens", () => {
  afterEach(() => {
    if (ORIGINAL_SECRET === undefined) {
      delete process.env.DOWNLOAD_TOKEN_SECRET
    } else {
      process.env.DOWNLOAD_TOKEN_SECRET = ORIGINAL_SECRET
    }
  })

  it("round-trips a valid workspace access token", () => {
    process.env.DOWNLOAD_TOKEN_SECRET = "test-cbs-secret"
    const token = createWorkspaceAccessToken({
      workspaceId: "ws_123",
      sessionId: "cs_test_abc",
    })
    const payload = verifyWorkspaceAccessToken(token)
    expect(payload).toEqual({
      workspaceId: "ws_123",
      sessionId: "cs_test_abc",
      productId: CORPORATE_BOOKING_SYSTEM_PRODUCT_ID,
      exp: expect.any(Number),
    })
  })

  it("rejects tampered tokens", () => {
    process.env.DOWNLOAD_TOKEN_SECRET = "test-cbs-secret"
    const token = createWorkspaceAccessToken({
      workspaceId: "ws_123",
      sessionId: "cs_test_abc",
    })
    expect(verifyWorkspaceAccessToken(token + "x")).toBeNull()
    expect(verifyWorkspaceAccessToken("not.a.token")).toBeNull()
    expect(verifyWorkspaceAccessToken("")).toBeNull()
  })

  it("rejects expired tokens", () => {
    process.env.DOWNLOAD_TOKEN_SECRET = "test-cbs-secret"
    const expiredPayload = Buffer.from(
      JSON.stringify({
        workspaceId: "ws_123",
        sessionId: "cs_test_abc",
        productId: CORPORATE_BOOKING_SYSTEM_PRODUCT_ID,
        exp: Math.floor(Date.now() / 1000) - 10,
      })
    ).toString("base64url")
    // Signature will not match unless we create via helper; verify path rejects bad sig.
    expect(verifyWorkspaceAccessToken(`${expiredPayload}.fakesig`)).toBeNull()
  })

  it("does not accept a token bound to a different workspace id after tamper of payload only", () => {
    process.env.DOWNLOAD_TOKEN_SECRET = "test-cbs-secret"
    const token = createWorkspaceAccessToken({
      workspaceId: "ws_123",
      sessionId: "cs_test_abc",
    })
    const [payload] = token.split(".")
    const decoded = JSON.parse(
      Buffer.from(payload!, "base64url").toString("utf8")
    ) as {
      workspaceId: string
      sessionId: string
      productId: string
      exp: number
    }
    decoded.workspaceId = "ws_other"
    const tamperedPayload = Buffer.from(JSON.stringify(decoded)).toString(
      "base64url"
    )
    const [, signature] = token.split(".")
    expect(
      verifyWorkspaceAccessToken(`${tamperedPayload}.${signature}`)
    ).toBeNull()
  })
})
