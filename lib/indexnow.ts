/**
 * IndexNow client (Bing / Yandex / Seznam).
 *
 * IndexNow is an open, IP-neutral ping protocol. Submitting a URL here
 * triggers a same-day recrawl from participating engines — notably Bing
 * (which also feeds ChatGPT's Bing-backed search) and Yandex. Google does
 * NOT participate, so IndexNow complements (not replaces) Google's
 * sitemap-driven crawl.
 *
 * Key management:
 *  - The public key lives in `public/indexnow-key.txt` and is exposed at
 *    `https://<host>/indexnow-key.txt`.
 *  - To rotate, change both the file AND the `INDEXNOW_KEY` env var
 *    (or the fallback in this file). Engines cache the key for 24h.
 */

const DEFAULT_KEY = "b8f2c7e4a9d1c3f6e2b5a8c0d7e9f1b4"

export function getIndexNowKey(): string {
  const key = process.env.INDEXNOW_KEY
  if (key) return key
  if (process.env.NODE_ENV === "production") {
    throw new Error("INDEXNOW_KEY environment variable is required in production")
  }
  return DEFAULT_KEY
}

export function getIndexNowKeyLocation(): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://rageroomdirectory.co.uk"
  return `${baseUrl}/indexnow-key.txt`
}

export interface IndexNowResult {
  ok: boolean
  status: number
  body?: string
  error?: string
}

/**
 * Submit one or more URLs to IndexNow.
 *
 * IndexNow accepts up to 10,000 URLs per request. All URLs must be on the
 * same host as `key`/`keyLocation`. Non-200 responses are still useful
 * signal — 202 means queued, 400 means bad input, 403 means key mismatch.
 */
export async function pingIndexNow(
  urls: string[],
  opts: { host?: string; endpoint?: string } = {}
): Promise<IndexNowResult> {
  if (urls.length === 0) return { ok: true, status: 204 }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://rageroomdirectory.co.uk"
  const host = opts.host || new URL(baseUrl).host
  const endpoint = opts.endpoint || "https://api.indexnow.org/indexnow"

  const payload = {
    host,
    key: getIndexNowKey(),
    keyLocation: getIndexNowKeyLocation(),
    urlList: urls.slice(0, 10000),
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
      // Short timeout — we don't want a hung ping blocking revalidation.
      signal: AbortSignal.timeout(8000),
    })
    const body = await res.text()
    return {
      ok: res.ok || res.status === 202,
      status: res.status,
      body: body.slice(0, 500),
    }
  } catch (e) {
    return {
      ok: false,
      status: 0,
      error: e instanceof Error ? e.message : String(e),
    }
  }
}
