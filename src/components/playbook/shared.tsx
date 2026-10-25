import { Link } from "react-router"
import { Icon } from "@/components/icon"
import { SyntheticBadge } from "@/components/synthetic-badge"
import { entryTypeInfo, SEED_ENTRIES, type Entry, type Status } from "@/content/playbook"
import { useCollection } from "@/lib/demo-store"
import { cn } from "@/lib/utils"

/** All Living Playbook entries (core, published contributions and the review queue), shared by every page in this browser. */
export function usePlaybook() {
  return useCollection<Entry>("playbook", SEED_ENTRIES)
}

/** Core philosophy is visually distinct from community content, so authorship is always clear. */
export function TypeBadge({ entry, className }: { entry: Pick<Entry, "type">; className?: string }) {
  const info = entryTypeInfo(entry.type)
  const core = entry.type === "core"
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 type-small font-semibold",
        core ? "bg-action text-on-action" : "border border-input bg-card",
        className
      )}
    >
      <Icon name={info.icon} className="text-sm" />
      {info.label}
    </span>
  )
}

export const STATUS_INFO: Record<Status, { label: string; icon: "hourglass" | "messages-square" | "circle-check" | "x" }> = {
  submitted: { label: "Submitted for review", icon: "hourglass" },
  "in-discussion": { label: "In discussion with a steward", icon: "messages-square" },
  published: { label: "Published", icon: "circle-check" },
  declined: { label: "Not published", icon: "x" },
}

export function StatusTag({ status }: { status: Status }) {
  const s = STATUS_INFO[status]
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 type-small font-semibold">
      <Icon name={s.icon} className="text-sm" />
      {s.label}
    </span>
  )
}

export function EntryCard({ entry }: { entry: Entry }) {
  const summary = entry.body ?? entry.fields.takeaway ?? entry.fields.challenge
  return (
    <article aria-labelledby={`e-${entry.id}`} className="flex h-full flex-col gap-3 rounded-2xl border bg-card p-5">
      <div className="flex flex-wrap items-center gap-2">
        <TypeBadge entry={entry} />
        {entry.type !== "core" && <SyntheticBadge />}
      </div>
      <h3 id={`e-${entry.id}`} className="type-title-3">
        {entry.title}
      </h3>
      {summary && <p className="text-muted-foreground">{summary}</p>}
      <p className="mt-auto type-small text-muted-foreground">
        {entry.type === "core" ? "By BRIDGEGOOD" : `Contributed by ${entry.attribution.as}`} · v{entry.version} · reviewed {entry.reviewedAt ?? entry.submittedAt}
      </p>
      <Link to={`/playbook/${entry.id}`} className="inline-flex min-h-12 items-center gap-1 font-semibold text-action underline underline-offset-4">
        Read it
        <Icon name="arrow-right" className="text-base" />
        <span className="sr-only">: {entry.title}</span>
      </Link>
    </article>
  )
}

/** Published entries linked to a resource or scenario: shows how the community has used it. */
export function RelatedEntries({ related }: { related: NonNullable<Entry["related"]> }) {
  const [entries] = usePlaybook()
  const items = entries.filter((e) => e.status === "published" && e.related?.kind === related.kind && e.related.slug === related.slug)
  if (items.length === 0) return null
  return (
    <section aria-labelledby="related-title" className="pt-4">
      <h2 id="related-title" className="mb-3 type-title-3">
        From the Living Playbook
      </h2>
      <ul className="grid gap-4 md:grid-cols-2">
        {items.map((e) => (
          <li key={e.id}>
            <EntryCard entry={e} />
          </li>
        ))}
      </ul>
    </section>
  )
}
