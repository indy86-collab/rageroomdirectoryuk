import { NextResponse } from "next/server"
import { sendLeadMagnetEmail } from "@/lib/digital-emails"

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
  let body: { email?: string; source?: string }
  try {
    body = (await request.json()) as { email?: string; source?: string }
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const email = body.email?.trim().toLowerCase() || ""
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 })
  }

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

  const result = await sendLeadMagnetEmail({ toEmail: email })
  if (!result.sent) {
    if (result.reason === "missing_api_key") {
      return NextResponse.json(
        { error: "Email is temporarily unavailable. Try the sample PDF on each product page." },
        { status: 503 }
      )
    }
    return NextResponse.json(
      { error: "Unable to send the checklist right now" },
      { status: 502 }
    )
  }

  return NextResponse.json({
    ok: true,
    downloadUrl: result.downloadUrl,
  })
}
