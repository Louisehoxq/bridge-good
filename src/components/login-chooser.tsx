import { Form, useSearchParams } from "react-router"
import { Icon } from "@/components/icon"
import { accountFor, ROLE_INFO, ROLES, type Role, type Session } from "@/lib/roles"
import { useSession } from "@/lib/session"
import { RoleBadge, studioRoleFor } from "@/components/studio/role-badge"
import { SyntheticBadge } from "@/components/synthetic-badge"

/** One card per synthetic demo account. */
const ACCOUNTS: Session[] = ROLES.map((role) => ({ role }))

/** Which role's guarded area a `next` path belongs to, if any. Public pages (events, chapters) need no particular role. */
const roleForPath = (path: string): Role | undefined =>
  ROLES.find((r) => ROLE_INFO[r].hasArea && (path === ROLE_INFO[r].home || path.startsWith(`${ROLE_INFO[r].home}/`)))

/** Lowercase a label for a sentence, but keep a name in capitals: "BRIDGEGOOD steward". */
const lower = (label: string) => label.replace(/^[A-Z](?=[a-z])/, (c) => c.toLowerCase())
const withArticle = (label: string) => `${/^[aeiou]/i.test(label) ? "an" : "a"} ${lower(label)}`

export function LoginChooser() {
  const [searchParams] = useSearchParams()
  const next = searchParams.get("next") ?? ""
  const current = useSession()
  const wanted = roleForPath(next)

  return (
    <div className="space-y-6">
      {wanted && (
        <p role="status" className="flex gap-3 rounded-xl border-2 border-archetype bg-archetype-soft p-4" data-archetype={wanted}>
          <Icon name="info" className="mt-0.5" />
          <span>
            {current
              ? `You're signed in as ${lower(accountFor(current).label)}. That page is for ${lower(ROLE_INFO[wanted].plural)}. Choose ${withArticle(ROLE_INFO[wanted].label)} account to continue.`
              : `Log in as ${withArticle(ROLE_INFO[wanted].label)} to open that page.`}
          </span>
        </p>
      )}
      <ul className="grid max-w-4xl gap-5 md:grid-cols-2">
        {ACCOUNTS.map((session) => {
          const account = accountFor(session)
          const summary = ROLE_INFO[session.role].summary
          const isCurrent = current?.role === session.role
          return (
            <li key={session.role} data-archetype={session.role}>
              <Form method="post" action="/login" className="h-full">
                <input type="hidden" name="role" value={session.role} />
                <input type="hidden" name="next" value={next} />
                <button
                  type="submit"
                  className="group flex h-full w-full flex-col gap-3 rounded-2xl border-2 border-border bg-card p-6 text-left transition-colors hover:border-archetype hover:bg-archetype-soft"
                >
                  <span className="flex flex-wrap items-center justify-between gap-2">
                    <RoleBadge role={studioRoleFor(session)} />
                    <SyntheticBadge />
                  </span>
                  <span>
                    <span className="block type-title-3">{account.name}</span>
                    <span className="block text-muted-foreground">{account.detail}</span>
                  </span>
                  <span className="text-muted-foreground">{summary}</span>
                  <span className="mt-auto inline-flex items-center gap-2 pt-2 font-bold text-archetype">
                    {isCurrent ? "Continue as" : "Log in as"} {lower(account.label)}
                    <Icon name="arrow-right" className="text-base transition-transform group-hover:translate-x-1" />
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
