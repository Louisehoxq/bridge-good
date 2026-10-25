import { RoleShell } from "@/components/app-shell"

export default function Layout({ children }: LayoutProps<"/student">) {
  return <RoleShell role="student">{children}</RoleShell>
}
