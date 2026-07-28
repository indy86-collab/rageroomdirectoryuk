"use client"

import { useEffect, useRef } from "react"
import { trackRageReset } from "@/lib/rage-reset/analytics"
import { loadStorage, saveStorage } from "@/lib/rage-reset/storage"

const ACTIVE_PLAY_STATES = new Set([
  "free-smash",
  "controlled-smash",
  "cool-down",
])

function isSafeToActivateUpdate(): boolean {
  try {
    if (sessionStorage.getItem("rage-reset-defer-sw") === "1") return false
    const raw = window.localStorage.getItem("rage-reset-v1")
    if (!raw) return true
    const data = JSON.parse(raw) as { activeSession?: { state?: string } }
    const state = data.activeSession?.state
    if (!state) return true
    if (ACTIVE_PLAY_STATES.has(state)) return false
    if (state === "welcome" || state === "results") return true
    // Check-in / select screens: prefer not to interrupt.
    return false
  } catch {
    return true
  }
}

function activateWaitingWorker(worker: ServiceWorker | null | undefined) {
  if (!worker) return
  worker.postMessage({ type: "SKIP_WAITING" })
}

/**
 * Registers the Rage Reset scoped service worker and handles install prompt analytics.
 * Update strategy: waiting worker activates only when the player is not mid-session;
 * soft-reload only when replacing an existing controller.
 */
export function RageResetPwa() {
  const prompted = useRef(false)
  const reloading = useRef(false)
  const hadController = useRef(
    typeof navigator !== "undefined" &&
      "serviceWorker" in navigator &&
      Boolean(navigator.serviceWorker.controller)
  )

  useEffect(() => {
    if (typeof window === "undefined") return

    if ("serviceWorker" in navigator) {
      let pollId = 0

      navigator.serviceWorker
        .register("/rage-reset-sw.js", { scope: "/rage-reset" })
        .then((reg) => {
          reg.update().catch(() => undefined)

          const tryActivate = () => {
            if (!hadController.current) return
            if (!isSafeToActivateUpdate()) return
            if (reg.waiting) activateWaitingWorker(reg.waiting)
          }

          tryActivate()
          pollId = window.setInterval(tryActivate, 15_000)

          reg.addEventListener("updatefound", () => {
            const installing = reg.installing
            if (!installing) return
            installing.addEventListener("statechange", () => {
              if (installing.state === "installed" && navigator.serviceWorker.controller) {
                tryActivate()
              }
            })
          })
        })
        .catch(() => {
          // SW registration failure should not break the game.
        })

      const onControllerChange = () => {
        if (!hadController.current) {
          hadController.current = true
          return
        }
        if (reloading.current) return
        if (!isSafeToActivateUpdate()) {
          // Keep the new controller; reload on next safe opportunity.
          sessionStorage.setItem("rage-reset-sw-pending-reload", "1")
          return
        }
        if (sessionStorage.getItem("rage-reset-sw-reloaded") === "1") return
        reloading.current = true
        sessionStorage.setItem("rage-reset-sw-reloaded", "1")
        window.location.reload()
      }
      navigator.serviceWorker.addEventListener("controllerchange", onControllerChange)

      if (sessionStorage.getItem("rage-reset-sw-pending-reload") === "1") {
        if (isSafeToActivateUpdate()) {
          sessionStorage.removeItem("rage-reset-sw-pending-reload")
          if (sessionStorage.getItem("rage-reset-sw-reloaded") !== "1") {
            sessionStorage.setItem("rage-reset-sw-reloaded", "1")
            window.location.reload()
          }
        }
      }

      window.setTimeout(() => {
        try {
          sessionStorage.removeItem("rage-reset-sw-reloaded")
        } catch {
          /* ignore */
        }
      }, 4000)

      return () => {
        if (pollId) window.clearInterval(pollId)
        navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange)
      }
    }

    return undefined
  }, [])

  useEffect(() => {
    const onBip = (e: Event) => {
      e.preventDefault()
      if (prompted.current) return
      prompted.current = true
      const data = loadStorage()
      if (!data.progression.installPromptShown) {
        data.progression.installPromptShown = true
        saveStorage(data)
        trackRageReset("rage_reset_install_prompt_shown", {
          display_mode: "browser",
        })
      }
    }

    const onInstalled = () => {
      trackRageReset("rage_reset_installed", { display_mode: "standalone" })
    }

    window.addEventListener("beforeinstallprompt", onBip)
    window.addEventListener("appinstalled", onInstalled)
    return () => {
      window.removeEventListener("beforeinstallprompt", onBip)
      window.removeEventListener("appinstalled", onInstalled)
    }
  }, [])

  return null
}
