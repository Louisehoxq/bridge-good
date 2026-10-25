import { Icon } from "@/components/icon"
import { PROBLEMS } from "@/content/problems"
import { TRAINING, type Audience } from "@/content/training"
import { SyntheticBadge } from "@/components/synthetic-badge"

/** One audience's training: modules, a one-page explainer, and example case studies. */
export function TrainingTrack({ audience, headingLevel = 2 }: { audience: Audience; headingLevel?: 2 | 3 }) {
  const track = TRAINING[audience]
  const H = headingLevel === 2 ? "h2" : "h3"
  const cases = PROBLEMS.filter((p) => track.caseStudies.includes(p.id))

  return (
    <div className="grid gap-10 xl:grid-cols-[3fr_2fr]">
      <section aria-labelledby={`${audience}-modules`}>
        <H id={`${audience}-modules`} className="mb-4 text-2xl font-bold">
          Modules
        </H>
        <ol className="space-y-4">
          {track.modules.map((m, i) => (
            <li key={m.title} className="grid gap-4 rounded-xl border bg-card p-5 sm:grid-cols-[3rem_1fr]">
              <span
                className="flex size-12 items-center justify-center rounded-full bg-archetype-soft text-lg font-bold text-archetype"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <div>
                <p className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                    <Icon name="play_circle" className="text-base" />
                    {m.format}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Icon name="schedule" className="text-base" />
                    {m.duration}
                  </span>
                </p>
                <p className="mt-1 text-lg font-bold">
                  <span className="sr-only">Module {i + 1}: </span>
                  {m.title}
                </p>
                <p className="mt-1 text-muted-foreground">{m.summary}</p>
                <p className="mt-2 text-sm">
                  <span className="font-bold">You&apos;ll be able to: </span>
                  {m.outcomes.join(" · ")}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-sm text-muted-foreground">Videos and downloads are placeholders until BRIDGEGOOD supplies them.</p>
      </section>

      <div className="space-y-8">
        <section aria-labelledby={`${audience}-explainer`} className="rounded-2xl border-2 border-archetype bg-archetype-soft p-6">
          <H id={`${audience}-explainer`} className="text-xl font-bold">
            One-page explainer: designing for good
          </H>
          <dl className="mt-4 space-y-4">
            {track.explainer.map((e) => (
              <div key={e.heading}>
                <dt className="font-bold">{e.heading}</dt>
                <dd className="mt-1">{e.body}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby={`${audience}-cases`}>
          <H id={`${audience}-cases`} className="mb-4 text-xl font-bold">
            Example case studies
          </H>
          <ul className="space-y-3">
            {cases.map((c) => (
              <li key={c.id} className="rounded-xl border bg-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold">{c.title}</p>
                  <SyntheticBadge />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {c.organisationType} · {c.location}
                </p>
                {c.outcome && <p className="mt-2 text-sm">{c.outcome}</p>}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
