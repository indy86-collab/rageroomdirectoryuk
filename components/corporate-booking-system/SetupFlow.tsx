"use client"

import { useState } from "react"
import {
  createDefaultPackage,
  isVenueProfileReady,
  prefillVenueFromListing,
  type VenueOwnerWorkspace,
} from "@/lib/corporate-booking-system"
import { fetchDirectoryListing, searchDirectoryVenues } from "./api"
import {
  btnPrimary,
  btnSecondary,
  fieldClass,
  helpClass,
  labelClass,
  sectionClass,
} from "./fieldStyles"

type SetupFlowProps = {
  accessToken: string
  workspace: VenueOwnerWorkspace
  onChange: (workspace: VenueOwnerWorkspace) => void
  onComplete: () => void
}

export default function SetupFlow({
  accessToken,
  workspace,
  onChange,
  onComplete,
}: SetupFlowProps) {
  const step = Math.min(4, Math.max(1, workspace.setupStep || 1))
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<
    Awaited<ReturnType<typeof searchDirectoryVenues>>
  >([])
  const [searching, setSearching] = useState(false)

  function patchVenue(patch: Partial<VenueOwnerWorkspace["venue"]>) {
    onChange({
      ...workspace,
      venue: { ...workspace.venue, ...patch },
    })
  }

  async function runSearch() {
    setSearching(true)
    try {
      setResults(await searchDirectoryVenues(accessToken, query.trim()))
    } catch {
      setResults([])
    } finally {
      setSearching(false)
    }
  }

  async function selectListing(listingId: string) {
    try {
      const listing = await fetchDirectoryListing(accessToken, listingId)
      onChange({
        ...workspace,
        venue: prefillVenueFromListing(workspace.venue, listing),
      })
    } catch {
      // ignore — operator can fill manually
    }
  }

  function goNext() {
    if (step >= 4) {
      onComplete()
      return
    }
    onChange({ ...workspace, setupStep: step + 1 })
  }

  function goBack() {
    onChange({ ...workspace, setupStep: Math.max(1, step - 1) })
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <header>
        <p className="text-sm font-bold uppercase tracking-widest text-rage-500">
          First-run setup
        </p>
        <h1 className="mt-2 text-3xl font-black uppercase tracking-wide text-white">
          {step === 1 && "Your Venue"}
          {step === 2 && "Build Your Corporate Package"}
          {step === 3 && "Set Your Pricing"}
          {step === 4 && "Your Corporate Booking System Is Ready"}
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Step {step} of 4 — you can edit everything later from Settings.
        </p>
      </header>

      {step === 1 && (
        <div className={`${sectionClass} space-y-4`}>
          <div>
            <label className={labelClass}>Find your listing (optional)</label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                className={fieldClass}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search RageRoom Directory by name or city"
              />
              <button
                type="button"
                className={btnSecondary}
                onClick={runSearch}
                disabled={searching}
              >
                {searching ? "Searching…" : "Search"}
              </button>
            </div>
            <p className={helpClass}>
              Prefills public directory details. Does not change your listing.
            </p>
            {results.length > 0 && (
              <ul className="mt-3 space-y-2">
                {results.map((venue) => (
                  <li key={venue.id}>
                    <button
                      type="button"
                      className="w-full rounded-md border border-zinc-800 px-3 py-2 text-left text-sm hover:border-zinc-600"
                      onClick={() => selectListing(venue.id)}
                    >
                      <span className="font-semibold text-white">
                        {venue.name}
                      </span>
                      <span className="ml-2 text-zinc-500">{venue.city}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {(
            [
              ["businessName", "Venue / business name"],
              ["city", "City / location"],
              ["website", "Website"],
              ["contactEmail", "Contact email"],
              ["telephone", "Telephone"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <label className={labelClass}>{label}</label>
              <input
                className={fieldClass}
                value={workspace.venue[key]}
                onChange={(e) => patchVenue({ [key]: e.target.value })}
              />
            </div>
          ))}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Maximum group size</label>
              <input
                type="number"
                className={fieldClass}
                value={workspace.venue.maxGroupSize ?? ""}
                onChange={(e) =>
                  patchVenue({
                    maxGroupSize: e.target.value
                      ? Number(e.target.value)
                      : null,
                  })
                }
              />
            </div>
            <div>
              <label className={labelClass}>Typical session (minutes)</label>
              <input
                type="number"
                className={fieldClass}
                value={workspace.venue.typicalSessionMinutes ?? ""}
                onChange={(e) =>
                  patchVenue({
                    typicalSessionMinutes: e.target.value
                      ? Number(e.target.value)
                      : null,
                  })
                }
              />
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          {workspace.packages.slice(0, 3).map((pkg, index) => (
            <div key={pkg.id} className={`${sectionClass} space-y-3`}>
              <h2 className="text-lg font-bold text-white">{pkg.name}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Package name</label>
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
              </div>
              <div>
                <label className={labelClass}>Included breakables / items</label>
                <input
                  className={fieldClass}
                  value={pkg.breakablesNote}
                  onChange={(e) => {
                    const packages = [...workspace.packages]
                    packages[index] = {
                      ...pkg,
                      breakablesNote: e.target.value,
                    }
                    onChange({ ...workspace, packages })
                  }}
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={pkg.ppeIncluded}
                  onChange={(e) => {
                    const packages = [...workspace.packages]
                    packages[index] = {
                      ...pkg,
                      ppeIncluded: e.target.checked,
                    }
                    onChange({ ...workspace, packages })
                  }}
                />
                PPE included
              </label>
              <label className="flex items-center gap-2 text-sm text-zinc-300">
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
                Exclusive / private area
              </label>
            </div>
          ))}
          {workspace.packages.length < 3 && (
            <button
              type="button"
              className={btnSecondary}
              onClick={() =>
                onChange({
                  ...workspace,
                  packages: [
                    ...workspace.packages,
                    createDefaultPackage("custom"),
                  ],
                })
              }
            >
              Add another package
            </button>
          )}
        </div>
      )}

      {step === 3 && (
        <div className={`${sectionClass} space-y-4`}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Public starting price (£)</label>
              <input
                type="number"
                className={fieldClass}
                value={workspace.venue.publicStartingPrice ?? ""}
                onChange={(e) =>
                  patchVenue({
                    publicStartingPrice: e.target.value
                      ? Number(e.target.value)
                      : null,
                  })
                }
              />
            </div>
            <div>
              <label className={labelClass}>
                Typical corporate / group price (£)
              </label>
              <input
                type="number"
                className={fieldClass}
                value={workspace.venue.typicalCorporatePrice ?? ""}
                onChange={(e) =>
                  patchVenue({
                    typicalCorporatePrice: e.target.value
                      ? Number(e.target.value)
                      : null,
                  })
                }
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>VAT registered?</label>
            <select
              className={fieldClass}
              value={
                workspace.venue.vatRegistered == null
                  ? ""
                  : workspace.venue.vatRegistered
                    ? "yes"
                    : "no"
              }
              onChange={(e) =>
                patchVenue({
                  vatRegistered:
                    e.target.value === ""
                      ? null
                      : e.target.value === "yes",
                })
              }
            >
              <option value="">Not set</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          {workspace.packages.map((pkg, index) => (
            <div key={pkg.id} className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass}>{pkg.name} — £ / person</label>
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
                <label className={labelClass}>Minimum booking value (£)</label>
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
          ))}
          <div>
            <label className={labelClass}>Deposit policy</label>
            <textarea
              className={fieldClass}
              rows={2}
              value={workspace.venue.depositPolicy}
              onChange={(e) => patchVenue({ depositPolicy: e.target.value })}
              placeholder="e.g. 25% deposit to confirm the booking"
            />
          </div>
        </div>
      )}

      {step === 4 && (
        <div className={sectionClass}>
          <p className="text-zinc-300">
            You can now respond to enquiries, build quotes, send proposals and
            track corporate opportunities from one workspace.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-zinc-400">
            <li>• Venue: {workspace.venue.businessName || "Not set yet"}</li>
            <li>• Packages: {workspace.packages.length}</li>
            <li>• Pipeline starts empty — add your first lead when ready</li>
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {step > 1 && (
          <button type="button" className={btnSecondary} onClick={goBack}>
            Back
          </button>
        )}
        <button
          type="button"
          className={btnPrimary}
          onClick={goNext}
          disabled={step === 1 && !isVenueProfileReady(workspace.venue)}
        >
          {step === 4 ? "Open dashboard" : "Continue"}
        </button>
      </div>
    </div>
  )
}
