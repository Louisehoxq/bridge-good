import { useRouteLoaderData } from "react-router"
import type { Role } from "@/lib/roles"

/** The demo role read from the session cookie by the root loader. Null when logged out. */
export function useSessionRole(): Role | null {
  const data = useRouteLoaderData("root") as { role: Role | null } | undefined
  return data?.role ?? null
}
