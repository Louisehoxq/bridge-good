import { Form, Link } from "react-router"
import { Icon } from "@/components/icon"
import { accountFor, ROLE_INFO } from "@/lib/roles"
import { useSession } from "@/lib/session"
import { Button, buttonVariants } from "@/components/ui/button"
import { NavLink } from "@/components/nav-link"
import { PeopleChip } from "@/components/studio/people-chip"
import { RoleBadge, studioRoleFor } from "@/components/studio/role-badge"

export function DashboardLink() {
  const session = useSession()
  if (!session) return null
  return (
    <NavLink href={ROLE_INFO[session.role].home} variant="top">
      My area
    </NavLink>
  )
}

export function AccountMenu() {
  const session = useSession()

  if (!session) {
    return (
      // The button's own inline-flex would override `hidden`, so the breakpoint lives on a wrapper.
      <span className="hidden md:inline-flex">
        <Link to="/login" className={buttonVariants({ size: "default" })}>
          <Icon name="login" />
          Log in
        </Link>
      </span>
    )
  }

  const account = accountFor(session)
  const role = studioRoleFor(session)
  return (
    <div data-archetype={session.role} className="hidden items-center gap-3 md:flex">
      <span className="sr-only">Signed in as</span>
      <PeopleChip name={account.name} role={role} detail="demo" className="hidden max-w-64 lg:flex" />
      <RoleBadge role={role} className="lg:hidden" />
      <span className="hidden xl:inline-flex">
        <Link to="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
          Switch role
        </Link>
      </span>
      <Form method="post" action="/logout">
        <Button type="submit" variant="outline" size="sm">
          Log out
        </Button>
      </Form>
    </div>
  )
}

/** Account actions inside the small-screen sheet menu. */
export function SheetAccount() {
  const session = useSession()
  if (!session) {
    return (
      <Link to="/login" className={buttonVariants({ className: "w-full" })}>
        <Icon name="login" />
        Log in
      </Link>
    )
  }
  const account = accountFor(session)
  return (
    <div data-archetype={session.role} className="space-y-3 rounded-xl border bg-archetype-soft p-4">
      <span className="sr-only">Signed in as</span>
      <PeopleChip name={account.name} role={studioRoleFor(session)} detail="demo" />
      <Link to={ROLE_INFO[session.role].home} className={buttonVariants({ size: "sm", className: "w-full bg-archetype text-on-archetype hover:bg-archetype/90" })}>
        My area
      </Link>
      <div className="flex flex-wrap gap-2">
        <Link to="/login" className={buttonVariants({ variant: "outline", size: "sm" })}>
          Switch role
        </Link>
        <Form method="post" action="/logout">
          <Button type="submit" variant="outline" size="sm">
            Log out
          </Button>
        </Form>
      </div>
    </div>
  )
}
