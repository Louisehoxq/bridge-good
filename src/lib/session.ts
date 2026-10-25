import { useRouteLoaderData } from "react-router"
import type { Role, Session } from "@/lib/roles"

/** The demo session read from the cookie by the root loader. Null when logged out. */
export function useSession(): Session | null {
  const data = useRouteLoaderData("root") as { session: Session | null } | undefined
  return data?.session ?? null
}

/** The demo role read from the session cookie by the root loader. Null when logged out. */
export function useSessionRole(): Role | null {
  return useSession()?.role ?? null
}
