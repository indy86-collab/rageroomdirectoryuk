import { existsSync } from "node:fs"
import { join } from "node:path"
import { cityToSlug } from "@/lib/location"

export function getCityHeroImagePath(city: string): string | null {
  const slug = cityToSlug(city)
  if (!slug) return null
  const relative = `/images/cities/${slug}.jpg`
  return existsSync(join(process.cwd(), "public", relative)) ? relative : null
}
