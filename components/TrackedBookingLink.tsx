"use client"

import type { ReactNode } from "react"
import { trackGenerateLead } from "@/lib/analytics"

type TrackedBookingLinkProps = {
  href: string
  source: string
  listingSlug?: string
  city?: string
  className?: string
  children: ReactNode
}

export default function TrackedBookingLink({
  href,
  source,
  listingSlug,
  city,
  className,
  children,
}: TrackedBookingLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() =>
        trackGenerateLead({
          source,
          listingSlug,
          city,
        })
      }
    >
      {children}
    </a>
  )
}
