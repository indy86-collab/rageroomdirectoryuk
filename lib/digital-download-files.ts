import "server-only"
import type { DigitalProduct } from "@/lib/digital-products"

export type DownloadFulfilmentKind = "lead" | "purchase"

/**
 * Resolve which file to serve.
 * Free First Visit Prep Pack and historical paid First Visit orders both
 * fulfil the same 12-page PDF.
 */
export function resolveDigitalDownloadFile(
  product: DigitalProduct,
  _kind: DownloadFulfilmentKind
) {
  if (!product.filePath) {
    return null
  }

  return {
    filePath: product.filePath,
    downloadFilename: product.downloadFilename || "download",
    contentType: product.contentType || "application/octet-stream",
  }
}
