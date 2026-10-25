import { Link } from "react-router"
import { PageHeader } from "@/components/app-shell"
import { usePlaybook } from "@/components/playbook/shared"
import { RESOURCES } from "@/content/practice-library"
import { recurringThemes } from "@/lib/playbook"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Recurring themes")

/** Improve: patterns across contributions point to resources, scenarios or guidance that need updating. */
export default function Themes() {
  const [entries] = usePlaybook()
  const themes = recurringThemes(entries)
  return (
    <>
      <PageHeader title="Recurring themes">
        Patterns across published community contributions. Use them to decide which tools, Decision Lab scenarios and
        facilitator guidance to improve next.
      </PageHeader>
      {themes.length === 0 ? (
        <p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">No themes tagged yet. Tag themes while reviewing.</p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {themes.map(({ theme, count }) => {
            const entriesWith = entries.filter((e) => e.status === "published" && e.themes.includes(theme))
            const resources = [...new Set(entriesWith.flatMap((e) => (e.related?.kind === "resource" ? [e.related.slug] : [])))]
            return (
              <li key={theme} className="rounded-2xl border bg-card p-5">
                <h2 className="type-title-3 capitalize">{theme}</h2>
                <p className="text-muted-foreground">
                  {count} {count === 1 ? "contribution" : "contributions"}
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {entriesWith.map((e) => (
                    <li key={e.id}>
                      <Link to={`/playbook/${e.id}`} className="underline underline-offset-4">
                        {e.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                {resources.length > 0 && (
                  <p className="mt-3 border-t pt-3">
                    <span className="font-semibold">Consider updating: </span>
                    {resources.map((slug, i) => (
                      <span key={slug}>
                        {i > 0 && ", "}
                        <Link to={`/library/${slug}`} className="underline underline-offset-4">
                          {RESOURCES.find((r) => r.slug === slug)?.title ?? slug}
                        </Link>
                      </span>
                    ))}
                  </p>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}
