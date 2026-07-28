"use client"

import { useCallback, useRef, useState } from "react"
import { getRoom, getWeapon } from "@/lib/rage-reset/content"
import { trackRageReset } from "@/lib/rage-reset/analytics"
import { drawBossPrinter, drawWeaponPreview } from "@/lib/rage-reset/officeArt"
import type { SessionRuntime } from "@/lib/rage-reset/types"

/**
 * Shareable results — game stats only. No scores, triggers, or safety copy.
 */
export function ShareResultButton({ runtime }: { runtime: SessionRuntime }) {
  const [status, setStatus] = useState<"idle" | "shared" | "copied" | "downloaded" | "error">(
    "idle"
  )
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const buildCard = useCallback(async (): Promise<Blob | null> => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const ctx = canvas.getContext("2d")
    if (!ctx) return null

    const w = 1080
    const h = 1920
    canvas.width = w
    canvas.height = h

    const room = getRoom(runtime.roomId ?? "office-meltdown")
    const weapon = getWeapon(runtime.weaponId ?? "baseball-bat")

    // Background
    const grd = ctx.createLinearGradient(0, 0, w, h)
    grd.addColorStop(0, "#1a0a00")
    grd.addColorStop(0.5, "#0A0A0A")
    grd.addColorStop(1, "#1c0505")
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, w, h)

    ctx.fillStyle = "#F97316"
    ctx.fillRect(0, 0, w, 12)

    ctx.fillStyle = "#FAFAFA"
    ctx.font = "bold 72px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("Rage Reset", w / 2, 160)

    ctx.fillStyle = "#A1A1AA"
    ctx.font = "36px sans-serif"
    ctx.fillText("I defeated The Unbreakable Printer.", w / 2, 240)
    ctx.fillText("Can you beat my controlled-strike score?", w / 2, 290)

    ctx.save()
    ctx.translate(w / 2 - 220, 360)
    drawBossPrinter(ctx, 440, 320, 0.05, "defeated", true)
    ctx.restore()

    ctx.save()
    ctx.translate(80, 720)
    drawWeaponPreview(ctx, runtime.weaponId ?? "baseball-bat", 160, 200)
    ctx.restore()

    const lines = [
      `Room: ${room?.name ?? "—"}`,
      `Weapon: ${weapon?.name ?? "—"}`,
      `Objects destroyed: ${runtime.objectsDestroyed}`,
      `Best combo: ${runtime.bestCombo}`,
      `Controlled strikes: ${runtime.controlledStrikes}`,
      `Calm Energy earned: ${runtime.calmEnergyEarned}`,
    ]
    ctx.fillStyle = "#E4E4E7"
    ctx.font = "42px sans-serif"
    ctx.textAlign = "left"
    lines.forEach((line, i) => {
      ctx.fillText(line, 280, 780 + i * 70)
    })

    ctx.fillStyle = "#F97316"
    ctx.font = "bold 40px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("Play free at rageroomdirectory.co.uk/rage-reset", w / 2, h - 120)

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/png")
    })
  }, [runtime])

  const shareText =
    "I defeated The Unbreakable Printer in Rage Reset. Can you beat my controlled-strike score?"
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/rage-reset?src=share&utm_source=share&utm_medium=organic&utm_campaign=rage_reset_pvr`
      : "https://rageroomdirectory.co.uk/rage-reset?src=share&utm_source=share&utm_medium=organic&utm_campaign=rage_reset_pvr"

  const onShare = async () => {
    trackRageReset("rage_reset_share_started", {
      room_id: runtime.roomId ?? "unknown",
      weapon_id: runtime.weaponId ?? "unknown",
    })
    try {
      const blob = await buildCard()
      if (
        blob &&
        typeof navigator !== "undefined" &&
        navigator.share &&
        navigator.canShare
      ) {
        const file = new File([blob], "rage-reset-result.png", { type: "image/png" })
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: "Rage Reset",
            text: shareText,
            files: [file],
            url: shareUrl,
          })
          trackRageReset("rage_reset_share_completed", { method: "native_file" })
          setStatus("shared")
          return
        }
      }
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: "Rage Reset", text: shareText, url: shareUrl })
        trackRageReset("rage_reset_share_completed", { method: "native_text" })
        setStatus("shared")
        return
      }
      if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "rage-reset-result.png"
        a.click()
        URL.revokeObjectURL(url)
        trackRageReset("rage_reset_share_completed", { method: "download" })
        setStatus("downloaded")
        return
      }
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
      trackRageReset("rage_reset_share_completed", { method: "clipboard" })
      setStatus("copied")
    } catch {
      try {
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
        trackRageReset("rage_reset_share_completed", { method: "clipboard" })
        setStatus("copied")
      } catch {
        setStatus("error")
      }
    }
  }

  return (
    <>
      <canvas ref={canvasRef} className="hidden" aria-hidden />
      <button
        type="button"
        onClick={() => void onShare()}
        className="btn-secondary mt-3 flex min-h-[48px] w-full items-center justify-center rounded-xl"
      >
        Share result
      </button>
      {status === "shared" && (
        <p className="mt-2 text-center text-xs text-emerald-400">Shared</p>
      )}
      {status === "copied" && (
        <p className="mt-2 text-center text-xs text-emerald-400">Link copied</p>
      )}
      {status === "downloaded" && (
        <p className="mt-2 text-center text-xs text-emerald-400">Image downloaded</p>
      )}
      {status === "error" && (
        <p className="mt-2 text-center text-xs text-zinc-500">Could not share — try copying the URL.</p>
      )}
    </>
  )
}
