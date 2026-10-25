import type { Metadata } from "next"
import { Suspense } from "react"
import { AppShell } from "@/components/app-shell"
import { LoginChooser } from "@/components/login-chooser"

export const metadata: Metadata = { title: "Log in" }

export default function LoginPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-10 max-w-2xl space-y-3">
          <h1 className="text-4xl font-bold">Log in</h1>
          <p className="text-lg text-muted-foreground">
            This prototype uses demo accounts, so there&apos;s no password. Choose a role to see what BridgeGoodx looks like
            for that person. You can switch at any time.
          </p>
        </div>
        <Suspense>
          <LoginChooser />
        </Suspense>
      </div>
    </AppShell>
  )
}
