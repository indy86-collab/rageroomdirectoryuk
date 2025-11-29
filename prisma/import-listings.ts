import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Import data - parsed from the provided CSV/TSV
const listingsData = [
  {
    id: "499e08d6-513b-4f4b-9f79-6063a3bf319f",
    name: "Anger Issues Rage Rooms Ltd",
    description: "Experience the ultimate stress relief at Anger Issues Rage Rooms. A smash room facility perfect for birthdays, team building, and stress relief. Choose your playlist and enjoy a safe, controlled environment.",
    city: "Ellesmere Port",
    region: "",
    postcode: "CH65 4EL",
    location: { lat: 53.280088, lng: -2.8785678 },
    website: "http://www.angerissuesragerooms.com/",
    phone: "+44 7359 660808",
    price: null,
    image: "https://storage.googleapis.com/directorly-listings/1b00dd9a-7a25-45c0-8696-e15860b13687/ChIJm1TH_ZbfekgRxY8gYN91ruc/image-1764201106200-c8e629f0.jpg",
    verified: true,
  },
  {
    id: "07fd29e8-d86e-4261-8b4f-0f6736e0c1ff",
    name: "Anger Resolution (Anger Management)",
    description: "Professional anger management and smash room services. Learn effective tools for communicating and managing stress in a safe environment.",
    city: "Norwich",
    region: "",
    postcode: "NR2 1AX",
    location: { lat: 52.630328, lng: 1.293693 },
    website: "https://www.angerresolution.co.uk/",
    phone: "+44 1603 361591",
    price: null,
    image: "https://storage.googleapis.com/directorly-listings/1b00dd9a-7a25-45c0-8696-e15860b13687/ChIJ_fBWenESWEIRFnA2ILsIc7c/image-1764201106078-84d17214.jpg",
    verified: true,
  },
  {
    id: "6eede7dc-117a-4e28-a4b7-57c8e67e7696",
    name: "The Rage House",
    description: "Newcastle's premier rage room and smash room experience. Features axe throwing, airsoft, and rage room activities. Enjoy drinks, protective gear, and competitive fun.",
    city: "Newcastle",
    region: "",
    postcode: "ST5 1QQ",
    location: { lat: 53.0104977, lng: -2.2272964 },
    website: "https://www.theragehouse.com/",
    phone: "+44 1782 204392",
    price: null,
    image: "https://storage.googleapis.com/directorly-listings/1b00dd9a-7a25-45c0-8696-e15860b13687/ChIJ2R0ziCVDekgRCv7JBCT8k0w/image-1764201103388-e9545eb1.jpg",
    verified: true,
  },
  {
    id: "0ca388aa-95ca-4ec8-b4e1-f11221888369",
    name: "The Snake Room Urban Axe Throwing",
    description: "Urban axe throwing and rage room experience in Chesterfield. Perfect for birthdays, team events, and stress relief. Professional instructors and safety equipment provided.",
    city: "Chesterfield",
    region: "",
    postcode: "S41 9AQ",
    location: { lat: 53.2594909, lng: -1.4283515 },
    website: "https://snakeroom.co.uk/",
    phone: null,
    price: null,
    image: "https://storage.googleapis.com/directorly-listings/1b00dd9a-7a25-45c0-8696-e15860b13687/ChIJp8f9yISFeUgRxtoo5qRwsOc/image-1764201103602-d3464978.png",
    verified: true,
  },
  {
    id: "80e9743b-a900-46cc-9eec-dfae390ca0da",
    name: "The Smash Lab Wellingborough",
    description: "Wellingborough's premier rage room and smash room. Perfect for stress relief, team building, and fun activities. Features printers, bottles, screens, TVs, and more to smash.",
    city: "Wellingborough",
    region: "",
    postcode: "NN8 4LA",
    location: { lat: 52.301854, lng: -0.6949674 },
    website: "https://thesmashlab.co.uk/",
    phone: "+44 7563 862095",
    price: null,
    image: "https://storage.googleapis.com/directorly-listings/1b00dd9a-7a25-45c0-8696-e15860b13687/ChIJdW4I0wWhd0gRk5_9ilgVaOE/image-1764201103368-0246c11d.jpg",
    verified: true,
  },
  {
    id: "9675e2e1-a84a-41c5-9171-13503af3c4d5",
    name: "The Activity Dome",
    description: "Weston-super-Mare's top rage room experience. Features axe throwing, archery, and rage room activities. Perfect for birthdays, team building, and stress relief with music and fun activities.",
    city: "Weston-super-Mare",
    region: "",
    postcode: "BS23 1QF",
    location: { lat: 51.3492201, lng: -2.978185 },
    website: "http://www.theactivitydome.com/",
    phone: "+44 1934 707150",
    price: null,
    image: "https://storage.googleapis.com/directorly-listings/1b00dd9a-7a25-45c0-8696-e15860b13687/ChIJX6iq6OH5cUgReHLJUqtGY_k/image-1764201103382-c837610a.jpg",
    verified: true,
  },
  {
    id: "e102773e-b449-4022-8ee5-c37fca15f7c3",
    name: "The British Association of Anger Management",
    description: "Professional anger management services with smash room facilities. Learn life skills, tools, and techniques for managing anger and stress. Therapy and counselling services available.",
    city: "East Grinstead",
    region: "",
    postcode: "RH19 1BP",
    location: { lat: 51.1263824, lng: -0.0111311 },
    website: "https://www.angermanage.co.uk/",
    phone: "+44 345 130 0286",
    price: null,
    image: "https://storage.googleapis.com/directorly-listings/1b00dd9a-7a25-45c0-8696-e15860b13687/ChIJSYaiciEFdkgRfzFgQV8jL_k/image-1764201103394-cc4a8dd2.jpg",
    verified: true,
  },
  {
    id: "cf7c8d69-4b25-41fd-bd95-3c2b0ad32690",
    name: "Rage Out Maidstone",
    description: "Maidstone's premier rage room and smash room experience. Features axe throwing, stress relief activities, playlists, TVs, and PPE equipment. Perfect for fun, stress relief, and team building.",
    city: "Maidstone",
    region: "",
    postcode: "ME14 1SD",
    location: { lat: 51.2733024, lng: 0.5221992 },
    website: "http://rageout.co.uk/",
    phone: "+44 1622 925107",
    price: null,
    image: "https://storage.googleapis.com/directorly-listings/1b00dd9a-7a25-45c0-8696-e15860b13687/ChIJed-gzPYz30cRp21dAOqbSSU/image-1764201100621-911fefe1.jpg",
    verified: true,
  },
  {
    id: "1d35e4d5-4f6a-4c10-b6b3-5c1cd4ef24c3",
    name: "Angry Smash Ltd",
    description: "Southend-on-Sea's top rage room experience. Perfect for birthdays, stress relief, and fun. Features weapons, music, steam, and a variety of items to smash. Great for letting off steam.",
    city: "Southend-on-Sea",
    region: "",
    postcode: "SS3 9QE",
    location: { lat: 51.5316935, lng: 0.7859498 },
    website: "https://www.angrysmash.com/",
    phone: "+44 7555 114479",
    price: null,
    image: "https://storage.googleapis.com/directorly-listings/1b00dd9a-7a25-45c0-8696-e15860b13687/ChIJqUa12rjZ2EcRkS_r2k9xs78/image-1764201100630-511d7706.jpg",
    verified: true,
  },
  {
    id: "258cf31a-ba0d-4769-bc70-aa17bed67157",
    name: "Rage Remedy",
    description: "Margate's rage room experience. Perfect for birthdays, stress relief, and fun. Features choice of items, playlists, footage recording, and water activities for a complete rage room experience.",
    city: "Margate",
    region: "",
    postcode: "CT9 4JG",
    location: { lat: 51.368656, lng: 1.387788 },
    website: "https://www.rageremedy.co.uk/",
    phone: "+44 7543 407032",
    price: null,
    image: "https://storage.googleapis.com/directorly-listings/1b00dd9a-7a25-45c0-8696-e15860b13687/ChIJfzbn6IlT2UcREyPq4NM6nb0/image-1764201098081-c9e5a939.jpg",
    verified: true,
  },
  {
    id: "46313bec-d877-46ae-8cdb-5ca4e4a239c5",
    name: "Weston Rage Rooms",
    description: "Weston-super-Mare's rage room and smash room facility. Features music, 30-minute sessions, weapons, speakers, PPE, printers, and TVs. Perfect for birthdays, team building, and stress relief.",
    city: "Weston-super-Mare",
    region: "",
    postcode: "BS23 1QF",
    location: { lat: 51.3492201, lng: -2.978185 },
    website: "https://theactivitydome.com/",
    phone: "+44 1934 707150",
    price: null,
    image: "https://storage.googleapis.com/directorly-listings/1b00dd9a-7a25-45c0-8696-e15860b13687/ChIJP-Y-6Nz5cUgR8RhjUGkdZaU/image-1764201098064-15e13551.jpg",
    verified: true,
  },
  {
    id: "ba70cd2a-780d-4081-ba5b-113a31da0512",
    name: "Urban Xtreme Colchester",
    description: "Colchester's premier rage room and smash room experience. Features rage room activities, axe throwing, knife throwing, music, retro gaming, stress relief, weapons, and professional instructors with safety equipment.",
    city: "Colchester",
    region: "",
    postcode: "CO1 1UU",
    location: { lat: 51.8971248, lng: 0.8927616 },
    website: "http://www.urbanxtreme.co.uk/",
    phone: "+44 1206 577974",
    price: null,
    image: "https://storage.googleapis.com/directorly-listings/1b00dd9a-7a25-45c0-8696-e15860b13687/ChIJAWc27UkF2UcRDLBMWoV60xk/image-1764201098104-0da7c756.jpg",
    verified: true,
  },
  {
    id: "d7a87e3b-5afc-40fc-b819-a3728cc29ee8",
    name: "Rage cage ltd",
    description: "Braintree's rage room and smash room facility. Features music, birthday packages, choice of items, fun activities, safety equipment, and sessions for both adults and kids.",
    city: "Braintree",
    region: "",
    postcode: "CM7 2YN",
    location: { lat: 51.8877239, lng: 0.5384545 },
    website: "http://www.ragecage.uk/",
    phone: "+44 7598 120662",
    price: null,
    image: "https://storage.googleapis.com/directorly-listings/1b00dd9a-7a25-45c0-8696-e15860b13687/ChIJL61rXqvx2EcR1fo8nfbJS8k/image-1764201094976-19fa1c98.jpg",
    verified: true,
  },
  {
    id: "3f887440-4920-4d23-9260-de599f094245",
    name: "Destroy'd Rage Rooms",
    description: "Northampton's rage room and smash room experience. Features printers, monitors, glass bottles, birthday packages, games, PPE, music, and boxing bags. Perfect for catharsis and stress relief.",
    city: "Northampton",
    region: "",
    postcode: "NN3 9DA",
    location: { lat: 52.2458281, lng: -0.8168655 },
    website: "https://trappd.com/what-is-destroyd/",
    phone: "+44 1604 379812",
    price: null,
    image: "https://storage.googleapis.com/directorly-listings/1b00dd9a-7a25-45c0-8696-e15860b13687/ChIJXfnJ29IJd0gRqIRKvqRHTFs/image-1764201094786-d52a9ce9.jpg",
    verified: true,
  },
  {
    id: "93667b86-efd4-4378-ac72-3b01838dfe01",
    name: "Smash It Rage Room Ltd",
    description: "London's premier rage room and smash room experience. Perfect for anger management, stress relief, and fun. Features steam, speakers, silver items, bottles of water, and frustration relief activities.",
    city: "London",
    region: "",
    postcode: "SE9 3BA",
    location: { lat: 51.4295873, lng: 0.0567488 },
    website: "http://smashitragerooms.co.uk/",
    phone: "+44 7359 207511",
    price: null,
    image: "https://storage.googleapis.com/directorly-listings/1b00dd9a-7a25-45c0-8696-e15860b13687/ChIJO4RR4D6r2EcRd-t7UC_2sts/image-1764201094922-5975ea39.jpg",
    verified: true,
  },
  {
    id: "a281abae-cd80-4c2a-996b-2c8aee5825fd",
    name: "Smash Space UK",
    description: "Newcastle upon Tyne's rage room and smash room facility. Features escape room activities, rage room experiences, TVs, helmets, birthday packages, and fun activities for stress relief and entertainment.",
    city: "Newcastle upon Tyne",
    region: "",
    postcode: "NE4 7JE",
    location: { lat: 54.9665854, lng: -1.6231805 },
    website: "https://www.smashspace.co.uk/",
    phone: "+44 330 229 4425",
    price: null,
    image: "https://storage.googleapis.com/directorly-listings/1b00dd9a-7a25-45c0-8696-e15860b13687/ChIJ2YzKCzx3fkgRpzDhVtmild8/image-1764201094888-d53dc744.jpg",
    verified: true,
  },
  {
    id: "20d7f17c-defe-405c-97e4-642d556b5860",
    name: "Rage Room Birmingham",
    description: "Birmingham's rage room and smash room experience. Perfect for anger management, stress relief, birthdays, and fun. Features sound systems, TVs, gloves, glasses, and golf equipment for a complete experience.",
    city: "Birmingham",
    region: "",
    postcode: "B12 0SH",
    location: { lat: 52.4702455, lng: -1.8882267 },
    website: "http://www.rageroombirmingham.co.uk/",
    phone: "+44 7448 349934",
    price: null,
    image: "https://storage.googleapis.com/directorly-listings/1b00dd9a-7a25-45c0-8696-e15860b13687/ChIJ99mUxxK9cEgRwmeXlvBHYZQ/image-1764201092030-e2ee5519.jpg",
    verified: true,
  },
  {
    id: "3402ac80-5163-467f-ad88-bc16ec1a8955",
    name: "Go Rage - Birmingham Rage Room",
    description: "Birmingham's rage room and smash room facility. Features plates, Bluetooth speakers, monitors, 30-minute sessions, paintball guns, spray paint, and glass bottles. Perfect for anger management and stress relief.",
    city: "Birmingham",
    region: "",
    postcode: "B8 2BB",
    location: { lat: 52.494865, lng: -1.8341767 },
    website: "https://www.gorageuk.com/",
    phone: "+44 7521 482101",
    price: null,
    image: "https://storage.googleapis.com/directorly-listings/1b00dd9a-7a25-45c0-8696-e15860b13687/ChIJ1Szj-wS7cEgRjij1NCeNXIY/image-1764201091929-d81e2889.jpg",
    verified: true,
  },
]

async function main() {
  console.log("Importing listings data...")

  let created = 0
  let updated = 0
  let skipped = 0

  for (const listingData of listingsData) {
    try {
      const existing = await prisma.listing.findUnique({
        where: { id: listingData.id },
      })

      if (existing) {
        await prisma.listing.update({
          where: { id: listingData.id },
          data: listingData,
        })
        updated++
        console.log(`Updated: ${listingData.name}`)
      } else {
        await prisma.listing.create({
          data: listingData,
        })
        created++
        console.log(`Created: ${listingData.name}`)
      }
    } catch (error) {
      console.error(`Error processing ${listingData.name}:`, error)
      skipped++
    }
  }

  console.log("\nImport complete!")
  console.log(`Created: ${created}`)
  console.log(`Updated: ${updated}`)
  console.log(`Skipped: ${skipped}`)
  console.log(`Total processed: ${listingsData.length}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })



