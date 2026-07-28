"use client"

import Link from "next/link"
import { getRoom, getWeapon } from "@/lib/rage-reset/content"
import { moodChangeCopy } from "@/lib/rage-reset/progression"
import type { DailyChallengeDefinition } from "@/lib/rage-reset/dailyChallenge"
import type { SessionRuntime } from "@/lib/rage-reset/types"
import { ScreenShell } from "./CheckInScreens"
import { SAFETY_COPY } from "./SafetyMessage"
import { ShareResultButton } from "./ShareResult"
import { FeedbackPrompt } from "./FeedbackPrompt"

export function ResultsScreen({
  runtime,
  calmEnergyTotal,
  streak,
  dailyChallenge,
  dailyCompleted,
  showPromo,
  showSafety,
  onResetAgain,
  onDirectoryCta,
  onViewProgress,
}: {
  runtime: SessionRuntime
  calmEnergyTotal: number
  streak: number
  dailyChallenge: DailyChallengeDefinition
  dailyCompleted: boolean
  showPromo: boolean
  showSafety: boolean
  onResetAgain: () => void
  onDirectoryCta: (href: string, label: string) => void
  onViewProgress: () => void
}) {
  const room = getRoom(runtime.roomId ?? "office-meltdown")
  const weapon = getWeapon(runtime.weaponId ?? "baseball-bat")
  const before = runtime.initialScore ?? 1
  const after = runtime.finalScore ?? 1

  return (
    <ScreenShell title="Results">
      <h2 className="font-display text-4xl tracking-wide text-white">
        {showSafety ? "Session saved" : "Session complete"}
      </h2>
      {!showSafety && (
        <p className="mt-2 text-sm text-zinc-300">{moodChangeCopy(before, after)}</p>
      )}

      {showSafety && (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-rage-500/40 bg-rage-950/40 p-3 text-sm text-zinc-200"
        >
          {SAFETY_COPY}
        </div>
      )}

      <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
        <ResultItem label="Room" value={room?.name ?? "—"} />
        <ResultItem label="Weapon" value={weapon?.name ?? "—"} />
        <ResultItem label="Objects destroyed" value={String(runtime.objectsDestroyed)} />
        <ResultItem label="Best combo" value={String(runtime.bestCombo)} />
        <ResultItem label="Controlled strikes" value={String(runtime.controlledStrikes)} />
        <ResultItem label="Calm Energy earned" value={String(runtime.calmEnergyEarned)} />
        {!showSafety && (
          <ResultItem label="Before → After" value={`${before} → ${after}`} />
        )}
        <ResultItem label="Reset streak" value={`${streak} day${streak === 1 ? "" : "s"}`} />
      </dl>

      {!showSafety && (
        <div className="mt-5 rounded-xl border border-zinc-800 bg-dark-800 p-4">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Daily challenge</p>
          <p className="mt-1 font-semibold text-white">{dailyChallenge.title}</p>
          <p className="mt-1 text-sm text-zinc-400">{dailyChallenge.description}</p>
          <p className="mt-2 text-sm font-semibold text-rage-400">
            {dailyCompleted ? "Completed today" : "Not completed yet"}
          </p>
          <p className="mt-1 text-xs text-zinc-500">Total Calm Energy: {calmEnergyTotal}</p>
        </div>
      )}

      {/* Action order: Reset → Share → Progress → optional promo → Directory */}
      <button
        type="button"
        onClick={onResetAgain}
        className="btn-rage mt-8 w-full min-h-[52px] rounded-xl"
      >
        Reset again
      </button>

      {!showSafety && <ShareResultButton runtime={runtime} />}

      <FeedbackPrompt className="mt-3" />

      <button
        type="button"
        onClick={onViewProgress}
        className="btn-secondary mt-3 flex min-h-[48px] w-full items-center justify-center rounded-xl"
      >
        View progress
      </button>

      {showPromo && !showSafety && (
        <div className="mt-6 rounded-xl border border-zinc-700 bg-dark-800/80 p-4">
          <p className="font-semibold text-white">Want to try a real rage-room experience?</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link
              href="/near-me"
              className="text-rage-400 underline-offset-2 hover:underline"
              onClick={() => onDirectoryCta("/near-me", "find_near_me")}
            >
              Find a rage room near me
            </Link>
            <Link
              href="/listings"
              className="text-rage-400 underline-offset-2 hover:underline"
              onClick={() => onDirectoryCta("/listings", "compare_venues")}
            >
              Compare nearby venues
            </Link>
            <Link
              href="/guides/best-rage-rooms-for-team-building"
              className="text-rage-400 underline-offset-2 hover:underline"
              onClick={() =>
                onDirectoryCta("/guides/best-rage-rooms-for-team-building", "plan_group")
              }
            >
              Plan a group session
            </Link>
          </div>
        </div>
      )}

      <Link
        href="/"
        className="btn-secondary mt-3 flex min-h-[48px] w-full items-center justify-center rounded-xl text-center"
        onClick={() => onDirectoryCta("/", "back_to_directory")}
      >
        Back to RageRoom Directory
      </Link>
    </ScreenShell>
  )
}

function ResultItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-dark-800 px-3 py-3">
      <dt className="text-[11px] uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-1 font-semibold text-white">{value}</dd>
    </div>
  )
}
