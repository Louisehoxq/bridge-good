import { Link } from "react-router"
import { Icon, type IconName } from "@/components/icon"
import { SyntheticBadge } from "@/components/synthetic-badge"
import { TargetTag } from "@/components/feedback/tags"
import { FRAMEWORK_VERSIONS, PUBLISHED_BY } from "@/content/framework-history"
import { compareVersions } from "@/lib/feedback/logic"
import { useChangelog } from "@/lib/feedback/store"
import type { ChangelogEntry, ChangelogType } from "@/lib/feedback/types"
import { cn } from "@/lib/utils"

const TYPE: Record<ChangelogType, { label: string; icon: IconName }> = {
  published: { label: "Version published", icon: "scroll-text" },
  wording: { label: "Official wording changed", icon: "pencil" },
  "field-note": { label: "Field note recognized (local)", icon: "map-pin" },
  noted: { label: "Noted for the next review", icon: "history" },
}

/**
 * The public changelog: every version of the framework, and under each one what BRIDGEGOOD changed, why,
 * and where it came from. Contributors are credited only when they said yes.
 */
export function ChangelogList({ headingLevel = 2 }: { headingLevel?: 2 | 3 }) {
  const [entries] = useChangelog()
  const versions = [...new Set([...FRAMEWORK_VERSIONS.map((v) => v.version), ...entries.map((e) => e.version)])].sort((a, b) => compareVersions(b, a))
  const H = headingLevel === 2 ? "h2" : "h3"

  return (
    <ol className="space-y-12">
      {versions.map((version) => {
        const published = FRAMEWORK_VERSIONS.find((v) => v.version === version)
        const forVersion = entries.filter((e) => e.version === version).toReversed()
        const newWording = forVersion.filter((e) => e.type === "wording")
        const date = published?.date ?? newWording[newWording.length - 1]?.at
        return (
          <li key={version} className="space-y-4">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b-2 border-gold pb-2">
              <H id={`v-${version}`} className="type-title-2">
                Version {version}
              </H>
              {date && <span className="text-muted-foreground">{published ? `Published ${date}` : `Published in this demo, ${date}`}</span>}
            </div>
            {published && (
              <p className="max-w-3xl type-body-lg">
                {published.summary} <span className="text-muted-foreground">Published by {PUBLISHED_BY}.</span>
              </p>
            )}
            {forVersion.length > 0 && (
              <ul className="space-y-4">
                {forVersion.map((entry) => (
                  <li key={entry.id}>
                    <Entry entry={entry} headingLevel={headingLevel === 2 ? 3 : 4} />
                  </li>
                ))}
              </ul>
            )}
          </li>
        )
      })}
    </ol>
  )
}

function Entry({ entry, headingLevel }: { entry: ChangelogEntry; headingLevel: 3 | 4 }) {
  const type = TYPE[entry.type]
  const H = headingLevel === 3 ? "h3" : "h4"
  return (
    <article id={entry.id} aria-labelledby={`${entry.id}-title`} className="scroll-mt-24 space-y-3 rounded-2xl border bg-card p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 type-small font-semibold", entry.type === "wording" ? "bg-marker text-ink" : "bg-muted text-foreground")}>
          <Icon name={type.icon} className="text-base" />
          {type.label}
        </span>
        {entry.target && <TargetTag target={entry.target} />}
        {entry.synthetic && <SyntheticBadge />}
      </div>
      <H id={`${entry.id}-title`} className="type-title-3">
        {entry.title}
      </H>
      <p>{entry.summary}</p>
      {entry.before !== undefined && entry.after !== undefined && (
        <dl className="grid gap-3 lg:grid-cols-2">
          <div className="rounded-lg bg-muted p-3">
            <dt className="font-semibold">Before</dt>
            <dd className="mt-1">{entry.before}</dd>
          </div>
          <div className="rounded-lg border-2 border-primary p-3">
            <dt className="font-semibold">After</dt>
            <dd className="mt-1">{entry.after}</dd>
          </div>
        </dl>
      )}
      <dl className="grid gap-2 sm:grid-cols-[10rem_1fr]">
        <dt className="font-semibold">Why</dt>
        <dd>{entry.reason}</dd>
        <dt className="font-semibold">Where it came from</dt>
        <dd>{entry.source}</dd>
        <dt className="font-semibold">Credit</dt>
        <dd>{entry.credit ?? "Not credited by name: the contributor didn't ask to be, or it came from counts."}</dd>
        <dt className="font-semibold">Decided</dt>
        <dd>
          {entry.at}, by a BRIDGEGOOD steward
          {entry.type === "field-note" && entry.target?.type === "pillar" && (
            <>
              {" · "}
              <Link to={`/learn/pillars/${entry.target.id}`} className="underline underline-offset-4">
                See the field note
              </Link>
            </>
          )}
        </dd>
      </dl>
    </article>
  )
}
