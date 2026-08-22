import CityGuidePage from "@/components/CityGuidePage"
import { buildCityGuideMetadata, getCityGuidePath } from "@/lib/city-guides"

export const metadata = buildCityGuideMetadata("Huddersfield")
export const revalidate = 86400

export default function BestRageRoomsHuddersfieldPage() {
  return (
    <CityGuidePage
      city="Huddersfield"
      path={getCityGuidePath("Huddersfield")}
      published="2026-08-22"
      updated="22 August 2026"
      modified="2026-08-22"
    />
  )
}
