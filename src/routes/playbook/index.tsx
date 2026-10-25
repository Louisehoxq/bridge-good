import { Link, useSearchParams } from "react-router"
import { AppShell } from "@/components/app-shell"
import { PublicPage } from "@/components/cycle"
import { Icon } from "@/components/icon"
import { EntryCard, StatusTag, TypeBadge, usePlaybook } from "@/components/playbook/shared"
import { buttonVariants } from "@/components/ui/button"
import { ENTRY_TYPES, type EntryType } from "@/content/playbook"
import { pageMeta } from "@/lib/meta"
import { cn } from "@/lib/utils"

export const meta = () => pageMeta("Living Playbook")

const isType = (v: string | null): v is EntryType => ENTRY_TYPES.some((t) => t.id === v)

export default function PlaybookIndex() {
  const [entries] = usePlaybook()
  const [params, setParams] = useSearchParams()
  const typeParam = params.get("type")
  const type = isType(typeParam) ? typeParam : null
  const published = entries.filter((e) => e.status === "published" && (!type || e.type === type))
  const mine = entries.filter((e) => e.mine)

  return (
    <AppShell>
      <PublicPage
        title="Living Playbook"
        stage="reflect"
        next={{ label: "Teach & Facilitate", href: "/teach" }}
        lede="Lessons, adaptations, questions, and improvements from the community, carefully stewarded so BRIDGEGOOD's philosophy can evolve without losing its identity or authorship. The playbook belongs to the community that practices it."
      >
        <div className="space-y-12">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-surface-sunken p-6">
            <div className="max-w-2xl">
              <h2 className="type-title-3">Share what you&apos;ve learned</h2>
              <p className="mt-1">
                Share a lesson. Reflect on a challenge. Adapt a tool. Ask a question the guidance doesn&apos;t answer. A
                BRIDGEGOOD steward reviews every contribution before it&apos;s published.
              </p>
            </div>
            <Link to="/playbook/contribute" className={buttonVariants({ size: "lg" })}>
              Contribute
              <Icon name="arrow-right" />
            </Link>
          </div>

          <nav aria-label="Filter by kind of entry">
            <ul className="flex flex-wrap gap-2">
              <li>
                <button
                  type="button"
                  aria-pressed={!type}
                  onClick={() => setParams({}, { replace: true, preventScrollReset: true })}
                  className={cn("min-h-12 rounded-lg border-[1.5px] px-4 font-semibold", !type ? "border-action bg-surface-sunken" : "border-input hover:bg-muted")}
                >
                  Everything
                </button>
              </li>
              {ENTRY_TYPES.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    aria-pressed={type === t.id}
                    onClick={() => setParams({ type: t.id }, { replace: true, preventScrollReset: true })}
                    className={cn(
                      "inline-flex min-h-12 items-center gap-2 rounded-lg border-[1.5px] px-4 font-semibold",
                      type === t.id ? "border-action bg-surface-sunken" : "border-input hover:bg-muted"
                    )}
                  >
                    <Icon name={t.icon} />
                    {t.label}
                  </button>
                </li>
              ))}
            </ul>
            {type && <p className="mt-3 text-muted-foreground">{ENTRY_TYPES.find((t) => t.id === type)!.description}</p>}
          </nav>

          <section aria-labelledby="entries-title">
            <h2 id="entries-title" className="sr-only">
              Entries
            </h2>
            <p role="status" className="mb-4 text-muted-foreground">
              {published.length} {published.length === 1 ? "entry" : "entries"}
            </p>
            <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {published.map((e) => (
                <li key={e.id}>
                  <EntryCard entry={e} />
                </li>
              ))}
            </ul>
          </section>

          {mine.length > 0 && (
            <section aria-labelledby="mine-title">
              <h2 id="mine-title" className="type-title-2">
                Your contributions
              </h2>
              <p className="mt-1 mb-4 text-muted-foreground">Contributions you made in this browser, and where each one is in review.</p>
              <ul className="space-y-3">
                {mine.toReversed().map((e) => (
                  <li key={e.id} className="flex flex-wrap items-center gap-3 rounded-xl border bg-card p-4">
                    <Link to={`/playbook/${e.id}`} className="font-semibold underline underline-offset-4">
                      {e.title}
                    </Link>
                    <TypeBadge entry={e} />
                    <StatusTag status={e.status} />
                    {e.replies.some((r) => r.from === "steward") && <span className="type-small font-semibold text-action">A steward replied</span>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section aria-labelledby="how-title" className="grid gap-6 lg:grid-cols-2">
            <div>
              <h2 id="how-title" className="type-title-3">
                What&apos;s in the Playbook
              </h2>
              <dl className="mt-3 space-y-3">
                {ENTRY_TYPES.map((t) => (
                  <div key={t.id}>
                    <dt className="flex items-center gap-2 font-bold">
                      <Icon name={t.icon} className="text-action" />
                      {t.label}
                    </dt>
                    <dd>{t.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="rounded-2xl border-2 border-action p-6">
              <h2 className="type-title-3">Trust, safety, and stewardship</h2>
              <p className="mt-2">
                The Playbook isn&apos;t an unmoderated collection of stories or a vote-based popularity contest. A person
                reviews every contribution for relevance, consent, privacy, accessibility, and alignment. One
                community&apos;s adaptation is never presented as right for everyone.
              </p>
              <div className="mt-3 flex flex-wrap gap-x-6">
                <Link to="/about#review" className="inline-flex min-h-12 items-center underline underline-offset-4">
                  How review works
                </Link>
                <Link to="/about#withdraw" className="inline-flex min-h-12 items-center underline underline-offset-4">
                  Request a correction or withdrawal
                </Link>
              </div>
            </div>
          </section>
        </div>
      </PublicPage>
    </AppShell>
  )
}
