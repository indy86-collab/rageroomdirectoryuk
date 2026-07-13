import "server-only"
import crypto from "crypto"
import { getDigitalProduct } from "@/lib/digital-products"

export type DownloadTokenPayload = {
  sessionId: string
  productId: string
  exp: number
}

const TOKEN_TTL_SECONDS = 72 * 60 * 60

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

  const payload: DownloadTokenPayload = {
    sessionId,
    productId: product.id,
    exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
  }
  const encodedPayload = base64UrlEncode(JSON.stringify(payload))
  const signature = signPayload(encodedPayload)

  return `${encodedPayload}.${signature}`
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

    return {
      sessionId: payload.sessionId,
      productId: payload.productId,
      exp: payload.exp,
    } satisfies DownloadTokenPayload
  } catch {
    return null
  }
}
