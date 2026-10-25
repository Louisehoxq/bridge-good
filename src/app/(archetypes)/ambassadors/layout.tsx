import { ArchetypeShell } from "@/components/archetype-shell"

export default function Layout({ children }: LayoutProps<"/ambassadors">) {
  return <ArchetypeShell archetype="ambassador">{children}</ArchetypeShell>
}
