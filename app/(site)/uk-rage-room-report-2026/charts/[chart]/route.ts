import { notFound } from "next/navigation"
import { getAllListingsForAdmin } from "@/lib/listings"
import { buildRageRoomReportData } from "@/lib/report-data"
import { buildReportChartSvg } from "@/lib/report-chart"

export const revalidate = 3600

export async function GET(
  _request: Request,
  { params }: { params: { chart: string } }
) {
  const data = buildRageRoomReportData(await getAllListingsForAdmin())
  const config =
    params.chart === "regions.svg"
      ? { title: "Verified fixed-location venues by recorded UK region", rows: data.regions }
      : params.chart === "prices.svg"
        ? { title: "Published per-person starting-price bands", rows: data.priceBands }
        : null
  if (!config) notFound()

  return new Response(buildReportChartSvg(config.title, config.rows), {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Content-Disposition": `inline; filename="${params.chart}"`,
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  })
}
