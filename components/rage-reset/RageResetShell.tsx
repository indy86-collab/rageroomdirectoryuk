"use client"

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react"
import {
  createInitialRuntime,
  rageResetReducer,
  snapshotFromRuntime,
  isHighIntensitySession,
} from "@/lib/rage-reset/reducer"
import {
  deleteAllRageResetData,
  loadStorage,
  saveStorage,
  createDefaultStorage,
} from "@/lib/rage-reset/storage"
import {
  applySessionCompletion,
  computeLocalStats,
  shouldShowDirectoryPromo,
} from "@/lib/rage-reset/progression"
import {
  evaluateDailyChallenge,
  getDailyChallengeForDate,
  localDateKey,
} from "@/lib/rage-reset/dailyChallenge"
import { trackRageReset } from "@/lib/rage-reset/analytics"
import { unlockAudio, setMasterMuted, setMasterIntensity } from "@/lib/rage-reset/audio"
import { prefersReducedMotion } from "@/lib/rage-reset/haptics"
import { durationBucket } from "@/lib/rage-reset/durationBuckets"
import { getDisplayMode, getEntrySource } from "@/lib/rage-reset/displayMode"
import { getCooldownChallenge } from "@/lib/rage-reset/features"
import {
  cohortAnalyticsParams,
  cohortForSessionComplete,
  hasPriorRageResetVisit,
  markRageResetSeen,
} from "@/lib/rage-reset/cohort"
import type { RageResetStorageV1, RoomId, TriggerCategory, WeaponId } from "@/lib/rage-reset/types"

import { WelcomeScreen } from "./WelcomeScreen"
import {
  CheckInScreen,
  TriggerScreen,
  FinalCheckInScreen,
} from "./CheckInScreens"
import { RoomSelectScreen, WeaponSelectScreen } from "./SelectScreens"
import { SmashGame } from "./SmashGame"
import { ControlledSmashGame } from "./ControlledSmashGame"
import { CooldownSortGame } from "./CooldownSortGame"
import { CooldownRebuildGame } from "./CooldownRebuildGame"
import { ResultsScreen } from "./ResultsScreen"
import { RageResetSettings } from "./RageResetSettings"
import { ProgressScreen } from "./ProgressScreen"
import { SafetyMessage } from "./SafetyMessage"
import { DiagnosticsPanel } from "./DiagnosticsPanel"
import { RageResetErrorBoundary } from "./RageResetErrorBoundary"

type ViewMode = "game" | "stats" | "progress"

