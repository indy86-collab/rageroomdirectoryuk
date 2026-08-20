"use client"

import Link from "next/link"
import type { ComponentProps, ReactNode } from "react"
import {
  getDirectorySourcePath,
  trackDirectoryEvent,
  type DirectoryPageType,
} from "@/lib/analytics"

type DiscoveryEventName =
  | "activity_discovery_click"
  | "occasion_discovery_click"
  | "location_discovery_click"

export default function TrackedDiscoveryLink({
  eventName,
  sourcePageType,
  destinationIdentifier,
  destinationPath,
  children,
  ...linkProps
}: Omit<ComponentProps<typeof Link>, "href" | "children" | "onClick"> & {
  eventName: DiscoveryEventName
  sourcePageType: DirectoryPageType
  destinationIdentifier: string
  destinationPath: string
  children: ReactNode
}) {
  return (
    <Link
      {...linkProps}
      href={destinationPath}
      onClick={() =>
        trackDirectoryEvent(eventName, {
          sourcePageType,
          sourcePath: getDirectorySourcePath(),
          destinationIdentifier,
          destinationPath,
        })
      }
    >
      {children}
    </Link>
  )
}
