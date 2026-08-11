import "server-only"
import fs from "fs/promises"
import path from "path"
import { createEmptyWorkspace, touchWorkspace } from "./defaults"
import { normalizeWorkspace } from "./normalize"
import type { VenueOwnerWorkspace } from "./types"

const STORE_DIR = path.join(
  process.cwd(),
  "private/corporate-booking-workspaces"
)

type MemoryEntry = { workspace: VenueOwnerWorkspace; savedAt: number }

const memoryStore = new Map<string, MemoryEntry>()
const sessionIndex = new Map<string, string>()

export function isUpstashConfigured() {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  )
}

function isMemoryOnlyStore() {
  return (
    process.env.CORPORATE_BOOKING_STORE === "memory" ||
    process.env.VITEST === "true" ||
    process.env.NODE_ENV === "test"
  )
}

function isServerlessRuntime() {
  return Boolean(process.env.VERCEL) || process.env.CORPORATE_BOOKING_REQUIRE_REDIS === "true"
}

/**
 * Production/serverless must use Upstash. Local/dev may use the JSON file store.
 */
export function isCorporateBookingDurableStoreReady() {
  if (isMemoryOnlyStore()) return true
  if (isUpstashConfigured()) return true
  return !isServerlessRuntime()
}

function assertDurableStoreAvailable(operation: "read" | "write") {
  if (isCorporateBookingDurableStoreReady()) return
  throw new Error(
    `Corporate Booking System ${operation} requires UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in this environment.`
  )
}

function redisKey(workspaceId: string) {
  return `cbs:workspace:${workspaceId}`
}

function redisSessionKey(sessionId: string) {
  return `cbs:session:${sessionId}`
}

async function ensureStoreDir() {
  await fs.mkdir(STORE_DIR, { recursive: true })
}

function filePathFor(workspaceId: string) {
  if (!/^[\w-]+$/.test(workspaceId)) {
    throw new Error("Invalid workspace id")
  }
  return path.join(STORE_DIR, `${workspaceId}.json`)
}

async function redisCommand(parts: string[]) {
  const base = process.env.UPSTASH_REDIS_REST_URL!.replace(/\/$/, "")
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!
  const path = parts.map((part) => encodeURIComponent(part)).join("/")
  const response = await fetch(`${base}/${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  if (!response.ok) {
    throw new Error(`Upstash request failed: ${response.status}`)
  }
  return response.json() as Promise<{ result: unknown }>
}

async function readFromRedis(workspaceId: string) {
  const data = await redisCommand(["GET", redisKey(workspaceId)])
  if (typeof data.result !== "string" || !data.result) return null
  return normalizeWorkspace(JSON.parse(data.result))
}

async function writeToRedis(workspace: VenueOwnerWorkspace) {
  const body = JSON.stringify(workspace)
  await redisCommand(["SET", redisKey(workspace.id), body])
  await redisCommand([
    "SET",
    redisSessionKey(workspace.sessionId),
    workspace.id,
  ])
}

async function readSessionFromRedis(sessionId: string) {
  const data = await redisCommand(["GET", redisSessionKey(sessionId)])
  if (typeof data.result !== "string" || !data.result) return null
  return readFromRedis(data.result)
}

async function readFromFile(workspaceId: string) {
  try {
    const raw = await fs.readFile(filePathFor(workspaceId), "utf8")
    return normalizeWorkspace(JSON.parse(raw))
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null
    throw error
  }
}

async function writeToFile(workspace: VenueOwnerWorkspace) {
  await ensureStoreDir()
  const target = filePathFor(workspace.id)
  const tmp = `${target}.${process.pid}.tmp`
  await fs.writeFile(tmp, JSON.stringify(workspace, null, 2), "utf8")
  await fs.rename(tmp, target)

  const indexPath = path.join(STORE_DIR, "sessions.json")
  let index: Record<string, string> = {}
  try {
    index = JSON.parse(await fs.readFile(indexPath, "utf8")) as Record<
      string,
      string
    >
  } catch {
    index = {}
  }
  index[workspace.sessionId] = workspace.id
  await fs.writeFile(indexPath, JSON.stringify(index, null, 2), "utf8")
}

async function readSessionFromFile(sessionId: string) {
  try {
    const indexPath = path.join(STORE_DIR, "sessions.json")
    const index = JSON.parse(await fs.readFile(indexPath, "utf8")) as Record<
      string,
      string
    >
    const workspaceId = index[sessionId]
    if (!workspaceId) return null
    return readFromFile(workspaceId)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null
    throw error
  }
}

export async function getWorkspaceById(
  workspaceId: string
): Promise<VenueOwnerWorkspace | null> {
  const mem = memoryStore.get(workspaceId)
  if (mem) return normalizeWorkspace(mem.workspace)
  if (isMemoryOnlyStore()) return null

  if (isUpstashConfigured()) {
    try {
      return await readFromRedis(workspaceId)
    } catch (error) {
      console.error("CBS Redis read failed", error)
      throw new Error("Unable to load workspace from durable storage.")
    }
  }

  assertDurableStoreAvailable("read")
  return readFromFile(workspaceId)
}

export async function getWorkspaceBySessionId(
  sessionId: string
): Promise<VenueOwnerWorkspace | null> {
  const mapped = sessionIndex.get(sessionId)
  if (mapped) return getWorkspaceById(mapped)
  if (isMemoryOnlyStore()) return null

  if (isUpstashConfigured()) {
    try {
      return await readSessionFromRedis(sessionId)
    } catch (error) {
      console.error("CBS Redis session read failed", error)
      throw new Error("Unable to load workspace from durable storage.")
    }
  }

  assertDurableStoreAvailable("read")
  return readSessionFromFile(sessionId)
}

export async function saveWorkspace(
  workspace: VenueOwnerWorkspace
): Promise<VenueOwnerWorkspace> {
  const next = touchWorkspace(normalizeWorkspace(workspace))
  memoryStore.set(next.id, { workspace: next, savedAt: Date.now() })
  sessionIndex.set(next.sessionId, next.id)

  if (isMemoryOnlyStore()) return next

  if (isUpstashConfigured()) {
    try {
      await writeToRedis(next)
      return next
    } catch (error) {
      console.error("CBS Redis write failed", error)
      // Never report success after a failed durable write.
      throw new Error("Unable to save workspace to durable storage.")
    }
  }

  assertDurableStoreAvailable("write")
  await writeToFile(next)
  return next
}

export async function getOrCreateWorkspaceForSession(
  sessionId: string
): Promise<VenueOwnerWorkspace> {
  const existing = await getWorkspaceBySessionId(sessionId)
  if (existing) return existing

  const created = createEmptyWorkspace(sessionId)
  return saveWorkspace(created)
}

/** Test helper — clears in-memory layer only. */
export function _resetCorporateBookingMemoryStoreForTests() {
  memoryStore.clear()
  sessionIndex.clear()
}
