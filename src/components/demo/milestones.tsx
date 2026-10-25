import { Check } from "lucide-react"
import { SPRINT_MILESTONES } from "@/content/journey"
import { cn } from "@/lib/utils"

/** The sprint milestones with the ones reached so far marked. Shared with the partner's project page. */
export function MilestoneList({ reached }: { reached: number }) {
  return (
    <ol className="mt-4 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
      {SPRINT_MILESTONES.map((m, i) => {
        const done = i <= reached
        const isNext = i === reached + 1
        return (
          <li key={m.title} aria-current={isNext ? "step" : undefined} className={cn("rounded-xl border p-3", done && "bg-archetype-soft", isNext && "border-2 border-archetype")}>
            <p className="flex items-center gap-2 font-bold">
              {done && <Check className="size-4 text-archetype" aria-hidden="true" />}
              {m.title}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{m.detail}</p>
            <p className="mt-1 text-xs font-semibold">{done ? "Reached" : isNext ? "Next" : "Coming up"}</p>
          </li>
        )
      })}
    </ol>
  )
}
