import { describe, expect, it } from "vitest"
import { buildLeadMagnetEmailHtml } from "@/lib/lead-magnet-email"

const downloadUrl =
  "https://www.rageroomdirectory.co.uk/download/lead-token-example"

describe("buildLeadMagnetEmailHtml", () => {
  it("keeps the download email transactional when marketing is not opted in", () => {
    const html = buildLeadMagnetEmailHtml({
      firstName: "Alex",
      downloadUrl,
      marketingOptIn: false,
    })

    expect(html).toContain("Hi Alex,")
    expect(html).toContain(downloadUrl)
    expect(html).toContain("Download Prep Pack (PDF)")
    expect(html).toContain("This email is transactional.")
    expect(html).not.toContain("Organising a group night?")
    expect(html).not.toContain("rage-room-party-planner-pack")
    expect(html).not.toContain("rage-room-gift-voucher-template-pack")
  })

  it("appends Party Planner and voucher offers only when marketing is opted in", () => {
    const html = buildLeadMagnetEmailHtml({
      firstName: "Sam",
      downloadUrl,
      marketingOptIn: true,
    })

    expect(html).toContain("Organising a group night?")
    expect(html).toContain("/digital-downloads/rage-room-party-planner-pack")
    expect(html).toContain(
      "/digital-downloads/rage-room-gift-voucher-template-pack"
    )
    expect(html).toContain("£5.60")
    expect(html).toContain("£4")
    expect(html).toContain("opted in to planning tips")
    expect(html).not.toContain("This email is transactional.")
  })

  it("escapes a hostile first name", () => {
    const html = buildLeadMagnetEmailHtml({
      firstName: `<img src=x onerror=alert(1)>`,
      downloadUrl,
      marketingOptIn: false,
    })

    expect(html).not.toContain("<img src=x")
    expect(html).toContain("&lt;img src=x")
  })
})
