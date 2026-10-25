import { useCallback, useSyncExternalStore } from "react"

/**
 * DEMO persistence: each collection lives in this browser's localStorage, seeded
 * with synthetic data. Every role shares the same storage, so switching roles
 * shows the other side of a flow (e.g. a student's submission in the mentor queue).
 */
const PREFIX = "bgx:"
const EVENT = "bgx-store"

const cache = new Map<string, { raw: string | null; value: unknown }>()

function readRaw(key: string): string | null {
  try {
    return localStorage.getItem(PREFIX + key)
  } catch {
    return null
  }
}

function read<T>(key: string, seed: T[]): T[] {
  const raw = readRaw(key)
  const hit = cache.get(key)
  if (hit && hit.raw === raw) return hit.value as T[]
  let value: T[] = seed
  if (raw) {
    try {
      const parsed: unknown = JSON.parse(raw)
      value = Array.isArray(parsed) ? (parsed as T[]) : seed
    } catch {
      value = seed
    }
  }
  cache.set(key, { raw, value })
  return value
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback)
  window.addEventListener(EVENT, callback)
  return () => {
    window.removeEventListener("storage", callback)
    window.removeEventListener(EVENT, callback)
  }
}

export function useCollection<T>(key: string, seed: T[]) {
  const items = useSyncExternalStore(
    subscribe,
    () => read(key, seed),
    () => seed
  )

  const update = useCallback(
    (updater: (prev: T[]) => T[]) => {
      const next = updater(read(key, seed))
      try {
        localStorage.setItem(PREFIX + key, JSON.stringify(next))
      } catch {
        // Storage unavailable (private mode, quota): keep the change in memory for this session.
        cache.set(key, { raw: readRaw(key), value: next })
      }
      window.dispatchEvent(new Event(EVENT))
    },
    [key, seed]
  )

  return [items, update] as const
}

export function resetDemoData() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k))
  } catch {
    // Nothing stored.
  }
  cache.clear()
  window.dispatchEvent(new Event(EVENT))
}

export function newId() {
  return Math.random().toString(36).slice(2, 10)
}

export function nowLabel() {
  return new Date().toLocaleString(undefined, { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })
}
