import "server-only"
import {
  getDigitalProduct,
  sessionAmountMatchesProduct,
} from "@/lib/digital-products"
import { getStripe } from "@/lib/stripe"
import {
  getOrCreateWorkspaceForSession,
  getWorkspaceById,
} from "./store"
import {
  createWorkspaceAccessToken,
  verifyWorkspaceAccessToken,
} from "./tokens"
import {
  CORPORATE_BOOKING_SYSTEM_PRODUCT_ID,
  type VenueOwnerWorkspace,
} from "./types"

export type BookingSystemAccessResult =
  | {
      ok: true
      sessionId: string
      workspaceId: string
      accessToken: string
      productId: string
      productName: string
      workspace: VenueOwnerWorkspace
    }
  | {
      ok: false
      error: string
      status: number
    }

export async function verifyCorporateBookingPurchase(
  sessionId: string | null | undefined
) {
  if (!sessionId?.trim()) {
    return { ok: false as const, error: "Missing checkout session.", status: 400 }
  }

  const product = getDigitalProduct(CORPORATE_BOOKING_SYSTEM_PRODUCT_ID)
  if (!product) {
    return { ok: false as const, error: "Product unavailable.", status: 500 }
  }

  try {
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(sessionId.trim())
    const purchasedId = session.metadata?.productId

    if (
      session.payment_status !== "paid" ||
      purchasedId !== CORPORATE_BOOKING_SYSTEM_PRODUCT_ID ||
      !sessionAmountMatchesProduct(
        product,
        session.amount_subtotal,
        session.currency
      )
    ) {
      return {
        ok: false as const,
        error:
          "This order does not unlock the Corporate Booking System.",
        status: 403,
      }
    }

    return {
      ok: true as const,
      sessionId: session.id,
      productId: product.id,
      productName: product.name,
    }
  } catch (error) {
    console.error("Corporate Booking System purchase check failed", error)
    return {
      ok: false as const,
      error: "We could not verify this purchase.",
      status: 404,
    }
  }
}

export async function establishCorporateBookingAccess(
  sessionId: string | null | undefined
): Promise<BookingSystemAccessResult> {
  const purchase = await verifyCorporateBookingPurchase(sessionId)
  if (!purchase.ok) return purchase

  const workspace = await getOrCreateWorkspaceForSession(purchase.sessionId)
  const accessToken = createWorkspaceAccessToken({
    workspaceId: workspace.id,
    sessionId: workspace.sessionId,
  })

  return {
    ok: true,
    sessionId: workspace.sessionId,
    workspaceId: workspace.id,
    accessToken,
    productId: purchase.productId,
    productName: purchase.productName,
    workspace,
  }
}

export async function resolveCorporateBookingAccess(input: {
  accessToken?: string | null
  sessionId?: string | null
}): Promise<BookingSystemAccessResult> {
  if (input.accessToken?.trim()) {
    const payload = verifyWorkspaceAccessToken(input.accessToken)
    if (!payload) {
      return {
        ok: false,
        error: "Invalid or expired access token.",
        status: 403,
      }
    }

    const purchase = await verifyCorporateBookingPurchase(payload.sessionId)
    if (!purchase.ok) return purchase

    const workspace = await getWorkspaceById(payload.workspaceId)
    if (!workspace || workspace.sessionId !== payload.sessionId) {
      return {
        ok: false,
        error: "Workspace not found for this access token.",
        status: 403,
      }
    }

    return {
      ok: true,
      sessionId: workspace.sessionId,
      workspaceId: workspace.id,
      accessToken: input.accessToken.trim(),
      productId: purchase.productId,
      productName: purchase.productName,
      workspace,
    }
  }

  return establishCorporateBookingAccess(input.sessionId)
}

export function readAccessTokenFromRequest(request: Request) {
  const header = request.headers.get("authorization")
  if (header?.toLowerCase().startsWith("bearer ")) {
    return header.slice(7).trim()
  }
  return request.headers.get("x-cbs-access-token")
}
