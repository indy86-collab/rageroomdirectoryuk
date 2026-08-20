import fs from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"
import listingsData from "@/data/listings.json"

const intentionallyImageLessSlugs = [
  "timberjacks-kidderminster",
  "timberjacks-leeds",
  "timberjacks-liverpool",
  "timberjacks-shrewsbury",
  "whistle-punks-bristol",
  "whistle-punks-leeds",
  "whistle-punks-london",
  "whistle-punks-manchester",
]

describe("listing cover images", () => {
  it("keeps only the compromised-domain listings image-less", () => {
    const imageLessSlugs = listingsData
      .filter((listing) => !listing.image)
      .map((listing) => listing.slug)
      .sort()

    expect(imageLessSlugs).toEqual(intentionallyImageLessSlugs)
  })

  it("has a public file for every local listing cover", () => {
    const missingFiles = listingsData
      .filter((listing) => listing.image?.startsWith("/"))
      .filter((listing) =>
        !fs.existsSync(path.join(process.cwd(), "public", listing.image as string))
      )
      .map((listing) => listing.slug)

    expect(missingFiles).toEqual([])
  })
})
