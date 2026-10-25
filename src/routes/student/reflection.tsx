import type { Route } from "./+types/reflection"
import { PageHeader } from "@/components/app-shell"
import { ContrastChecker } from "@/components/reflection/contrast-checker"
import { ReflectionCompanion } from "@/components/reflection/reflection-companion"
import { SavedReflections, SharedWithMentor } from "@/components/reflection/shared-lists"
import { isAiConfigured } from "@/lib/ai.server"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("AI Reflection Companion")

/** Read at request time, so adding a key needs no rebuild. */
export function loader() {
  return { aiEnabled: isAiConfigured() }
}

export default function ReflectionPage({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <PageHeader eyebrow="AI Reflection Companion" title="Reflect on your work with questions, not grades">
        Describe a mini project or capstone sprint. The companion is AI: it asks questions tied to BRIDGEGOOD&apos;s Design for Social Good
        pillars, and it never scores your work. You decide what to keep and what to share with your mentor.
      </PageHeader>
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <ReflectionCompanion aiEnabled={loaderData.aiEnabled} />
        <aside aria-label="Your reflections and tools" className="space-y-6">
          <SharedWithMentor />
          <SavedReflections />
          <ContrastChecker />
        </aside>
      </div>
    </>
  )
}
