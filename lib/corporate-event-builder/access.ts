import "server-only"
import {
  CORPORATE_EVENT_BUILDER_PRODUCT_ID,
} from "./types"
import {
  getDigitalProduct,
  sessionAmountMatchesProduct,
} from "@/lib/digital-products"
import {
  isLeadDownloadSession,
  verifyDownloadToken,
} from "@/lib/download-token"
import { getStripe } from "@/lib/stripe"

export type BuilderAccessResult =
  | {
      ok: true
      sessionId: string
      productId: string
      productName: string
    }
  | {
      ok: false
      error: string
      status: number
    }

/**
 * Verify a Stripe Checkout session unlocks the Event Builder PDF pack.
 * The builder itself is free. Historical purchasers keep PDF access.
 */
export async function verifyCorporateBuilderAccess(
  sessionId: string | null | undefined
): Promise<BuilderAccessResult> {
  if (!sessionId?.trim()) {
    return { ok: false, error: "Missing checkout session.", status: 400 }
  }

  const product = getDigitalProduct(CORPORATE_EVENT_BUILDER_PRODUCT_ID)
  if (!product) {
    return { ok: false, error: "Product unavailable.", status: 500 }
  }

  try {
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(sessionId.trim())
    const purchasedId = session.metadata?.productId

    if (
      session.payment_status !== "paid" ||
      purchasedId !== CORPORATE_EVENT_BUILDER_PRODUCT_ID ||
      !sessionAmountMatchesProduct(
        product,
        session.amount_subtotal,
        session.currency
      )
    ) {
      return {
        ok: false,
        error: "This order does not unlock the Event Builder PDF pack.",
        status: 403,
      }
    }

    return {
      ok: true,
      sessionId: session.id,
      productId: product.id,
      productName: product.name,
    }
  } catch (error) {
    console.error("Corporate Event Builder access check failed", error)
    return {
      ok: false,
      error: "We could not verify this purchase.",
      status: 404,
    }
  }
}

/**
 * Allow access via an unexpired purchase download token (helps legacy buyers
 * who still have their email download link).
 */
export async function verifyCorporateBuilderAccessFromToken(
  token: string | null | undefined
): Promise<BuilderAccessResult> {
  if (!token?.trim()) {
    return { ok: false, error: "Missing access token.", status: 400 }
  }

  const payload = verifyDownloadToken(token.trim())
  if (
    !payload ||
    payload.kind === "lead" ||
    isLeadDownloadSession(payload.sessionId) ||
    payload.productId !== CORPORATE_EVENT_BUILDER_PRODUCT_ID
  ) {
    return {
      ok: false,
      error: "This download link does not unlock the Event Builder PDF pack.",
      status: 403,
    }
  }

  return verifyCorporateBuilderAccess(payload.sessionId)
}
