"use client"

import { useCollection } from "@/lib/demo-store"
import type { SubmittedBrief } from "@/components/partner/scoping-studio"

const NONE: SubmittedBrief[] = []

export function SubmittedBriefs() {
  const [briefs] = useCollection<SubmittedBrief>("briefs", NONE)
  return (
    <section aria-labelledby="briefs-title" className="rounded-2xl border bg-card p-6">
      <h2 id="briefs-title" className="mb-3 text-xl font-bold">
        Your submitted briefs
      </h2>
      {briefs.length === 0 ? (
        <p className="text-muted-foreground">Nothing submitted yet. Briefs you send appear here while BRIDGEGOOD reviews them.</p>
      ) : (
        <ul className="space-y-3">
          {briefs.toReversed().map((b) => (
            <li key={b.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border p-4">
              <div>
                <p className="font-bold">{b.title}</p>
                <p className="text-sm text-muted-foreground">Sent {b.submittedAt}</p>
              </div>
              <span className="rounded-full bg-archetype-soft px-3 py-1 text-sm font-bold text-archetype">With BRIDGEGOOD for review</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
