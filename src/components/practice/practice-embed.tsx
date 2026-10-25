import type { ReactNode } from "react"
import { Icon } from "@/components/icon"
import { PracticeMomentView } from "@/components/practice/practice-moment"
import { getPracticeMoment } from "@/content/practice"

/** A practice moment inside a role page, next to the decisions it's about. Its title is an h2 there. */
export function PracticeEmbed({ slug, children }: { slug: string; children: ReactNode }) {
  const moment = getPracticeMoment(slug)
  if (!moment) return null
  return (
    <section aria-label={`Practice moment: ${moment.title}`} className="space-y-6 rounded-2xl border bg-card p-4 sm:p-6">
      <div className="max-w-3xl space-y-1">
        <p className="flex items-center gap-2 type-label">
          <Icon name="scale" />
          Practice moment
        </p>
        <p className="text-muted-foreground">{children}</p>
      </div>
      <PracticeMomentView moment={moment} level={2} embedded />
    </section>
  )
}
