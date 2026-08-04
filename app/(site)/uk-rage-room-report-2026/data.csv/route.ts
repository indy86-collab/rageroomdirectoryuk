import { getAllListingsForAdmin } from "@/lib/listings"
import { buildAggregateReportCsv, buildRageRoomReportData } from "@/lib/report-data"

export const revalidate = 3600

export async function GET() {
  const data = buildRageRoomReportData(await getAllListingsForAdmin())
  return new Response(buildAggregateReportCsv(data), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="uk-rage-room-report-2026.csv"',
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  })
}
