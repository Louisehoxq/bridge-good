import { PageHeader } from "@/components/app-shell"
import { Icon } from "@/components/icon"
import { HOST_EXPLAINER, HOST_MODULES, VETTING } from "@/content/company-host"
import { PRINCIPLES } from "@/content/philosophy"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Company host guide")

export default function HostGuide() {
  return (
    <>
      <PageHeader title="Company host guide">
        For partner companies and corporate stakeholders who fund, host or mentor, and want to carry the approach into their
        own work.
      </PageHeader>
      <div className="space-y-12">
        <section aria-labelledby="explainer-title" className="rounded-2xl border-2 border-archetype bg-archetype-soft p-6">
          <h2 id="explainer-title" className="type-title-2">
            One-page explainer
          </h2>
          <dl className="mt-4 grid gap-4 lg:grid-cols-3">
            {HOST_EXPLAINER.map((e) => (
              <div key={e.heading}>
                <dt className="font-bold">{e.heading}</dt>
                <dd className="mt-1">{e.body}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="modules-title">
          <h2 id="modules-title" className="mb-4 type-title-2">
            Modules
          </h2>
          <ol className="grid gap-4 md:grid-cols-2">
            {HOST_MODULES.map((m, i) => (
              <li key={m.title} className="rounded-xl border bg-card p-5">
                <p className="flex flex-wrap items-center gap-3 text-muted-foreground">
                  <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                    <Icon name="circle-play" className="text-base" />
                    {m.format}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Icon name="clock" className="text-base" />
                    {m.duration}
                  </span>
                </p>
                <h3 className="mt-1 type-title-3">
                  <span className="sr-only">Module {i + 1}: </span>
                  {m.title}
                </h3>
                <p className="mt-1 text-muted-foreground">{m.summary}</p>
                <p className="mt-2">
                  <span className="font-semibold">You&apos;ll be able to: </span>
                  {m.outcomes.join(" · ")}
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-muted-foreground">Videos and downloads are placeholders until BRIDGEGOOD supplies them.</p>
        </section>

        <section aria-labelledby="principles-title">
          <h2 id="principles-title" className="mb-4 type-title-2">
            The principles, in a company
          </h2>
          <ul className="grid gap-3 md:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <li key={p.id} className="rounded-xl border bg-card p-4">
                <p className="font-bold">{p.title}</p>
                <p className="mt-1 text-muted-foreground">{p.question}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="vetted" aria-labelledby="vetting-title" className="scroll-mt-24">
          <h2 id="vetting-title" className="type-title-2">
            What BRIDGEGOOD looks for in a company host
          </h2>
          <p className="mt-2 mb-4 max-w-3xl text-muted-foreground">{VETTING.howItWorks}</p>
          <dl className="grid gap-3 md:grid-cols-2">
            {VETTING.criteria.map((c) => (
              <div key={c.name} className="rounded-xl border bg-card p-4">
                <dt className="font-bold">{c.name}</dt>
                <dd className="mt-1">{c.lookFor}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 rounded-lg bg-surface-sunken p-3">{VETTING.neverAsked}</p>
        </section>
      </div>
    </>
  )
}
