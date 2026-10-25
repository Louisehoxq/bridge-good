"use client"

import { useSearchParams } from "next/navigation"
import { ArrowRightIcon } from "lucide-react"
import { loginAs } from "@/app/actions"
import { isRole, ROLE_INFO, ROLES } from "@/lib/roles"
import { useSessionRole } from "@/lib/session"
import { SyntheticBadge } from "@/components/synthetic-badge"

export function LoginChooser() {
  const next = useSearchParams().get("next") ?? ""
  const current = useSessionRole()
  const wanted = next.split("/")[1]

  return (
    <div className="space-y-6">
      {isRole(wanted) && (
        <p role="status" className="rounded-xl border-2 border-archetype bg-archetype-soft p-4" data-archetype={wanted}>
          {current
            ? `You're signed in as ${ROLE_INFO[current].label.toLowerCase()}. That page is for ${ROLE_INFO[wanted].plural.toLowerCase()}. Log in as a ${ROLE_INFO[wanted].label.toLowerCase()} to continue.`
            : `Log in as a ${ROLE_INFO[wanted].label.toLowerCase()} to open that page.`}
        </p>
      )}
      <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {ROLES.map((role) => {
          const info = ROLE_INFO[role]
          const isCurrent = role === current
          return (
            <li key={role} data-archetype={role}>
              <form action={loginAs} className="h-full">
                <input type="hidden" name="role" value={role} />
                <input type="hidden" name="next" value={next} />
                <button
                  type="submit"
                  className="group flex h-full w-full flex-col gap-3 rounded-2xl border-2 border-border bg-card p-6 text-left transition-colors hover:border-archetype hover:bg-archetype-soft"
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-archetype">{info.label}</span>
                    <SyntheticBadge />
                  </span>
                  <span className="flex items-center gap-3">
                    <span
                      className="flex size-12 shrink-0 items-center justify-center rounded-full bg-archetype text-lg font-bold text-white"
                      aria-hidden="true"
                    >
                      {info.demoAccount.name.charAt(0)}
                    </span>
                    <span>
                      <span className="block text-lg font-bold">{info.demoAccount.name}</span>
                      <span className="block text-sm text-muted-foreground">{info.demoAccount.detail}</span>
                    </span>
                  </span>
                  <span className="text-muted-foreground">{info.summary}</span>
                  <span className="mt-auto inline-flex items-center gap-2 pt-2 font-bold text-archetype">
                    {isCurrent ? "Continue as" : "Log in as"} {info.label.toLowerCase()}
                    <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </button>
              </form>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
