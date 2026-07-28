"use client"

import { useEffect, useRef } from "react"
import { drawBossPrinter, drawOfficeObject, drawWeaponPreview } from "@/lib/rage-reset/officeArt"

/** Compact original preview for homepage discovery — Office Meltdown vibe. */
export function OfficeMeltdownPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = 480
    const h = 260
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = "100%"
    canvas.style.height = "auto"
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    let raf = 0
    let t = 0

    const tick = () => {
      t += 0.016
      ctx.fillStyle = "#0A0A0A"
      ctx.fillRect(0, 0, w, h)
      const grd = ctx.createLinearGradient(0, 0, w, h)
      grd.addColorStop(0, "rgba(249,115,22,0.2)")
      grd.addColorStop(1, "rgba(220,38,38,0.12)")
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, w, h)

      drawOfficeObject(ctx, "laptop", 90, 70, 0.2, false, "Laptop", "#CBD5E1", "#38BDF8")
      ctx.save()
      ctx.translate(20, 40)
      drawOfficeObject(ctx, "laptop", 90, 70, 0.2, false, "Laptop", "#CBD5E1", "#38BDF8")
      ctx.restore()

      ctx.save()
      ctx.translate(130, 50)
      drawOfficeObject(ctx, "coffee-machine", 80, 90, 0.1, false, "Coffee", "#57534E", "#F97316")
      ctx.restore()

      ctx.save()
      ctx.translate(230, 20)
      drawBossPrinter(ctx, 180, 140, 0.7 + Math.sin(t) * 0.05, "idle", true)
      ctx.restore()

      ctx.save()
      ctx.translate(400, 80)
      drawWeaponPreview(ctx, "baseball-bat", 60, 120)
      ctx.restore()

      ctx.fillStyle = "#FAFAFA"
      ctx.font = "bold 14px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText("Office Meltdown", 16, h - 16)

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
