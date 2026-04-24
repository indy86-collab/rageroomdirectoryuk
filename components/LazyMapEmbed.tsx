"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin } from "lucide-react"

interface LazyMapEmbedProps {
  lat: number
  lng: number
  /** Accessible title for the iframe; screenreaders read this aloud. */
  title: string
  /** Optional static preview image to show before the map loads. */
  previewImage?: string
}

/**
 * Lazily mounts a Google Maps embed iframe.
 *
 * The Maps JS bundle behind `maps/embed/v1/place` is ~200KB + a cascade of
 * sub-requests and layout shifts. On listing pages the map is below the
 * fold, so we:
 *   1. Render a lightweight placeholder immediately (no third-party JS).
 *   2. Swap in the real iframe only when the placeholder is within ~400px
 *      of the viewport, OR when the user interacts.
 *
 * This typically saves 150–300ms of blocking time on mobile and removes
 * Maps from the LCP critical path entirely.
 */
export default function LazyMapEmbed({
  lat,
  lng,
  title,
  previewImage,
}: LazyMapEmbedProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [load, setLoad] = useState(false)

  useEffect(() => {
    if (load || typeof window === "undefined" || !wrapRef.current) return
    if (typeof IntersectionObserver === "undefined") {
      setLoad(true)
      return
    }

    const el = wrapRef.current
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setLoad(true)
            io.disconnect()
            break
          }
        }
      },
      { rootMargin: "400px 0px" }
    )

    io.observe(el)
    return () => io.disconnect()
  }, [load])

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  const src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}`

  return (
    <div
      ref={wrapRef}
      className="aspect-video w-full bg-zinc-900 rounded-lg overflow-hidden relative"
    >
      {load ? (
        <iframe
          title={title}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={src}
        />
      ) : (
        <button
          type="button"
          onClick={() => setLoad(true)}
          aria-label={`Load interactive map for ${title}`}
          className="absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-2 text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-colors"
          style={
            previewImage
              ? {
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${previewImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        >
          <MapPin className="w-8 h-8 text-orange-500" />
          <span className="text-sm font-semibold">
            Tap or scroll to load map
          </span>
          <span className="text-xs text-zinc-500">Google Maps · interactive</span>
        </button>
      )}
    </div>
  )
}
