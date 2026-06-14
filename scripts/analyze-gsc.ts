/**
 * Analyze Google Search Console CSV exports.
 *
 * Expected files:
 *  - seo-data/gsc-queries.csv
 *  - seo-data/gsc-pages.csv
 *
 * Export columns should include Query/Page, Clicks, Impressions, CTR, Position.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs"
import { join } from "path"

interface GscRow {
  label: string
  clicks: number
  impressions: number
  ctr: number
  position: number
}

function parseCsv(input: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ""
  let quoted = false

  for (let i = 0; i < input.length; i++) {
    const char = input[i]
    const next = input[i + 1]

    if (char === '"' && quoted && next === '"') {
      field += '"'
      i++
    } else if (char === '"') {
      quoted = !quoted
    } else if (char === "," && !quoted) {
      row.push(field)
      field = ""
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") i++
      row.push(field)
      if (row.some((value) => value.trim() !== "")) rows.push(row)
      row = []
      field = ""
    } else {
      field += char
    }
  }

  row.push(field)
  if (row.some((value) => value.trim() !== "")) rows.push(row)
  return rows
}

function parseNumber(value: string | undefined) {
  if (!value) return 0
  return Number(value.replace(/[% ,]/g, "")) || 0
}

function normalizeHeader(header: string) {
  return header.trim().toLowerCase()
}

function readGscCsv(path: string, fallbackLabel: string): GscRow[] {
  if (!existsSync(path)) return []

  const rows = parseCsv(readFileSync(path, "utf-8"))
  const headers = rows.shift()?.map(normalizeHeader) ?? []
  const labelIndex = headers.findIndex((h) => h === "query" || h === "page")
  const clicksIndex = headers.findIndex((h) => h === "clicks")
  const impressionsIndex = headers.findIndex((h) => h === "impressions")
  const ctrIndex = headers.findIndex((h) => h === "ctr")
  const positionIndex = headers.findIndex((h) => h === "position")

  if (labelIndex === -1 || impressionsIndex === -1 || positionIndex === -1) {
    throw new Error(`${path} must include ${fallbackLabel}, Impressions and Position columns`)
  }

  return rows
    .map((row) => {
      const rawCtr = parseNumber(row[ctrIndex])
      return {
        label: row[labelIndex]?.trim() || "(blank)",
        clicks: parseNumber(row[clicksIndex]),
        impressions: parseNumber(row[impressionsIndex]),
        ctr: row[ctrIndex]?.includes("%") ? rawCtr / 100 : rawCtr,
        position: parseNumber(row[positionIndex]),
      }
    })
    .filter((row) => row.label !== "(blank)" && row.impressions > 0)
}

function nearWins(rows: GscRow[]) {
  return rows
    .filter((row) => row.position >= 4 && row.position <= 20)
    .sort((a, b) => b.impressions - a.impressions || a.position - b.position)
    .slice(0, 25)
}

function lowCtr(rows: GscRow[]) {
  return rows
    .filter((row) => row.impressions >= 100 && row.position <= 12 && row.ctr < 0.03)
    .sort((a, b) => b.impressions - a.impressions || a.ctr - b.ctr)
    .slice(0, 25)
}

function table(rows: GscRow[]) {
  if (rows.length === 0) return "_No matching rows._\n"

  return [
    "| Target | Clicks | Impressions | CTR | Position |",
    "| --- | ---: | ---: | ---: | ---: |",
    ...rows.map(
      (row) =>
        `| ${row.label.replace(/\|/g, "\\|")} | ${row.clicks} | ${row.impressions} | ${(row.ctr * 100).toFixed(1)}% | ${row.position.toFixed(1)} |`
    ),
    "",
  ].join("\n")
}

function main() {
  const root = process.cwd()
  const queryPath = join(root, "seo-data", "gsc-queries.csv")
  const pagePath = join(root, "seo-data", "gsc-pages.csv")
  const queries = readGscCsv(queryPath, "Query")
  const pages = readGscCsv(pagePath, "Page")

  if (queries.length === 0 && pages.length === 0) {
    throw new Error(
      "No GSC CSV data found. Add seo-data/gsc-queries.csv and/or seo-data/gsc-pages.csv."
    )
  }

  const report = [
    "# GSC Organic Priority Report",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "## Query Near-Wins",
    table(nearWins(queries)),
    "## Query CTR Fixes",
    table(lowCtr(queries)),
    "## Page Near-Wins",
    table(nearWins(pages)),
    "## Page CTR Fixes",
    table(lowCtr(pages)),
  ].join("\n")

  const outDir = join(root, "seo-reports")
  mkdirSync(outDir, { recursive: true })
  const outPath = join(outDir, "gsc-priorities.md")
  writeFileSync(outPath, report)
  console.log(`Wrote ${outPath}`)
}

main()
