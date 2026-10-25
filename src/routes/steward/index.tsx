import { Link } from "react-router"
import { PageHeader } from "@/components/app-shell"
import { Icon } from "@/components/icon"
import { StatusTag, TypeBadge, usePlaybook } from "@/components/playbook/shared"
import { CONTRIBUTION_KINDS } from "@/content/playbook"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Review queue")

export default function StewardQueue() {
  const [entries] = usePlaybook()
  const open = entries.filter((e) => e.status === "submitted" || e.status === "in-discussion")
  const decided = entries.filter((e) => e.type !== "core" && (e.status === "published" || e.status === "declined")).slice(-5).toReversed()

  return (
    <>
      <PageHeader title="Review queue">
        Every community contribution waits here until a person reviews it. Check relevance, consent, privacy, accessibility
        and alignment, talk with the contributor if needed, then publish with the right label and attribution, or explain
        why not.
      </PageHeader>

      <section aria-labelledby="open-title" className="space-y-4">
        <h2 id="open-title" className="type-title-2">
          Waiting for review <span className="text-muted-foreground">({open.length})</span>
        </h2>
        {open.length === 0 ? (
          <p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">Nothing waiting. Contributions appear here when someone submits one.</p>
        ) : (
          <ul className="space-y-3">
            {open.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center gap-3 rounded-xl border bg-card p-4">
                <div className="min-w-0 flex-1">
                  <Link to={`/steward/review/${e.id}`} className="type-title-3 underline underline-offset-4">
                    {e.title}
                  </Link>
                  <p className="text-muted-foreground">
                    {CONTRIBUTION_KINDS.find((k) => k.id === e.kind)?.label} · from {e.attribution.as} · {e.submittedAt}
                  </p>
                </div>
                <TypeBadge entry={e} />
                <StatusTag status={e.status} />
                <Link to={`/steward/review/${e.id}`} className="inline-flex min-h-12 items-center gap-1 font-semibold text-action">
                  Review
                  <Icon name="arrow-right" className="text-base" />
                  <span className="sr-only">: {e.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {decided.length > 0 && (
        <section aria-labelledby="decided-title" className="mt-12 space-y-4">
          <h2 id="decided-title" className="type-title-2">
            Recently decided
          </h2>
          <ul className="space-y-2">
            {decided.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center gap-3 rounded-lg bg-surface-sunken p-3">
                <Link to={`/steward/review/${e.id}`} className="font-semibold underline underline-offset-4">
                  {e.title}
                </Link>
                <StatusTag status={e.status} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
