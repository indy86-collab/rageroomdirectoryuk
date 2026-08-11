import type { Metadata } from "next"
import Link from "next/link"
import { TriangleAlert } from "lucide-react"
import CorporateBookingSystem from "@/components/corporate-booking-system/CorporateBookingSystem"
import {
  establishCorporateBookingAccess,
  resolveCorporateBookingAccess,
} from "@/lib/corporate-booking-system/access"
import { getDigitalProduct } from "@/lib/digital-products"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Corporate Booking System | Venue Owner Access",
  description:
    "Venue-owner workspace for corporate packages, quotes, proposals and lead follow-up.",
  robots: { index: false, follow: false },
}

type PageProps = {
  searchParams: { session_id?: string; access?: string }
}

export default async function CorporateBookingSystemPage({
  searchParams,
}: PageProps) {
  const product = getDigitalProduct("rage-room-corporate-booking-system")!

  let access:
    | Awaited<ReturnType<typeof resolveCorporateBookingAccess>>
    | {
        ok: false
        error: string
        status: number
      }

  try {
    access = searchParams.access
      ? await resolveCorporateBookingAccess({
          accessToken: searchParams.access,
          sessionId: searchParams.session_id,
        })
      : searchParams.session_id
        ? await establishCorporateBookingAccess(searchParams.session_id)
        : {
            ok: false as const,
            error:
              "Open this page from your order success link or purchase email.",
            status: 400,
          }
  } catch (error) {
    console.error("Corporate Booking System page access failed", error)
    access = {
      ok: false,
      error:
        "Unable to open your workspace right now. Durable storage may be unavailable — please try again shortly.",
      status: 503,
    }
  }

  if (!access.ok) {
    return (
      <div className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl rounded-lg border border-zinc-800 bg-[#181818] p-6 text-center sm:p-8">
          <TriangleAlert className="mx-auto h-10 w-10 text-rage-500" />
          <h1 className="mt-4 text-2xl font-bold text-white">{access.error}</h1>
          <p className="mt-3 text-sm text-zinc-300">
            Access is tied to a successful Stripe payment for the {product.name}.
            This tool is for rage room owners and operators — not corporate event
            organisers.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href={`/digital-downloads/${product.slug}`}
              className="btn-rage inline-flex min-h-[44px] items-center justify-center"
            >
              View product page
            </Link>
            <Link
              href="/digital-downloads"
              className="text-sm font-semibold text-rage-500 hover:text-rage-400"
            >
              Back to downloads
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <CorporateBookingSystem
      accessToken={access.accessToken}
      productName={access.productName}
      initialWorkspace={access.workspace}
    />
  )
}
