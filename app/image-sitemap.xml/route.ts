import { getAllListingsForAdmin } from "@/lib/listings"
import { buildImageSitemapXml } from "@/lib/image-sitemap"

export const revalidate = 3600

export async function GET() {
  const listings = await getAllListingsForAdmin()
  return new Response(buildImageSitemapXml(listings), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  })
}
