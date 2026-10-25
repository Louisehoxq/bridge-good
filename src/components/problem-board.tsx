import { Icon, type IconName } from "@/components/icon"
import { OUTCOME_LABEL, PROBLEMS, STATUS_LABEL, type ProblemStatus } from "@/content/problems"
import { SyntheticBadge } from "@/components/synthetic-badge"

/** Each project status has an icon as well as a word, so it never depends on color. */
const STATUS_ICON: Record<ProblemStatus, IconName> = {
  "needs-sponsor": "hourglass",
  "open-for-students": "clipboard-list",
  "in-progress": "pencil-ruler",
  completed: "circle-check",
}

export function ProblemBoard({ status }: { status?: ProblemStatus[] }) {
  const problems = status ? PROBLEMS.filter((p) => status.includes(p.status)) : PROBLEMS

  return (
    <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {problems.map((p) => (
        <li key={p.id}>
          <article aria-labelledby={`${p.id}-title`} className="flex h-full flex-col gap-3 rounded-xl border bg-card p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 type-small font-semibold">
                <Icon name={STATUS_ICON[p.status]} className="text-base" />
                {STATUS_LABEL[p.status]}
              </span>
              {p.synthetic && <SyntheticBadge />}
            </div>
            <h3 id={`${p.id}-title`} className="type-title-3">
              {p.title}
            </h3>
            <p className="text-muted-foreground">{p.organizationType}</p>
            <p>{p.summary}</p>
            {p.outcome && (
              <p className="rounded-lg bg-archetype-soft p-3">
                <span className="font-bold">{OUTCOME_LABEL}: </span>
                {p.outcome}
                {p.team && <span className="mt-1 block text-muted-foreground">Team: {p.team}</span>}
              </p>
            )}
            <dl className="mt-auto space-y-1.5">
              <div className="flex gap-2">
                <dt>
                  <Icon name="map-pin" className="translate-y-0.5" />
                  <span className="sr-only">Location</span>
                </dt>
                <dd>{p.location}</dd>
              </div>
              <div className="flex gap-2">
                <dt>
                  <Icon name="users" className="translate-y-0.5" />
                  <span className="sr-only">Community</span>
                </dt>
                <dd>{p.community}</dd>
              </div>
              {p.accessibilityFocus && (
                <div className="flex gap-2">
                  <dt>
                    <Icon name="accessibility" className="translate-y-0.5" />
                    <span className="sr-only">Accessibility focus</span>
                  </dt>
                  <dd>{p.accessibilityFocus}</dd>
                </div>
              )}
            </dl>
            <ul className="flex flex-wrap gap-1.5" aria-label="Skills involved">
              {p.skills.map((s) => (
                <li key={s} className="rounded-md border px-2 py-0.5 type-small font-semibold">
                  {s}
                </li>
              ))}
            </ul>
          </article>
        </li>
      ))}
    </ul>
  )
}
