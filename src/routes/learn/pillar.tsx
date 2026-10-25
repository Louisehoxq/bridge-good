import { data, Link } from "react-router"
import type { Route } from "./+types/pillar"
import { LibraryPage, PromptList } from "@/components/library/library-page"
import { SyntheticBadge } from "@/components/synthetic-badge"
import { DidntFit, pillarTarget } from "@/components/feedback/didnt-fit" // Milestone 3 hook
import { FieldNotes, FrameworkVersion, OfficialWording } from "@/components/feedback/framework-hooks" // Milestone 3 hook
import { PILLARS, type PillarId } from "@/content/framework"
import { RUBRIC } from "@/content/seed"
import { TRAINING } from "@/content/training"
import { TRACKS } from "@/lib/library"
import { pageMeta } from "@/lib/meta"

export function loader({ params }: Route.LoaderArgs) {
  const pillar = PILLARS.find((p) => p.id === params.pillarId)
  if (!pillar) throw data(null, { status: 404 })
  return { id: pillar.id as PillarId }
}

export const meta = ({ loaderData }: Route.MetaArgs) => pageMeta(PILLARS.find((p) => p.id === loaderData?.id)?.name ?? "Pillar")

export default function PillarPage({ loaderData }: Route.ComponentProps) {
  const pillar = PILLARS.find((p) => p.id === loaderData.id)!
  const modules = TRACKS.flatMap((t) =>
    TRAINING[t.audience].modules.filter((m) => m.pillarIds?.includes(pillar.id)).map((m) => ({ ...m, track: t }))
  )
  const rubricRows = RUBRIC.filter((r) => r.pillarIds.includes(pillar.id))

  return (
    <LibraryPage
      href={`/learn/pillars/${pillar.id}`}
      title={pillar.name}
      intro={<p>Pillar {pillar.number} of {PILLARS.length} in the Design for Social Good framework.</p>}
    >
      <div className="grid gap-10 lg:grid-cols-[3fr_2fr]">
        <div className="space-y-10">
          <section aria-labelledby="meaning-title">
            <h2 id="meaning-title" className="mb-3 type-title-2">
              What it means
            </h2>
            <OfficialWording pillarId={pillar.id} />
          </section>

          {/* Milestone 3 hook: recognized local adaptations, beneath BRIDGEGOOD's official wording. */}
          <FieldNotes pillarId={pillar.id} />

          <section aria-labelledby="example-title" className="rounded-2xl bg-muted p-6">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <h2 id="example-title" className="type-title-2">
                What it looks like in a project
              </h2>
              <SyntheticBadge />
            </div>
            <p className="type-body-lg">{pillar.inPractice}</p>
          </section>

          <section aria-labelledby="prompts-title">
            <h2 id="prompts-title" className="mb-2 type-title-2">
              Questions to ask yourself
            </h2>
            <p className="mb-4 text-muted-foreground">
              Answer in your own words. Nobody scores the answers. They come up again{" "}
              <Link to="/learn/prompts" className="underline underline-offset-4">
                at the moments decisions get made
              </Link>
              .
            </p>
            <PromptList prompts={pillar.promptIds} />
          </section>
        </div>

        <aside className="space-y-6">
          <section aria-labelledby="outcome-title" className="rounded-2xl border-2 border-primary p-6">
            <h2 id="outcome-title" className="type-title-3">
              Learning outcome
            </h2>
            <p className="mt-2 type-body-lg">{pillar.learningOutcome}</p>
          </section>

          {modules.length > 0 && (
            <section aria-labelledby="modules-title" className="rounded-2xl border bg-card p-6">
              <h2 id="modules-title" className="type-title-3">
                Where it&apos;s taught
              </h2>
              <ul className="mt-3 space-y-2">
                {modules.map((m) => (
                  <li key={`${m.track.slug}-${m.title}`}>
                    <Link to={`/learn/tracks/${m.track.slug}`} className="underline underline-offset-4">
                      {m.title}
                    </Link>
                    <span className="block text-muted-foreground">
                      {m.track.title} · {m.format}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {rubricRows.length > 0 && (
            <section aria-labelledby="growth-title" className="rounded-2xl border bg-card p-6">
              <h2 id="growth-title" className="type-title-3">
                In growth conversations
              </h2>
              <p className="mt-2 text-muted-foreground">Mentors use these questions when they talk with an apprentice about their work:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {rubricRows.map((r) => (
                  <li key={r.id}>{r.question}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Milestone 3 hook: "this didn't fit" flag. */}
          <DidntFit {...pillarTarget(pillar.id)} />
        </aside>
      </div>
      <p className="mt-10 text-muted-foreground">
        Version <FrameworkVersion />
      </p>
    </LibraryPage>
  )
}
