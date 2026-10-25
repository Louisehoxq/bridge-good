import { useRouteLoaderData } from "react-router"
import type { Role, Session } from "@/lib/roles"

/** The demo session read from the cookie by the root loader. Null when logged out. */
export function useSession(): Session | null {
  const data = useRouteLoaderData("root") as { session: Session | null } | undefined
  return data?.session ?? null
}

/**
 * The server's clock when the page loaded. Event pages use it to decide what's upcoming, so the server and the
 * browser render the same list.
 */
export function useServerNow(): number {
  const data = useRouteLoaderData("root") as { now?: number } | undefined
  return data?.now ?? 0
}

/** The demo role read from the session cookie by the root loader. Null when logged out. */
export function useSessionRole(): Role | null {
  return useSession()?.role ?? null
}
