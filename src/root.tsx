import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState, type ReactNode } from "react"
import { isRouteErrorResponse, Link, Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router"
import type { Route } from "./+types/root"
import { AppShell } from "@/components/app-shell"
import { buttonVariants } from "@/components/ui/button"
import { getSessionRole } from "@/lib/session.server"
import { pageMeta } from "@/lib/meta"
import "./app.css"

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.ico" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  // Bridge Studio type: Atkinson Hyperlegible Next (body), Bricolage Grotesque (headings), Atkinson Hyperlegible Mono (code).
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Mono:wght@400..700&family=Atkinson+Hyperlegible+Next:wght@400..800&family=Bricolage+Grotesque:opsz,wght@12..96,600..700&display=swap",
  },
]

export const meta = () => pageMeta()

/** Security headers for every page (resource routes such as /api/scope set their own). */
export const headers: Route.HeadersFunction = () => ({
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "DENY",
  "Content-Security-Policy": "frame-ancestors 'none'",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
})

export async function loader({ request }: Route.LoaderArgs) {
  return { role: await getSessionRole(request) }
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only z-50 rounded-md bg-primary px-4 py-3 font-semibold text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:px-4 focus:py-3"
        >
          Skip to main content
        </a>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  // Server data (none yet beyond the AI chat) goes through TanStack Query, one client per browser session.
  const [queryClient] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const notFound = isRouteErrorResponse(error) && error.status === 404
  if (!notFound) console.error(error)
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="headline-large font-bold">{notFound ? "We can't find that page" : "Something went wrong"}</h1>
        <p className="body-large text-muted-foreground">
          {notFound
            ? "The link may be out of date. Start again from the welcome page."
            : "Try again in a moment. If you were filling in a form, your demo data is still saved in this browser."}
        </p>
        <Link to="/" className={buttonVariants()}>
          Go to the welcome page
        </Link>
      </div>
    </AppShell>
  )
}
