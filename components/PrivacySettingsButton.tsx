"use client"

import { OPEN_PRIVACY_SETTINGS_EVENT } from "@/lib/consent"

export default function PrivacySettingsButton({
  className = "",
}: {
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_PRIVACY_SETTINGS_EVENT))}
      className={`inline-flex min-h-10 items-center ${className}`}
    >
      Privacy settings
    </button>
  )
}
