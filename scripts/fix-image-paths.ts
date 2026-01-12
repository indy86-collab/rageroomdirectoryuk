import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Fixing image paths for listings with spaces in filenames...\n")

  // Fix The Rage Room NI
  const rageRoomNI = await prisma.listing.findFirst({
    where: {
      name: {
        equals: "The Rage Room NI",
        mode: "insensitive",
      },
    },
  })

  if (rageRoomNI) {
    await prisma.listing.update({
      where: { id: rageRoomNI.id },
      data: { image: "/images/TheRageRoomNIPortadown.png" },
    })
    console.log(`✅ Updated: The Rage Room NI -> /images/TheRageRoomNIPortadown.png`)
  } else {
    console.log(`❌ Not found: The Rage Room NI`)
  }

  // Fix The Smash Factory
  const smashFactory = await prisma.listing.findFirst({
    where: {
      name: {
        equals: "The Smash Factory",
        mode: "insensitive",
      },
    },
  })

  if (smashFactory) {
    await prisma.listing.update({
      where: { id: smashFactory.id },
      data: { image: "/images/TheSmashFactoryColeraine.png" },
    })
    console.log(`✅ Updated: The Smash Factory -> /images/TheSmashFactoryColeraine.png`)
  } else {
    console.log(`❌ Not found: The Smash Factory`)
  }

  console.log("\n✅ Done!")
}

main()
  .catch((e) => {
    console.error("Error updating listings:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
