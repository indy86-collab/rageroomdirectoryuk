"use client"

import { useState } from "react"
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
 * Mounts a Google Maps embed only after an explicit request.
 *
 * The Maps JS bundle behind `maps/embed/v1/place` is ~200KB + a cascade of
 * sub-requests and layout shifts. On listing pages the map is below the
 * fold, so we:
 *   1. Render a lightweight placeholder immediately (no third-party JS).
 *   2. Contact Google only when the user presses the load button.
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
  const [load, setLoad] = useState(false)

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  const src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}`

  return (
    <div
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
            Load interactive map
          </span>
          <span className="max-w-xs text-xs text-zinc-400">
            This contacts Google Maps, which may receive device and request information.
          </span>
        </button>
      )}
    </div>
  )
}
