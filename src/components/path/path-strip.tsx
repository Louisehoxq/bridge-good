import { Link, useLocation } from "react-router"
import { usePathProgress } from "@/components/demo/journey-data"
import { pathKeyFor, type PathKey } from "@/lib/paths"
import { accountFor } from "@/lib/roles"
import { useSession } from "@/lib/session"

/** Shown on library pages when someone is signed in: where this page sits on their own path. */
export function PathStrip() {
  const session = useSession()
  const pathKey = session && pathKeyFor(session)
  if (!session || !pathKey) return null
  return <Strip pathKey={pathKey} role={session.role} label={accountFor(session).label} />
}

function Strip({ pathKey, role, label }: { pathKey: PathKey; role: string; label: string }) {
  const { pathname } = useLocation()
  const { path, stages, current } = usePathProgress(pathKey)
  const linked = stages.findIndex((s) => s.learn.some((l) => l.href === pathname))
  const step = linked >= 0 ? linked : current

  return (
    <aside aria-label="Your path" data-archetype={role} className="border-b bg-archetype-soft print:hidden">
      <p className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2 sm:px-6 lg:px-8">
        <span>
          <span className="sr-only">{label}: </span>
          {linked >= 0 ? "Part of " : "You're on "}
          <span className="font-bold">
            step {step + 1} of your path: {stages[step].title}
          </span>
        </span>
        <span aria-hidden="true">·</span>
        <Link to={path.home} className="inline-flex min-h-12 items-center font-semibold text-archetype underline underline-offset-4">
          Back to your path
        </Link>
      </p>
    </aside>
  )
}
