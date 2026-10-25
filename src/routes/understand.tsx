import { Link } from "react-router"
import { AppShell } from "@/components/app-shell"
import { PublicPage } from "@/components/cycle"
import { Icon } from "@/components/icon"
import { PRINCIPLES } from "@/content/philosophy"
import { LAB_SCENARIOS } from "@/content/lab"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Understand")

/** How Design for Social Good differs from claims that sound similar. */
const DIFFERENCES = [
  {
    claim: "“We're human-centered.”",
    gap: "Designing around user needs is a foundation, not the whole idea. It can still leave the team deciding everything from a distance.",
    here: "The people closest to a challenge help shape the problem and judge the result. And the designers' own growth counts as an outcome.",
  },
  {
    claim: "“We value inclusion.”",
    gap: "Inviting people in doesn't change who decides. Without removing barriers, the same voices show up every time.",
    here: "Name who's missing, remove the barriers (language, disability, schedule, cost, trust), and make room for people to take part with dignity.",
  },
  {
    claim: "“We create social impact.”",
    gap: "Impact claimed by the organization, measured in reach or page views, can miss what changed for the people involved.",
    here: "Describe the change in the community's own terms, with evidence: time saved, access gained, trust built, doors opened.",
  },
]

/** What the words mean here, so they don't turn into branding language. */
const TERMS = [
  { term: "Access", meaning: "Everyone, including disabled people and people with limited data, older devices or other languages, can perceive, understand, use and afford what's designed." },
  { term: "Inclusion", meaning: "Changing who decides, not only who is invited." },
  { term: "Community benefit", meaning: "A real, observable change for the people affected, described in their terms." },
  { term: "Economic mobility", meaning: "Skills, relationships, a portfolio and confidence that open doors to work people choose, by their own definition of success." },
]

export default function UnderstandPage() {
  return (
    <AppShell>
      <PublicPage
        title="Understand"
        stage="understand"
        next={{ label: "Practice in the Decision Lab", href: "/lab" }}
        lede="Explore the values and the reasoning behind them: what Design for Social Good means at BRIDGEGOOD, why it matters, and how it differs from generic claims about inclusion or human-centered design."
      >
        <div className="space-y-16">
          <section aria-labelledby="principles-title">
            <h2 id="principles-title" className="type-title-2">
              The principles behind the practice
            </h2>
            <p className="mt-2 mb-6 text-muted-foreground italic">Not rules to follow blindly, but questions to return to.</p>
            <div className="space-y-6">
              {PRINCIPLES.map((p) => (
                <article key={p.id} id={p.id} aria-labelledby={`${p.id}-title`} className="scroll-mt-24 rounded-2xl border bg-card p-6 lg:p-8">
                  <div className="grid gap-8 lg:grid-cols-[2fr_3fr]">
                    <div className="space-y-3">
                      <p className="w-fit border-b-4 border-gold pb-1 font-heading text-2xl font-bold text-action" aria-hidden="true">
                        {p.number}
                      </p>
                      <h3 id={`${p.id}-title`} className="type-title-2">
                        <span className="sr-only">Principle {p.number}: </span>
                        {p.title}
                      </h3>
                      <p className="type-body-lg">{p.body}</p>
                      <p className="rounded-lg bg-note p-3">
                        <span className="font-semibold">Return to this question: </span>
                        {p.question}
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-bold">Why it matters</h4>
                        <p>{p.reasoning}</p>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="rounded-lg border-2 border-action p-4">
                          <h4 className="flex items-center gap-2 font-bold">
                            <Icon name="circle-check" className="text-success" />
                            A design choice that reflects it
                          </h4>
                          <p className="mt-1">{p.example.choice}</p>
                        </div>
                        <div className="rounded-lg bg-surface-sunken p-4">
                          <h4 className="flex items-center gap-2 font-bold">
                            <Icon name="info" />
                            The generic alternative
                          </h4>
                          <p className="mt-1">{p.example.generic}</p>
                        </div>
                      </div>
                      <p className="text-muted-foreground">Synthetic example, for illustration.</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="different" aria-labelledby="different-title" className="scroll-mt-24">
            <h2 id="different-title" className="type-title-2">
              How this differs from generic claims
            </h2>
            <p className="mt-2 mb-6 max-w-3xl text-muted-foreground">
              Many organizations say similar things. The difference is in what people actually do.
            </p>
            <div className="overflow-x-auto rounded-xl border" role="region" aria-label="Generic claims compared with Design for Social Good" tabIndex={0}>
              <table className="w-full min-w-[48rem] border-collapse text-left">
                <thead className="bg-muted">
                  <tr>
                    <th scope="col" className="p-4">
                      The generic claim
                    </th>
                    <th scope="col" className="p-4">
                      What it can miss
                    </th>
                    <th scope="col" className="bg-action p-4 text-on-action">
                      Design for Social Good asks
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {DIFFERENCES.map((d) => (
                    <tr key={d.claim} className="border-t align-top">
                      <th scope="row" className="p-4 font-semibold">
                        {d.claim}
                      </th>
                      <td className="p-4 text-muted-foreground">{d.gap}</td>
                      <td className="p-4">{d.here}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section aria-labelledby="terms-title">
            <h2 id="terms-title" className="type-title-2">
              Being specific about social good
            </h2>
            <p className="mt-2 mb-6 max-w-3xl text-muted-foreground">
              What these words mean here, so they describe real situations instead of working as branding.
            </p>
            <dl className="grid gap-4 md:grid-cols-2">
              {TERMS.map((t) => (
                <div key={t.term} className="rounded-xl border bg-card p-5">
                  <dt className="type-title-3">{t.term}</dt>
                  <dd className="mt-1">{t.meaning}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="tensions-title">
            <h2 id="tensions-title" className="type-title-2">
              Realistic tensions
            </h2>
            <p className="mt-2 mb-6 max-w-3xl text-muted-foreground">
              Values meet real limits: budgets, timelines, competing needs. These dilemmas have more than one defensible
              answer. Work through one in the Decision Lab.
            </p>
            <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {LAB_SCENARIOS.map((s) => (
                <li key={s.slug}>
                  <Link to={`/lab/${s.slug}`} className="flex h-full flex-col gap-2 rounded-xl border bg-card p-5 hover:border-action">
                    <span className="type-small font-semibold text-muted-foreground">{s.theme}</span>
                    <span className="type-title-3">{s.title}</span>
                    <span className="mt-auto inline-flex items-center gap-1 pt-2 font-semibold text-action">
                      Work through it
                      <Icon name="arrow-right" className="text-base" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="power-title" className="rounded-2xl bg-surface-sunken p-6 lg:p-8">
            <h2 id="power-title" className="type-title-2">
              Questions to examine assumptions and power
            </h2>
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {[
                "Who is affected by this design, and whose perspective might be missing?",
                "Who decided what the problem is? Who benefits if we solve it this way?",
                "What are we assuming about people's devices, language, time, money or trust?",
                "Who carries the risk if this goes wrong, and did they have a say?",
                "What would the people closest to this challenge say about our plan?",
                "What evidence would change our minds?",
              ].map((q) => (
                <li key={q} className="flex gap-3 rounded-lg bg-card p-4">
                  <Icon name="sparkles" className="mt-1 text-action" />
                  {q}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </PublicPage>
    </AppShell>
  )
}
