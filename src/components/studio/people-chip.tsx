import { Icon } from "@/components/icon"
import { STUDIO_ROLES, type StudioRole } from "@/components/studio/role-badge"
import { cn } from "@/lib/utils"

/** Up to two initials. Never a photo: people here are synthetic or have consented. */
function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("")
}

/**
 * A person with an initials avatar, their role icon and label. Use in team lists, messages and review queues.
 * `stacked` centers the avatar above the text, for a team joined by a <TeamPath>.
 */
export function PeopleChip({
  name,
  role,
  detail,
  you,
  stacked,
  className,
}: {
  name: string
  role: StudioRole
  /** Extra context after the role label, such as "alum" or "Chicago". */
  detail?: string
  you?: boolean
  stacked?: boolean
  className?: string
}) {
  const { label, icon } = STUDIO_ROLES[role]
  return (
    <span
      data-archetype={role}
      className={cn(
        "flex min-w-0 gap-3",
        stacked ? "flex-col items-center text-center" : "items-center",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="relative flex size-11 shrink-0 items-center justify-center rounded-full bg-archetype font-bold text-on-archetype"
      >
        {initials(name)}
      </span>
      <span className="min-w-0">
        <span className="block font-semibold">
          {name}
          {you && " (you)"}
        </span>
        <span className={cn("flex items-center gap-1.5 type-small text-muted-foreground", stacked && "justify-center")}>
          <Icon name={icon} className="text-base text-archetype" />
          {label}
          {detail && `, ${detail}`}
        </span>
      </span>
    </span>
  )
}
