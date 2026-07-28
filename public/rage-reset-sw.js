/* Rage Reset scoped service worker — caches core game assets only.
 * Scope is /rage-reset (registration + Service-Worker-Allowed header).
 * Does not intercept unrelated directory pages outside that scope.
 *
 * Cache name must stay in sync with lib/rage-reset/build.ts (RAGE_RESET_SW_CACHE).
 * Update strategy: do NOT skipWaiting on install. The page activates a waiting
 * worker when the player is not mid-session, then soft-reloads once.
 */
const CACHE = "rage-reset-pvr-1"
const BUILD = "pvr-1.0.0"
const PRECACHE = [
  "/rage-reset",
  "/rage-reset.webmanifest",
  "/rage-reset/icons/icon-192.png",
  "/rage-reset/icons/icon-512.png",
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE))
    // Intentionally no skipWaiting here — avoids yanking an active session.
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
  if (event.data && event.data.type === "GET_BUILD") {
    event.ports?.[0]?.postMessage({ build: BUILD, cache: CACHE })
  }
})

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url)

  if (url.origin !== self.location.origin) return

  // Strict: only game shell, game assets, and hashed Next static chunks used by the game.
  const isGameShell =
    url.pathname === "/rage-reset" || url.pathname.startsWith("/rage-reset/")
  const isManifest = url.pathname === "/rage-reset.webmanifest"
  const isNextStatic = url.pathname.startsWith("/_next/static/")

  if (!isGameShell && !isManifest && !isNextStatic) {
    // Outside scope in practice; if somehow reached, never cache directory HTML.
    return
  }

  // Navigations to the game: network-first so builds update; cache fallback offline.
  if (event.request.mode === "navigate" && isGameShell) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone()
            caches.open(CACHE).then((cache) => cache.put(event.request, copy))
          }
          return response
        })
        .catch(async () => {
          const cached = await caches.match(event.request)
          if (cached) return cached
          const shell = await caches.match("/rage-reset")
          if (shell) return shell
          return new Response(
            "<!doctype html><title>Offline</title><body style=\"font-family:sans-serif;background:#0A0A0A;color:#fff;padding:2rem\"><h1>Rage Reset</h1><p>You are offline. Reconnect once to load the game shell, then you can play offline.</p></body>",
            { headers: { "Content-Type": "text/html; charset=utf-8" } }
          )
        })
    )
    return
  }

  // Static assets / chunks: stale-while-revalidate within game cache only.
  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(event.request)
      const network = fetch(event.request)
        .then((response) => {
          if (response.ok && event.request.method === "GET") {
            cache.put(event.request, response.clone())
          }
          return response
        })
        .catch(() => cached)

      // Prefer network for HTML-ish; prefer cache for hashed static.
      if (isNextStatic && cached) {
        network.catch(() => undefined)
        return cached
      }
      return cached || network
    })
  )
})
