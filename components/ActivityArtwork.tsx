import Image from "next/image"
import { Sparkles } from "lucide-react"

const artworks: Record<string, string> = {
  "rage-room": "/images/activities/rage-room-concept.png",
  "paint-splatter": "/images/activities/paint-splatter-concept.png",
  "axe-throwing": "/images/activities/axe-throwing-concept.png",
}

/** Editorial illustrations must never be used as venue photographs or schema images. */
export default function ActivityArtwork({ activity, className = "h-40", venueFallback = false }: {
  activity: string
  className?: string
  venueFallback?: boolean
}) {
  const src = artworks[activity]
  return (
    <div className={`relative overflow-hidden bg-[#20201e] ${className}`}>
      {src ? <Image src={src} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px" className="object-cover" /> : <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#34271e] to-[#191919]"><Sparkles className="h-10 w-10 text-orange-300" aria-hidden="true" /></div>}
      <span className="absolute bottom-2 left-2 rounded bg-black/80 px-2 py-1 text-xs text-zinc-200">
        {src ? (venueFallback ? "Activity illustration · venue photo unavailable" : "AI activity illustration") : "Venue photo unavailable"}
      </span>
    </div>
  )
}
