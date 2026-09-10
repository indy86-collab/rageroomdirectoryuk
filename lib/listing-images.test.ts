import fs from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"
import listingsData from "@/data/listings.json"
import { getAuthorisedListingImage, getListingDisplayImage } from "@/lib/listing-quality"
import type { Listing } from "@/types/listing"

describe("listing cover images", () => {
  it("gives every listing a cover image", () => {
    const imageLessSlugs = listingsData
      .filter((listing) => !listing.image)
      .map((listing) => listing.slug)
      .sort()

    expect(imageLessSlugs).toEqual([])
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

  it("uses the legacy venue cover for display when no authorised media image exists", () => {
    const listing = listingsData[0] as Listing

    expect(getAuthorisedListingImage(listing)).toBeNull()
    expect(getListingDisplayImage(listing)).toBe(listing.image)
  })

  it("prefers an authorised media image over the legacy cover", () => {
    const listing = {
      ...listingsData[0],
      media: [{
        type: "image",
        url: "/images/authorised.jpg",
        alt: "Venue photo",
        authorised: true,
      }],
    } as Listing

    expect(getListingDisplayImage(listing)).toBe("/images/authorised.jpg")
  })
})
