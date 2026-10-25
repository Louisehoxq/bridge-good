import { RoleShell } from "@/components/app-shell"

export default function Layout({ children }: LayoutProps<"/mentor">) {
  return <RoleShell role="mentor">{children}</RoleShell>
}
