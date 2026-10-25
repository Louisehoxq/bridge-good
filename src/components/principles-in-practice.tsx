import { Icon } from "@/components/icon"
import { PRINCIPLES } from "@/content/principles"
import type { CommunityRole } from "@/lib/roles"

/** Each principle paired with what it asks of this archetype. Uses <details> so it works without JavaScript. */
export function PrinciplesInPractice({ role }: { role: CommunityRole }) {
  return (
    <ul className="grid gap-4 lg:grid-cols-2">
      {PRINCIPLES.map((p) => (
        <li key={p.id} className="rounded-xl border bg-card">
          <details className="group">
            <summary className="flex min-h-12 cursor-pointer list-none items-start justify-between gap-4 rounded-xl p-5 [&::-webkit-details-marker]:hidden">
              <span>
                <span className="block type-label">{p.name}</span>
                <span className="mt-1 block text-muted-foreground">{p.meaning}</span>
              </span>
              <Icon name="chevron-down" className="mt-1 text-archetype transition-transform group-open:rotate-180" />
            </summary>
            <div className="border-t px-5 py-4">
              <p className="font-bold text-archetype">What this looks like for you</p>
              <p className="mt-1">{p.inPractice[role]}</p>
            </div>
          </details>
        </li>
      ))}
    </ul>
  )
}
