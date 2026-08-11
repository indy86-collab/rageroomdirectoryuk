import { NextRequest, NextResponse } from "next/server"
import {
  verifyCorporateBuilderAccess,
  verifyCorporateBuilderAccessFromToken,
} from "@/lib/corporate-event-builder/access"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id")
  const token = request.nextUrl.searchParams.get("token")
  const result = sessionId
    ? await verifyCorporateBuilderAccess(sessionId)
    : await verifyCorporateBuilderAccessFromToken(token)

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }

  return NextResponse.json({
    ok: true,
    sessionId: result.sessionId,
    productId: result.productId,
    productName: result.productName,
  })
}
