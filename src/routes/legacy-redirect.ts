import { redirect } from "react-router"
import type { Route } from "./+types/legacy-redirect"
import { REDIRECTS } from "./redirects"

/** Permanent redirects for old URLs. Anything under /training/ that isn't a known track goes to the library. */
export function loader({ request }: Route.LoaderArgs) {
  const pathname = new URL(request.url).pathname.replace(/\/$/, "")
  const target = REDIRECTS[pathname] ?? (pathname.startsWith("/training") ? "/learn" : "/")
  return redirect(target, 301)
}
