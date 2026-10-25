import { MapPinIcon, UsersIcon, AccessibilityIcon } from "lucide-react"
import { PROBLEMS, STATUS_LABEL, type ProblemStatus } from "@/content/problems"
import { SyntheticBadge } from "@/components/section"

export function ProblemBoard({ status }: { status?: ProblemStatus[] }) {
  const problems = status ? PROBLEMS.filter((p) => status.includes(p.status)) : PROBLEMS

  return (
    <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {problems.map((p) => (
        <li key={p.id}>
          <article aria-labelledby={`${p.id}-title`} className="flex h-full flex-col gap-3 rounded-xl border bg-card p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-archetype-soft px-2.5 py-0.5 text-xs font-bold text-archetype">
                {STATUS_LABEL[p.status]}
              </span>
              <SyntheticBadge />
            </div>
            <h3 id={`${p.id}-title`} className="text-lg font-bold">
              {p.title}
            </h3>
            <p className="text-sm text-muted-foreground">{p.organisationType}</p>
            <p>{p.summary}</p>
            <dl className="mt-auto space-y-1.5 text-sm">
              <div className="flex gap-2">
                <dt>
                  <MapPinIcon className="size-4 translate-y-0.5" aria-hidden="true" />
                  <span className="sr-only">Location</span>
                </dt>
                <dd>{p.location}</dd>
              </div>
              <div className="flex gap-2">
                <dt>
                  <UsersIcon className="size-4 translate-y-0.5" aria-hidden="true" />
                  <span className="sr-only">Community</span>
                </dt>
                <dd>{p.community}</dd>
              </div>
              {p.accessibilityFocus && (
                <div className="flex gap-2">
                  <dt>
                    <AccessibilityIcon className="size-4 translate-y-0.5" aria-hidden="true" />
                    <span className="sr-only">Accessibility focus</span>
                  </dt>
                  <dd>{p.accessibilityFocus}</dd>
                </div>
              )}
            </dl>
            <ul className="flex flex-wrap gap-1.5" aria-label="Skills involved">
              {p.skills.map((s) => (
                <li key={s} className="rounded-md bg-muted px-2 py-0.5 text-xs font-semibold">
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
