import { prisma } from "../lib/prisma"
import { generateUniqueSlug } from "../lib/slugify"

async function run() {
  console.log("Starting slug migration...")
  
  const listings = await prisma.listing.findMany({
    where: {
      OR: [
        { slug: null },
        { slug: "" },
      ],
    },
  })

  console.log(`Found ${listings.length} listings without slugs`)

  for (const listing of listings) {
    try {
      const slug = await generateUniqueSlug(listing.name, listing.city, listing.slug || undefined)
      
      await prisma.listing.update({
        where: { id: listing.id },
        data: { slug },
      })

      console.log(`✓ Generated slug for: ${listing.name} -> ${slug}`)
    } catch (error) {
      console.error(`✗ Error processing ${listing.name}:`, error)
    }
  }

  console.log("\n✅ Slug migration complete!")
  await prisma.$disconnect()
}

run().catch((error) => {
  console.error("Migration failed:", error)
  process.exit(1)
})


