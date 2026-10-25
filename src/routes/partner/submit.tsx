import type { Route } from "./+types/submit"
import { PageHeader } from "@/components/app-shell"
import { ScopingStudio } from "@/components/partner/scoping-studio"
import { isAiConfigured } from "@/lib/ai.server"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Submit a problem")

export function loader() {
  return { aiEnabled: isAiConfigured() }
}

export default function SubmitPage({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <PageHeader eyebrow="Submit a problem" title="Shape your problem into a project brief">
        Describe what isn&apos;t working, in plain language. The assistant asks questions and drafts the brief. You stay in
        control of every word.
      </PageHeader>
      <ScopingStudio aiEnabled={loaderData.aiEnabled} />
    </>
  )
}
