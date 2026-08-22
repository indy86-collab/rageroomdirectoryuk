import Link from "next/link"
import { cityToSlug } from "@/lib/location"
import { getListingsNearCity } from "@/lib/listings"
import { EDITORIAL_CITY_GUIDES, getCityGuidePath, hasEditorialCityGuide } from "@/lib/city-guides"

/**
 * Hand-curated "near me" neighbour lists by city. These are the related city
 * links shown on each city page — they're region-aware and deliberately
 * surface cities that searchers often compare.
 */
const NEIGHBOURS: Record<string, readonly string[]> = {
  London: ["Brighton", "Reading", "Milton Keynes", "Oxford", "Cambridge"],
  Birmingham: ["Coventry", "Leicester", "Nottingham", "Manchester", "Derby"],
  Manchester: ["Liverpool", "Leeds", "Sheffield", "Birmingham", "Preston"],
  Leeds: ["Sheffield", "Manchester", "Huddersfield", "York", "Liverpool"],
  Liverpool: ["Manchester", "Chester", "Leeds", "Preston", "Birmingham"],
  Bristol: ["Cardiff", "Bath", "Weston-super-Mare", "Swindon", "London"],
  Newcastle: ["Sunderland", "Durham", "Middlesbrough", "Leeds", "Edinburgh"],
  Sheffield: ["Leeds", "Manchester", "Nottingham", "Huddersfield", "Derby"],
  Nottingham: ["Leicester", "Derby", "Sheffield", "Birmingham", "Northampton"],
  Glasgow: ["Edinburgh", "Aberdeen", "Dundee", "Newcastle"],
  Edinburgh: ["Glasgow", "Newcastle", "Dundee", "Aberdeen"],
  Cardiff: ["Bristol", "Swansea", "Newport", "Bath"],
  Hull: ["Leeds", "Sheffield", "York", "Grimsby", "Doncaster"],
  Belfast: ["Dublin", "Londonderry"],
  Northampton: ["Leicester", "Birmingham", "Milton Keynes", "Bedford", "Coventry"],
  Huddersfield: ["Leeds", "Manchester", "Sheffield", "Bradford"],
  Bath: ["Bristol", "Weston-super-Mare", "Cardiff", "Swindon"],
  "Weston-super-Mare": ["Bristol", "Bath", "Cardiff"],
  "Weston Super Mare": ["Bristol", "Bath", "Cardiff"],
}

const FALLBACK_GUIDE_CITIES = EDITORIAL_CITY_GUIDES.map((guide) => guide.city)

function slugifyCity(city: string) {
  return cityToSlug(city)
}

export default async function CityRelatedLinks({ cityName }: { cityName: string }) {
  const neighbours =
    NEIGHBOURS[cityName] ?? FALLBACK_GUIDE_CITIES.filter((c) => cityToSlug(c) !== cityToSlug(cityName)).slice(0, 5)
  const availableNeighbours = (
    await Promise.all(
      neighbours.map(async (city) => {
        const { allForSchema } = await getListingsNearCity(city)
        return allForSchema.length > 0 ? city : null
      })
    )
  ).filter((city): city is string => city != null)

  return (
    <section
      aria-label={`Related links for rage rooms in ${cityName}`}
      className="mt-8 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <div className="bg-[#181818] rounded-lg border border-zinc-800 p-5 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-3">
          More about rage rooms in {cityName}
        </h2>
        <ul className="space-y-2 text-zinc-300">
          {hasEditorialCityGuide(cityName) && (
            <li>
              <Link
                href={getCityGuidePath(cityName)}
                className="text-orange-500 hover:text-orange-400 underline"
              >
                Best rage rooms in {cityName} — editorial ranking
              </Link>
            </li>
          )}
          <li>
            <Link
              href="/guides/what-happens-in-a-rage-room"
              className="text-orange-500 hover:text-orange-400 underline"
            >
              What happens in a rage room? Step-by-step guide
            </Link>
          </li>
          <li>
            <Link
              href="/guides/are-rage-rooms-safe-uk"
              className="text-orange-500 hover:text-orange-400 underline"
            >
              Are rage rooms safe? UK safety & age guide
            </Link>
          </li>
          <li>
            <Link
              href="/guides/how-much-do-rage-rooms-cost-uk"
              className="text-orange-500 hover:text-orange-400 underline"
            >
              How much do rage rooms cost in the UK?
            </Link>
          </li>
          <li>
            <Link
              href="/guides/best-rage-rooms-for-couples"
              className="text-orange-500 hover:text-orange-400 underline"
            >
              Rage rooms for couples &amp; date nights
            </Link>
          </li>
          <li>
            <Link
              href="/guides/best-rage-rooms-for-team-building"
              className="text-orange-500 hover:text-orange-400 underline"
            >
              Rage rooms for team building &amp; corporate events
            </Link>
          </li>
          <li>
            <Link
              href="/guides/rage-rooms-for-stress-relief"
              className="text-orange-500 hover:text-orange-400 underline"
            >
              Do rage rooms relieve stress?
            </Link>
          </li>
          <li>
            <Link
              href="/guides/what-to-wear-to-a-rage-room"
              className="text-orange-500 hover:text-orange-400 underline"
            >
              What to wear to a rage room
            </Link>
          </li>
          <li>
            <Link
              href="/guides/rage-room-gift-vouchers-uk"
              className="text-orange-500 hover:text-orange-400 underline"
            >
              Rage room gift vouchers UK
            </Link>
          </li>
        </ul>
      </div>

      <div className="bg-[#181818] rounded-lg border border-zinc-800 p-5 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-3">
          Rage rooms in nearby cities
        </h2>
        <ul className="space-y-2 text-zinc-300">
          {availableNeighbours.map((c) => (
            <li key={c}>
              <Link
                href={`/city/${slugifyCity(c)}`}
                className="text-orange-500 hover:text-orange-400 underline"
              >
                Rage rooms in {c}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/near-me"
              className="text-orange-500 hover:text-orange-400 underline"
            >
              Find a rage room near me (map)
            </Link>
          </li>
          <li>
            <Link
              href="/listings"
              className="text-orange-500 hover:text-orange-400 underline"
            >
              Browse all UK rage rooms
            </Link>
          </li>
        </ul>
      </div>
    </section>
  )
}
