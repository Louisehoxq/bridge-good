import type { ReactNode } from "react"
import { Link } from "react-router"
import { Icon } from "@/components/icon"
import { CYCLE, type CycleStageId } from "@/content/philosophy"
import { cn } from "@/lib/utils"

/**
 * The community experience cycle as an ordered list: Understand → Practice → Reflect and Share → Teach and Evolve,
 * then back to Understand. Reads in order without the visuals; the gold path is decoration.
 */
export function CycleDiagram({ current, compact = false }: { current?: CycleStageId; compact?: boolean }) {
  return (
    <div>
      <ol className={cn("grid gap-4", compact ? "sm:grid-cols-2 xl:grid-cols-4" : "md:grid-cols-2 xl:grid-cols-4")}>
        {CYCLE.map((stage) => {
          const here = stage.id === current
          return (
            <li key={stage.id} className={cn("relative flex flex-col gap-2 rounded-xl border bg-card p-5", here && "border-2 border-action")}>
              <span className="flex items-center gap-2">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-action font-bold text-on-action" aria-hidden="true">
                  {stage.number}
                </span>
                <Icon name={stage.icon} className="text-action" />
                {here && <span className="ml-auto rounded-full bg-action px-2.5 py-0.5 type-small font-bold text-on-action">You are here</span>}
              </span>
              <h3 className="type-title-3">
                <span className="sr-only">Stage {stage.number}: </span>
                {stage.title}
              </h3>
              <p className="font-semibold">{stage.tagline}</p>
              {!compact && <p className="text-muted-foreground">{stage.description}</p>}
              <p className="mt-auto border-t pt-3 text-muted-foreground">
                <span className="font-semibold text-foreground">A useful question: </span>
                {stage.question}
              </p>
              <ul className="flex flex-wrap gap-x-4">
                {stage.places.map((p) => (
                  <li key={p.href}>
                    <Link to={p.href} className="inline-flex min-h-12 items-center gap-1 font-semibold text-action underline underline-offset-4">
                      {p.label}
                      <Icon name="arrow-right" className="text-base" />
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          )
        })}
      </ol>
      <p className="mt-4 flex items-center gap-2 text-muted-foreground">
        <Icon name="history" />
        The cycle is continuous: Teach and Evolve leads back to Understand. Enter wherever makes sense for you, and return when you need support.
      </p>
    </div>
  )
}

/** Shows where a page sits in the cycle, and the natural next step. */
export function CycleStageBar({ stage, next }: { stage: CycleStageId; next?: { label: string; href: string } }) {
  const s = CYCLE.find((c) => c.id === stage)!
  return (
    <nav aria-label="Where this page sits in the cycle" className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border bg-surface-sunken px-4 py-2">
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-1">
        {CYCLE.map((c, i) => (
          <li key={c.id} className="flex items-center gap-1">
            {i > 0 && <Icon name="arrow-right" className="text-base text-muted-foreground" />}
            <Link
              to={c.href}
              aria-current={c.id === stage ? "step" : undefined}
              className={cn(
                "inline-flex min-h-12 items-center rounded-md px-2 hover:bg-card",
                c.id === stage ? "font-bold text-action underline decoration-2 underline-offset-4" : "text-muted-foreground"
              )}
            >
              {c.number}. {c.title}
            </Link>
          </li>
        ))}
      </ol>
      {next && (
        <Link to={next.href} className="ml-auto inline-flex min-h-12 items-center gap-1 font-semibold text-action underline underline-offset-4">
          Next: {next.label}
          <Icon name="arrow-right" className="text-base" />
        </Link>
      )}
      <span className="sr-only">Current stage: {s.title}.</span>
    </nav>
  )
}

/** Page header for public pages: h1, lede and an optional cycle bar above. */
export function PublicPage({
  title,
  lede,
  stage,
  next,
  children,
}: {
  title: string
  lede?: ReactNode
  stage?: CycleStageId
  next?: { label: string; href: string }
  children: ReactNode
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      {stage && <CycleStageBar stage={stage} next={next} />}
      <div className="mb-10 max-w-3xl space-y-3">
        <h1 className="type-title-1">{title}</h1>
        {lede && <div className="type-body-lg text-muted-foreground">{lede}</div>}
      </div>
      {children}
    </div>
  )
}