export function RageResetShell() {
  const [storage, setStorage] = useState<RageResetStorageV1>(() => createDefaultStorage())
  const [hydrated, setHydrated] = useState(false)
  const [runtime, dispatch] = useReducer(rageResetReducer, undefined, createInitialRuntime)
  const [view, setView] = useState<ViewMode>("game")
  const [restorePrompt, setRestorePrompt] = useState(false)
  const [cooldownIncorrect, setCooldownIncorrect] = useState(false)
  const [promoShownThisResults, setPromoShownThisResults] = useState(false)
  const [cooldownMode, setCooldownMode] = useState<"fragment-sort" | "rebuild-room">(
    "fragment-sort"
  )
  const abandonedTracked = useRef(false)
  const sessionStartedAt = useRef<string | null>(null)
  const sessionsStartedThisVisit = useRef(0)
  const restoredThisVisit = useRef(false)
  const entrySource = useRef(getEntrySource())
  const seenBeforeThisOpen = useRef(false)

  const dailyChallenge = useMemo(() => getDailyChallengeForDate(), [])

  const commonAnalyticsContext = useCallback(() => {
    return {
      display_mode: getDisplayMode(),
      entry_source: entrySource.current,
      sound_enabled: storage.settings.soundEnabled,
      haptics_enabled: storage.settings.hapticsEnabled,
      reduced_effects: storage.settings.reducedEffects,
      ...cohortAnalyticsParams(storage),
    }
  }, [storage])

  const trackAbandon = useCallback(
    (stage: string, extra?: Record<string, string | number | boolean | undefined>) => {
      if (abandonedTracked.current) return
      if (stage === "welcome" || stage === "results") return
      abandonedTracked.current = true
      const started = sessionStartedAt.current
        ? Date.parse(sessionStartedAt.current)
        : Date.now()
      trackRageReset("rage_reset_session_abandoned", {
        stage,
        duration_bucket: durationBucket(Date.now() - started),
        room_id: runtime.roomId ?? undefined,
        weapon_id: runtime.weaponId ?? undefined,
        display_mode: getDisplayMode(),
        completed: false,
        ...extra,
      })
    },
    [runtime.roomId, runtime.weaponId]
  )

  useEffect(() => {
    const seenBefore = hasPriorRageResetVisit()
    seenBeforeThisOpen.current = seenBefore
    const data = loadStorage()
    if (prefersReducedMotion() && !data.settings.reducedEffects) {
      data.settings.reducedEffects = true
    }
    const today = localDateKey()
    if (!data.dailyChallenge || data.dailyChallenge.date !== today) {
      data.dailyChallenge = {
        date: today,
        challengeId: dailyChallenge.id,
        completed: false,
      }
    }
    setStorage(data)
    saveStorage(data)
    setCooldownMode(getCooldownChallenge())

    if (data.activeSession && data.activeSession.state !== "welcome" && data.activeSession.state !== "results") {
      setRestorePrompt(true)
    }
    setHydrated(true)
    trackRageReset("rage_reset_view", {
      entry_source: entrySource.current,
      sound_enabled: data.settings.soundEnabled,
      haptics_enabled: data.settings.hapticsEnabled,
      reduced_effects: data.settings.reducedEffects,
      ...cohortAnalyticsParams(data, seenBefore),
    })
    markRageResetSeen()
  }, [dailyChallenge.id])

  // Persist active session snapshot
  useEffect(() => {
    if (!hydrated) return
    // Do not wipe an unfinished session while the restore dialog is open
    if (restorePrompt) return
    if (runtime.state === "welcome") {
      setStorage((prev) => {
        const next = { ...prev, activeSession: undefined }
        saveStorage(next)
        return next
      })
      return
    }
    if (runtime.state === "results") {
      setStorage((prev) => {
        const next = { ...prev, activeSession: undefined }
        saveStorage(next)
        return next
      })
      return
    }
    const snap = snapshotFromRuntime(runtime)
    setStorage((prev) => {
      const next = { ...prev, activeSession: snap }
      saveStorage(next)
      return next
    })
  }, [runtime, hydrated, restorePrompt])

  useEffect(() => {
    const playing = ["free-smash", "controlled-smash", "cool-down"].includes(runtime.state)
    if (playing) {
      document.documentElement.style.overscrollBehavior = "none"
      document.body.style.overflow = "hidden"
      document.body.style.touchAction = "none"
    } else {
      document.documentElement.style.overscrollBehavior = ""
      document.body.style.overflow = ""
      document.body.style.touchAction = ""
    }
    return () => {
      document.documentElement.style.overscrollBehavior = ""
      document.body.style.overflow = ""
      document.body.style.touchAction = ""
    }
  }, [runtime.state])

  // Abandonment: visibility + pagehide (more reliable than beforeunload on mobile)
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "hidden") {
        trackAbandon(runtime.state)
      }
    }
    const onPageHide = () => trackAbandon(runtime.state)
    document.addEventListener("visibilitychange", onVis)
    window.addEventListener("pagehide", onPageHide)
    return () => {
      document.removeEventListener("visibilitychange", onVis)
      window.removeEventListener("pagehide", onPageHide)
    }
  }, [runtime.state, trackAbandon])

  // Defer SW activation/reload while the player is mid-session.
  useEffect(() => {
    const playing = ["free-smash", "controlled-smash", "cool-down", "final-check-in"].includes(
      runtime.state
    )
    try {
      if (playing) sessionStorage.setItem("rage-reset-defer-sw", "1")
      else sessionStorage.removeItem("rage-reset-defer-sw")
    } catch {
      /* ignore */
    }
  }, [runtime.state])

  const toggleSound = useCallback(() => {
    setStorage((prev) => {
      const soundEnabled = !prev.settings.soundEnabled
      setMasterMuted(!soundEnabled)
      const next = {
        ...prev,
        settings: { ...prev.settings, soundEnabled },
      }
      saveStorage(next)
      return next
    })
  }, [])

  const toggleHaptics = useCallback(() => {
    setStorage((prev) => {
      const next = {
        ...prev,
        settings: { ...prev.settings, hapticsEnabled: !prev.settings.hapticsEnabled },
      }
      saveStorage(next)
      return next
    })
  }, [])

  const toggleReduced = useCallback(() => {
    setStorage((prev) => {
      const next = {
        ...prev,
        settings: { ...prev.settings, reducedEffects: !prev.settings.reducedEffects },
      }
      saveStorage(next)
      return next
    })
  }, [])

  const beginSession = useCallback(async () => {
    await unlockAudio()
    setMasterMuted(!storage.settings.soundEnabled)
    setMasterIntensity(1)
    abandonedTracked.current = false
    restoredThisVisit.current = false
    sessionStartedAt.current = new Date().toISOString()
    setCooldownIncorrect(false)
    setPromoShownThisResults(false)
    sessionsStartedThisVisit.current += 1
    dispatch({ type: "START" })
    const ctx = commonAnalyticsContext()
    if (sessionsStartedThisVisit.current > 1 || storage.progression.completedSessions > 0) {
      if (sessionsStartedThisVisit.current > 1) {
        trackRageReset("rage_reset_second_session_start", ctx)
      }
    }
    trackRageReset("rage_reset_start", ctx)
  }, [storage.settings.soundEnabled, storage.progression.completedSessions, commonAnalyticsContext])

  const restoreSession = useCallback(() => {
    if (storage.activeSession) {
      // Successful restore — do not count as abandon; allow future abandon tracking.
      abandonedTracked.current = false
      restoredThisVisit.current = true
      sessionStartedAt.current = storage.activeSession.startedAt
      dispatch({ type: "HYDRATE_SESSION", session: storage.activeSession })
    }
    setRestorePrompt(false)
    void unlockAudio()
  }, [storage.activeSession])

  const discardSession = useCallback(() => {
    if (storage.activeSession) {
      trackRageReset("rage_reset_session_abandoned", {
        stage: storage.activeSession.state,
        room_id: storage.activeSession.roomId,
        weapon_id: storage.activeSession.weaponId,
        display_mode: getDisplayMode(),
        reason: "restart_instead_of_restore",
      })
    }
    setStorage((prev) => {
      const next = { ...prev, activeSession: undefined }
      saveStorage(next)
      return next
    })
    dispatch({ type: "RESTART" })
    setRestorePrompt(false)
  }, [storage.activeSession])

  const onFreeSmashComplete = useCallback(
    (result: {
      objectsDestroyed: number
      bestCombo: number
      smashScore: number
      maxHeat: number
      calmEnergyBonus: number
    }) => {
      setMasterIntensity(0.7)
      dispatch({
        type: "FREE_SMASH_COMPLETE",
        ...result,
      })
      trackRageReset("rage_reset_free_smash_complete", {
        room_id: runtime.roomId ?? undefined,
        weapon_id: runtime.weaponId ?? undefined,
        display_mode: getDisplayMode(),
      })
    },
    [runtime.roomId, runtime.weaponId]
  )

  const onControlledComplete = useCallback(
    (result: { controlledStrikes: number; calmEnergyBonus: number; maxHeat: number }) => {
      setMasterIntensity(0.45)
      dispatch({
        type: "CONTROLLED_SMASH_COMPLETE",
        ...result,
      })
      trackRageReset("rage_reset_controlled_smash_complete", {
        room_id: runtime.roomId ?? undefined,
        weapon_id: runtime.weaponId ?? undefined,
        display_mode: getDisplayMode(),
      })
    },
    [runtime.roomId, runtime.weaponId]
  )

  const onCooldownComplete = useCallback(
    (result: { skipped: boolean; calmEnergyBonus: number; hadIncorrect: boolean }) => {
      setCooldownIncorrect(result.hadIncorrect)
      dispatch({
        type: "COOLDOWN_COMPLETE",
        skipped: result.skipped,
        calmEnergyBonus: result.calmEnergyBonus,
      })
      trackRageReset("rage_reset_cooldown_complete", {
        skipped: result.skipped,
        cooldown_variant: cooldownMode,
        display_mode: getDisplayMode(),
      })
    },
    [cooldownMode]
  )

  const completeWithFinalScore = useCallback(
    (score: number) => {
      const withScore = rageResetReducer(runtime, {
        type: "SET_FINAL_SCORE",
        score,
      })

      const challengeDone = evaluateDailyChallenge(dailyChallenge.id, {
        reachedMaxHeat: withScore.reachedMaxHeat,
        controlledStrikes: withScore.controlledStrikes,
        cooldownCompleted: withScore.cooldownCompleted,
        cooldownHadIncorrect: cooldownIncorrect,
        completedFullSession: true,
        weaponId: withScore.weaponId,
        roomId: withScore.roomId,
      })

      const { progression, calmEnergyEarned, historyEntry } = applySessionCompletion(
        storage.progression,
        withScore,
        challengeDone
      )

      const finalized = {
        ...withScore,
        calmEnergyEarned,
      }

      let sessionsSinceLastPromo = progression.sessionsSinceLastPromo
      const showPromo = shouldShowDirectoryPromo({
        initialScore: finalized.initialScore,
        finalScore: finalized.finalScore,
        sessionsSinceLastPromo: progression.sessionsSinceLastPromo,
      })
      if (showPromo) {
        sessionsSinceLastPromo = 0
        setPromoShownThisResults(true)
      }

      const nextStorage: RageResetStorageV1 = {
        ...storage,
        progression: {
          ...progression,
          sessionsSinceLastPromo,
        },
        history: [historyEntry, ...storage.history],
        activeSession: undefined,
        dailyChallenge: {
          date: localDateKey(),
          challengeId: dailyChallenge.id,
          completed: storage.dailyChallenge?.completed || challengeDone,
        },
      }
      saveStorage(nextStorage)
      setStorage(nextStorage)
      dispatch({ type: "SET_FINAL_SCORE", score })
      dispatch({
        type: "ADD_CALM_ENERGY",
        amount: Math.max(0, calmEnergyEarned - withScore.calmEnergyEarned),
      })

      abandonedTracked.current = true
      const started = sessionStartedAt.current
        ? Date.parse(sessionStartedAt.current)
        : Date.now()
      const priorCompleted = storage.progression.completedSessions
      trackRageReset("rage_reset_session_complete", {
        room_id: finalized.roomId ?? "unknown",
        weapon_id: finalized.weaponId ?? "unknown",
        daily_challenge_completed: challengeDone,
        duration_bucket: durationBucket(Date.now() - started),
        cooldown_skipped: finalized.cooldownSkipped,
        completed: true,
        display_mode: getDisplayMode(),
        ...cohortForSessionComplete(priorCompleted, seenBeforeThisOpen.current),
      })
    },
    [runtime, storage, dailyChallenge.id, cooldownIncorrect]
  )

  const stats = useMemo(
    () => computeLocalStats(storage.history, storage.progression.currentResetStreak),
    [storage.history, storage.progression.currentResetStreak]
  )

  const historyDurationsMs = useMemo(() => {
    return storage.history
      .map((h) => {
        const a = Date.parse(h.startedAt)
        const b = Date.parse(h.completedAt)
        if (!Number.isFinite(a) || !Number.isFinite(b)) return null
        return b - a
      })
      .filter((n): n is number => n != null && n > 0)
  }, [storage.history])

  if (!hydrated) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-dark-950 text-zinc-400">
        Loading Rage Reset…
      </div>
    )
  }

  if (view === "stats") {
    return (
      <RageResetSettings
        stats={stats}
        soundEnabled={storage.settings.soundEnabled}
        hapticsEnabled={storage.settings.hapticsEnabled}
        reducedEffects={storage.settings.reducedEffects}
        onToggleSound={toggleSound}
        onToggleHaptics={toggleHaptics}
        onToggleReduced={toggleReduced}
        onClose={() => setView("game")}
        onDelete={() => {
          deleteAllRageResetData()
          setStorage(createDefaultStorage())
          dispatch({ type: "RESTART" })
          setView("game")
        }}
      />
    )
  }

  if (view === "progress") {
    return (
      <ProgressScreen
        progression={storage.progression}
        stats={stats}
        historyDurationsMs={historyDurationsMs}
        dailyChallenge={dailyChallenge}
        dailyCompleted={Boolean(storage.dailyChallenge?.completed)}
        onBack={() => setView("game")}
        onDeleteRequest={() => setView("stats")}
      />
    )
  }

  return (
    <RageResetErrorBoundary stage={runtime.state}>
      <div className="min-h-[100dvh] bg-dark-950 text-white">
        {restorePrompt && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          >
            <div className="w-full max-w-md rounded-2xl border border-zinc-700 bg-dark-800 p-5">
              <h2 className="font-display text-2xl">Resume your reset?</h2>
              <p className="mt-2 text-sm text-zinc-300">
                An unfinished session was found on this device.
              </p>
              <div className="mt-5 flex flex-col gap-2">
                <button type="button" className="btn-rage min-h-[48px]" onClick={restoreSession}>
                  Resume
                </button>
                <button type="button" className="btn-secondary min-h-[48px]" onClick={discardSession}>
                  Start fresh
                </button>
              </div>
            </div>
          </div>
        )}

        {runtime.showSafetyGate && (
          <SafetyMessage onContinue={() => dispatch({ type: "ACK_SAFETY" })} />
        )}

        {runtime.state === "welcome" && (
          <WelcomeScreen
            soundEnabled={storage.settings.soundEnabled}
            hapticsEnabled={storage.settings.hapticsEnabled}
            onToggleSound={toggleSound}
            onToggleHaptics={toggleHaptics}
            onStart={beginSession}
            onOpenPrivacy={() => undefined}
            onOpenHowItWorks={() => undefined}
            onOpenStats={() => setView("stats")}
            onOpenProgress={() => setView("progress")}
          />
        )}

        {runtime.state === "check-in" && (
          <CheckInScreen
            onBack={() => dispatch({ type: "GO_WELCOME" })}
            onContinue={(score) => dispatch({ type: "SET_INITIAL_SCORE", score })}
          />
        )}

        {runtime.state === "trigger" && (
          <TriggerScreen
            onBack={() => dispatch({ type: "GOTO", state: "check-in" })}
            onSelect={(trigger: TriggerCategory) => dispatch({ type: "SET_TRIGGER", trigger })}
          />
        )}

        {runtime.state === "room-select" && (
          <RoomSelectScreen
            unlockedRooms={storage.progression.unlockedRooms}
            onBack={() => dispatch({ type: "GOTO", state: "trigger" })}
            onSelect={(roomId: RoomId) => {
              dispatch({ type: "SELECT_ROOM", roomId })
              trackRageReset("rage_reset_room_selected", {
                room_id: roomId,
                display_mode: getDisplayMode(),
              })
            }}
          />
        )}

        {runtime.state === "weapon-select" && (
          <WeaponSelectScreen
            unlockedWeapons={storage.progression.unlockedWeapons}
            onBack={() => dispatch({ type: "GOTO", state: "room-select" })}
            onSelect={(weaponId: WeaponId) => {
              dispatch({ type: "SELECT_WEAPON", weaponId })
              trackRageReset("rage_reset_weapon_selected", {
                weapon_id: weaponId,
                display_mode: getDisplayMode(),
              })
            }}
          />
        )}

        {runtime.state === "free-smash" && runtime.roomId && runtime.weaponId && (
          <SmashGame
            roomId={runtime.roomId}
            weaponId={runtime.weaponId}
            soundEnabled={storage.settings.soundEnabled}
            hapticsEnabled={storage.settings.hapticsEnabled}
            reducedEffects={storage.settings.reducedEffects}
            onComplete={onFreeSmashComplete}
            onMuteToggle={toggleSound}
          />
        )}

        {runtime.state === "controlled-smash" && runtime.weaponId && (
          <ControlledSmashGame
            weaponId={runtime.weaponId}
            soundEnabled={storage.settings.soundEnabled}
            hapticsEnabled={storage.settings.hapticsEnabled}
            reducedEffects={storage.settings.reducedEffects}
            onComplete={onControlledComplete}
            onMuteToggle={toggleSound}
          />
        )}

        {runtime.state === "cool-down" &&
          (cooldownMode === "rebuild-room" ? (
            <CooldownRebuildGame
              soundEnabled={storage.settings.soundEnabled}
              hapticsEnabled={storage.settings.hapticsEnabled}
              canSkip={storage.progression.cooldownEverCompleted}
              onComplete={onCooldownComplete}
              onMuteToggle={toggleSound}
            />
          ) : (
            <CooldownSortGame
              soundEnabled={storage.settings.soundEnabled}
              hapticsEnabled={storage.settings.hapticsEnabled}
              canSkip={storage.progression.cooldownEverCompleted}
              onComplete={onCooldownComplete}
              onMuteToggle={toggleSound}
            />
          ))}

        {runtime.state === "final-check-in" && (
          <FinalCheckInScreen
            beforeScore={runtime.initialScore ?? 5}
            calmEnergyEarned={runtime.calmEnergyEarned}
            onContinue={completeWithFinalScore}
          />
        )}

        {runtime.state === "results" && (
          <ResultsScreen
            runtime={runtime}
            calmEnergyTotal={storage.progression.calmEnergy}
            streak={storage.progression.currentResetStreak}
            dailyChallenge={dailyChallenge}
            dailyCompleted={Boolean(storage.dailyChallenge?.completed)}
            showPromo={promoShownThisResults}
            showSafety={isHighIntensitySession(runtime)}
            onResetAgain={() => {
              void beginSession()
            }}
            onViewProgress={() => setView("progress")}
            onDirectoryCta={(href, label) => {
              trackRageReset("rage_reset_directory_cta_clicked", {
                cta_destination: label.includes("group")
                  ? "group_planner"
                  : label.includes("near")
                    ? "near_me"
                    : label.includes("compare")
                      ? "listings"
                      : "directory",
              })
            }}
          />
        )}

        {runtime.state !== "welcome" && runtime.state !== "results" && (
          <button
            type="button"
            className="fixed bottom-[max(0.5rem,env(safe-area-inset-bottom))] left-3 z-30 min-h-[40px] rounded-lg bg-black/50 px-2 text-[11px] text-zinc-400 backdrop-blur-sm"
            onClick={() => {
              trackAbandon(runtime.state, { reason: "explicit_restart" })
              dispatch({ type: "RESTART" })
            }}
          >
            Restart
          </button>
        )}

        <DiagnosticsPanel
          runtime={runtime}
          sessionCount={storage.progression.completedSessions}
          unlocks={{
            rooms: storage.progression.unlockedRooms,
            weapons: storage.progression.unlockedWeapons,
          }}
          dailyChallengeId={dailyChallenge.id}
        />
      </div>
    </RageResetErrorBoundary>
  )
}
