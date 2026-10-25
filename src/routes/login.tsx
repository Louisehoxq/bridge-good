import { data } from "react-router"
import type { Route } from "./+types/login"
import { AppShell } from "@/components/app-shell"
import { LoginChooser } from "@/components/login-chooser"
import { pageMeta } from "@/lib/meta"
import { isAmbassadorKind, isRole } from "@/lib/roles"
import { loginAs } from "@/lib/session.server"

export const meta = () => pageMeta("Log in")

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData()
  const role = form.get("role")
  if (!isRole(role)) return data({ error: "Choose one of the demo accounts." }, { status: 400 })
  const kind = form.get("ambassadorKind")
  return loginAs(role, String(form.get("next") ?? ""), isAmbassadorKind(kind) ? kind : undefined)
}

export default function LoginPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-10 max-w-2xl space-y-3">
          <h1 className="headline-large font-bold lg:display-small">Log in</h1>
          <p className="body-large text-muted-foreground">
            This prototype uses demo accounts, so there&apos;s no password. Choose a role to see what BridgeGoodx looks like
            for that person. You can switch at any time.
          </p>
        </div>
        <LoginChooser />
      </div>
    </AppShell>
  )
}
