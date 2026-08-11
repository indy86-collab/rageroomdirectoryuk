import type { Metadata } from "next"
import Link from "next/link"
import { TriangleAlert } from "lucide-react"
import CorporateEventBuilder from "@/components/corporate-event-builder/CorporateEventBuilder"
import {
  verifyCorporateBuilderAccess,
  verifyCorporateBuilderAccessFromToken,
} from "@/lib/corporate-event-builder/access"
import { getDigitalProduct } from "@/lib/digital-products"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Corporate Rage Room Event Builder | Access",
  description:
    "Build your corporate rage room event plan — budget, venue shortlist, approval and team invitations.",
  robots: { index: false, follow: false },
}

type PageProps = {
  searchParams: { session_id?: string; token?: string }
}

export default async function CorporateEventBuilderPage({
  searchParams,
}: PageProps) {
  const product = getDigitalProduct("corporate-team-building-toolkit")!
  const access = searchParams.session_id
    ? await verifyCorporateBuilderAccess(searchParams.session_id)
    : searchParams.token
      ? await verifyCorporateBuilderAccessFromToken(searchParams.token)
      : {
          ok: false as const,
          error: "Open this page from your order success link or purchase email.",
          status: 400,
        }

  if (!access.ok) {
    return (
      <div className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl rounded-lg border border-zinc-800 bg-[#181818] p-6 text-center sm:p-8">
          <TriangleAlert className="mx-auto h-10 w-10 text-rage-500" />
          <h1 className="mt-4 text-2xl font-bold text-white">
            {access.error}
          </h1>
          <p className="mt-3 text-sm text-zinc-300">
            Open the Event Builder from your order success page or purchase
            email. Access is tied to a successful Stripe payment for the{" "}
            {product.name}.
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
    <div className="bg-dark-900 print:bg-white">
      <CorporateEventBuilder
        sessionId={access.sessionId}
        productName={access.productName}
      />
    </div>
  )
}
