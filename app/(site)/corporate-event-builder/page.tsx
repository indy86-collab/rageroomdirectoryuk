import type { Metadata } from "next"
import CorporateEventBuilder from "@/components/corporate-event-builder/CorporateEventBuilder"
import {
  verifyCorporateBuilderAccess,
  verifyCorporateBuilderAccessFromToken,
} from "@/lib/corporate-event-builder/access"
import { GUEST_WORKSPACE_ID } from "@/lib/corporate-event-builder/types"
import { createDownloadToken } from "@/lib/download-token"
import {
  getDigitalProduct,
  getDigitalProductAnalytics,
} from "@/lib/digital-products"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Corporate Rage Room Event Builder",
  description:
    "Build your corporate rage room event plan — budget, venue shortlist, approval and team invitations. Download a PDF when you are happy.",
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
      : null

  const paid = Boolean(access?.ok)
  const sessionId = access?.ok ? access.sessionId : GUEST_WORKSPACE_ID
  const toolkitDownloadHref =
    paid && product.filePath
      ? `/download/${createDownloadToken({
          sessionId,
          productId: product.id,
        })}`
      : null

  return (
    <div className="bg-dark-900 print:bg-white">
      <CorporateEventBuilder
        sessionId={sessionId}
        paid={paid}
        productName={product.name}
        productPriceLabel={product.priceLabel}
        analyticsProduct={getDigitalProductAnalytics(product)}
        toolkitDownloadHref={toolkitDownloadHref}
      />
    </div>
  )
}
