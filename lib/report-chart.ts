import type { ReportRow } from "@/lib/report-data"

function escape(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    '"': "&quot;",
  })[character] || character)
}

export function buildReportChartSvg(title: string, rows: ReportRow[]) {
  const shown = rows.slice(0, 8)
  const maximum = Math.max(1, ...shown.map((row) => row.count))
  const bars = shown
    .map((row, index) => {
      const y = 120 + index * 54
      const width = Math.max(4, Math.round((row.count / maximum) * 650))
      return `<text x="60" y="${y}" fill="#e4e4e7" font-size="18" font-family="Arial,sans-serif">${escape(row.label)}</text>
<rect x="360" y="${y - 20}" width="${width}" height="26" rx="5" fill="#f97316"/>
<text x="${375 + width}" y="${y}" fill="#fff" font-size="18" font-weight="700" font-family="Arial,sans-serif">${row.count}</text>`
    })
    .join("\n")
  const height = 160 + shown.length * 54

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${height}" viewBox="0 0 1200 ${height}" role="img" aria-labelledby="title desc">
<title id="title">${escape(title)}</title><desc id="desc">Chart from the UK Rage Room Report 2026</desc>
<rect width="1200" height="${height}" fill="#09090b"/>
<text x="60" y="64" fill="#fff" font-size="34" font-weight="800" font-family="Arial,sans-serif">${escape(title)}</text>
<text x="60" y="92" fill="#a1a1aa" font-size="16" font-family="Arial,sans-serif">RageRoom Directory · UK Rage Room Report 2026</text>
${bars}
<text x="60" y="${height - 30}" fill="#71717a" font-size="15" font-family="Arial,sans-serif">Source: rageroomdirectory.co.uk/uk-rage-room-report-2026</text>
</svg>`
}
