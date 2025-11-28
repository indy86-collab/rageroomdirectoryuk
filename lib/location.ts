/**
 * Converts a city name to a URL-friendly slug
 * Example: "Newcastle upon Tyne" -> "newcastle-upon-tyne"
 */
export function cityToSlug(city: string): string {
  return city
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, "") // Remove leading/trailing hyphens
}

/**
 * Converts a slug back to a displayable city name
 * Example: "newcastle-upon-tyne" -> "Newcastle Upon Tyne"
 * Note: This is a simple reverse; it may not perfectly match the original
 */
export function slugToCity(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

/**
 * Converts a region name to a URL-friendly slug
 */
export function regionToSlug(region: string): string {
  return region
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

/**
 * Converts a region slug back to a displayable region name
 */
export function slugToRegion(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}



