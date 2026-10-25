"use client"

import { useEffect } from "react"
import { ARCHETYPE_COOKIE, type Archetype } from "@/lib/archetype"

/** Saves the current view so the landing page can offer to bring the visitor back. */
export function RememberArchetype({ archetype }: { archetype: Archetype }) {
  useEffect(() => {
    document.cookie = `${ARCHETYPE_COOKIE}=${archetype}; path=/; max-age=${60 * 60 * 24 * 180}; samesite=lax`
  }, [archetype])
  return null
}
