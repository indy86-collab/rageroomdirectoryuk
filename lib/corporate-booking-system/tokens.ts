import "server-only"
import crypto from "crypto"
import { CORPORATE_BOOKING_SYSTEM_PRODUCT_ID } from "./types"

export type WorkspaceAccessTokenPayload = {
  workspaceId: string
  sessionId: string
  productId: string
  exp: number
}

/** Long-lived access for recurring venue-owner use (1 year). */
const ACCESS_TTL_SECONDS = 365 * 24 * 60 * 60

function getTokenSecret() {
  const secret =
    process.env.DOWNLOAD_TOKEN_SECRET || process.env.STRIPE_SECRET_KEY

  if (!secret) {
    throw new Error(
      "DOWNLOAD_TOKEN_SECRET or STRIPE_SECRET_KEY must be configured"
    )
  }

  return `${secret}:corporate-booking-system`
}

function base64UrlEncode(value: string | Buffer) {
  return Buffer.from(value).toString("base64url")
}

function signPayload(encodedPayload: string) {
  return crypto
    .createHmac("sha256", getTokenSecret())
    .update(encodedPayload)
    .digest("base64url")
}

export function createWorkspaceAccessToken({
  workspaceId,
  sessionId,
}: {
  workspaceId: string
  sessionId: string
}) {
  const payload: WorkspaceAccessTokenPayload = {
    workspaceId,
    sessionId,
    productId: CORPORATE_BOOKING_SYSTEM_PRODUCT_ID,
    exp: Math.floor(Date.now() / 1000) + ACCESS_TTL_SECONDS,
  }
  const encodedPayload = base64UrlEncode(JSON.stringify(payload))
  const signature = signPayload(encodedPayload)
  return `${encodedPayload}.${signature}`
}

export function verifyWorkspaceAccessToken(
  token: string | null | undefined
): WorkspaceAccessTokenPayload | null {
  if (!token?.trim()) return null

  const [encodedPayload, signature] = token.trim().split(".")
  if (!encodedPayload || !signature) return null

  const expected = signPayload(encodedPayload)
  const sigBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)
  if (
    sigBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(sigBuffer, expectedBuffer)
  ) {
    return null
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8")
    ) as WorkspaceAccessTokenPayload

    if (
      !payload.workspaceId ||
      !payload.sessionId ||
      payload.productId !== CORPORATE_BOOKING_SYSTEM_PRODUCT_ID ||
      typeof payload.exp !== "number" ||
      payload.exp < Math.floor(Date.now() / 1000)
    ) {
      return null
    }

    return payload
  } catch {
    return null
  }
}
