import { ArchetypeShell } from "@/components/archetype-shell"

export default function Layout({ children }: LayoutProps<"/students">) {
  return <ArchetypeShell archetype="student">{children}</ArchetypeShell>
}
