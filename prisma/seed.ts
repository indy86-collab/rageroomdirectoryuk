import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Sample rage rooms in the UK
  const listings = [
    {
      name: "Smash It London",
      description: "Experience the ultimate stress relief in the heart of London. Break, smash, and destroy in our fully equipped rage room.",
      city: "London",
      region: "London",
      postcode: "SW1A 1AA",
      location: { lat: 51.5074, lng: -0.1278 },
      website: "https://example.com/smash-it-london",
      phone: "+44 20 1234 5678",
      price: 35.0,
      verified: true,
    },
    {
      name: "Rage Room Newcastle",
      description: "Let off steam in Newcastle's premier rage room. Perfect for parties, team building, or just a fun day out.",
      city: "Newcastle",
      region: "North East",
      postcode: "NE1 7RU",
      location: { lat: 54.9783, lng: -1.6178 },
      website: "https://example.com/rage-room-newcastle",
      phone: "+44 191 234 5678",
      price: 30.0,
      verified: true,
    },
    {
      name: "Birmingham Break Room",
      description: "The Midlands' top destination for smashing and breaking. Book your session today!",
      city: "Birmingham",
      region: "West Midlands",
      postcode: "B1 1AA",
      location: { lat: 52.4862, lng: -1.8904 },
      website: "https://example.com/birmingham-break-room",
      phone: "+44 121 234 5678",
      price: 32.0,
      verified: true,
    },
    {
      name: "Manchester Smash House",
      description: "Release your inner rage in Manchester. Professional equipment and safety gear provided.",
      city: "Manchester",
      region: "North West",
      postcode: "M1 1AA",
      location: { lat: 53.4808, lng: -2.2426 },
      website: "https://example.com/manchester-smash-house",
      phone: "+44 161 234 5678",
      price: 33.0,
      verified: false,
    },
    {
      name: "Edinburgh Rage Room",
      description: "Scotland's premier rage room experience. Perfect for stress relief and fun activities.",
      city: "Edinburgh",
      region: "Scotland",
      postcode: "EH1 1AA",
      location: { lat: 55.9533, lng: -3.1883 },
      website: "https://example.com/edinburgh-rage-room",
      phone: "+44 131 234 5678",
      price: 34.0,
      verified: true,
    },
  ]

  for (const listing of listings) {
    const existing = await prisma.listing.findFirst({
      where: { name: listing.name },
    })

    if (!existing) {
      await prisma.listing.create({
        data: listing,
      })
    }
  }

  console.log(`Seeded ${listings.length} listings`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

