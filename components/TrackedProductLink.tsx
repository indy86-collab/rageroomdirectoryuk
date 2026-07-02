"use client"

import Link from "next/link"
import { type ComponentProps } from "react"
import { type AnalyticsProduct, trackSelectItem } from "@/lib/analytics"

type TrackedProductLinkProps = ComponentProps<typeof Link> & {
  product: AnalyticsProduct
  listName?: string
}

export default function TrackedProductLink({
  product,
  listName,
  onClick,
  ...props
}: TrackedProductLinkProps) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        trackSelectItem(product, listName)
        onClick?.(event)
      }}
    />
  )
}
