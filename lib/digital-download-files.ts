import "server-only"
import fs from "fs"
import path from "path"
import type { DigitalProduct } from "@/lib/digital-products"
import { FIRST_VISIT_CHECKLIST_PRODUCT_ID } from "@/lib/digital-products"
import {
  FIRST_TIMER_CHECKLIST_FILENAME,
  FIRST_VISIT_LEGACY_PACK_FILENAME,
} from "@/lib/first-timer-checklist"

export type DownloadFulfilmentKind = "lead" | "purchase"

/**
 * Resolve which file to serve.
 * Free lead magnet → concise checklist.
 * Historical paid First Visit orders → legacy 12-page pack when still on disk.
 */
export function resolveDigitalDownloadFile(
  product: DigitalProduct,
  kind: DownloadFulfilmentKind
) {
  if (product.id === FIRST_VISIT_CHECKLIST_PRODUCT_ID && kind === "purchase") {
    const legacyPath = path.join(
      process.cwd(),
      "private/digital-downloads",
      FIRST_VISIT_LEGACY_PACK_FILENAME
    )
    if (fs.existsSync(legacyPath)) {
      return {
        filePath: legacyPath,
        downloadFilename: FIRST_VISIT_LEGACY_PACK_FILENAME,
        contentType: "application/pdf",
      }
    }
  }

  if (!product.filePath) {
    return null
  }

  return {
    filePath: product.filePath,
    downloadFilename:
      product.downloadFilename ||
      (product.id === FIRST_VISIT_CHECKLIST_PRODUCT_ID
        ? FIRST_TIMER_CHECKLIST_FILENAME
        : "download"),
    contentType: product.contentType || "application/octet-stream",
  }
}
