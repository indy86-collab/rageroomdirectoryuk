"use client"

import Link from "next/link"
import { Download } from "lucide-react"
import { type AnalyticsProduct, trackProductDownload } from "@/lib/analytics"

type TrackedDownloadLinkProps = {
  href: string
  label: string
  fileName: string
  product: AnalyticsProduct
}

export default function TrackedDownloadLink({
  href,
  label,
  fileName,
  product,
}: TrackedDownloadLinkProps) {
  return (
    <Link
      href={href}
      className="btn-rage mt-7 inline-flex min-h-[48px] items-center justify-center gap-2 text-sm uppercase tracking-wider"
      onClick={() => {
        trackProductDownload(product, fileName)
      }}
    >
      <Download className="h-4 w-4" />
      {label}
    </Link>
  )
}
