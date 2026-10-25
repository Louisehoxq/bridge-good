import type { ReactNode } from "react"
import { Icon, type IconName } from "@/components/icon"
import type { Role, Session } from "@/lib/roles"
import { cn } from "@/lib/utils"

/**
 * Bridge Studio roles (DESIGN.md section 2). Each one always shows icon + label + color together.
 * Every demo login role is here, plus people who take part without a login (students and alumni, mentors),
 * for example as an event's audience.
 */
export const STUDIO_ROLES = {
  apprentice: { label: "Student or alum", icon: "sprout" },
  mentor: { label: "Mentor", icon: "message-circle-heart" },
  "chapter-lead": { label: "Chapter lead", icon: "map-pin" },
  "company-host": { label: "Company host", icon: "building-2" },
  "community-partner": { label: "Community partner", icon: "heart-handshake" },
  steward: { label: "BRIDGEGOOD steward", icon: "scroll-text" },
} as const satisfies Record<Role | "apprentice" | "mentor", { label: string; icon: IconName }>

export type StudioRole = keyof typeof STUDIO_ROLES

/** The Bridge Studio role for a signed-in demo session. */
export function studioRoleFor(session: Session): StudioRole {
  return session.role
}

/** A fully round tag in the role's soft tint, with its icon and a word. `children` replaces the default label. */
export function RoleBadge({ role, children, className }: { role: StudioRole; children?: ReactNode; className?: string }) {
  const { label, icon } = STUDIO_ROLES[role]
  return (
    <span
      data-archetype={role}
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-full bg-archetype-soft px-3 py-1 type-small font-semibold text-archetype",
        className
      )}
    >
      <Icon name={icon} className="text-base" />
      {children ?? label}
    </span>
  )
}
