"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import {
  trackCorporateBookingSystemSetupStarted,
  trackCorporatePackageCreated,
} from "@/lib/analytics"
import type {
  AppView,
  VenueOwnerWorkspace,
} from "@/lib/corporate-booking-system"
import { fetchWorkspace, saveWorkspaceRemote } from "./api"
import DashboardView from "./DashboardView"
import MessagesView from "./MessagesView"
import PackagesView from "./PackagesView"
import PipelineView from "./PipelineView"
import QuoteProposalView from "./QuoteProposalView"
import SetupFlow from "./SetupFlow"
import ToolsView from "./ToolsView"

const NAV: { id: AppView; label: string; desktopOnly?: boolean }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "pipeline", label: "Pipeline" },
  { id: "packages", label: "Packages" },
  { id: "quote", label: "Quote" },
  { id: "proposal", label: "Proposal", desktopOnly: true },
  { id: "messages", label: "Messages" },
  { id: "tools", label: "Tools" },
  { id: "settings", label: "Settings" },
]

type CorporateBookingSystemProps = {
  accessToken: string
  productName: string
  initialWorkspace: VenueOwnerWorkspace
}

export default function CorporateBookingSystem({
  accessToken,
  productName,
  initialWorkspace,
}: CorporateBookingSystemProps) {
  const [workspace, setWorkspace] =
    useState<VenueOwnerWorkspace>(initialWorkspace)
  const [view, setView] = useState<AppView>(
    initialWorkspace.setupCompleted ? "dashboard" : "setup"
  )
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  )
  const [error, setError] = useState<string | null>(null)
  const [, startTransition] = useTransition()
  const hydrated = useRef(false)
  const setupTracked = useRef(false)
  const packageCountRef = useRef(initialWorkspace.packages.length)
  const saveTimer = useRef<number | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const remote = await fetchWorkspace(accessToken)
        if (!cancelled) {
          setWorkspace(remote)
          if (!remote.setupCompleted) setView("setup")
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load workspace")
        }
      } finally {
        hydrated.current = true
      }
    })()
    return () => {
      cancelled = true
    }
  }, [accessToken])

  useEffect(() => {
    if (!hydrated.current) return
    if (view === "setup" && !setupTracked.current) {
      setupTracked.current = true
      trackCorporateBookingSystemSetupStarted()
    }
  }, [view])

  useEffect(() => {
    if (!hydrated.current) return
    if (workspace.packages.length > packageCountRef.current) {
      trackCorporatePackageCreated()
    }
    packageCountRef.current = workspace.packages.length
  }, [workspace.packages.length])

  useEffect(() => {
    if (!hydrated.current) return
    if (saveTimer.current) window.clearTimeout(saveTimer.current)
    saveTimer.current = window.setTimeout(() => {
      setSaveState("saving")
      saveWorkspaceRemote(accessToken, workspace)
        .then(() => setSaveState("saved"))
        .catch(() => setSaveState("error"))
    }, 500)
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current)
    }
  }, [accessToken, workspace])

  function patchWorkspace(next: VenueOwnerWorkspace) {
    startTransition(() => setWorkspace(next))
  }

  function completeSetup() {
    patchWorkspace({
      ...workspace,
      setupCompleted: true,
      setupStep: 4,
    })
    setView("dashboard")
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="border-b border-zinc-800 bg-[#121212] print:hidden">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-rage-500">
              {productName}
            </p>
            <p className="text-sm text-zinc-500">
              {saveState === "saving"
                ? "Saving…"
                : saveState === "saved"
                  ? "Saved to your workspace"
                  : saveState === "error"
                    ? "Save failed — retry by editing again"
                    : "Server-backed workspace"}
            </p>
          </div>
          {workspace.setupCompleted && (
            <nav className="flex gap-1 overflow-x-auto pb-1">
              {NAV.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setView(item.id)}
                  className={`min-h-[36px] whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${
                    view === item.id
                      ? "bg-rage-500/20 text-white"
                      : "text-zinc-500 hover:text-zinc-200"
                  } ${item.desktopOnly ? "hidden sm:inline-flex" : ""}`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        {error && (
          <p className="mb-4 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        )}

        {view === "setup" && (
          <SetupFlow
            accessToken={accessToken}
            workspace={workspace}
            onChange={patchWorkspace}
            onComplete={completeSetup}
          />
        )}
        {view === "dashboard" && (
          <DashboardView workspace={workspace} onNavigate={setView} />
        )}
        {view === "packages" && (
          <PackagesView workspace={workspace} onChange={patchWorkspace} />
        )}
        {view === "economics" && (
          <PackagesView workspace={workspace} onChange={patchWorkspace} />
        )}
        {view === "pipeline" && (
          <PipelineView workspace={workspace} onChange={patchWorkspace} />
        )}
        {view === "quote" && (
          <QuoteProposalView
            workspace={workspace}
            onChange={patchWorkspace}
            mode="quote"
          />
        )}
        {view === "proposal" && (
          <QuoteProposalView
            workspace={workspace}
            onChange={patchWorkspace}
            mode="proposal"
          />
        )}
        {view === "messages" && (
          <MessagesView workspace={workspace} onChange={patchWorkspace} />
        )}
        {view === "outreach" && (
          <MessagesView workspace={workspace} onChange={patchWorkspace} />
        )}
        {view === "tools" && (
          <ToolsView
            workspace={workspace}
            onChange={patchWorkspace}
            mode="tools"
          />
        )}
        {view === "settings" && (
          <ToolsView
            workspace={workspace}
            onChange={patchWorkspace}
            mode="settings"
          />
        )}
      </div>
    </div>
  )
}
