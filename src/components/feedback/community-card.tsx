import { useId } from "react"
import { Link } from "react-router"
import { Icon } from "@/components/icon"
import { SyntheticBadge } from "@/components/synthetic-badge"
import { getPillar } from "@/content/framework"
import type { CommunityFeedback } from "@/lib/feedback/types"

/** Aggregated, anonymous community feedback: counts and themes only. No names, quotes or personal data. */
export function CommunityCard({ item, link }: { item: CommunityFeedback; link?: boolean }) {
  const id = useId()
  const max = Math.max(...item.themes.map((t) => t.count), 1)
  return (
    <section aria-labelledby={`${id}-title`} className="space-y-4 rounded-2xl border bg-card p-5">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 id={`${id}-title`} className="flex items-center gap-2 type-title-3">
            <Icon name="users" />
            Community feedback
          </h2>
          {item.synthetic && <SyntheticBadge />}
        </div>
        <p className="text-muted-foreground">
          {item.source}: {item.responses} responses. Counts and themes only, with no names or quotes.
        </p>
      </div>
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">Themes in {item.source}, with how many responses mentioned each</caption>
        <thead>
          <tr className="border-b">
            <th scope="col" className="py-2 pr-3 font-semibold">
              Theme
            </th>
            <th scope="col" className="w-24 py-2 text-right font-semibold">
              Responses
            </th>
          </tr>
        </thead>
        <tbody>
          {item.themes.map((t) => (
            <tr key={t.theme} className="border-b align-top last:border-0">
              <td className="py-2 pr-3">
                <span className="block">{t.theme}</span>
                {t.pillarId && <span className="block type-small text-muted-foreground">{getPillar(t.pillarId).name}</span>}
                <span aria-hidden="true" className="mt-1 block h-1.5 rounded-full bg-primary" style={{ width: `${(t.count / max) * 100}%` }} />
              </td>
              <td className="py-2 text-right font-semibold tabular-nums">{t.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {link && (
        <Link to={`/steward/feedback/${item.id}`} className="inline-flex min-h-12 items-center font-semibold text-primary underline underline-offset-4">
          Respond to this feedback
        </Link>
      )}
    </section>
  )
}
