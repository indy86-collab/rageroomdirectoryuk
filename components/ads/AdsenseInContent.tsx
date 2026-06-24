"use client"

import { useEffect, useRef, useState } from "react"

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

const AD_CLIENT = "ca-pub-9868896840591922"
const AD_SLOT = "2022027286"

/**
 * Single responsive in-content unit. Client-only: adsbygoogle must run after mount.
 * Global loader lives in root layout (next/script); this file only renders the ins + push.
 *
 * Performance: we defer the `adsbygoogle.push()` until the ad container is
 * within ~400px of the viewport via IntersectionObserver. This avoids paying
 * the ad-render cost for ads far below the fold (especially on long guide
 * / listing pages), improving LCP/INP without affecting fill rate on
 * ads the user will actually see.
 */
export default function AdsenseInContent() {
  const insRef = useRef<HTMLModElement>(null)
  const pushedRef = useRef(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined" || !insRef.current) return

    // Older browsers that don't support IntersectionObserver — still render ads.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true)
      return
    }

    const el = insRef.current
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            io.disconnect()
            break
          }
        }
      },
      { rootMargin: "400px 0px" }
    )

    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!visible || pushedRef.current || !insRef.current) return
    pushedRef.current = true
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // Duplicate fill or race (e.g. React Strict Mode remount); safe to ignore.
    }
  }, [visible])

  return (
    <aside
      aria-label="Advertisement"
      className="my-10 sm:my-12 w-full border-y border-zinc-800/70 py-5 sm:py-6"
    >
      <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
        Advertisement
      </p>
      <div className="mx-auto flex min-h-[250px] w-full max-w-[728px] items-center justify-center overflow-hidden">
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: "block", width: "100%" }}
          data-ad-client={AD_CLIENT}
          data-ad-slot={AD_SLOT}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </aside>
  )
}
