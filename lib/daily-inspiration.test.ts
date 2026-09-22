import { describe, expect, it } from "vitest"
import { londonDateKey, pickDailyListings } from "@/lib/daily-inspiration"

const rooms = Array.from({ length: 12 }, (_, index) => ({ id: `room-${index}` }))

describe("pickDailyListings", () => {
  it("keeps the same mix through a UK day and changes on the next one", () => {
    const morning = pickDailyListings(rooms, 9, new Date("2026-09-22T08:00:00Z"))
    const evening = pickDailyListings(rooms, 9, new Date("2026-09-22T20:00:00Z"))
    const nextMorning = pickDailyListings(rooms, 9, new Date("2026-09-23T08:00:00Z"))

    expect(morning.map((room) => room.id)).toEqual(evening.map((room) => room.id))
    expect(morning.map((room) => room.id)).not.toEqual(nextMorning.map((room) => room.id))
    expect(new Set(morning.map((room) => room.id)).size).toBe(9)
  })

  it("uses the London date, including across midnight", () => {
    expect(londonDateKey(new Date("2026-09-22T22:30:00Z"))).toBe("2026-09-22")
    expect(londonDateKey(new Date("2026-09-22T23:30:00Z"))).toBe("2026-09-23")
  })

  it("returns the whole pool when fewer rooms exist than requested", () => {
    expect(pickDailyListings(rooms.slice(0, 3), 9)).toHaveLength(3)
    expect(pickDailyListings([], 9)).toEqual([])
  })
})
