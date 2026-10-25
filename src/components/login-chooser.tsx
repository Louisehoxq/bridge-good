import { Form, useSearchParams } from "react-router"
import { Icon } from "@/components/icon"
import { accountFor, AMBASSADOR_KIND_INFO, isRole, ROLE_INFO, type Session } from "@/lib/roles"
import { useSession } from "@/lib/session"
import { RoleBadge, studioRoleFor } from "@/components/studio/role-badge"
import { SyntheticBadge } from "@/components/synthetic-badge"

/** One card per synthetic demo account. Chapter lead and company host both sign in to the ambassador area. */
const ACCOUNTS: Session[] = [
  { role: "student" },
  { role: "mentor" },
  { role: "ambassador", ambassadorKind: "chapter-lead" },
  { role: "ambassador", ambassadorKind: "company-host" },
  { role: "partner" },
]

const withArticle = (label: string) => `${/^[aeiou]/i.test(label) ? "an" : "a"} ${label.toLowerCase()}`

export function LoginChooser() {
  const [searchParams] = useSearchParams()
  const next = searchParams.get("next") ?? ""
  const current = useSession()
  const wanted = next.split("/")[1]

  return (
    <div className="space-y-6">
      {isRole(wanted) && (
        <p role="status" className="flex gap-3 rounded-xl border-2 border-archetype bg-archetype-soft p-4" data-archetype={wanted}>
          <Icon name="info" className="mt-0.5" />
          <span>
            {current
              ? `You're signed in as ${accountFor(current).label.toLowerCase()}. That page is for ${ROLE_INFO[wanted].plural.toLowerCase()}. Choose ${withArticle(ROLE_INFO[wanted].label)} account to continue.`
              : `Log in as ${withArticle(ROLE_INFO[wanted].label)} to open that page.`}
          </span>
        </p>
      )}
      <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {ACCOUNTS.map((session) => {
          const account = accountFor(session)
          const summary = session.ambassadorKind ? AMBASSADOR_KIND_INFO[session.ambassadorKind].summary : ROLE_INFO[session.role].summary
          const isCurrent = current?.role === session.role && current.ambassadorKind === session.ambassadorKind
          return (
            <li key={`${session.role}-${session.ambassadorKind ?? ""}`} data-archetype={session.role}>
              <Form method="post" action="/login" className="h-full">
                <input type="hidden" name="role" value={session.role} />
                {session.ambassadorKind && <input type="hidden" name="ambassadorKind" value={session.ambassadorKind} />}
                <input type="hidden" name="next" value={next} />
                <button
                  type="submit"
                  className="group flex h-full w-full flex-col gap-3 rounded-2xl border-2 border-border bg-card p-6 text-left transition-colors hover:border-archetype hover:bg-archetype-soft"
                >
                  <span className="flex flex-wrap items-center justify-between gap-2">
                    <RoleBadge role={studioRoleFor(session)}>{session.ambassadorKind ? `${account.label} · ambassador` : undefined}</RoleBadge>
                    <SyntheticBadge />
                  </span>
                  <span>
                    <span className="block type-title-3">{account.name}</span>
                    <span className="block text-muted-foreground">{account.detail}</span>
                  </span>
                  <span className="text-muted-foreground">{summary}</span>
                  <span className="mt-auto inline-flex items-center gap-2 pt-2 font-bold text-archetype">
                    {isCurrent ? "Continue as" : "Log in as"} {account.label.toLowerCase()}
                    <Icon name="arrow_forward" className="text-base transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
              </Form>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
