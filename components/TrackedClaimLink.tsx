"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { trackClaimListingClicked } from "@/lib/analytics"

export default function TrackedClaimLink({
  href,
  listingSlug,
  source,
  className,
  children,
}: {
  href: string
  listingSlug?: string
  source: string
  className?: string
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => trackClaimListingClicked(listingSlug, source)}
    >
      {children}
    </Link>
  )
}
