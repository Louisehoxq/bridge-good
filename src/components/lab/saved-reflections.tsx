import { Link } from "react-router"
import { PinnedNote } from "@/components/studio/pinned-note"
import { scenarioBySlug, REFLECTION_PROMPTS, type ReflectionPromptId } from "@/content/lab"
import { useCollection } from "@/lib/demo-store"

export type LabReflection = {
  id: string
  scenario: string
  approach: string
  reasoning: string
  answers: Partial<Record<ReflectionPromptId, string>>
  at: string
}

const NONE: LabReflection[] = []

export function useLabReflections() {
  return useCollection<LabReflection>("lab-reflections", NONE)
}

/** Reflections saved in this browser. Private to you: they never leave the device. */
export function SavedReflections({ scenario }: { scenario?: string }) {
  const [all] = useLabReflections()
  const items = (scenario ? all.filter((r) => r.scenario === scenario) : all).toReversed()
  if (items.length === 0) return null
  return (
    <section aria-labelledby="saved-title">
      <h2 id="saved-title" className="type-title-2">
        Your saved reflections
      </h2>
      <p className="mt-1 mb-6 text-muted-foreground">Saved in this browser only. Nobody else sees them unless you share a lesson.</p>
      <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((r) => {
          const s = scenarioBySlug(r.scenario)
          return (
            <li key={r.id}>
              <PinnedNote title={s?.title ?? r.scenario}>
                <p className="type-small text-muted-foreground">{r.at}</p>
                <p>
                  <span className="font-semibold">You chose: </span>
                  {r.approach}
                </p>
                {REFLECTION_PROMPTS.map((p) =>
                  r.answers[p.id] ? (
                    <p key={p.id}>
                      <span className="font-semibold">{p.label} </span>
                      {r.answers[p.id]}
                    </p>
                  ) : null
                )}
                {s && (
                  <Link to={`/lab/${s.slug}`} className="inline-flex min-h-12 items-center underline underline-offset-4">
                    Revisit the scenario
                  </Link>
                )}
              </PinnedNote>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
