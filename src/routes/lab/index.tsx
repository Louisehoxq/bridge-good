import { Link } from "react-router"
import { AppShell } from "@/components/app-shell"
import { PublicPage } from "@/components/cycle"
import { Icon } from "@/components/icon"
import { SavedReflections } from "@/components/lab/saved-reflections"
import { SyntheticBadge } from "@/components/synthetic-badge"
import { LAB_SCENARIOS } from "@/content/lab"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Design Decision Lab")

const FLOW = ["Meet the situation", "Choose an approach", "Explore consequences", "Hear other perspectives", "Reflect", "Take it into practice"]

export default function LabIndex() {
  return (
    <AppShell>
      <PublicPage
        title="Design Decision Lab"
        stage="practice"
        next={{ label: "Practice Library", href: "/library" }}
        lede="Work through realistic design dilemmas and explore the reasoning, trade-offs, and potential consequences behind different choices. There's no single correct answer: practice judgment, recognize competing needs, and think about who holds power, who benefits, and who may be excluded."
      >
        <div className="space-y-14">
          <section aria-labelledby="flow-title" className="rounded-2xl bg-surface-sunken p-6">
            <h2 id="flow-title" className="type-title-3">
              How each scenario works
            </h2>
            <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {FLOW.map((f, i) => (
                <li key={f} className="flex items-center gap-3 rounded-lg bg-card p-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-action font-bold text-on-action" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className="font-semibold">
                    <span className="sr-only">Step {i + 1}: </span>
                    {f}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="scenarios-title">
            <h2 id="scenarios-title" className="mb-6 type-title-2">
              Scenarios
            </h2>
            <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {LAB_SCENARIOS.map((s) => (
                <li key={s.slug}>
                  <article aria-labelledby={`${s.slug}-title`} className="flex h-full flex-col gap-3 rounded-2xl border bg-card p-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-muted px-2.5 py-0.5 type-small font-semibold">{s.theme}</span>
                      <SyntheticBadge />
                    </div>
                    <h3 id={`${s.slug}-title`} className="type-title-3">
                      {s.title}
                    </h3>
                    <p className="text-muted-foreground">{s.situation}</p>
                    <Link to={`/lab/${s.slug}`} className="mt-auto inline-flex min-h-12 items-center gap-1 font-semibold text-action underline underline-offset-4">
                      Work through it
                      <Icon name="arrow-right" className="text-base" />
                      <span className="sr-only">: {s.title}</span>
                    </Link>
                  </article>
                </li>
              ))}
            </ul>
          </section>

          <SavedReflections />

          <section aria-labelledby="principles-title" className="grid gap-6 lg:grid-cols-2">
            <div>
              <h2 id="principles-title" className="type-title-3">
                How the Lab is designed
              </h2>
              <ul className="mt-3 list-disc space-y-1.5 pl-5">
                <li>Dilemmas are nuanced, without simplistic heroes and villains.</li>
                <li>It explains reasoning and trade-offs rather than grading you on one answer.</li>
                <li>Multiple approaches can be defensible.</li>
                <li>Every scenario is fictional. No real participant stories, identities, portfolios or artwork.</li>
              </ul>
            </div>
            <div className="rounded-2xl border-2 border-action p-6">
              <h2 className="type-title-3">Success looks like</h2>
              <p className="mt-2">
                You can explain why you chose an approach, identify trade-offs, and name whose perspectives you would involve
                next.
              </p>
              <Link to="/playbook/contribute?kind=scenario" className="mt-3 inline-flex min-h-12 items-center underline underline-offset-4">
                Propose a scenario for the Lab
              </Link>
            </div>
          </section>
        </div>
      </PublicPage>
    </AppShell>
  )
}
