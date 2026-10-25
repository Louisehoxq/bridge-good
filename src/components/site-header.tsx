import { Link } from "react-router"
import { Icon } from "@/components/icon"
import { PUBLIC_NAV, ROLE_INFO, type Role } from "@/lib/roles"
import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { AccountMenu, DashboardLink, SheetAccount } from "@/components/account-menu"
import { NavLink } from "@/components/nav-link"
import { Wordmark } from "@/components/wordmark"

/** Desktop-first top bar. Below lg the links collapse into a sheet; below md account actions move there too. */
export function SiteHeader({ role }: { role?: Role }) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="rounded-md" aria-label="BridgeGoodx home">
          <Wordmark />
        </Link>

        <nav aria-label="Main" className="hidden flex-1 lg:block">
          <ul className="flex items-center gap-1">
            {PUBLIC_NAV.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href} exact={item.href === "/"} variant="top">
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li>
              <DashboardLink />
            </li>
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <AccountMenu />
          <Sheet>
            <SheetTrigger render={<Button variant="outline" size="icon" aria-label="Open menu" className="lg:hidden" />}>
              <Icon name="menu" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-sm overflow-y-auto p-6">
              <SheetHeader className="p-0">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <SheetAccount />
              <nav aria-label="Main">
                <ul className="flex flex-col">
                  {PUBLIC_NAV.map((item) => (
                    <li key={item.href}>
                      <SheetClose
                        nativeButton={false}
                        render={<Link to={item.href} />}
                        className="flex min-h-12 w-full items-center rounded-md px-2 font-medium hover:bg-muted"
                      >
                        {item.label}
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              </nav>
              {role &&
                ROLE_INFO[role].sidebar.map((group, i) => (
                  <nav key={group.label ?? i} aria-label={`${ROLE_INFO[role].label}: ${group.label ?? "overview"}`}>
                    <h2 className="mb-1 font-sans type-small font-semibold text-muted-foreground">{group.label ?? `${ROLE_INFO[role].label} area`}</h2>
                    <ul className="flex flex-col">
                      {group.items.map((item) => (
                        <li key={item.href}>
                          <SheetClose
                            nativeButton={false}
                            render={<Link to={item.href} />}
                            className="flex min-h-12 w-full items-center rounded-md px-2 font-medium hover:bg-muted"
                          >
                            {item.label}
                          </SheetClose>
                        </li>
                      ))}
                    </ul>
                  </nav>
                ))}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
