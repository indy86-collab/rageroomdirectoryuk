"use client"

/**
 * Procedural Web Audio sounds — no large asset downloads.
 * AudioContext is created only after a user gesture.
 */

type SoundKind =
  | "impact-bat"
  | "impact-chicken"
  | "break"
  | "whoosh"
  | "ui"
  | "success"
  | "warn"
  | "cooldown"
  | "breath"

let audioCtx: AudioContext | null = null
let masterGain: GainNode | null = null
let unlocked = false

export function isAudioUnlocked(): boolean {
  return unlocked
}

export async function unlockAudio(): Promise<void> {
  if (typeof window === "undefined") return
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctx) return

  if (!audioCtx) {
    audioCtx = new Ctx()
    masterGain = audioCtx.createGain()
    masterGain.gain.value = 0.35
    masterGain.connect(audioCtx.destination)
  }
  if (audioCtx.state === "suspended") {
    await audioCtx.resume()
  }
  unlocked = true
}

export function setMasterMuted(muted: boolean): void {
  if (!masterGain || !audioCtx) return
  masterGain.gain.setTargetAtTime(muted ? 0 : 0.35, audioCtx.currentTime, 0.02)
}

export function setMasterIntensity(intensity: number): void {
  if (!masterGain || !audioCtx) return
  const v = Math.max(0, Math.min(1, intensity)) * 0.35
  masterGain.gain.setTargetAtTime(v, audioCtx.currentTime, 0.05)
}

function tone(
  freq: number,
  duration: number,
  type: OscillatorType,
  gain = 0.2,
  slideTo?: number
) {
  if (!audioCtx || !masterGain || !unlocked) return
  const now = audioCtx.currentTime
  const osc = audioCtx.createOscillator()
  const g = audioCtx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, now)
  if (slideTo != null) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), now + duration)
  }
  g.gain.setValueAtTime(gain, now)
  g.gain.exponentialRampToValueAtTime(0.001, now + duration)
  osc.connect(g)
  g.connect(masterGain)
  osc.start(now)
  osc.stop(now + duration + 0.02)
}

function noiseBurst(duration: number, gain = 0.15, filterFreq = 1200) {
  if (!audioCtx || !masterGain || !unlocked) return
  const now = audioCtx.currentTime
  const length = Math.floor(audioCtx.sampleRate * duration)
  const buffer = audioCtx.createBuffer(1, length, audioCtx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / length)
  }
  const src = audioCtx.createBufferSource()
  src.buffer = buffer
  const filter = audioCtx.createBiquadFilter()
  filter.type = "bandpass"
  filter.frequency.value = filterFreq
  const g = audioCtx.createGain()
  g.gain.setValueAtTime(gain, now)
  g.gain.exponentialRampToValueAtTime(0.001, now + duration)
  src.connect(filter)
  filter.connect(g)
  g.connect(masterGain)
  src.start(now)
  src.stop(now + duration + 0.02)
}

export function playSound(kind: SoundKind, intensity = 1): void {
  const i = Math.max(0.2, Math.min(1, intensity))
  switch (kind) {
    case "impact-bat":
      noiseBurst(0.08 * i, 0.22 * i, 800)
      tone(120, 0.12, "square", 0.12 * i, 60)
      break
    case "impact-chicken":
      tone(420, 0.08, "sawtooth", 0.1 * i, 180)
      tone(620, 0.1, "triangle", 0.08 * i, 300)
      noiseBurst(0.05, 0.1 * i, 2000)
      break
    case "break":
      noiseBurst(0.25 * i, 0.28 * i, 1500)
      tone(90, 0.2, "sawtooth", 0.1 * i, 40)
      break
    case "whoosh":
      noiseBurst(0.12, 0.08 * i, 400)
      break
    case "ui":
      tone(520, 0.06, "sine", 0.08 * i)
      break
    case "success":
      tone(440, 0.08, "sine", 0.1 * i)
      tone(660, 0.12, "sine", 0.08 * i)
      break
    case "warn":
      tone(220, 0.15, "square", 0.08 * i, 160)
      break
    case "cooldown":
      tone(360, 0.1, "sine", 0.06 * i)
      tone(480, 0.14, "triangle", 0.05 * i)
      break
    case "breath":
      tone(180, 0.4, "sine", 0.03 * i, 220)
      break
    default:
      break
  }
}

export function playWeaponImpact(weaponId: string, intensity = 1): void {
  if (weaponId === "rubber-chicken") {
    playSound("impact-chicken", intensity)
  } else {
    playSound("impact-bat", intensity)
  }
}
