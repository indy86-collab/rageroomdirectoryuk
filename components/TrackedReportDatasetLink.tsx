"use client"

import { trackAuthorityEvent } from "@/lib/analytics"

export default function TrackedReportDatasetLink({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => trackAuthorityEvent("report_dataset_downloaded", { format: "csv" })}
    >
      {children}
    </a>
  )
}
