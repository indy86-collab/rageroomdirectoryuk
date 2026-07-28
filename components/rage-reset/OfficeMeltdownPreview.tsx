"use client"

import { useEffect, useRef } from "react"
import { drawOfficeRoom } from "@/lib/rage-reset/art/officeRoom"
import { drawIllustratedObject } from "@/lib/rage-reset/art/objectIllustrators"
import { RR_COLORS } from "@/lib/rage-reset/art/styleGuide"
import type { DamageTier } from "@/lib/rage-reset/engine/types"

/**
 * Homepage hero preview — rich Office Meltdown vignette using the next renderer art.
 */
export function OfficeMeltdownPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = 560
    const h = 320
    canvas.width = Math.floor(w * dpr)
    canvas.height = Math.floor(h * dpr)
    canvas.style.width = "100%"
    canvas.style.height = "auto"
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    let raf = 0
    let t = 0
    let reduced = false
    try {
      reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    } catch {
      /* ignore */
    }

    const props: Array<{
      id: string
      x: number
      y: number
      size: number
      tier: DamageTier
      phase: number
      bob: number
    }> = [
      { id: "filing-cabinet", x: 0.12, y: 0.58, size: 78, tier: "light", phase: 0.25, bob: 0.4 },
      { id: "alarm-clock", x: 0.28, y: 0.48, size: 48, tier: "intact", phase: 0, bob: 1.1 },
      { id: "laptop", x: 0.34, y: 0.56, size: 70, tier: "medium", phase: 0.4, bob: 0.7 },
      { id: "keyboard", x: 0.48, y: 0.62, size: 64, tier: "light", phase: 0.2, bob: 0.9 },
      { id: "monitor", x: 0.5, y: 0.42, size: 88, tier: "heavy", phase: 0.55, bob: 0.5 },
      { id: "desk-lamp", x: 0.64, y: 0.44, size: 58, tier: "intact", phase: 0.1, bob: 1.3 },
      { id: "mug-stack", x: 0.38, y: 0.68, size: 44, tier: "light", phase: 0.3, bob: 1.6 },
      { id: "coffee-machine", x: 0.78, y: 0.58, size: 66, tier: "medium", phase: 0.35, bob: 0.6 },
      { id: "email-sign", x: 0.72, y: 0.34, size: 72, tier: "intact", phase: 0.15, bob: 0.8 },
    ]

    const particles = Array.from({ length: reduced ? 4 : 14 }, (_, i) => ({
      x: 0.35 + Math.random() * 0.35,
      y: 0.35 + Math.random() * 0.3,
      vx: (Math.random() - 0.5) * 0.03,
      vy: -0.01 - Math.random() * 0.04,
      size: 2 + Math.random() * 3,
      life: Math.random(),
      color: i % 3 === 0 ? RR_COLORS.paper : i % 3 === 1 ? RR_COLORS.accentOrange : RR_COLORS.plastic,
    }))

    const tick = () => {
      t += reduced ? 0.004 : 0.016

      // Camera gently breathes
      const zoom = 1.02 + Math.sin(t * 0.35) * (reduced ? 0 : 0.012)
      const shakeX = reduced ? 0 : Math.sin(t * 2.1) * 1.2
      const shakeY = reduced ? 0 : Math.cos(t * 1.7) * 0.8

      ctx.save()
      ctx.clearRect(0, 0, w, h)
      ctx.translate(w / 2 + shakeX, h / 2 + shakeY)
      ctx.scale(zoom, zoom)
      ctx.translate(-w / 2, -h / 2)

      drawOfficeRoom(
        ctx,
        w,
        h,
        {
          wreck: 0.35 + Math.sin(t * 0.4) * 0.05,
          papersLoose: 0.45,
          lightsFlicker: 0.25 + Math.sin(t * 3) * 0.1,
        },
        t * 1000
      )

      // Soft vignette for hero framing
      const vig = ctx.createRadialGradient(w * 0.5, h * 0.45, 40, w * 0.5, h * 0.5, w * 0.7)
      vig.addColorStop(0, "rgba(0,0,0,0)")
      vig.addColorStop(1, "rgba(5,10,20,0.45)")
      ctx.fillStyle = vig
      ctx.fillRect(0, 0, w, h)

      // Desk props
      for (const p of props) {
        const bob = Math.sin(t * 2 + p.bob) * (reduced ? 0 : 2)
        const px = w * p.x
        const py = h * p.y + bob
        // Contact shadow
        ctx.fillStyle = "rgba(0,0,0,0.35)"
        ctx.beginPath()
        ctx.ellipse(px, py + p.size * 0.48, p.size * 0.38, 6, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.save()
        ctx.translate(px, py)
        drawIllustratedObject(ctx, p.id, p.size, p.size * 0.9, p.tier, p.phase)
        ctx.restore()
      }

      // Boss printer centrepiece
      const bossPulse = 0.55 + Math.sin(t * 1.2) * 0.08
      const bw = 130 + Math.sin(t) * (reduced ? 0 : 4)
      const bh = bw * 0.95
      const bx = w * 0.52
      const by = h * 0.5 + Math.sin(t * 1.5) * (reduced ? 0 : 3)
      ctx.fillStyle = "rgba(0,0,0,0.4)"
      ctx.beginPath()
      ctx.ellipse(bx, by + bh * 0.48, bw * 0.42, 10, 0, 0, Math.PI * 2)
      ctx.fill()
      // Spotlight
      const spot = ctx.createRadialGradient(bx, by, 10, bx, by, bw * 1.1)
      spot.addColorStop(0, "rgba(45,212,191,0.22)")
      spot.addColorStop(1, "rgba(0,0,0,0)")
      ctx.fillStyle = spot
      ctx.beginPath()
      ctx.arc(bx, by, bw * 1.1, 0, Math.PI * 2)
      ctx.fill()
      ctx.save()
      ctx.translate(bx, by)
      drawIllustratedObject(ctx, "printer", bw, bh, "heavy", bossPulse)
      // Warning glow ring
      ctx.strokeStyle = `rgba(249,115,22,${0.35 + Math.sin(t * 4) * 0.15})`
      ctx.lineWidth = 3
      ctx.setLineDash([8, 6])
      ctx.strokeRect(-bw * 0.5, -bh * 0.45, bw, bh * 0.85)
      ctx.setLineDash([])
      ctx.restore()

      // Floating debris
      for (const p of particles) {
        if (!reduced) {
          p.x += p.vx * 0.016
          p.y += p.vy * 0.016
          p.life += 0.008
          if (p.life > 1 || p.y < 0.2) {
            p.x = 0.4 + Math.random() * 0.25
            p.y = 0.55 + Math.random() * 0.15
            p.life = 0
          }
        }
        ctx.globalAlpha = 0.35 + (1 - p.life) * 0.4
        ctx.fillStyle = p.color
        ctx.fillRect(w * p.x, h * p.y, p.size * 2, p.size)
      }
      ctx.globalAlpha = 1

      // Foreground baseball bat
      ctx.save()
      ctx.translate(w * 0.86, h * 0.92)
      ctx.rotate(-0.55 + Math.sin(t * 1.8) * (reduced ? 0 : 0.08))
      drawBat(ctx)
      ctx.restore()

      // Title plate
      ctx.fillStyle = "rgba(11,18,32,0.82)"
      roundRect(ctx, 12, h - 44, 188, 32, 8)
      ctx.fill()
      ctx.strokeStyle = "rgba(45,212,191,0.4)"
      ctx.lineWidth = 1.5
      roundRect(ctx, 12, h - 44, 188, 32, 8)
      ctx.stroke()
      ctx.fillStyle = RR_COLORS.accentOrange
      ctx.font = "800 13px 'Segoe UI', system-ui, sans-serif"
      ctx.textAlign = "left"
      ctx.fillText("OFFICE MELTDOWN", 24, h - 23)

      // Boss caption
      ctx.fillStyle = "rgba(11,18,32,0.75)"
      roundRect(ctx, w - 168, 12, 156, 28, 8)
      ctx.fill()
      ctx.fillStyle = RR_COLORS.controlled
      ctx.font = "700 11px 'Segoe UI', system-ui, sans-serif"
      ctx.textAlign = "right"
      ctx.fillText("The Unbreakable Printer", w - 24, 30)

      ctx.restore()
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="block w-full"
      aria-hidden
      role="img"
      aria-label="Preview of Office Meltdown room with The Unbreakable Printer"
    />
  )
}

function drawBat(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#3F2A1E"
  roundRect(ctx, -7, -18, 14, 55, 3)
  ctx.fill()
  const grd = ctx.createLinearGradient(-12, -130, 12, -20)
  grd.addColorStop(0, "#C4A574")
  grd.addColorStop(0.5, "#E8C99B")
  grd.addColorStop(1, "#A67C52")
  ctx.fillStyle = grd
  ctx.beginPath()
  ctx.moveTo(-6, -20)
  ctx.quadraticCurveTo(-14, -90, -10, -125)
  ctx.quadraticCurveTo(0, -138, 10, -125)
  ctx.quadraticCurveTo(14, -90, 6, -20)
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = RR_COLORS.outline
  ctx.lineWidth = 2
  ctx.stroke()
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
}
