"use client"

import type { ReactNode } from "react"
import {
  getDirectorySourcePath,
  trackDirectoryEvent,
  type DirectoryCtaPlacement,
  type DirectoryDiscoveryContext,
} from "@/lib/analytics"

export default function TrackedWebsiteLink({
  href,
  venueSlug,
  venueCity,
  context,
  ctaPlacement,
  className,
  children,
}: {
  href: string
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
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() =>
        trackDirectoryEvent("website_click", {
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
