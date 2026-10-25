import { Outlet } from "react-router"
import { AppShell } from "@/components/app-shell"
import { PathStrip } from "@/components/path/path-strip"

/** The public library. Open to everyone; signed-in visitors also see where each page sits on their path. */
export default function LibraryLayout() {
  return (
    <AppShell>
      <PathStrip />
      <Outlet />
    </AppShell>
  )
}
