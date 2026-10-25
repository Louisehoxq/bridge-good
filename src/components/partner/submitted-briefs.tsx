import { useCollection } from "@/lib/demo-store"
import { RoleBadge } from "@/components/studio/role-badge"
import type { SubmittedBrief } from "@/components/partner/scoping-studio"

const NONE: SubmittedBrief[] = []

export function SubmittedBriefs() {
  const [briefs] = useCollection<SubmittedBrief>("briefs", NONE)
  return (
    <section aria-labelledby="briefs-title" className="min-w-0 rounded-2xl border bg-card p-6">
      <h2 id="briefs-title" className="mb-3 type-title-3">
        Your submitted briefs
      </h2>
      {briefs.length === 0 ? (
        <p className="text-muted-foreground">Nothing submitted yet. Briefs you send appear here while your community chapter reviews them.</p>
      ) : (
        <ul className="space-y-3">
          {briefs.toReversed().map((b) => (
            <li key={b.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border p-4">
              <div className="min-w-0">
                <p className="font-bold [overflow-wrap:anywhere]">{b.title}</p>
                <p className="type-small text-muted-foreground">Sent {b.submittedAt}</p>
              </div>
              <RoleBadge role="steward">With your community chapter for review</RoleBadge>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
