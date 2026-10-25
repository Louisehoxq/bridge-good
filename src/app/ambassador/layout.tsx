import { RoleShell } from "@/components/app-shell"

export default function Layout({ children }: LayoutProps<"/ambassador">) {
  return <RoleShell role="ambassador">{children}</RoleShell>
}
