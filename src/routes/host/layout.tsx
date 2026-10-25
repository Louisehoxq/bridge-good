import { Outlet } from "react-router"
import type { Route } from "./+types/layout"
import { RoleShell } from "@/components/app-shell"
import { requireRole } from "@/lib/session.server"

export async function loader({ request }: Route.LoaderArgs) {
  await requireRole(request, "company-host")
  return null
}

export default function Layout() {
  return (
    <RoleShell role="company-host">
      <Outlet />
    </RoleShell>
  )
}
