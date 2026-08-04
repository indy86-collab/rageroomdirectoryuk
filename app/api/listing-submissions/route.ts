import { NextResponse } from "next/server"
import { sendListingSubmissionEmail } from "@/lib/listing-submission-email"
import { processListingSubmission } from "@/lib/listing-submission-service"

export const runtime = "nodejs"

const recentByIp = new Map<string, number>()

function clientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  )
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const ip = clientIp(request)
  const now = Date.now()
  const result = await processListingSubmission({
    input: body,
    ip,
    now,
    recentByIp,
    send: sendListingSubmissionEmail,
  })
  return NextResponse.json(result.body, { status: result.status })
}
