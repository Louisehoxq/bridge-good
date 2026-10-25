import type { Route } from "./+types/reflection"
import { PageHeader } from "@/components/app-shell"
import { ContrastChecker } from "@/components/reflection/contrast-checker"
import { ReflectionCompanion } from "@/components/reflection/reflection-companion"
import { SavedReflections, SharedWithMentor } from "@/components/reflection/shared-lists"
import { evaluatorFreeTierNotice, evaluatorLabel, isEvaluatorConfigured } from "@/lib/evaluator/model.server"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("AI Reflection Companion")

/** Read at request time, so adding a key needs no rebuild. */
export function loader() {
  const aiEnabled = isEvaluatorConfigured()
  return { aiEnabled, modelLabel: evaluatorLabel(), freeTierNotice: aiEnabled ? evaluatorFreeTierNotice() : null }
}

export default function ReflectionPage({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <PageHeader title="Reflection companion (AI): questions about your work, not grades">
        Describe a mini project or capstone sprint. It asks questions tied to BRIDGEGOOD&apos;s Design for Social Good pillars. You decide what to keep and what to share with your mentor.
      </PageHeader>
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <ReflectionCompanion aiEnabled={loaderData.aiEnabled} modelLabel={loaderData.modelLabel} freeTierNotice={loaderData.freeTierNotice} />
        <aside aria-label="Your reflections and tools" className="space-y-6">
          <SharedWithMentor />
          <SavedReflections />
          <ContrastChecker />
        </aside>
      </div>
    </>
  )
}
