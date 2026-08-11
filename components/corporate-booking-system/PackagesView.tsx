"use client"

import {
  calculateMinimumBooking,
  calculatePackageEconomics,
  createDefaultPackage,
  formatGbp,
  type VenueOwnerWorkspace,
} from "@/lib/corporate-booking-system"
import {
  btnSecondary,
  fieldClass,
  helpClass,
  labelClass,
  sectionClass,
} from "./fieldStyles"

export default function PackagesView({
  workspace,
  onChange,
}: {
  workspace: VenueOwnerWorkspace
  onChange: (workspace: VenueOwnerWorkspace) => void
}) {
  const economics = calculatePackageEconomics(workspace.economicsDraft)
  const minimum = calculateMinimumBooking({
    desiredMinimumRevenue:
      workspace.packages[0]?.minimumBookingValue ||
      workspace.economicsDraft.participants *
        workspace.economicsDraft.sellingPricePerPerson,
    groupSize: workspace.economicsDraft.participants,
    costEstimate: economics.estimatedVariableCosts,
    desiredMarginPercent: 40,
  })

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black uppercase tracking-wide text-white">
          Corporate packages
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Define 2–3 packages your venue actually offers. Economics below are
          estimates based on your inputs — not accounting advice.
        </p>
      </header>

      <div className="space-y-4">
        {workspace.packages.map((pkg, index) => (
          <div key={pkg.id} className={`${sectionClass} space-y-3`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-white">
                {pkg.tier.toUpperCase()} — {pkg.name}
              </h2>
              <button
                type="button"
                className={btnSecondary}
                onClick={() =>
                  onChange({
                    ...workspace,
                    packages: workspace.packages.filter((p) => p.id !== pkg.id),
                  })
                }
              >
                Remove
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className={labelClass}>Name</label>
                <input
                  className={fieldClass}
                  value={pkg.name}
                  onChange={(e) => {
                    const packages = [...workspace.packages]
                    packages[index] = { ...pkg, name: e.target.value }
                    onChange({ ...workspace, packages })
                  }}
                />
              </div>
              <div>
                <label className={labelClass}>Participants min</label>
                <input
                  type="number"
                  className={fieldClass}
                  value={pkg.participantMin ?? ""}
                  onChange={(e) => {
                    const packages = [...workspace.packages]
                    packages[index] = {
                      ...pkg,
                      participantMin: e.target.value
                        ? Number(e.target.value)
                        : null,
                    }
                    onChange({ ...workspace, packages })
                  }}
                />
              </div>
              <div>
                <label className={labelClass}>Participants max</label>
                <input
                  type="number"
                  className={fieldClass}
                  value={pkg.participantMax ?? ""}
                  onChange={(e) => {
                    const packages = [...workspace.packages]
                    packages[index] = {
                      ...pkg,
                      participantMax: e.target.value
                        ? Number(e.target.value)
                        : null,
                    }
                    onChange({ ...workspace, packages })
                  }}
                />
              </div>
              <div>
                <label className={labelClass}>Smash duration (mins)</label>
                <input
                  type="number"
                  className={fieldClass}
                  value={pkg.smashDurationMinutes ?? ""}
                  onChange={(e) => {
                    const packages = [...workspace.packages]
                    packages[index] = {
                      ...pkg,
                      smashDurationMinutes: e.target.value
                        ? Number(e.target.value)
                        : null,
                    }
                    onChange({ ...workspace, packages })
                  }}
                />
              </div>
              <div>
                <label className={labelClass}>Price per person (£)</label>
                <input
                  type="number"
                  className={fieldClass}
                  value={pkg.pricePerPerson ?? ""}
                  onChange={(e) => {
                    const packages = [...workspace.packages]
                    packages[index] = {
                      ...pkg,
                      pricePerPerson: e.target.value
                        ? Number(e.target.value)
                        : null,
                    }
                    onChange({ ...workspace, packages })
                  }}
                />
              </div>
              <div>
                <label className={labelClass}>Minimum booking (£)</label>
                <input
                  type="number"
                  className={fieldClass}
                  value={pkg.minimumBookingValue ?? ""}
                  onChange={(e) => {
                    const packages = [...workspace.packages]
                    packages[index] = {
                      ...pkg,
                      minimumBookingValue: e.target.value
                        ? Number(e.target.value)
                        : null,
                    }
                    onChange({ ...workspace, packages })
                  }}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Breakables / items</label>
              <input
                className={fieldClass}
                value={pkg.breakablesNote}
                onChange={(e) => {
                  const packages = [...workspace.packages]
                  packages[index] = { ...pkg, breakablesNote: e.target.value }
                  onChange({ ...workspace, packages })
                }}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Refreshments</label>
                <input
                  className={fieldClass}
                  value={pkg.refreshments}
                  onChange={(e) => {
                    const packages = [...workspace.packages]
                    packages[index] = { ...pkg, refreshments: e.target.value }
                    onChange({ ...workspace, packages })
                  }}
                />
              </div>
              <div>
                <label className={labelClass}>Photos / video</label>
                <input
                  className={fieldClass}
                  value={pkg.photosVideo}
                  onChange={(e) => {
                    const packages = [...workspace.packages]
                    packages[index] = { ...pkg, photosVideo: e.target.value }
                    onChange({ ...workspace, packages })
                  }}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-zinc-300">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={pkg.ppeIncluded}
                  onChange={(e) => {
                    const packages = [...workspace.packages]
                    packages[index] = { ...pkg, ppeIncluded: e.target.checked }
                    onChange({ ...workspace, packages })
                  }}
                />
                PPE included
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={pkg.exclusiveArea}
                  onChange={(e) => {
                    const packages = [...workspace.packages]
                    packages[index] = {
                      ...pkg,
                      exclusiveArea: e.target.checked,
                    }
                    onChange({ ...workspace, packages })
                  }}
                />
                Exclusive area
              </label>
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                className={fieldClass}
                rows={2}
                value={pkg.description}
                onChange={(e) => {
                  const packages = [...workspace.packages]
                  packages[index] = { ...pkg, description: e.target.value }
                  onChange({ ...workspace, packages })
                }}
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          className={btnSecondary}
          onClick={() =>
            onChange({
              ...workspace,
              packages: [...workspace.packages, createDefaultPackage("custom")],
            })
          }
        >
          Add package
        </button>
      </div>

      <section className={`${sectionClass} space-y-4`}>
        <h2 className="text-lg font-bold text-white">
          Package economics calculator
        </h2>
        <p className={helpClass}>{economics.disclaimer}</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(
            [
              ["participants", "Participants"],
              ["sellingPricePerPerson", "Selling price / person (£)"],
              ["breakablesCost", "Breakables / material (£)"],
              ["staffCost", "Staff cost (£)"],
              ["roomSessionCost", "Room / session cost (£)"],
              ["refreshmentsCost", "Refreshments (£)"],
              ["externalCosts", "External costs (£)"],
              ["paymentProcessingPercent", "Payment processing %"],
              ["otherCosts", "Other costs (£)"],
              ["sessionMinutes", "Session minutes"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <label className={labelClass}>{label}</label>
              <input
                type="number"
                className={fieldClass}
                value={workspace.economicsDraft[key]}
                onChange={(e) =>
                  onChange({
                    ...workspace,
                    economicsDraft: {
                      ...workspace.economicsDraft,
                      [key]: Number(e.target.value) || 0,
                    },
                  })
                }
              />
            </div>
          ))}
        </div>
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-xs uppercase text-zinc-500">Total revenue</dt>
            <dd className="text-xl font-bold text-white">
              {formatGbp(economics.totalRevenue)}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-zinc-500">
              Estimated variable costs
            </dt>
            <dd className="text-xl font-bold text-white">
              {formatGbp(economics.estimatedVariableCosts)}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-zinc-500">
              Estimated contribution
            </dt>
            <dd className="text-xl font-bold text-white">
              {formatGbp(economics.estimatedContribution)}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-zinc-500">Margin %</dt>
            <dd className="text-xl font-bold text-white">
              {economics.marginPercent}%
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-zinc-500">
              Revenue / participant
            </dt>
            <dd className="text-xl font-bold text-white">
              {formatGbp(economics.revenuePerParticipant)}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-zinc-500">Revenue / hour</dt>
            <dd className="text-xl font-bold text-white">
              {economics.revenuePerHour != null
                ? formatGbp(economics.revenuePerHour)
                : "—"}
            </dd>
          </div>
        </dl>
      </section>

      <section className={sectionClass}>
        <h2 className="text-lg font-bold text-white">
          Minimum booking calculator
        </h2>
        <p className={`mt-1 ${helpClass}`}>{minimum.disclaimer}</p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-3">
          <div>
            <dt className="text-xs uppercase text-zinc-500">
              From desired margin
            </dt>
            <dd className="text-lg font-bold text-white">
              {formatGbp(minimum.minimumRevenueFromMargin)}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-zinc-500">
              Recommended minimum
            </dt>
            <dd className="text-lg font-bold text-white">
              {formatGbp(minimum.recommendedMinimumRevenue)}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-zinc-500">
              £ / person at that minimum
            </dt>
            <dd className="text-lg font-bold text-white">
              {minimum.pricePerPersonForMinimum != null
                ? formatGbp(minimum.pricePerPersonForMinimum)
                : "—"}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  )
}
