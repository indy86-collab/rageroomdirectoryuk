import Link from "next/link"
import FAQ from "@/components/FAQ"
import { getListingHref, pluraliseVenue } from "@/lib/discovery"
import {
  getPaintAgeRows,
  getPaintCityGroups,
  getPaintPriceRows,
} from "@/lib/listing-comparisons"
import { cityToSlug } from "@/lib/location"
import type { LocationDiscoveryPageData } from "@/lib/location-discovery"
import type { Listing } from "@/types/listing"

const PAINT_FAQS = [
  {
    question: "How much does a paint splatter room cost in the UK?",
    answer:
      "Most dedicated UK paint and splatter studios publish £20–£43 per person. A few rooms and group packages are priced as a hire rather than a ticket. Confirm canvas, extra colours and photography add-ons before you book.",
  },
  {
    question: "What age is a paint room suitable for?",
    answer:
      "Paint studios are often much younger than smash rooms. Several verified listings publish 2+ to 8+ rules, while smash-and-paint venues usually follow the stricter smash-room age. Check the venue page and the booking form for every child.",
  },
  {
    question: "Can you smash and paint at the same venue?",
    answer:
      "Yes. A subset of UK venues run both a rage room and a paint or splatter session. Those combination venues are listed on this page and can be filtered as Rage Room + Paint.",
  },
  {
    question: "What should I wear to a paint splatter room?",
    answer:
      "Wear old clothes and closed-toe shoes even when coveralls are supplied. Ask whether paint can stain hair, trainers or jewellery, and whether you can take a canvas home.",
  },
  {
    question: "Rage room or paint splatter — which should I book?",
    answer:
      "Choose a rage room for high-intensity stress relief and mixed-ability adult groups. Choose paint if you want a colourful, lower-impact session that younger guests can join. The comparison guide covers price, age, mess and occasions.",
  },
]

