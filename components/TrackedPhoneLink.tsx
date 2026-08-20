"use client"

import type { ReactNode } from "react"
import {
  getDirectorySourcePath,
  trackDirectoryEvent,
  type DirectoryCtaPlacement,
  type DirectoryDiscoveryContext,
} from "@/lib/analytics"

export default function TrackedPhoneLink({
  href,
  venueSlug,
  venueCity,
  context,
  ctaPlacement,
  className,
  children,
}: {
  href: `tel:${string}`
  venueSlug: string
  venueCity?: string
  context: DirectoryDiscoveryContext
  ctaPlacement: DirectoryCtaPlacement
  className?: string
  children: ReactNode
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={() =>
        trackDirectoryEvent("phone_click", {
          venueSlug,
          venueCity,
          ...context,
          sourcePath: getDirectorySourcePath(),
          ctaPlacement,
        })
      }
    >
      {children}
    </a>
  )
}
