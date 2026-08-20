"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import {
  getDirectorySourcePath,
  trackDirectoryEvent,
  type DirectoryCtaPlacement,
  type DirectoryPageType,
} from "@/lib/analytics"

export default function TrackedClaimLink({
  href,
  venueSlug,
  venueCity,
  pageType,
  ctaPlacement,
  className,
  children,
}: {
  href: string
  venueSlug: string
  venueCity?: string
  pageType: DirectoryPageType
  ctaPlacement: DirectoryCtaPlacement
  className?: string
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() =>
        trackDirectoryEvent("claim_listing_click", {
          venueSlug,
          venueCity,
          pageType,
          ctaPlacement,
          sourcePath: getDirectorySourcePath(),
        })
      }
    >
      {children}
    </Link>
  )
}
