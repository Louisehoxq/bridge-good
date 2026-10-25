"use client"

import { useSyncExternalStore } from "react"
import { isRole, SESSION_COOKIE, type Role } from "@/lib/roles"

/**
 * DEMO session: the signed-in role lives in a plain cookie so static pages can
 * read it in the browser. Not real authentication.
 */
function readRole(): Role | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${SESSION_COOKIE}=([^;]*)`))
  const value = match?.[1]
  return isRole(value) ? value : null
}

const noop = () => () => {}

export function useSessionRole(): Role | null {
  return useSyncExternalStore(noop, readRole, () => null)
}
