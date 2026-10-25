import { Form, Link } from "react-router"
import { Icon } from "@/components/icon"
import { accountFor, ROLE_INFO } from "@/lib/roles"
import { useSession } from "@/lib/session"
import { Button, buttonVariants } from "@/components/ui/button"
import { NavLink } from "@/components/nav-link"

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
      <Link to="/login" className={buttonVariants({ size: "default", className: "hidden md:inline-flex" })}>
        <Icon name="login" />
        Log in
      </Link>
    )
  }

  const account = accountFor(session)
  return (
    <div data-archetype={session.role} className="hidden items-center gap-3 md:flex">
      <p className="hidden text-right text-sm leading-tight lg:block">
        <span className="block font-bold">{account.name}</span>
        <span className="text-muted-foreground">Signed in as {account.label.toLowerCase()} (demo)</span>
      </p>
      <span
        className="flex size-10 items-center justify-center rounded-full bg-archetype font-bold text-on-archetype"
        aria-hidden="true"
      >
        {account.name.charAt(0)}
      </span>
      <Link to="/login" className={buttonVariants({ variant: "ghost", size: "sm", className: "hidden xl:inline-flex" })}>
        Switch role
      </Link>
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
    <div data-archetype={session.role} className="space-y-3 rounded-xl bg-archetype-soft p-4">
      <p className="leading-tight">
        <span className="block font-bold">{account.name}</span>
        <span className="text-sm text-muted-foreground">Signed in as {account.label.toLowerCase()} (demo)</span>
      </p>
      <Link to={ROLE_INFO[session.role].home} className={buttonVariants({ size: "sm", className: "w-full bg-archetype text-on-archetype hover:bg-archetype/90" })}>
        My area
      </Link>
      <div className="flex gap-2">
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
