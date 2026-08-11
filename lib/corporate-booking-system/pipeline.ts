import type {
  CorporateLead,
  DashboardStats,
  LeadStage,
  VenueOwnerWorkspace,
} from "./types"
import { LEAD_STAGES, OPEN_LEAD_STAGES } from "./types"
import { roundMoney } from "./money"

function todayIsoDate(now = new Date()) {
  return now.toISOString().slice(0, 10)
}

export function isFollowUpDue(lead: CorporateLead, now = new Date()) {
  if (!lead.nextFollowUpDate) return false
  if (lead.stage === "booked" || lead.stage === "lost") return false
  return lead.nextFollowUpDate <= todayIsoDate(now)
}

export function computeDashboardStats(
  workspace: VenueOwnerWorkspace,
  now = new Date()
): DashboardStats {
  const byStage = Object.fromEntries(
    LEAD_STAGES.map((stage) => [stage, 0])
  ) as Record<LeadStage, number>

  let openOpportunities = 0
  let pipelineValue = 0
  let quotesAwaitingResponse = 0
  let followUpsDue = 0
  let bookingsWon = 0
  let bookedValue = 0

  for (const lead of workspace.leads) {
    byStage[lead.stage] += 1
    const value = lead.estimatedValue ?? 0

    if (OPEN_LEAD_STAGES.includes(lead.stage)) {
      openOpportunities += 1
      pipelineValue += value
    }

    if (lead.stage === "quote_sent" || lead.stage === "follow_up") {
      quotesAwaitingResponse += 1
    }

    if (isFollowUpDue(lead, now)) {
      followUpsDue += 1
    }

    if (lead.stage === "booked") {
      bookingsWon += 1
      bookedValue += value
    }
  }

  const decided = bookingsWon + byStage.lost
  const conversionCount = bookingsWon

  return {
    openOpportunities,
    pipelineValue: roundMoney(pipelineValue),
    quotesAwaitingResponse,
    followUpsDue,
    bookingsWon,
    bookedValue: roundMoney(bookedValue),
    conversionCount: decided > 0 ? conversionCount : bookingsWon,
    byStage,
  }
}

export function followUpsDueToday(
  leads: CorporateLead[],
  now = new Date()
) {
  return leads
    .filter((lead) => isFollowUpDue(lead, now))
    .sort((a, b) => a.nextFollowUpDate.localeCompare(b.nextFollowUpDate))
}

export function quotesAwaiting(leads: CorporateLead[]) {
  return leads.filter(
    (lead) => lead.stage === "quote_sent" || lead.stage === "follow_up"
  )
}

export function upcomingBookedEvents(leads: CorporateLead[], now = new Date()) {
  const today = todayIsoDate(now)
  return leads
    .filter(
      (lead) =>
        lead.stage === "booked" &&
        lead.proposedDate &&
        lead.proposedDate >= today
    )
    .sort((a, b) => a.proposedDate.localeCompare(b.proposedDate))
}

export function recentlyWon(leads: CorporateLead[], limit = 5) {
  return [...leads]
    .filter((lead) => lead.stage === "booked")
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, limit)
}
