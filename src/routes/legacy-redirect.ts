import { redirect } from "react-router"
import type { Route } from "./+types/legacy-redirect"

const TARGETS: Record<string, string> = {
  "/students": "/student",
  "/ambassadors": "/ambassador",
  "/problem-owners": "/partner",
}

export function loader({ request }: Route.LoaderArgs) {
  return redirect(TARGETS[new URL(request.url).pathname] ?? "/")
}
