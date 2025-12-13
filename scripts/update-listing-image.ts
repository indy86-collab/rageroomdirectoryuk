import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const slug = "rage-room-leicester"
  const imagePath = "/images/rageroomleicester.png"

  console.log(`Updating listing with slug "${slug}" to use image "${imagePath}"...`)

  const listing = await prisma.listing.findUnique({
    where: { slug },
  })

  if (!listing) {
    console.error(`Listing with slug "${slug}" not found!`)
    process.exit(1)
  }

  const updated = await prisma.listing.update({
    where: { slug },
    data: { image: imagePath },
  })

  console.log(`Successfully updated listing "${updated.name}" (ID: ${updated.id})`)
  console.log(`Image set to: ${updated.image}`)
}

main()
  .catch((e) => {
    console.error("Error updating listing:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

