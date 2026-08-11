import { NextRequest, NextResponse } from "next/server"
import {
  readAccessTokenFromRequest,
  resolveCorporateBookingAccess,
} from "@/lib/corporate-booking-system/access"
import { normalizeWorkspace } from "@/lib/corporate-booking-system/normalize"
import { saveWorkspace } from "@/lib/corporate-booking-system/store"
import type { VenueOwnerWorkspace } from "@/lib/corporate-booking-system/types"

export const dynamic = "force-dynamic"

async function authorize(request: NextRequest) {
  const accessToken =
    request.nextUrl.searchParams.get("access") ||
    readAccessTokenFromRequest(request)
  const sessionId = request.nextUrl.searchParams.get("session_id")
  return resolveCorporateBookingAccess({ accessToken, sessionId })
}

export async function GET(request: NextRequest) {
  const access = await authorize(request)
  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status })
  }

  return NextResponse.json({
    workspace: access.workspace,
    accessToken: access.accessToken,
  })
}

export async function PUT(request: NextRequest) {
  const access = await authorize(request)
  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const incoming =
    body && typeof body === "object" && "workspace" in body
      ? (body as { workspace: unknown }).workspace
      : body

  const normalized = normalizeWorkspace(incoming)
  // Ownership hard-lock — never accept another workspace/session from the client.
  const secured: VenueOwnerWorkspace = {
    ...normalized,
    id: access.workspaceId,
    sessionId: access.sessionId,
    productId: access.productId,
    createdAt: access.workspace.createdAt,
  }

  try {
    const saved = await saveWorkspace(secured)
    return NextResponse.json({ workspace: saved })
  } catch (error) {
    console.error("Corporate Booking System workspace save failed", error)
    return NextResponse.json(
      {
        error:
          "Unable to save your workspace right now. Changes were not persisted — please try again.",
      },
      { status: 503 }
    )
  }
}