export default function PaintHubExtras({
  listings,
  locationPages,
}: {
  listings: Listing[]
  locationPages: LocationDiscoveryPageData[]
}) {
  const { perPerson, perRoomOrGroup } = getPaintPriceRows(listings)
  const { known, unknown } = getPaintAgeRows(listings)
  const cityGroups = getPaintCityGroups(listings).filter(
    (group) => group.listings.length >= 2
  )
  const locationBySlug = new Map(
    locationPages.map((page) => [page.location.slug, page.href])
  )
  const lowest = perPerson[0]
  const youngest = known[0]

  return (
    <div className="mt-10 space-y-10">
      <section aria-labelledby="paint-prices-heading">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-rage-500">
          Live directory data
        </p>
        <h2 id="paint-prices-heading" className="mt-2 text-2xl font-bold text-white sm:text-3xl">
          Paint splatter prices in the UK
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400">
          {lowest
            ? `The lowest published per-person starting price in our verified paint data is ${lowest.formattedPrice} at ${lowest.listing.name} in ${lowest.listing.city}. `
            : ""}
          Per-person tickets and room/group hires are kept on separate tables so units are not mixed.
          Compare that with smash-room pricing in the{" "}
          <Link href="/guides/rage-room-vs-paint-splatter" className="text-orange-500 underline hover:text-orange-400">
            rage room vs paint splatter guide
          </Link>
          .
        </p>
        <PriceTable
          heading="Lowest per-person paint prices"
          rows={perPerson}
          empty="No comparable per-person paint prices are published yet."
        />
        {perRoomOrGroup.length > 0 && (
          <PriceTable
            heading="Per-room and per-group paint prices"
            rows={perRoomOrGroup}
            empty="No per-room or per-group paint prices are published yet."
          />
        )}
      </section>

      <section aria-labelledby="paint-ages-heading">
        <h2 id="paint-ages-heading" className="text-2xl font-bold text-white sm:text-3xl">
          Paint room age limits
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400">
          {youngest
            ? `The youngest published paint-room age in our data is ${youngest.ageLabel} at ${youngest.listing.name}. `
            : ""}
          Smash-and-paint venues often follow the smash-room rule instead, so check both activities if you are booking a mixed-age group.
        </p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-800">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-zinc-900 text-zinc-300">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Venue</th>
                <th scope="col" className="px-4 py-3 font-semibold">City</th>
                <th scope="col" className="px-4 py-3 font-semibold">Published age</th>
                <th scope="col" className="px-4 py-3 font-semibold">Also smash?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 bg-[#181818]">
              {[...known, ...unknown].map((row) => (
                <tr key={row.listing.id}>
                  <th scope="row" className="px-4 py-3 font-semibold text-white">
                    <Link
                      href={getListingHref(row.listing)}
                      className="text-orange-500 hover:text-orange-400"
                    >
                      {row.listing.name}
                    </Link>
                  </th>
                  <td className="px-4 py-3 text-zinc-300">
                    {row.listing.locationType === "mobile-service"
                      ? "Mobile / UK-wide"
                      : row.listing.city}
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{row.ageLabel}</td>
                  <td className="px-4 py-3 text-zinc-300">
                    {row.listing.activities.includes("rage-room") ? "Yes" : "Paint only"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {cityGroups.length > 0 && (
        <section aria-labelledby="paint-cities-heading">
          <h2 id="paint-cities-heading" className="text-2xl font-bold text-white sm:text-3xl">
            Paint rooms by city
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400">
            London is the only city with enough verified paint studios for a dedicated comparison page.
            Other cities below have two or more listed venues, shown here rather than as thin landing pages.
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {cityGroups.map((group) => {
              const href = locationBySlug.get(cityToSlug(group.city))
              return (
                <article
                  key={group.city}
                  className="rounded-lg border border-zinc-800 bg-[#181818] p-5"
                >
                  <h3 className="text-lg font-bold text-white">
                    {href ? (
                      <Link href={href} className="text-orange-500 hover:text-orange-400">
                        {group.city} ({pluraliseVenue(group.listings.length)})
                      </Link>
                    ) : (
                      <>
                        {group.city}{" "}
                        <span className="font-normal text-zinc-500">
                          ({pluraliseVenue(group.listings.length)})
                        </span>
                      </>
                    )}
                  </h3>
                  <ul className="mt-3 space-y-1 text-sm text-zinc-300">
                    {group.listings.map((listing) => (
                      <li key={listing.id}>
                        <Link
                          href={getListingHref(listing)}
                          className="hover:text-orange-400"
                        >
                          {listing.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </article>
              )
            })}
          </div>
        </section>
      )}

      <FAQ items={PAINT_FAQS} title="Paint splatter FAQs" />
    </div>
  )
}

function PriceTable({
  heading,
  rows,
  empty,
}: {
  heading: string
  rows: ReturnType<typeof getPaintPriceRows>["perPerson"]
  empty: string
}) {
  return (
    <div className="mt-5">
      <h3 className="mb-3 text-lg font-bold text-white">{heading}</h3>
      {rows.length === 0 ? (
        <p className="text-zinc-400">{empty}</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-zinc-800">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-zinc-900 text-zinc-300">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Venue</th>
                <th scope="col" className="px-4 py-3 font-semibold">City</th>
                <th scope="col" className="px-4 py-3 font-semibold">Published from</th>
                <th scope="col" className="px-4 py-3 font-semibold">Age</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 bg-[#181818]">
              {rows.map((row) => (
                <tr key={row.listing.id}>
                  <th scope="row" className="px-4 py-3 font-semibold text-white">
                    <Link
                      href={getListingHref(row.listing)}
                      className="text-orange-500 hover:text-orange-400"
                    >
                      {row.listing.name}
                    </Link>
                  </th>
                  <td className="px-4 py-3 text-zinc-300">
                    {row.listing.locationType === "mobile-service"
                      ? "Mobile / UK-wide"
                      : row.listing.city}
                  </td>
                  <td className="px-4 py-3 text-white">{row.formattedPrice}</td>
                  <td className="px-4 py-3 text-zinc-300">
                    {row.listing.ageMin != null ? `${row.listing.ageMin}+` : "Check venue"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
