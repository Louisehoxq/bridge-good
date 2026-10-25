import { Check } from "lucide-react"
import { Link } from "react-router"
import { Icon } from "@/components/icon"
import { usePathProgress } from "@/components/demo/journey-data"
import type { PathKey } from "@/lib/paths"
import { cn } from "@/lib/utils"

function StageMarker({ index, done, current }: { index: number; done: boolean; current: boolean }) {
  return (
    <span
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-full border-2 font-bold",
        done && "border-success bg-card text-success",
        current && "border-archetype bg-archetype text-on-archetype",
        !done && !current && "border-input bg-card text-foreground"
      )}
      aria-hidden="true"
    >
      {done ? <Check className="size-5" /> : index + 1}
    </span>
  )
}

const statusText = (done: boolean, current: boolean) => (current ? "You are here" : done ? "Done" : "Coming up")

/**
 * A role's path as an ordered list of stages, joined by the gold path line (a journey is a real sequence).
 * "full" shows each stage's summary and links into the library; "compact" is a one-row summary for overview pages.
 */
export function PathStepper({
  pathKey,
  variant = "full",
  headingLevel = 2,
  title,
  linkToPath = true,
}: {
  pathKey: PathKey
  variant?: "full" | "compact"
  headingLevel?: 2 | 3
  /** Heading for the compact view, when someone else's path is shown (e.g. a mentor viewing their mentee's). */
  title?: string
  linkToPath?: boolean
}) {
  const { path, stages, done, current } = usePathProgress(pathKey)
  const H = headingLevel === 2 ? "h2" : "h3"

  if (variant === "compact") {
    return (
      <section aria-labelledby="path-compact-title" className="@container rounded-2xl border bg-card p-5">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <H id="path-compact-title" className="type-title-3">
            {title ?? path.title}
          </H>
          {linkToPath && (
            <Link to={path.home} className="inline-flex min-h-12 items-center gap-1 font-semibold text-archetype underline underline-offset-4">
              Open your path
              <Icon name="arrow-right" className="text-base" />
            </Link>
          )}
        </div>
        <ol className="grid gap-3 @sm:grid-cols-2 @xl:grid-cols-3 @4xl:grid-cols-6">
          {stages.map((s, i) => (
            <li key={s.id} aria-current={i === current ? "step" : undefined} className="flex items-center gap-3">
              <StageMarker index={i} done={done[i] && i !== current} current={i === current} />
              <span className="min-w-0">
                <span className={cn("block leading-tight", i === current && "font-bold")}>{s.title}</span>
                <span className="type-small text-muted-foreground">{statusText(done[i] && i !== current, i === current)}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>
    )
  }

  return (
    // The dotted gold line runs behind the markers, joining the stages. It's decorative: each stage has its own label.
    <ol className="relative space-y-4 before:absolute before:top-10 before:bottom-10 before:left-[2.5rem] before:border-l-[3px] before:border-dotted before:border-gold before:content-[''] max-sm:before:hidden">
      {stages.map((s, i) => {
        const isCurrent = i === current
        const isDone = done[i] && !isCurrent
        return (
          <li
            key={s.id}
            id={s.id}
            aria-current={isCurrent ? "step" : undefined}
            className={cn(
              "relative grid scroll-mt-24 gap-4 rounded-2xl border bg-card p-5 sm:grid-cols-[2.5rem_1fr]",
              isCurrent && "border-2 border-archetype bg-archetype-soft"
            )}
          >
            <StageMarker index={i} done={isDone} current={isCurrent} />
            <div className="min-w-0 space-y-2">
              <p className="type-small font-semibold text-muted-foreground">
                Step {i + 1} of {stages.length} · {statusText(isDone, isCurrent)}
              </p>
              <H className="type-title-3">{s.title}</H>
              <p>{s.summary}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <Link to={s.href} className="inline-flex min-h-12 items-center gap-1 font-semibold text-archetype underline underline-offset-4">
                  {isCurrent ? "Go to this step" : "Open"}
                  <span className="sr-only">: {s.title}</span>
                  <Icon name="arrow-right" className="text-base" />
                </Link>
              </div>
              {s.learn.length > 0 && (
                <div className="border-t pt-2">
                  <p className="font-bold">In the library</p>
                  <ul className="flex flex-wrap gap-x-4">
                    {s.learn.map((l) => (
                      <li key={l.href}>
                        <Link to={l.href} className="inline-flex min-h-12 items-center underline underline-offset-4">
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
