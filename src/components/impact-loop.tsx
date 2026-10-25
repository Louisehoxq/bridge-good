import { ARCHETYPE_INFO, type Archetype } from "@/lib/archetype"
import { cn } from "@/lib/utils"

const STEPS: { archetype?: Archetype; title: string; body: string }[] = [
  {
    archetype: "problem-owner",
    title: "A community organisation shares a problem",
    body: ARCHETYPE_INFO["problem-owner"].loopRole,
  },
  {
    archetype: "ambassador",
    title: "An ambassador gathers support",
    body: ARCHETYPE_INFO.ambassador.loopRole,
  },
  {
    archetype: "student",
    title: "Students design with the community",
    body: ARCHETYPE_INFO.student.loopRole,
  },
  {
    title: "Everyone's feedback improves the philosophy",
    body: "What worked, what didn't and what changed for the community goes back to BRIDGEGOOD, and shapes the next round.",
  },
]

/** The loop that connects the three archetypes. Rendered as an ordered list so it reads well without visuals. */
export function ImpactLoop({ current }: { current?: Archetype }) {
  return (
    <div>
      <ol className="grid gap-4 md:grid-cols-4">
        {STEPS.map((step, i) => {
          const isYou = step.archetype && step.archetype === current
          return (
            <li
              key={step.title}
              data-archetype={step.archetype}
              className={cn(
                "relative rounded-xl border bg-card p-5",
                isYou && "border-2 border-archetype bg-archetype-soft"
              )}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full text-sm font-bold",
                    step.archetype ? "bg-archetype text-white" : "bg-foreground text-background"
                  )}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                {isYou && (
                  <span className="rounded-full bg-archetype px-2.5 py-0.5 text-xs font-bold text-white">You are here</span>
                )}
              </div>
              <h3 className="font-bold">{step.title}</h3>
              <p className="mt-1 text-muted-foreground">{step.body}</p>
            </li>
          )
        })}
      </ol>
      <p className="mt-4 text-sm text-muted-foreground">
        Step 4 leads back to step 1. Every project leaves the community, the people involved and the philosophy itself a
        little stronger.
      </p>
    </div>
  )
}
