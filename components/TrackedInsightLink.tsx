"use client"

import Link from "next/link"
import type { ComponentProps, ReactNode } from "react"
import { trackAuthorityEvent, type AuthorityEventMap } from "@/lib/analytics"

type DestinationKind = AuthorityEventMap["insight_directory_click"]["destinationKind"]

function destinationKindFromPath(path: string): DestinationKind | null {
  if (path.startsWith("/city/")) return "city"
  if (path.startsWith("/region/")) return "region"
  if (path.startsWith("/activities/")) return "activity"
  if (path.startsWith("/occasions/")) return "occasion"
  if (path.startsWith("/listings")) return "listings"
  if (path.startsWith("/rage-room-prices")) return "prices"
  return null
}

export default function TrackedInsightLink({
  href,
  children,
  ...linkProps
}: Omit<ComponentProps<typeof Link>, "href" | "children" | "onClick"> & {
  href: string
  children: ReactNode
}) {
  const destinationKind = destinationKindFromPath(href)

  return (
    <Link
      {...linkProps}
      href={href}
      onClick={() => {
        if (!destinationKind) return
        trackAuthorityEvent("insight_directory_click", {
          destinationKind,
          destinationPath: href,
        })
      }}
    >
      {children}
    </Link>
  )
}
