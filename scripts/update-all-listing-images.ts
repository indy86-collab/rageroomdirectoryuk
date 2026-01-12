import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Mapping of image filenames to listing names (or slugs)
const imageMappings: Array<{ image: string; listingName: string; listingSlug?: string }> = [
  { image: "/images/RageRoomsGlasgow.png", listingName: "Rage Rooms Glasgow" },
  { image: "/images/axedandenraged.png", listingName: "Axed and Enraged" },
  { image: "/images/rageroomireland.png", listingName: "Rage Room Ireland" },
  { image: "/images/rageroomleicester.png", listingName: "Rage Room Leicester" },
  { image: "/images/DestructionTimeSwansea.png", listingName: "Destruction Time" },
  { image: "/images/EdinburghRageRoom.png", listingName: "Edinburgh Rage Room" },
  { image: "/images/GameVaultAyrshire.png", listingName: "Game Vault Ayrshire" },
  { image: "/images/JustRageRoomsHenlow.png", listingName: "Just Rage Rooms" },
  { image: "/images/RageRoomsLeamingtonSpa.png", listingName: "Rage Rooms Leamington Spa" },
  { image: "/images/RageRoomsNorwich.png", listingName: "Rage Rooms Norwich" },
  { image: "/images/RiotRoomDunfermline.png", listingName: "Riot Room" },
  { image: "/images/SMASHITHuddersfield.png", listingName: "SMASH IT" },
  { image: "/images/SmashPalaceLincoln.png", listingName: "Smash Palace" },
  { image: "/images/TheRageRoomNIPortadown.png", listingName: "The Rage Room NI" },
  { image: "/images/TheSmashFactoryColeraine.png", listingName: "The Smash Factory" },
  { image: "/images/TheRageRoomsBournemouth.png", listingName: "The Rage Rooms" },
  { image: "/images/TheUndergroundNewport.png", listingName: "The Underground" },
  { image: "/images/Wreck-ItRoomAberdeen.png", listingName: "Wreck-It Room" },
]

async function main() {
  console.log("Starting to update listing images...\n")

  let updatedCount = 0
  let notFoundCount = 0

  for (const mapping of imageMappings) {
    try {
      // Try to find by name first (case-insensitive)
      let listing = await prisma.listing.findFirst({
        where: {
          name: {
            equals: mapping.listingName,
            mode: "insensitive",
          },
        },
      })

      // If not found by name and we have a slug, try by slug
      if (!listing && mapping.listingSlug) {
        listing = await prisma.listing.findUnique({
          where: { slug: mapping.listingSlug },
        })
      }

      if (!listing) {
        console.log(`❌ Not found: ${mapping.listingName}`)
        notFoundCount++
        continue
      }

      // Update the listing
      const updated = await prisma.listing.update({
        where: { id: listing.id },
        data: { image: mapping.image },
      })

      console.log(`✅ Updated: ${updated.name} -> ${mapping.image}`)
      updatedCount++
    } catch (error) {
      console.error(`❌ Error updating ${mapping.listingName}:`, error)
      notFoundCount++
    }
  }

  console.log(`\n✅ Successfully updated ${updatedCount} listings`)
  if (notFoundCount > 0) {
    console.log(`⚠️  ${notFoundCount} listings not found`)
  }
}

main()
  .catch((e) => {
    console.error("Error updating listings:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
