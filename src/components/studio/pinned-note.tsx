import type { ReactNode } from "react"
import { Icon, type IconName } from "@/components/icon"
import { cn } from "@/lib/utils"

/**
 * Pinned note: a paper-like card for a mentor's feedback, your own reflection, or a field note from a chapter.
 * It tilts by under 1° only when the person allows motion. The transparent border shows in forced-colors mode
 * and turns into a line in dark mode, where the note sits close to the page color.
 */
export function PinnedNote({
  title,
  icon = "sticky-note",
  tilt = "left",
  children,
  className,
}: {
  title: ReactNode
  icon?: IconName
  tilt?: "left" | "right" | "none"
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "rounded-xs border border-transparent bg-note px-[1.125rem] py-4 text-ink [box-shadow:var(--note-shadow)] dark:border-line",
        tilt === "left" && "motion-safe:-rotate-[0.8deg]",
        tilt === "right" && "motion-safe:rotate-[0.6deg]",
        className
      )}
    >
      <p className="mb-1.5 flex items-center gap-2 font-semibold">
        <Icon name={icon} />
        {title}
      </p>
      <div className="space-y-2">{children}</div>
    </div>
  )
}
