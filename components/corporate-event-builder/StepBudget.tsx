"use client"

import {
  defaultCategoriesFromTotal,
  deriveBudgetPerPerson,
  deriveTotalBudget,
  formatGbp,
  remainingContingency,
  sumCategories,
  type BudgetMode,
  type CorporateEvent,
} from "@/lib/corporate-event-builder"
import { fieldClass, helpClass, labelClass, sectionClass } from "./fieldStyles"

type StepBudgetProps = {
  event: CorporateEvent
  onChange: (patch: Partial<CorporateEvent>) => void
}

export default function StepBudget({ event, onChange }: StepBudgetProps) {
  const total = deriveTotalBudget({
    mode: event.budgetMode,
    totalBudget: event.totalBudget,
    budgetPerPerson: event.budgetPerPerson,
    attendeeCount: event.attendeeCount,
  })
  const perPerson = deriveBudgetPerPerson({
    mode: event.budgetMode,
    totalBudget: event.totalBudget,
    budgetPerPerson: event.budgetPerPerson,
    attendeeCount: event.attendeeCount,
  })
  const allocated = sumCategories(event.categories)
  const remaining = remainingContingency(total, {
    ...event.categories,
    contingency: 0,
  })

  function setMode(mode: BudgetMode) {
    if (mode === "total") {
      onChange({
        budgetMode: mode,
        totalBudget: total,
        categories: defaultCategoriesFromTotal(total),
      })
      return
    }
    onChange({
      budgetMode: mode,
      budgetPerPerson: perPerson || 50,
      categories: defaultCategoriesFromTotal(
        (perPerson || 50) * Math.max(event.attendeeCount, 1)
      ),
    })
  }

  function updateCategory(
    key: keyof CorporateEvent["categories"],
    value: number
  ) {
    onChange({
      categories: {
        ...event.categories,
        [key]: Math.max(0, value),
      },
    })
  }

  return (
    <div className="space-y-4">
      <div className={sectionClass}>
        <h2 className="text-lg font-bold text-white">Budget calculator</h2>
        <p className={helpClass}>
          Answer: can we realistically run this event within budget?
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {(
            [
              ["total", "Total budget"],
              ["per_person", "Budget per person"],
            ] as const
          ).map(([mode, label]) => (
            <button
              key={mode}
              type="button"
              onClick={() => setMode(mode)}
              className={`min-h-[40px] rounded-md border px-3 py-2 text-sm font-semibold ${
                event.budgetMode === mode
                  ? "border-rage-500 bg-rage-500/15 text-white"
                  : "border-zinc-700 text-zinc-300 hover:border-zinc-500"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {event.budgetMode === "total" ? (
            <div>
              <label className={labelClass} htmlFor="totalBudget">
                Total event budget (£)
              </label>
              <input
                id="totalBudget"
                type="number"
                inputMode="decimal"
                min={0}
                step="1"
                className={fieldClass}
                value={event.totalBudget || ""}
                onChange={(e) => {
                  const next = Math.max(0, Number(e.target.value) || 0)
                  onChange({
                    totalBudget: next,
                    categories: defaultCategoriesFromTotal(next),
                  })
                }}
              />
            </div>
          ) : (
            <div>
              <label className={labelClass} htmlFor="budgetPerPerson">
                Budget per person (£)
              </label>
              <input
                id="budgetPerPerson"
                type="number"
                inputMode="decimal"
                min={0}
                step="1"
                className={fieldClass}
                value={event.budgetPerPerson || ""}
                onChange={(e) => {
                  const next = Math.max(0, Number(e.target.value) || 0)
                  const nextTotal = next * Math.max(event.attendeeCount, 0)
                  onChange({
                    budgetPerPerson: next,
                    totalBudget: nextTotal,
                    categories: defaultCategoriesFromTotal(nextTotal),
                  })
                }}
              />
            </div>
          )}
          <div className="rounded-md border border-zinc-800 bg-[#121212] p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Snapshot
            </p>
            <p className="mt-2 text-sm text-zinc-200">
              Total: <span className="font-bold text-white">{formatGbp(total)}</span>
            </p>
            <p className="text-sm text-zinc-200">
              Per person:{" "}
              <span className="font-bold text-white">{formatGbp(perPerson)}</span>
            </p>
            <p className="text-sm text-zinc-200">
              Attendees:{" "}
              <span className="font-bold text-white">
                {event.attendeeCount || 0}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white">Category allocation</h2>
            <p className={helpClass}>Adjust the split to match your plan.</p>
          </div>
          <button
            type="button"
            className="text-sm font-semibold text-rage-500 hover:text-rage-400"
            onClick={() =>
              onChange({ categories: defaultCategoriesFromTotal(total) })
            }
          >
            Reset to suggested split
          </button>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {(
            [
              ["rageRoom", "Rage room allocation (£)"],
              ["foodDrinks", "Food / drinks allowance (£)"],
              ["travel", "Travel allowance (£)"],
              ["contingency", "Contingency (£)"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <label className={labelClass} htmlFor={key}>
                {label}
              </label>
              <input
                id={key}
                type="number"
                inputMode="decimal"
                min={0}
                step="1"
                className={fieldClass}
                value={event.categories[key] || ""}
                onChange={(e) =>
                  updateCategory(key, Number(e.target.value) || 0)
                }
              />
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-2 rounded-md border border-zinc-800 bg-[#121212] p-3 text-sm text-zinc-300 sm:grid-cols-3">
          <p>
            Allocated:{" "}
            <span className="font-semibold text-white">
              {formatGbp(allocated)}
            </span>
          </p>
          <p>
            Unallocated (before contingency field):{" "}
            <span className="font-semibold text-white">
              {formatGbp(remaining)}
            </span>
          </p>
          <p>
            vs total:{" "}
            <span
              className={`font-semibold ${
                Math.abs(allocated - total) < 0.01
                  ? "text-emerald-400"
                  : allocated > total
                    ? "text-amber-400"
                    : "text-white"
              }`}
            >
              {formatGbp(allocated - total)}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
