import slugifyLib from "slugify"
import listingsData from "@/data/listings.json"
import type { Listing } from "@/types/listing"

const slugify = (input: string, options?: Parameters<typeof slugifyLib>[1]): string => {
  return slugifyLib(input, options)
}

export function generateSlug(name: string, city?: string): string {
  const base = city ? `${name} ${city}` : name
  return slugify(base, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  })
}

function getAllSlugs(): string[] {
  return (listingsData as Listing[])
    .map((l) => l.slug)
    .filter((s): s is string => Boolean(s))
}

export async function generateUniqueSlug(
  name: string,
  city: string,
  existingSlug?: string | null
): Promise<string> {
  const baseSlug = generateSlug(name, city)

  if (existingSlug === baseSlug) {
    return baseSlug
  }

  const usedSlugs = new Set(getAllSlugs())
  let slug = baseSlug
  let counter = 1

  while (usedSlugs.has(slug) && slug !== existingSlug) {
    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}
