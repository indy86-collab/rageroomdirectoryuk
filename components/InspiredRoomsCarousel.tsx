"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

export type InspiredRoom = {
  id: string
  name: string
  city: string
  href: string
  image: string
  alt: string
  price: string | null
  experience: string
}

const INTERVAL_MS = 4800

function slideStep(scroller: HTMLElement) {
  const card = scroller.querySelector<HTMLElement>("[data-slide]")
  if (!card) return 0
  const gap = Number.parseFloat(getComputedStyle(scroller).columnGap || "0") || 0
  return card.offsetWidth + gap
}

export default function InspiredRoomsCarousel({ rooms }: { rooms: InspiredRoom[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const touchTimer = useRef<number | null>(null)
  const [active, setActive] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [touchHold, setTouchHold] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [pageHidden, setPageHidden] = useState(false)

  const syncActive = useCallback(() => {
    const scroller = scrollerRef.current
    const step = scroller ? slideStep(scroller) : 0
    if (!scroller || step <= 0) return
    setActive(Math.round(scroller.scrollLeft / step) % rooms.length)
  }, [rooms.length])

  const scrollByStep = useCallback((direction: 1 | -1) => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const step = slideStep(scroller)
    if (step <= 0) return
    const max = scroller.scrollWidth - scroller.clientWidth
    const next = scroller.scrollLeft + direction * step
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (direction > 0 && next > max + 1) {
      scroller.scrollTo({ left: 0, behavior: "auto" })
    } else if (direction < 0 && scroller.scrollLeft <= 1) {
      scroller.scrollTo({ left: max, behavior: "auto" })
    } else {
      scroller.scrollTo({ left: Math.max(0, next), behavior: reduced ? "auto" : "smooth" })
    }
  }, [])

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const apply = () => setReducedMotion(motion.matches)
    apply()
    motion.addEventListener("change", apply)
    return () => motion.removeEventListener("change", apply)
  }, [])

  useEffect(() => {
    if (reducedMotion || hovered || focused || touchHold || pageHidden || rooms.length < 2) {
      return
    }
    const id = window.setInterval(() => scrollByStep(1), INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [reducedMotion, hovered, focused, touchHold, pageHidden, rooms.length, scrollByStep])

  useEffect(() => {
    const onVisibility = () => setPageHidden(document.hidden)
    document.addEventListener("visibilitychange", onVisibility)
    return () => document.removeEventListener("visibilitychange", onVisibility)
  }, [])

  if (rooms.length === 0) return null

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setFocused(false)
        }
      }}
      onTouchStart={() => {
        setTouchHold(true)
        if (touchTimer.current) window.clearTimeout(touchTimer.current)
        touchTimer.current = window.setTimeout(() => setTouchHold(false), 8000)
      }}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
          {reducedMotion ? "Swipe the rooms" : "Today’s mix"}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-700 text-white hover:border-rage-400"
            aria-label="Previous room"
            onClick={() => scrollByStep(-1)}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-700 text-white hover:border-rage-400"
            aria-label="Next room"
            onClick={() => scrollByStep(1)}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        onScroll={syncActive}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Featured rage rooms"
      >
        {rooms.map((room, index) => (
          <article
            key={room.id}
            data-slide
            className="w-[84%] shrink-0 snap-start sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${rooms.length}`}
          >
            <Link
              href={room.href}
              className="group relative block aspect-[4/5] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-[0_20px_50px_-28px_rgba(0,0,0,0.8)] sm:aspect-[4/5] lg:aspect-[5/4]"
            >
              <Image
                src={room.image}
                alt={room.alt}
                fill
                sizes="(max-width: 640px) 84vw, (max-width: 1024px) 46vw, 380px"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/10" />
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-rage-300">
                  {room.experience}
                </p>
                <h3 className="mt-1 line-clamp-2 text-xl font-bold text-white sm:text-2xl">
                  {room.name}
                </h3>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-zinc-200">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-rage-400" />
                  {room.city}
                </p>
                <p className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-sm font-bold text-zinc-950">
                  {room.price ?? "Check with venue"}
                </p>
              </div>
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-rage-500 transition-[width] duration-500"
            style={{ width: `${((active + 1) / rooms.length) * 100}%` }}
          />
        </div>
        <p className="w-12 text-right text-xs font-semibold tabular-nums text-zinc-400">
          {active + 1}/{rooms.length}
        </p>
      </div>
    </div>
  )
}
