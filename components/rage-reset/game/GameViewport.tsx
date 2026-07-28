"use client"

/**
 * Centred gameplay stage — caps desktop width, fills mobile portrait.
 */

import type { ReactNode } from "react"
import { RR_LAYOUT } from "@/lib/rage-reset/art/styleGuide"

export function GameViewport({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`relative flex h-[100dvh] w-full items-stretch justify-center overflow-hidden bg-[#070B14] ${className}`}
      style={{
        // Decorative side wash on wide screens
        backgroundImage:
          "radial-gradient(ellipse at 50% 40%, #152238 0%, #070B14 70%)",
      }}
    >
      <div
        className="relative h-full w-full touch-none overscroll-none"
        style={{
          maxWidth: RR_LAYOUT.maxStageWidth,
          maxHeight: RR_LAYOUT.maxStageHeight,
        }}
        data-testid="rage-reset-game-viewport"
      >
        {children}
      </div>
    </div>
  )
}
