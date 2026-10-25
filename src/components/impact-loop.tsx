import { RoleBadge, type StudioRole } from "@/components/studio/role-badge"
import { ROLE_INFO, type Role } from "@/lib/roles"
import { cn } from "@/lib/utils"

const STEPS: { roles: Role[]; badges: StudioRole[]; title: string; body: string }[] = [
  { roles: ["partner"], badges: ["community-partner"], title: "A community partner shares a problem", body: ROLE_INFO.partner.loopRole },
  { roles: ["ambassador"], badges: ["chapter-lead", "company-host"], title: "An ambassador gathers support", body: ROLE_INFO.ambassador.loopRole },
  {
    roles: ["student", "mentor"],
    badges: ["apprentice", "mentor"],
    title: "Apprentices design with the community, mentors guide",
    body: `${ROLE_INFO.student.loopRole}. Mentors: ${ROLE_INFO.mentor.loopRole.toLowerCase()}.`,
  },
  {
    roles: [],
    badges: ["steward"],
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
              data-archetype={isYou ? current : undefined}
              aria-current={isYou ? "step" : undefined}
              className={cn("relative rounded-xl border bg-card p-5", isYou && "border-2 border-archetype bg-archetype-soft")}
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground font-bold text-background" aria-hidden="true">
                  {i + 1}
                </span>
                {step.badges.map((b) => (
                  <RoleBadge key={b} role={b}>{b === "steward" ? "BRIDGEGOOD" : undefined}</RoleBadge>
                ))}
              </div>
              <h3 className="type-title-3">
                <span className="sr-only">Step {i + 1}: </span>
                {step.title}
              </h3>
              <p className="mt-1 text-muted-foreground">{step.body}</p>
              {isYou && (
                <p className="mt-3 font-bold text-archetype">
                  You are here, as {/^[aeiou]/i.test(ROLE_INFO[current].label) ? "an" : "a"} {ROLE_INFO[current].label.toLowerCase()}
                </p>
              )}
            </li>
          )
        })}
      </ol>
      <p className="mt-4 max-w-[70ch] text-muted-foreground">
        Step 4 leads back to step 1. What partners, apprentices and mentors send back goes to BRIDGEGOOD. BRIDGEGOOD
        decides what changes in the philosophy, and credits where each change came from.
      </p>
    </div>
  )
}
