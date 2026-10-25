import type { Metadata } from "next"
import { SparklesIcon } from "lucide-react"
import { PageHeader } from "@/components/app-shell"

export const metadata: Metadata = { title: "AI Reflection Companion" }

export default function ReflectionPage() {
  return (
    <>
      <PageHeader eyebrow="AI Reflection Companion" title="Coming soon">
        A companion to help you reflect on your projects each week. Details are still being designed with BRIDGEGOOD.
      </PageHeader>
      <div className="grid max-w-5xl gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border-2 border-dashed border-archetype p-6">
          <SparklesIcon className="mb-3 size-8 text-archetype" aria-hidden="true" />
          <h2 className="text-xl font-bold">What we&apos;re planning</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Gentle prompts that connect your week&apos;s work to the principles</li>
            <li>Helps you put lived experience into words for your portfolio</li>
            <li>Your reflections stay yours, and you choose what to share with mentors</li>
          </ul>
        </div>
        <div className="rounded-2xl bg-muted p-6">
          <h2 className="text-xl font-bold">Commitments</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>It supports your mentors. It doesn&apos;t replace them.</li>
            <li>It never makes decisions about you or grades your work.</li>
            <li>It&apos;s clearly labelled as AI, with its limits explained.</li>
          </ul>
        </div>
      </div>
    </>
  )
}
