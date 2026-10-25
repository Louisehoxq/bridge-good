import { PRINCIPLES } from "@/content/principles"
import type { Archetype } from "@/lib/archetype"

/** Each principle paired with what it asks of this archetype. Uses <details> so it works without JavaScript. */
export function PrinciplesInPractice({ archetype }: { archetype: Archetype }) {
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {PRINCIPLES.map((p) => (
        <li key={p.id} className="rounded-xl border bg-card">
          <details className="group">
            <summary className="flex min-h-11 cursor-pointer list-none items-start justify-between gap-4 rounded-xl p-5 [&::-webkit-details-marker]:hidden">
              <span>
                <span className="block text-lg font-bold">{p.name}</span>
                <span className="mt-1 block text-muted-foreground">{p.meaning}</span>
              </span>
              <span
                className="mt-1 shrink-0 text-2xl leading-none text-archetype transition-transform group-open:rotate-45"
                aria-hidden="true"
              >
                +
              </span>
            </summary>
            <div className="border-t px-5 py-4">
              <p className="text-sm font-bold text-archetype">What this looks like for you</p>
              <p className="mt-1">{p.inPractice[archetype]}</p>
            </div>
          </details>
        </li>
      ))}
    </ul>
  )
}
