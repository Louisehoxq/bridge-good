import { Icon } from "@/components/icon"
import { OUTCOME_LABEL, PROBLEMS } from "@/content/problems"
import { TRAINING, type Audience } from "@/content/training"
import { PillarChip } from "@/components/library/library-page"
import { SyntheticBadge } from "@/components/synthetic-badge"

/** One audience's training: modules, a one-page explainer, and example case studies. */
export function TrainingTrack({ audience, headingLevel = 2 }: { audience: Audience; headingLevel?: 2 | 3 }) {
  const track = TRAINING[audience]
  const H = headingLevel === 2 ? "h2" : "h3"
  const Sub = headingLevel === 2 ? "h3" : "h4"
  const cases = PROBLEMS.filter((p) => track.caseStudies.includes(p.id))

  return (
    <div className="grid gap-10 xl:grid-cols-[3fr_2fr]">
      <section aria-labelledby={`${audience}-modules`}>
        <H id={`${audience}-modules`} className="mb-4 type-title-2">
          Modules
        </H>
        <ul className="space-y-4">
          {track.modules.map((m) => (
            <li key={m.title} className="rounded-xl border bg-card p-5">
              <div>
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
                <Sub className="mt-1 type-title-3">{m.title}</Sub>
                <p className="mt-1 text-muted-foreground">{m.summary}</p>
                <p className="mt-2">
                  <span className="font-bold">You&apos;ll be able to: </span>
                  {m.outcomes.join(" · ")}
                </p>
                {m.pillarIds && (
                  <ul className="mt-3 flex flex-wrap gap-x-1.5 gap-y-2" aria-label="Pillars">
                    {m.pillarIds.map((id) => (
                      <li key={id}>
                        <PillarChip id={id} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-muted-foreground">Videos and downloads are placeholders until BRIDGEGOOD supplies them.</p>
      </section>

      <div className="space-y-8">
        <section aria-labelledby={`${audience}-explainer`} className="rounded-2xl border-2 border-archetype bg-archetype-soft p-6">
          <H id={`${audience}-explainer`} className="type-title-3">
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
          <H id={`${audience}-cases`} className="mb-4 type-title-3">
            Example case studies <SyntheticBadge />
          </H>
          <ul className="space-y-3">
            {cases.map((c) => (
              <li key={c.id} className="rounded-xl border bg-card p-4">
                <p className="font-bold">{c.title}</p>
                <p className="mt-1 text-muted-foreground">
                  {c.organizationType} · {c.location}
                </p>
                {c.outcome && (
                  <p className="mt-2">
                    <span className="font-bold">{OUTCOME_LABEL}: </span>
                    {c.outcome}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
