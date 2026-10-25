"use client"

import Link from "next/link"
import { useSyncExternalStore } from "react"
import { ArrowRightIcon } from "lucide-react"
import { ARCHETYPE_COOKIE, ARCHETYPE_INFO, isArchetype } from "@/lib/archetype"
import { buttonVariants } from "@/components/ui/button"

function readSaved() {
  const match = document.cookie.match(new RegExp(`(?:^|; )${ARCHETYPE_COOKIE}=([^;]*)`))
  return match ? match[1] : null
}

const noop = () => () => {}

/** Offers a shortcut back to the last view. Never hides the other choices. */
export function ContinueAs() {
  const saved = useSyncExternalStore(noop, readSaved, () => null)
  if (!isArchetype(saved)) return null
  const info = ARCHETYPE_INFO[saved]

  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl bg-muted px-4 py-3 text-base">
      <span>Welcome back. Last time you were browsing as {info.label.toLowerCase()}.</span>
      <Link href={info.href} className={buttonVariants({ variant: "outline", size: "sm" })}>
        Continue
        <ArrowRightIcon aria-hidden="true" />
      </Link>
    </p>
  )
}
