import { Icon } from "@/components/icon"
import { PageHeader } from "@/components/app-shell"
import { LEGAL_TEMPLATES, PARTNER_FAQS, PROBLEM_OWNER_TOOLKIT } from "@/content/toolkits"
import { ToolkitList } from "@/components/toolkit-list"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Toolkit & FAQs")

export default function PartnerToolkit() {
  return (
    <>
      <PageHeader title="Resources for organizations with small teams and budgets">
        Guides and templates for working with an apprentice team. Downloads are placeholders for now.
      </PageHeader>
      <section aria-labelledby="toolkit-title" className="mb-14">
        <h2 id="toolkit-title" className="mb-6 type-title-2">
          Toolkit
        </h2>
        <ToolkitList sections={PROBLEM_OWNER_TOOLKIT} />
      </section>

      <section id="legal" aria-labelledby="legal-title" className="mb-14 max-w-4xl scroll-mt-24">
        <h2 id="legal-title" className="type-title-2">
          Funding and legal templates
        </h2>
        <p className="mt-1 mb-4 text-muted-foreground">
          Standard financial documents, contracts and legal templates are planned for a later release. BRIDGEGOOD&apos;s
          advisors will review them before they&apos;re published. They&apos;ll be general guidance, not legal advice.
        </p>
        <ul className="divide-y rounded-xl border bg-card">
          {LEGAL_TEMPLATES.map((t) => (
            <li key={t.name} className="flex flex-wrap items-center gap-x-4 gap-y-2 p-4">
              <Icon name="description" className="shrink-0 text-archetype" />
              <span className="min-w-0 flex-1 basis-56">
                <span className="block font-bold">{t.name}</span>
                <span className="text-muted-foreground">{t.description}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 type-small font-semibold">
                <Icon name="hourglass" className="text-base" />
                Coming soon
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="faq-title">
        <h2 id="faq-title" className="mb-6 type-title-2">
          Frequently asked questions
        </h2>
        <ul className="grid gap-4 lg:grid-cols-2">
          {PARTNER_FAQS.map((f) => (
            <li key={f.q} className="rounded-xl border bg-card">
              <details className="group">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 p-5 font-bold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <Icon name="chevron-down" className="text-archetype transition-transform group-open:rotate-180" />
                </summary>
                <div className="space-y-2 border-t px-5 py-4">
                  <p>{f.a}</p>
                  {f.draft && <p className="font-semibold text-muted-foreground">Draft: BRIDGEGOOD will confirm</p>}
                </div>
              </details>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
