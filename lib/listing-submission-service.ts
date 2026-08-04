import {
  parseListingSubmission,
  type ListingSubmission,
} from "@/lib/listing-submissions"

export interface SubmissionServiceResult {
  status: number
  body: { ok?: true; message?: string; error?: string; errors?: string[] }
}

export async function processListingSubmission({
  input,
  ip,
  now,
  recentByIp,
  send,
  rateLimitMs = 120_000,
}: {
  input: unknown
  ip: string
  now: number
  recentByIp: Map<string, number>
  send: (data: ListingSubmission) => Promise<{ sent: boolean }>
  rateLimitMs?: number
}): Promise<SubmissionServiceResult> {
  const parsed = parseListingSubmission(input)
  if (!parsed.success) {
    return {
      status: 400,
      body: { error: parsed.errors[0], errors: parsed.errors },
    }
  }

  const last = recentByIp.get(ip) || 0
  if (now - last < rateLimitMs) {
    return {
      status: 429,
      body: { error: "Please wait before sending another submission" },
    }
  }

  recentByIp.set(ip, now)
  const result = await send(parsed.data)
  if (!result.sent) {
    recentByIp.delete(ip)
    return {
      status: 503,
      body: { error: "We could not send your submission. Please try again later." },
    }
  }

  return {
    status: 200,
    body: {
      ok: true,
      message: "Thanks — your information is queued for editorial review.",
    },
  }
}
