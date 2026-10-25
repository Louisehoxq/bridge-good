import type { Metadata } from "next"
import { FileTextIcon } from "lucide-react"
import { PageHeader } from "@/components/app-shell"
import { LEGAL_TEMPLATES } from "@/content/toolkits"

export const metadata: Metadata = { title: "Funding & legal templates" }

export default function LegalPage() {
  return (
    <>
      <PageHeader eyebrow="Funding & legal templates · coming soon" title="Standard documents">
        Standardised financial documents, contracts and legal templates, planned for a later release. They&apos;ll be
        reviewed by BRIDGEGOOD&apos;s advisers before publishing.
      </PageHeader>
      <ul className="max-w-4xl divide-y rounded-xl border">
        {LEGAL_TEMPLATES.map((t) => (
          <li key={t.name} className="flex items-center gap-4 p-4">
            <FileTextIcon className="size-5 shrink-0 text-archetype" aria-hidden="true" />
            <span className="flex-1">
              <span className="block font-bold">{t.name}</span>
              <span className="text-sm text-muted-foreground">{t.description}</span>
            </span>
            <span className="rounded-full bg-muted px-3 py-1 text-sm">Coming soon</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 max-w-4xl text-sm text-muted-foreground">
        Templates are general guidance, not legal advice. Partners should seek their own advice where needed.
      </p>
    </>
  )
}
