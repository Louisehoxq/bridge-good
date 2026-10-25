import type { Metadata } from "next"
import { PageHeader } from "@/components/app-shell"
import { PARTNER_FAQS, PROBLEM_OWNER_TOOLKIT } from "@/content/toolkits"
import { ToolkitList } from "@/components/toolkit-list"

export const metadata: Metadata = { title: "Toolkit & FAQs" }

export default function PartnerToolkit() {
  return (
    <>
      <PageHeader eyebrow="Toolkit & FAQs" title="Resources for resource-constrained organisations">
        Guides and templates for working with a student team. Downloads are placeholders for now.
      </PageHeader>
      <section aria-labelledby="toolkit-title" className="mb-14">
        <h2 id="toolkit-title" className="mb-6 text-2xl font-bold">
          Toolkit
        </h2>
        <ToolkitList sections={PROBLEM_OWNER_TOOLKIT} />
      </section>
      <section aria-labelledby="faq-title">
        <h2 id="faq-title" className="mb-6 text-2xl font-bold">
          Frequently asked questions
        </h2>
        <ul className="grid gap-4 lg:grid-cols-2">
          {PARTNER_FAQS.map((f) => (
            <li key={f.q} className="rounded-xl border bg-card">
              <details className="group">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 p-5 font-bold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="text-2xl text-archetype transition-transform group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="border-t px-5 py-4">{f.a}</p>
              </details>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
