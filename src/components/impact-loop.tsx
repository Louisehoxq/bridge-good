import { ROLE_INFO, type Role } from "@/lib/roles"
import { cn } from "@/lib/utils"

const STEPS: { roles: Role[]; title: string; body: string }[] = [
  { roles: ["partner"], title: "A community partner shares a problem", body: ROLE_INFO.partner.loopRole },
  { roles: ["ambassador"], title: "An ambassador gathers support", body: ROLE_INFO.ambassador.loopRole },
  {
    roles: ["student", "mentor"],
    title: "Apprentices design with the community, mentors guide",
    body: `${ROLE_INFO.student.loopRole}. Mentors: ${ROLE_INFO.mentor.loopRole.toLowerCase()}.`,
  },
  {
    roles: [],
    title: "Everyone's feedback improves the philosophy",
    body: "What worked, what didn't and what changed for the community goes back to BRIDGEGOOD, and shapes the next round.",
  },
]

/** The loop that connects the roles. Rendered as an ordered list so it reads well without visuals. */
export function ImpactLoop({ current }: { current?: Role }) {
  return (
    <div>
      <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {STEPS.map((step, i) => {
          const isYou = current && step.roles.includes(current)
          return (
            <li
              key={step.title}
              data-archetype={isYou ? current : step.roles[0]}
              className={cn("relative rounded-xl border bg-card p-5", isYou && "border-2 border-archetype bg-archetype-soft")}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full text-sm font-bold",
                    step.roles.length ? "bg-archetype text-on-archetype" : "bg-foreground text-background"
                  )}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                {isYou && <span className="rounded-full bg-archetype px-2.5 py-0.5 text-xs font-bold text-on-archetype">You are here</span>}
              </div>
              <h3 className="font-bold">{step.title}</h3>
              <p className="mt-1 text-muted-foreground">{step.body}</p>
            </li>
          )
        })}
      </ol>
      <p className="mt-4 text-sm text-muted-foreground">
        Step 4 leads back to step 1. What partners, students and mentors send back goes to BRIDGEGOOD. BRIDGEGOOD decides
        what changes in the philosophy, and credits where each change came from.
      </p>
    </div>
  )
}
