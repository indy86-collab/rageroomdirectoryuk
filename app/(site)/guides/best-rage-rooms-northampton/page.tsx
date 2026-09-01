import CityGuidePage from "@/components/CityGuidePage"
import { buildCityGuideMetadata, getCityGuidePath } from "@/lib/city-guides"

export const metadata = buildCityGuideMetadata("Northampton")
export const revalidate = 86400

export default function BestRageRoomsNorthamptonPage() {
  return (
    <CityGuidePage
      city="Northampton"
      path={getCityGuidePath("Northampton")}
      published="2026-08-22"
      updated="31 August 2026"
      modified="2026-08-31"
    />
  )
}
