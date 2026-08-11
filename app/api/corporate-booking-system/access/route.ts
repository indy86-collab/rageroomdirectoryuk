import { NextRequest, NextResponse } from "next/server"
import {
  establishCorporateBookingAccess,
  readAccessTokenFromRequest,
  resolveCorporateBookingAccess,
} from "@/lib/corporate-booking-system/access"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id")
  const accessToken =
    request.nextUrl.searchParams.get("access") ||
    readAccessTokenFromRequest(request)

  try {
    const access = accessToken
      ? await resolveCorporateBookingAccess({ accessToken, sessionId })
      : await establishCorporateBookingAccess(sessionId)

    if (!access.ok) {
      return NextResponse.json(
        { error: access.error },
        { status: access.status }
      )
    }

    return NextResponse.json({
      ok: true,
      sessionId: access.sessionId,
      workspaceId: access.workspaceId,
      accessToken: access.accessToken,
      productId: access.productId,
      productName: access.productName,
      setupCompleted: access.workspace.setupCompleted,
    })
  } catch (error) {
    console.error("Corporate Booking System access failed", error)
    return NextResponse.json(
      {
        error:
          "Unable to open the Corporate Booking System workspace right now. Durable storage may be unavailable.",
      },
      { status: 503 }
    )
  }
}
