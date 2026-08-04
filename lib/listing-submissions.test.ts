import { describe, expect, it, vi } from "vitest"
import { processListingSubmission } from "@/lib/listing-submission-service"
import { escapeEmailHtml, parseListingSubmission } from "@/lib/listing-submissions"

const validSubmission = {
  requestType: "claim",
  listingSlug: "example-venue-london",
  businessName: "Example Venue",
  contactName: "Alex Owner",
  workEmail: "alex@example.com",
  website: "https://example.com",
  bookingUrl: "https://example.com/book",
  city: "London",
  postcode: "SW1A 1AA",
  sessionLengths: "15, 30",
  groupSizeMin: "1",
  groupSizeMax: "6",
  features: ["couples", "corporate-groups"],
  mediaUrls: "https://example.com/photo.jpg",
  sourceUrls: "https://example.com/prices",
  consent: true,
  websiteUrl: "",
}

describe("listing submission validation", () => {
  it("normalises a valid reviewed submission", () => {
    const result = parseListingSubmission(validSubmission)
    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.data.sessionLengths).toEqual([15, 30])
    expect(result.data.features).toEqual(["couples", "corporate-groups"])
    expect(result.data.mediaUrls).toEqual(["https://example.com/photo.jpg"])
  })

  it("rejects missing consent, invalid URLs and honeypot traffic", () => {
    const invalid = parseListingSubmission({
      ...validSubmission,
      consent: false,
      bookingUrl: "javascript:alert(1)",
    })
    expect(invalid.success).toBe(false)
    if (!invalid.success) {
      expect(invalid.errors).toContain("Consent is required before we can review the submission")
      expect(invalid.errors).toContain("Booking link must be a valid http(s) URL")
    }
    expect(
      parseListingSubmission({ ...validSubmission, websiteUrl: "spam" }).success
    ).toBe(false)
  })

  it("escapes operator content before building editorial email HTML", () => {
    expect(escapeEmailHtml(`<img src=x onerror="bad">`)).toBe(
      "&lt;img src=x onerror=&quot;bad&quot;&gt;"
    )
  })
})

describe("listing submission service", () => {
  it("returns success only after the editorial email succeeds", async () => {
    const send = vi.fn().mockResolvedValue({ sent: true })
    const result = await processListingSubmission({
      input: validSubmission,
      ip: "192.0.2.1",
      now: 1_000_000,
      recentByIp: new Map(),
      send,
    })
    expect(result.status).toBe(200)
    expect(send).toHaveBeenCalledOnce()
  })

  it("unlocks the rate limit when email delivery fails", async () => {
    const recent = new Map<string, number>()
    const result = await processListingSubmission({
      input: validSubmission,
      ip: "192.0.2.2",
      now: 1_000_000,
      recentByIp: recent,
      send: vi.fn().mockResolvedValue({ sent: false }),
    })
    expect(result.status).toBe(503)
    expect(recent.has("192.0.2.2")).toBe(false)
  })

  it("rate limits repeated successful submissions", async () => {
    const recent = new Map([["192.0.2.3", 1_000_000]])
    const result = await processListingSubmission({
      input: validSubmission,
      ip: "192.0.2.3",
      now: 1_000_100,
      recentByIp: recent,
      send: vi.fn().mockResolvedValue({ sent: true }),
    })
    expect(result.status).toBe(429)
  })
})
