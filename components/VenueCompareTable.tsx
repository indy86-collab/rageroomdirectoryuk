"use client"

import Link from "next/link"
import type { Listing } from "@/types/listing"
import { getActivityLabel, formatGroupSize, formatListingPrice } from "@/lib/discovery"

function formatBoolean(value: boolean | null | undefined) {
  if (value === true) return "Yes"
  if (value === false) return "No"
  return "Not provided"
}

export default function VenueCompareTable({ listings }: { listings: Listing[] }) {
  if (listings.length < 2) return null

  const rows: Array<{ label: string; value: (listing: Listing) => string }> = [
    { label: "Rage-room starting price", value: (listing) => formatListingPrice(listing) ?? "Not provided" },
    { label: "Activities", value: (listing) => listing.activities.map(getActivityLabel).join(", ") },
    { label: "Published duration", value: (listing) => listing.sessionLengths?.length ? `${listing.sessionLengths.map((value) => `${value} min`).join(", ")}${listing.sessionDurationType ? ` (${listing.sessionDurationType.replace("-", " ")})` : ""}` : "Not provided" },
    { label: "Rage-room minimum age", value: (listing) => listing.ageMin != null ? `${listing.ageMin}+${listing.minimumAgeNote ? ` — ${listing.minimumAgeNote}` : ""}` : "Not provided" },
    { label: "Rating", value: (listing) => listing.rating != null ? `${listing.rating.toFixed(1)}${listing.reviewCount ? ` (${listing.reviewCount})` : ""}` : "Not provided" },
    { label: "Booking group size", value: (listing) => formatGroupSize(listing) ?? "Not provided" },
    { label: "Walk-ins accepted", value: (listing) => formatBoolean(listing.walkInsAccepted) },
    { label: "Online booking", value: (listing) => formatBoolean(listing.onlineBooking) },
    { label: "Gift vouchers", value: (listing) => formatBoolean(listing.giftVouchers) },
    { label: "Corporate packages", value: (listing) => formatBoolean(listing.corporatePackages) },
    { label: "Private hire", value: (listing) => formatBoolean(listing.privateHire) },
  ]

  return (
    <section className="mb-8 overflow-hidden rounded-lg border border-rage-500/40 bg-[#181818]" aria-labelledby="compare-heading">
      <div className="border-b border-zinc-800 p-4 sm:p-5">
        <h2 id="compare-heading" className="text-xl font-bold text-white">Compare selected venues</h2>
        <p className="mt-1 text-sm text-zinc-400">Compare confirmed listing data side by side. Check the venue website before booking.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[720px] w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="w-40 p-3 text-xs uppercase tracking-wider text-zinc-500">Compare</th>
              {listings.map((listing) => (
                <th key={listing.id} className="min-w-48 p-3 text-white">
                  <Link href={`/listing/${listing.slug || listing.id}`} className="hover:text-rage-400">{listing.name}</Link>
                  <span className="mt-1 block text-xs font-normal text-zinc-500">{listing.city}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-zinc-800/70 last:border-0">
                <th className="p-3 text-xs font-bold uppercase tracking-wider text-zinc-500">{row.label}</th>
                {listings.map((listing) => <td key={listing.id} className="p-3 text-zinc-200">{row.value(listing)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
