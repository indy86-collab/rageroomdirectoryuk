"use client"

import { useEffect, useRef, useState } from "react"
import { PrinterBossScene } from "@/lib/rage-reset/scenes/PrinterBossScene"
import type { ControlledSmashResult, HudSnapshot } from "@/lib/rage-reset/engine/types"
import { isDiagnosticsEnabled } from "@/lib/rage-reset/features"
import { GameViewport } from "./GameViewport"
import { GameHUD } from "./GameHUD"
import { PauseMenu } from "./PauseMenu"

export function NextControlledSmashGame({
  weaponId,
  soundEnabled,
  hapticsEnabled,
  reducedEffects,
  onComplete,
  onMuteToggle,
}: {
  weaponId: string
  soundEnabled: boolean
  hapticsEnabled: boolean
  reducedEffects: boolean
  onComplete: (result: ControlledSmashResult) => void
  onMuteToggle: () => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<PrinterBossScene | null>(null)
  const rafRef = useRef(0)
  const [hud, setHud] = useState<HudSnapshot | null>(null)
  const [paused, setPaused] = useState(false)
  const [fps, setFps] = useState(0)
  const diag = isDiagnosticsEnabled()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const scene = new PrinterBossScene({
      weaponId,
      settings: {
        soundEnabled,
        hapticsEnabled,
        reducedEffects,
        effectIntensity: reducedEffects ? "reduced" : "full",
      },
      onComplete,
    })
    sceneRef.current = scene

    const dprCap = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      const parent = canvas.parentElement
      const w = parent?.clientWidth ?? window.innerWidth
      const h = parent?.clientHeight ?? window.innerHeight
      canvas.width = Math.floor(w * dprCap)
      canvas.height = Math.floor(h * dprCap)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dprCap, 0, 0, dprCap, 0, 0)
      scene.resize(w, h)
    }

    scene.mount(canvas)
    resize()
    window.addEventListener("resize", resize)
    const onVis = () => scene.setHidden(document.hidden)
    document.addEventListener("visibilitychange", onVis)

    let last = performance.now()
    let frames = 0
    let fpsT = 0
    let hudAccum = 0

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      frames += 1
      fpsT += dt
      if (fpsT >= 0.5) {
        setFps(Math.round(frames / fpsT))
        frames = 0
        fpsT = 0
      }
      scene.update(dt)
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
      scene.draw(ctx)
      hudAccum += dt
      if (hudAccum > 0.1) {
        hudAccum = 0
        setHud(scene.getHud())
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", resize)
      document.removeEventListener("visibilitychange", onVis)
      scene.unmount()
      sceneRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weaponId])

  useEffect(() => {
    sceneRef.current?.setPaused(paused)
  }, [paused])

  return (
    <GameViewport>
      <div className="absolute inset-0 select-none">
        {hud && (
          <GameHUD
            hud={hud}
            soundEnabled={soundEnabled}
            onMuteToggle={onMuteToggle}
            onPause={() => setPaused(true)}
            mode="boss"
          />
        )}
        {paused && (
          <PauseMenu
            onResume={() => setPaused(false)}
            soundEnabled={soundEnabled}
            onMuteToggle={onMuteToggle}
          />
        )}
        {diag && (
          <div className="pointer-events-none absolute bottom-24 left-3 z-30 rounded bg-black/70 px-2 py-1 font-mono text-[10px] text-emerald-400">
            FPS {fps}
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full touch-none"
          aria-label="Controlled smash. Hold during expand and release in the calm zone."
          data-testid="controlled-smash-arena"
        />
      </div>
    </GameViewport>
  )
}
