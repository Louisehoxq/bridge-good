import type { ReactNode } from "react"
import { accountFor, ROLE_INFO, type Role } from "@/lib/roles"
import { useSession } from "@/lib/session"
import { NavLink } from "@/components/nav-link"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

/** Public pages: top bar, full-width main, footer. */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}

/**
 * Role areas: desktop layout with a sticky left sidebar beside a wide content column.
 * Below lg the sidebar becomes a scrollable tab strip.
 */
export function RoleShell({ role, children }: { role: Role; children: ReactNode }) {
  const info = ROLE_INFO[role]
  const session = useSession()
  // Chapter leads and company hosts share the ambassador area; label it with their own kind.
  const label = session?.role === role ? accountFor(session).label : info.label
  return (
    <div data-archetype={role} className="flex min-h-full flex-col">
      <SiteHeader role={role} />
      <div className="mx-auto w-full max-w-7xl flex-1 lg:grid lg:grid-cols-[16rem_1fr] lg:gap-10 lg:px-8">
        <aside className="hidden lg:block">
          <nav aria-label={`${info.label} area`} className="sticky top-16 space-y-6 py-8">
            <p className="px-3 text-sm font-bold tracking-wide text-archetype uppercase">{label} area</p>
            {info.sidebar.map((group, i) => (
              <div key={group.label ?? i}>
                {group.label && (
                  <p id={`side-${i}`} className="mb-1 px-3 text-sm font-bold text-muted-foreground">
                    {group.label}
                  </p>
                )}
                <ul className="space-y-1" aria-labelledby={group.label ? `side-${i}` : undefined}>
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <NavLink href={item.href} exact={item.href === info.home} variant="side">
                        {item.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        <nav aria-label={`${info.label} area`} className="border-b px-4 sm:px-6 lg:hidden">
          <ul className="-mb-px flex overflow-x-auto">
            {info.sidebar.flatMap((group) => group.items).map((item) => (
              <li key={item.href}>
                <NavLink href={item.href} exact={item.href === info.home} variant="tab">
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <main id="main" tabIndex={-1} className="min-w-0 px-4 py-8 focus:outline-none sm:px-6 lg:px-0 lg:py-10">
          {children}
        </main>
      </div>
      <SiteFooter />
    </div>
  )
}

export function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <div className="mb-8 max-w-3xl space-y-2">
      {eyebrow && <p className="text-sm font-bold tracking-wide text-archetype uppercase">{eyebrow}</p>}
      <h1 className="text-3xl font-bold lg:text-4xl">{title}</h1>
      {children && <div className="text-lg text-muted-foreground">{children}</div>}
    </div>
  )
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">{children}</p>
}
