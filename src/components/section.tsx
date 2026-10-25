import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className,
  tone = "plain",
}: {
  id: string
  eyebrow?: string
  title: string
  intro?: ReactNode
  children: ReactNode
  className?: string
  tone?: "plain" | "soft" | "muted"
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn(tone === "soft" && "bg-archetype-soft", tone === "muted" && "bg-muted", className)}
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
        <div className="mb-8 max-w-3xl space-y-3">
          {eyebrow && <p className="text-sm font-bold tracking-wide text-archetype uppercase">{eyebrow}</p>}
          <h2 id={`${id}-title`} className="text-3xl font-bold md:text-4xl">
            {title}
          </h2>
          {intro && <div className="text-lg text-muted-foreground">{intro}</div>}
        </div>
        {children}
      </div>
    </section>
  )
}

export function SyntheticBadge() {
  return (
    <span className="inline-flex shrink-0 items-center rounded-full whitespace-nowrap border border-dashed border-muted-foreground px-2 py-0.5 text-xs font-semibold text-muted-foreground">
      Synthetic example
    </span>
  )
}
