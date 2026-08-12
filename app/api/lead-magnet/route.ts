import { NextResponse } from "next/server"
import {
  buildFirstTimerChecklistDownloadUrl,
  sendLeadMagnetEmail,
} from "@/lib/digital-emails"

export const runtime = "nodejs"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const recentByIp = new Map<string, number>()
const RATE_LIMIT_MS = 60_000

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown"
  }
  return request.headers.get("x-real-ip") || "unknown"
}

export async function POST(request: Request) {
  let body: {
    email?: string
    firstName?: string
    source?: string
    marketingOptIn?: boolean
  }
  try {
    body = (await request.json()) as {
      email?: string
      firstName?: string
      source?: string
      marketingOptIn?: boolean
    }
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const email = body.email?.trim().toLowerCase() || ""
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 })
  }

  const firstName = body.firstName?.trim().slice(0, 80) || undefined
  const marketingOptIn = Boolean(body.marketingOptIn)
  const source =
    typeof body.source === "string" && body.source.trim()
      ? body.source.trim().slice(0, 80)
      : "unknown"

  const ip = clientIp(request)
  const now = Date.now()
  const last = recentByIp.get(ip) || 0
  if (now - last < RATE_LIMIT_MS) {
    return NextResponse.json(
      { error: "Please wait a moment before trying again" },
      { status: 429 }
    )
  }
  recentByIp.set(ip, now)

  let downloadUrl: string
  try {
    // Local/dev: keep download on the same origin so localhost serves the local PDF.
    // Production: use the canonical site URL.
    const requestOrigin = new URL(request.url).origin
    const useRequestOrigin = /localhost|127\.0\.0\.1/.test(requestOrigin)
    downloadUrl = buildFirstTimerChecklistDownloadUrl(
      useRequestOrigin ? requestOrigin : undefined
    )
  } catch (error) {
    console.error("Lead magnet download token failed", error)
    return NextResponse.json(
      { error: "Unable to prepare the checklist right now" },
      { status: 500 }
    )
  }

  const emailResult = await sendLeadMagnetEmail({
    toEmail: email,
    firstName,
    marketingOptIn,
    downloadUrl,
    source,
  })

  // Immediate access always succeeds when the download token is ready.
  // Email is best-effort when Resend is configured.
  return NextResponse.json({
    ok: true,
    downloadUrl,
    emailSent: emailResult.sent,
    emailSkipped:
      !emailResult.sent && emailResult.reason === "missing_api_key"
        ? true
        : undefined,
    source,
  })
}
