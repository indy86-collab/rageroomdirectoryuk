import type { ScheduleItem } from "./types"

function addMinutesToTime(time: string, minutes: number): string {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim())
  if (!match) return time
  const hours = Number(match[1])
  const mins = Number(match[2])
  if (!Number.isFinite(hours) || !Number.isFinite(mins)) return time
  const total = hours * 60 + mins + minutes
  const wrapped = ((total % (24 * 60)) + 24 * 60) % (24 * 60)
  const h = Math.floor(wrapped / 60)
  const m = wrapped % 60
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
}

export function defaultSchedule(startTime: string): ScheduleItem[] {
  const start = /^\d{1,2}:\d{2}$/.test(startTime.trim())
    ? startTime.trim()
    : "16:00"
  const arrive = addMinutesToTime(start, -15)

  return [
    {
      id: "arrive",
      time: arrive,
      label: "Team arrives",
      estimated: true,
    },
    {
      id: "check-in",
      time: start,
      label: "Venue check-in",
      estimated: true,
    },
    {
      id: "briefing",
      time: addMinutesToTime(start, 10),
      label: "Safety briefing / PPE (confirm with venue)",
      estimated: true,
    },
    {
      id: "activity",
      time: addMinutesToTime(start, 20),
      label: "Rage room activity (confirm session length with venue)",
      estimated: true,
    },
    {
      id: "ends",
      time: addMinutesToTime(start, 75),
      label: "Session ends (estimated)",
      estimated: true,
    },
    {
      id: "after",
      time: addMinutesToTime(start, 90),
      label: "Optional food / drinks nearby",
      estimated: true,
    },
  ]
}

export function formatScheduleLines(schedule: ScheduleItem[]) {
  return schedule
    .filter((item) => item.time.trim() || item.label.trim())
    .map((item) => {
      const suffix = item.estimated ? " (estimated)" : ""
      return `${item.time || "TBC"} – ${item.label}${suffix}`
    })
    .join("\n")
}
