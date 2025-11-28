import slugifyLib from "slugify"

// slugify is a default export, handle it properly
const slugify = (input: string, options?: any): string => {
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

// Ensure unique slug by appending number if needed
export async function generateUniqueSlug(
  name: string,
  city: string,
  existingSlug?: string | null
): Promise<string> {
  const baseSlug = generateSlug(name, city)
  
  // If this is an update and slug hasn't changed, return existing
  if (existingSlug === baseSlug) {
    return baseSlug
  }

  // Check if slug exists
  const { prisma } = await import("@/lib/prisma")
  let slug = baseSlug
  let counter = 1

  while (true) {
    const existing = await prisma.listing.findUnique({
      where: { slug },
    })

    if (!existing || existing.slug === existingSlug) {
      return slug
    }

    slug = `${baseSlug}-${counter}`
    counter++
  }
}

