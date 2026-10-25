import { RoleShell } from "@/components/app-shell"

export default function Layout({ children }: LayoutProps<"/partner">) {
  return <RoleShell role="partner">{children}</RoleShell>
}
