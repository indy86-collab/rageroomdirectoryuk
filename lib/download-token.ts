import "server-only"
import crypto from "crypto"
import { getDigitalProduct } from "@/lib/digital-products"

export type DownloadTokenKind = "purchase" | "lead"

export type DownloadTokenPayload = {
  sessionId: string
  productId: string
  exp: number
  kind?: DownloadTokenKind
}

const TOKEN_TTL_SECONDS = 72 * 60 * 60
const LEAD_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60
export const LEAD_DOWNLOAD_SESSION_PREFIX = "lead:"

function getTokenSecret() {
  const secret = process.env.DOWNLOAD_TOKEN_SECRET || process.env.STRIPE_SECRET_KEY

  if (!secret) {
    throw new Error("DOWNLOAD_TOKEN_SECRET or STRIPE_SECRET_KEY must be configured")
  }

  return secret
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

function encodeToken(payload: DownloadTokenPayload) {
  const encodedPayload = base64UrlEncode(JSON.stringify(payload))
  const signature = signPayload(encodedPayload)
  return `${encodedPayload}.${signature}`
}

export function createDownloadToken({
  sessionId,
  productId,
}: {
  sessionId: string
  productId: string
}) {
  const product = getDigitalProduct(productId)

  if (!product?.filePath) {
    throw new Error("Unknown digital product or product has no downloadable file")
  }

  return encodeToken({
    sessionId,
    productId: product.id,
    exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
    kind: "purchase",
  })
}

/** Signed download token for free lead-magnet products (no Stripe session). */
export function createLeadDownloadToken(productId: string) {
  const product = getDigitalProduct(productId)

  if (!product?.isFree || !product.filePath) {
    throw new Error("Lead download tokens are only available for free products")
  }

  const nonce = crypto.randomBytes(8).toString("hex")
  return encodeToken({
    sessionId: `${LEAD_DOWNLOAD_SESSION_PREFIX}${nonce}`,
    productId: product.id,
    exp: Math.floor(Date.now() / 1000) + LEAD_TOKEN_TTL_SECONDS,
    kind: "lead",
  })
}

export function isLeadDownloadSession(sessionId: string) {
  return sessionId.startsWith(LEAD_DOWNLOAD_SESSION_PREFIX)
}

export function verifyDownloadToken(token: string) {
  const [encodedPayload, signature] = token.split(".")

  if (!encodedPayload || !signature) {
    return null
  }

  const expectedSignature = signPayload(encodedPayload)
  const signatureBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expectedSignature)

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8")
    ) as Partial<DownloadTokenPayload>

    if (
      !payload.sessionId ||
      !payload.productId ||
      !payload.exp ||
      payload.exp <= Math.floor(Date.now() / 1000) ||
      !getDigitalProduct(payload.productId)
    ) {
      return null
    }

    const kind: DownloadTokenKind =
      payload.kind === "lead" || isLeadDownloadSession(payload.sessionId)
        ? "lead"
        : "purchase"

    return {
      sessionId: payload.sessionId,
      productId: payload.productId,
      exp: payload.exp,
      kind,
    } satisfies DownloadTokenPayload
  } catch {
    return null
  }
}
