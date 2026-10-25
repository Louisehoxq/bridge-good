import { data } from "react-router"
import type { Route } from "./+types/login"
import { AppShell } from "@/components/app-shell"
import { LoginChooser } from "@/components/login-chooser"
import { pageMeta } from "@/lib/meta"
import { isRole } from "@/lib/roles"
import { loginAs } from "@/lib/session.server"

export const meta = () => pageMeta("Log in")

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData()
  const role = form.get("role")
  if (!isRole(role)) return data({ error: "Choose one of the demo accounts." }, { status: 400 })
  return loginAs(role, String(form.get("next") ?? ""))
}

export default function LoginPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-10 max-w-2xl space-y-3">
          <h1 className="type-title-1">Log in</h1>
          <p className="type-body-lg text-muted-foreground">
            Everything on BridgeGoodx is open to everyone without logging in. Two demo accounts add their own areas:
            company hosts, and the BRIDGEGOOD stewards who review Living Playbook contributions. There&apos;s no password.
          </p>
        </div>
        <LoginChooser />
      </div>
    </AppShell>
  )
}
