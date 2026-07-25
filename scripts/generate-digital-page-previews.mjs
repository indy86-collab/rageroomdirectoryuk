/**
 * Generates branded A4-style page preview PNGs for digital packs.
 * Run: node scripts/generate-digital-page-previews.mjs
 */
import sharp from "sharp"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, "../public/digital-products")

const W = 540
const H = 720

function escapeXml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

function pageSvg({ badge, title, subtitle, rows, footer }) {
  const rowHtml = rows
    .map((row, i) => {
      const y = 210 + i * 58
      return `
        <rect x="40" y="${y}" width="460" height="48" rx="8" fill="#f4f4f5"/>
        <rect x="56" y="${y + 14}" width="20" height="20" rx="4" fill="none" stroke="#F97316" stroke-width="2"/>
        <text x="92" y="${y + 29}" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#18181b">${escapeXml(row)}</text>
      `
    })
    .join("")

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="#ffffff"/>
  <rect width="${W}" height="12" fill="#F97316"/>
  <rect x="40" y="36" width="120" height="28" rx="6" fill="#F97316"/>
  <text x="100" y="55" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="700" fill="#ffffff">${escapeXml(badge)}</text>
  <text x="40" y="110" font-family="Arial Black, Arial, Helvetica, sans-serif" font-size="28" font-weight="900" fill="#111111">${escapeXml(title)}</text>
  <text x="40" y="145" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#52525b">${escapeXml(subtitle)}</text>
  <line x1="40" y1="170" x2="500" y2="170" stroke="#e4e4e7" stroke-width="2"/>
  ${rowHtml}
  <text x="40" y="690" font-family="Arial, Helvetica, sans-serif" font-size="12" fill="#a1a1aa">${escapeXml(footer)}</text>
</svg>`
}

const packs = {
  "rage-room-first-visit-prep-pack": [
    {
      file: "rage-room-first-visit-prep-pack-page-1.png",
      badge: "PAGE 1",
      title: "What happens",
      subtitle: "Step-by-step from arrival to smash",
      rows: [
        "Arrival and check-in",
        "Safety briefing",
        "Gear up",
        "Smash session",
        "Debrief and leave",
      ],
      footer: "RageRoom Directory · First Visit Prep Pack · UK",
    },
    {
      file: "rage-room-first-visit-prep-pack-page-2.png",
      badge: "PAGE 2",
      title: "What to wear",
      subtitle: "Clothing and kit checklist",
      rows: [
        "Closed-toe shoes",
        "Clothes you can get dusty",
        "Tie long hair back",
        "Leave valuables secure",
        "Bring photo ID if asked",
      ],
      footer: "RageRoom Directory · First Visit Prep Pack · UK",
    },
    {
      file: "rage-room-first-visit-prep-pack-page-3.png",
      badge: "PAGE 3",
      title: "Venue questions",
      subtitle: "Ask before you book",
      rows: [
        "Age rules and waivers",
        "Session length",
        "Items included",
        "Group size limits",
        "Arrival time",
      ],
      footer: "RageRoom Directory · First Visit Prep Pack · UK",
    },
  ],
  "rage-room-party-planner-pack": [
    {
      file: "rage-room-party-planner-pack-page-1.png",
      badge: "PAGE 1",
      title: "Event snapshot",
      subtitle: "Lock the basics first",
      rows: [
        "Occasion and date",
        "Group size",
        "Budget range",
        "City / area",
        "After-party plan",
      ],
      footer: "RageRoom Directory · Party Planner Pack · UK",
    },
    {
      file: "rage-room-party-planner-pack-page-2.png",
      badge: "PAGE 2",
      title: "Venue scorecard",
      subtitle: "Compare options fairly",
      rows: [
        "Price per person",
        "Travel ease",
        "Safety brief quality",
        "Group capacity",
        "Photo policy",
      ],
      footer: "RageRoom Directory · Party Planner Pack · UK",
    },
    {
      file: "rage-room-party-planner-pack-page-3.png",
      badge: "PAGE 3",
      title: "Final checklist",
      subtitle: "Before you smash",
      rows: [
        "Deposit paid",
        "RSVPs confirmed",
        "Travel shared",
        "What-to-wear sent",
        "Food booked",
      ],
      footer: "RageRoom Directory · Party Planner Pack · UK",
    },
  ],
  "corporate-rage-room-team-building-toolkit": [
    {
      file: "corporate-rage-room-team-building-toolkit-page-1.png",
      badge: "PAGE 1",
      title: "Approval email",
      subtitle: "Ready-to-send internal draft",
      rows: [
        "Objective and outcome",
        "Headcount and cost",
        "Proposed date",
        "Risk notes",
        "Ask for approval",
      ],
      footer: "RageRoom Directory · Corporate Toolkit · UK",
    },
    {
      file: "corporate-rage-room-team-building-toolkit-page-2.png",
      badge: "PAGE 2",
      title: "Budget worksheet",
      subtitle: "Sessions, travel, extras",
      rows: [
        "Session fees",
        "Travel / taxis",
        "Food and drinks",
        "Contingency",
        "Total request",
      ],
      footer: "RageRoom Directory · Corporate Toolkit · UK",
    },
    {
      file: "corporate-rage-room-team-building-toolkit-page-3.png",
      badge: "PAGE 3",
      title: "Run sheet",
      subtitle: "Minute-by-minute on the day",
      rows: [
        "Arrive and register",
        "Brief and waivers",
        "Session blocks",
        "Photos / regroup",
        "Feedback form",
      ],
      footer: "RageRoom Directory · Corporate Toolkit · UK",
    },
  ],
  "rage-room-gift-voucher-template-pack": [
    {
      file: "rage-room-gift-voucher-template-pack-page-1.png",
      badge: "A4",
      title: "Birthday voucher",
      subtitle: "Printable experience gift",
      rows: [
        "To / From fields",
        "Personal message",
        "Voucher code",
        "Valid until",
        "How to redeem",
      ],
      footer: "RageRoom Directory · Gift Voucher Pack · UK",
    },
    {
      file: "rage-room-gift-voucher-template-pack-page-2.png",
      badge: "MOBILE",
      title: "Date night voucher",
      subtitle: "Digital share-ready layout",
      rows: [
        "Compact mobile format",
        "Message space",
        "Code and date",
        "Share as image",
        "No Canva needed",
      ],
      footer: "RageRoom Directory · Gift Voucher Pack · UK",
    },
    {
      file: "rage-room-gift-voucher-template-pack-page-3.png",
      badge: "BONUS",
      title: "Gift inserts",
      subtitle: "Note, tag and envelope",
      rows: [
        "Gift note template",
        "Mini gift tag",
        "Envelope insert",
        "Redeem card",
        "Blank versions",
      ],
      footer: "RageRoom Directory · Gift Voucher Pack · UK",
    },
  ],
}

async function main() {
  for (const pages of Object.values(packs)) {
    for (const page of pages) {
      const svg = pageSvg(page)
      const out = path.join(outDir, page.file)
      await sharp(Buffer.from(svg)).png().toFile(out)
      console.log("wrote", page.file)
    }
  }

  // Bundle uses party + gift page thumbs already; also make a simple composite strip cover is enough.
  console.log("done")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
