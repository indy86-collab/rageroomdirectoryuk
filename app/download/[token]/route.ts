import fs from "fs"
import { NextResponse } from "next/server"
import { getDigitalProduct } from "@/lib/digital-products"
import { verifyDownloadToken } from "@/lib/download-token"
import { getStripe } from "@/lib/stripe"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type DownloadRouteProps = {
  params: { token: string }
}

function invalidDownloadResponse() {
  return new NextResponse(
    `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Download unavailable</title></head><body style="margin:0;background:#111;color:#fff;font-family:system-ui,sans-serif"><main style="min-height:100vh;display:grid;place-items:center;padding:24px"><section style="max-width:560px;border:1px solid #333;background:#181818;border-radius:8px;padding:32px;text-align:center"><h1 style="font-size:24px;margin:0 0 12px">This download link has expired or is no longer valid.</h1><p style="color:#d4d4d8;margin:0 0 20px">If you recently bought a planner, return to your Stripe success page or contact support.</p><a href="/digital-downloads" style="display:inline-block;background:#f97316;color:white;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:6px">Back to downloads</a></section></main></body></html>`,
    {
      status: 410,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    }
  )
}

export async function GET(_request: Request, { params }: DownloadRouteProps) {
  const payload = verifyDownloadToken(params.token)

  if (!payload) {
    return invalidDownloadResponse()
  }

  const product = getDigitalProduct(payload.productId)

  if (!product || !fs.existsSync(product.filePath)) {
    return invalidDownloadResponse()
  }

  const stripe = getStripe()
  const session = await stripe.checkout.sessions.retrieve(payload.sessionId)

  if (
    session.payment_status !== "paid" ||
    session.metadata?.productId !== product.id ||
    session.amount_total !== product.unitAmount ||
    session.currency !== product.currency
  ) {
    return invalidDownloadResponse()
  }

  const file = await fs.promises.readFile(product.filePath)

  return new NextResponse(file, {
    headers: {
      "Content-Type": product.contentType,
      "Content-Disposition": `attachment; filename="${product.downloadFilename}"`,
      "Cache-Control": "no-store",
    },
  })
}
