import { ArchetypeShell } from "@/components/archetype-shell"

export default function Layout({ children }: LayoutProps<"/problem-owners">) {
  return <ArchetypeShell archetype="problem-owner">{children}</ArchetypeShell>
}
