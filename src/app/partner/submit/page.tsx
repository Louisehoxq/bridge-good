import type { Metadata } from "next"
import { PageHeader } from "@/components/app-shell"
import { ScopingStudio } from "@/components/partner/scoping-studio"

export const metadata: Metadata = { title: "Submit a problem" }

export default function SubmitPage() {
  const aiEnabled = Boolean(process.env.ANTHROPIC_API_KEY || process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN)
  return (
    <>
      <PageHeader eyebrow="Submit a problem" title="Shape your problem into a capstone brief">
        Describe what isn&apos;t working, in plain language. The assistant asks questions and drafts the brief. You stay in
        control of every word.
      </PageHeader>
      <ScopingStudio aiEnabled={aiEnabled} />
    </>
  )
}
