import { NextRequest, NextResponse } from "next/server"
import { pingIndexNow } from "@/lib/indexnow"

/**
 * Submit site URLs to IndexNow (Bing / Yandex / Seznam).
 *
 * Usage:
 *  GET /api/indexnow?token=<INDEXNOW_API_TOKEN>&limit=50
 *    → submits the most-recently-updated URLs from the sitemap.
 *
 *  POST /api/indexnow
 *    Body: { token: string, urls: string[] }
 *    → submits an explicit URL list (e.g. after publishing a new listing).
 *
 * Access control: a separate `INDEXNOW_API_TOKEN` env var gates these
 * endpoints so external callers can't spam the engines with stale URLs.
 */

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function checkAuth(tokenFromCaller: string | null): boolean {
  const expected = process.env.INDEXNOW_API_TOKEN
  if (!expected) return false
  return tokenFromCaller === expected
}

async function collectSitemapUrls(limit: number): Promise<string[]> {
  // Reuse the app's own sitemap function to avoid drift between what
  // Google crawls and what we push to IndexNow.
  const mod = await import("@/app/sitemap")
  const routes = await mod.default()
  const sorted = [...routes].sort((a, b) => {
    const bt =
      b.lastModified instanceof Date
        ? b.lastModified.getTime()
        : new Date(b.lastModified ?? 0).getTime()
    const at =
      a.lastModified instanceof Date
        ? a.lastModified.getTime()
        : new Date(a.lastModified ?? 0).getTime()
    return bt - at
  })
  return sorted.slice(0, limit).map((r) => r.url)
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")
  if (!checkAuth(token)) {
    return NextResponse.json({ error: "unauthorised" }, { status: 401 })
  }

  const limit = Math.min(
    500,
    Math.max(1, Number(req.nextUrl.searchParams.get("limit") || "50"))
  )
  const urls = await collectSitemapUrls(limit)
  const result = await pingIndexNow(urls)
  return NextResponse.json({ submitted: urls.length, result })
}

export async function POST(req: NextRequest) {
  let body: { token?: string; urls?: string[] } = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 })
  }

  if (!checkAuth(body.token ?? null)) {
    return NextResponse.json({ error: "unauthorised" }, { status: 401 })
  }

  const urls = Array.isArray(body.urls) ? body.urls.filter((u) => typeof u === "string") : []
  if (urls.length === 0) {
    return NextResponse.json({ error: "urls required" }, { status: 400 })
  }

  const result = await pingIndexNow(urls)
  return NextResponse.json({ submitted: urls.length, result })
}
