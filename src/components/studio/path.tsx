import { Children, type CSSProperties, type ReactNode } from "react"
import { Icon } from "@/components/icon"
import { cn } from "@/lib/utils"

/**
 * The gold path: a curved line that joins people or steps that really are connected (a team, a journey,
 * the impact loop). Decorative only: every node it joins has its own text label. Never a divider.
 * Place it inside a `relative` container; it spans the width and sits behind evenly spaced nodes.
 */
export function Path({ nodes, className }: { nodes: number; className?: string }) {
  const xs = Array.from({ length: nodes }, (_, i) => ((i + 0.5) / nodes) * 100)
  // A gentle wave through each node's center, bowing up then down between neighbors.
  const d = xs.slice(1).reduce((acc, x, i) => {
    const from = xs[i]
    const bow = i % 2 === 0 ? 2 : 38
    return `${acc} C ${from + (x - from) / 3} ${bow}, ${x - (x - from) / 3} ${40 - bow}, ${x} 20`
  }, `M ${xs[0]} 20`)

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      className={cn("pointer-events-none absolute inset-x-0 h-10 w-full", className)}
    >
      <path d={d} fill="none" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

/**
 * A team joined by the path. Pass one <li> per person, each holding a stacked <PeopleChip>.
 * On narrow screens the team stacks as a plain list and the path is hidden, so nothing scrolls sideways.
 */
export function TeamPath({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  const count = Children.count(children)
  return (
    <div className={cn("relative", className)}>
      {/* Centered on the 44px avatars. */}
      {count > 1 && <Path nodes={count} className="top-0.5 hidden sm:block" />}
      <ul
        aria-label={label}
        className="relative grid gap-4 sm:grid-cols-[repeat(var(--people),minmax(0,1fr))]"
        style={{ "--people": count } as CSSProperties}
      >
        {children}
      </ul>
    </div>
  )
}

export type JourneyStep = { label: string; status: "done" | "current" | "todo" }

/**
 * Journey stepper: steps joined by a dotted gold path. Done steps get a check, the current step is filled in
 * the role color with aria-current="step", and future steps are outlined. Labels are always visible.
 * Set data-archetype on a parent to pick the role color.
 */
export function JourneyStepper({ label, steps, className }: { label: string; steps: JourneyStep[]; className?: string }) {
  return (
    <ol
      aria-label={label}
      className={cn(
        "relative grid gap-3 sm:grid-cols-[repeat(var(--steps),minmax(0,1fr))] sm:gap-0 sm:before:absolute sm:before:inset-x-[calc(50%/var(--steps))] sm:before:top-[1.1875rem] sm:before:border-t-[3px] sm:before:border-dotted sm:before:border-gold sm:before:content-['']",
        className
      )}
      style={{ "--steps": steps.length } as CSSProperties}
    >
      {steps.map((step, i) => (
        <li
          key={step.label}
          aria-current={step.status === "current" ? "step" : undefined}
          className="relative flex items-center gap-3 sm:flex-col sm:gap-2 sm:px-1 sm:text-center"
        >
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-full border-2 font-bold",
              step.status === "done" && "border-success bg-card text-success",
              step.status === "current" && "border-archetype bg-archetype text-on-archetype",
              step.status === "todo" && "border-input bg-card text-foreground"
            )}
          >
            {step.status === "done" ? <Icon name="check" /> : i + 1}
          </span>
          <span className={cn(step.status === "current" && "font-bold")}>
            {step.label}
            {step.status === "done" && <span className="sr-only">, done</span>}
          </span>
        </li>
      ))}
    </ol>
  )
}
