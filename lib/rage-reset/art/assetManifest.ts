/**
 * Asset manifest for the next Rage Reset renderer.
 * Phase 1 ships high-quality procedural Canvas illustrators keyed here;
 * bitmap/SVG paths are reserved for progressive enrichment under public/rage-reset/art/.
 */

export type ArtKind = "procedural" | "image"

export interface ArtEntry {
  id: string
  kind: ArtKind
  /** Relative to /rage-reset/art/ when kind === "image" */
  path?: string
  proceduralKey?: string
  damageStates: Array<"intact" | "light" | "medium" | "heavy" | "destroyed">
}

export const OFFICE_OBJECT_ART: ArtEntry[] = [
  { id: "printer", kind: "procedural", proceduralKey: "printer", damageStates: ["intact", "light", "medium", "heavy", "destroyed"] },
  { id: "monitor", kind: "procedural", proceduralKey: "monitor", damageStates: ["intact", "light", "medium", "heavy", "destroyed"] },
  { id: "laptop", kind: "procedural", proceduralKey: "laptop", damageStates: ["intact", "light", "medium", "heavy", "destroyed"] },
  { id: "keyboard", kind: "procedural", proceduralKey: "keyboard", damageStates: ["intact", "light", "medium", "heavy", "destroyed"] },
  { id: "filing-cabinet", kind: "procedural", proceduralKey: "filingCabinet", damageStates: ["intact", "light", "medium", "heavy", "destroyed"] },
  { id: "coffee-machine", kind: "procedural", proceduralKey: "coffeeMachine", damageStates: ["intact", "light", "medium", "heavy", "destroyed"] },
  { id: "alarm-clock", kind: "procedural", proceduralKey: "alarmClock", damageStates: ["intact", "light", "medium", "heavy", "destroyed"] },
  { id: "desk-lamp", kind: "procedural", proceduralKey: "deskLamp", damageStates: ["intact", "light", "medium", "heavy", "destroyed"] },
  { id: "mug-stack", kind: "procedural", proceduralKey: "mugStack", damageStates: ["intact", "light", "medium", "heavy", "destroyed"] },
  { id: "email-sign", kind: "procedural", proceduralKey: "meetingSign", damageStates: ["intact", "light", "medium", "heavy", "destroyed"] },
]

export const WEAPON_ART: ArtEntry[] = [
  { id: "baseball-bat", kind: "procedural", proceduralKey: "baseballBat", damageStates: ["intact"] },
  { id: "rubber-chicken", kind: "procedural", proceduralKey: "rubberChicken", damageStates: ["intact"] },
]

export const ROOM_ART = {
  officeBackground: { id: "office-room", kind: "procedural" as const, proceduralKey: "officeRoom" },
  bossPrinter: { id: "boss-printer", kind: "procedural" as const, proceduralKey: "bossPrinter" },
}

export const PUBLIC_ART_ROOT = "/rage-reset/art"

/** Validate manifest integrity for unit tests. */
export function validateAssetManifest(): { ok: boolean; errors: string[] } {
  const errors: string[] = []
  const ids = new Set<string>()
  for (const entry of [...OFFICE_OBJECT_ART, ...WEAPON_ART]) {
    if (!entry.id) errors.push("empty art id")
    if (ids.has(entry.id)) errors.push(`duplicate art id: ${entry.id}`)
    ids.add(entry.id)
    if (entry.damageStates.length === 0) errors.push(`${entry.id}: no damage states`)
    if (entry.kind === "procedural" && !entry.proceduralKey) {
      errors.push(`${entry.id}: missing proceduralKey`)
    }
    if (entry.kind === "image" && !entry.path) {
      errors.push(`${entry.id}: missing path`)
    }
  }
  return { ok: errors.length === 0, errors }
}
