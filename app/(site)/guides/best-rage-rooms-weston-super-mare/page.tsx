import CityGuidePage from "@/components/CityGuidePage"
import { buildCityGuideMetadata, getCityGuidePath } from "@/lib/city-guides"

export const metadata = buildCityGuideMetadata("Weston-super-Mare")
export const revalidate = 86400

export default function BestRageRoomsWestonSuperMarePage() {
  return (
    <CityGuidePage
      city="Weston-super-Mare"
      path={getCityGuidePath("Weston-super-Mare")}
      published="2026-08-22"
      updated="22 August 2026"
      modified="2026-08-22"
    />
  )
}
