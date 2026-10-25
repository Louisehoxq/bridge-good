import type { ReactNode } from "react"
import { ROLE_INFO, type Role } from "@/lib/roles"
import { Icon, type IconName } from "@/components/icon"
import { NavLink } from "@/components/nav-link"
import { RoleBadge, STUDIO_ROLES } from "@/components/studio/role-badge"
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

/** Sidebar icons by link, so each item reads at a glance. The same icon always means the same thing. */
const SIDEBAR_ICONS: Record<string, IconName> = {
  "/host": "house",
  "/host/guide": "book-open",
  "/host/workplace": "building-2",
  "/host/projects": "heart-handshake",
  "/host/toolkit": "folder-open",
  "/steward": "inbox",
  "/steward/log": "history",
  "/steward/themes": "sparkles",
}

/**
 * Role areas: desktop layout with a sticky, sunken left sidebar beside a wide content column.
 * Below lg the sidebar becomes a scrollable tab strip under the role badge.
 */
export function RoleShell({ role, children }: { role: Role; children: ReactNode }) {
  const info = ROLE_INFO[role]
  const badge = <RoleBadge role={role}>{STUDIO_ROLES[role].label} area</RoleBadge>
  return (
    <div data-archetype={role} className="flex min-h-full flex-col">
      <SiteHeader role={role} />
      <div className="mx-auto w-full max-w-7xl flex-1 lg:grid lg:grid-cols-[16rem_1fr] lg:gap-10 lg:px-8">
        <div className="hidden lg:block">
          <nav aria-label={`${info.label} area`} className="sticky top-20 my-8 space-y-5 rounded-xl border bg-surface-sunken p-3">
            <p className="px-2 pt-1">{badge}</p>
            {info.sidebar.map((group, i) => (
              <div key={group.label ?? i}>
                {group.label && (
                  <p id={`side-${i}`} className="mb-1 px-3 type-small font-semibold text-muted-foreground">
                    {group.label}
                  </p>
                )}
                <ul className="space-y-1" aria-labelledby={group.label ? `side-${i}` : undefined}>
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <NavLink href={item.href} exact={item.href === info.home} variant="side">
                        {SIDEBAR_ICONS[item.href] && <Icon name={SIDEBAR_ICONS[item.href]} />}
                        {item.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="border-b px-4 pt-4 sm:px-6 lg:hidden">
          {badge}
          <nav aria-label={`${info.label} area`} className="mt-2">
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
        </div>

        <main id="main" tabIndex={-1} className="min-w-0 px-4 py-8 focus:outline-none sm:px-6 lg:px-0 lg:py-10">
          {children}
        </main>
      </div>
      <SiteFooter />
    </div>
  )
}

/** A page's h1 and lede. In role areas the role badge sits in the sidebar, so there's no eyebrow label. */
export function PageHeader({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="mb-8 max-w-3xl space-y-2">
      <h1 className="type-title-1">{title}</h1>
      {children && <div className="type-body-lg text-muted-foreground">{children}</div>}
    </div>
  )
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">{children}</p>
}
