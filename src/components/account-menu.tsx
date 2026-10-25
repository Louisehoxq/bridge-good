import { Form, Link } from "react-router"
import { Icon } from "@/components/icon"
import { ROLE_INFO } from "@/lib/roles"
import { useSessionRole } from "@/lib/session"
import { Button, buttonVariants } from "@/components/ui/button"
import { NavLink } from "@/components/nav-link"

export function DashboardLink() {
  const role = useSessionRole()
  if (!role) return null
  return (
    <NavLink href={ROLE_INFO[role].home} variant="top">
      My {ROLE_INFO[role].label.toLowerCase()} area
    </NavLink>
  )
}

export function AccountMenu() {
  const role = useSessionRole()

  if (!role) {
    return (
      <Link to="/login" className={buttonVariants({ size: "default", className: "hidden md:inline-flex" })}>
        <Icon name="login" />
        Log in
      </Link>
    )
  }

  const info = ROLE_INFO[role]
  return (
    <div data-archetype={role} className="hidden items-center gap-3 md:flex">
      <p className="hidden text-right text-sm leading-tight lg:block">
        <span className="block font-bold">{info.demoAccount.name}</span>
        <span className="text-muted-foreground">Signed in as {info.label.toLowerCase()} (demo)</span>
      </p>
      <span
        className="flex size-10 items-center justify-center rounded-full bg-archetype font-bold text-on-archetype"
        aria-hidden="true"
      >
        {info.demoAccount.name.charAt(0)}
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
  const role = useSessionRole()
  if (!role) {
    return (
      <Link to="/login" className={buttonVariants({ className: "w-full" })}>
        <Icon name="login" />
        Log in
      </Link>
    )
  }
  const info = ROLE_INFO[role]
  return (
    <div data-archetype={role} className="space-y-3 rounded-xl bg-archetype-soft p-4">
      <p className="leading-tight">
        <span className="block font-bold">{info.demoAccount.name}</span>
        <span className="text-sm text-muted-foreground">Signed in as {info.label.toLowerCase()} (demo)</span>
      </p>
      <Link to={info.home} className={buttonVariants({ size: "sm", className: "w-full bg-archetype text-on-archetype hover:bg-archetype/90" })}>
        My {info.label.toLowerCase()} area
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
