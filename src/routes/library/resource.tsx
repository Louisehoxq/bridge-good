import { data, Link } from "react-router"
import type { Route } from "./+types/resource"
import { AppShell } from "@/components/app-shell"
import { PublicPage } from "@/components/cycle"
import { Icon, type IconName } from "@/components/icon"
import { RelatedEntries } from "@/components/playbook/shared"
import { buttonVariants } from "@/components/ui/button"
import { LAB_SCENARIOS } from "@/content/lab"
import { CATEGORIES, optionLabel, resourceBySlug, SOURCE } from "@/content/practice-library"
import { pageMeta } from "@/lib/meta"

export function loader({ params }: Route.LoaderArgs) {
  if (!resourceBySlug(params.slug)) throw data("Not found", { status: 404 })
  return { slug: params.slug }
}

export const meta = ({ data }: Route.MetaArgs) => pageMeta(data ? resourceBySlug(data.slug)?.title : "Practice Library")

function Block({ title, icon, children }: { title: string; icon: IconName; children: React.ReactNode }) {
  return (
    <section aria-label={title} className="rounded-xl border bg-card p-5">
      <h2 className="mb-2 flex items-center gap-2 type-title-3">
        <Icon name={icon} className="text-action" />
        {title}
      </h2>
      {children}
    </section>
  )
}

export default function ResourcePage({ loaderData }: Route.ComponentProps) {
  const r = resourceBySlug(loaderData.slug)!
  const category = CATEGORIES.find((c) => c.id === r.category)!
  const scenarios = LAB_SCENARIOS.filter((s) => s.related.includes(r.slug))

  return (
    <AppShell>
      <PublicPage
        title={r.title}
        stage="practice"
        next={{ label: "Reflect and share what happened", href: `/playbook/contribute?kind=lesson&resource=${r.slug}` }}
        lede={
          <>
            <p>{r.helps}</p>
            <p className="mt-2 type-body text-muted-foreground">
              <Link to="/library" className="underline underline-offset-4">
                Practice Library
              </Link>{" "}
              · {category.label}
            </p>
          </>
        }
      >
        <div className="grid gap-8 lg:grid-cols-[3fr_1fr]">
          <div className="min-w-0 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Block title="When to use it" icon="calendar-clock">
                <p>{r.when}</p>
              </Block>
              <Block title="Who should be involved" icon="users">
                <p>{r.who}</p>
              </Block>
            </div>
            <Block title="How to use it" icon="clipboard-list">
              <ol className="list-decimal space-y-2 pl-5">
                {r.how.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ol>
            </Block>
            <Block title="Questions to consider" icon="messages-square">
              <ul className="list-disc space-y-1 pl-5">
                {r.questions.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
            </Block>
            <Block title="Accessibility and inclusion considerations" icon="accessibility">
              <ul className="list-disc space-y-1 pl-5">
                {r.accessibility.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </Block>
            <Block title="How to reflect on the outcome" icon="sticky-note">
              <p>{r.reflect}</p>
            </Block>
            <RelatedEntries related={{ kind: "resource", slug: r.slug }} />
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start" aria-label="About this resource">
            <dl className="space-y-2 rounded-xl bg-surface-sunken p-5">
              <div>
                <dt className="type-small font-semibold text-muted-foreground">Format</dt>
                <dd>{optionLabel("format", r.format)}</dd>
              </div>
              <div>
                <dt className="type-small font-semibold text-muted-foreground">Time</dt>
                <dd>{optionLabel("time", r.time)}</dd>
              </div>
              <div>
                <dt className="type-small font-semibold text-muted-foreground">Experience level</dt>
                <dd>{optionLabel("level", r.level)}</dd>
              </div>
              <div>
                <dt className="type-small font-semibold text-muted-foreground">For</dt>
                <dd>{r.roles.map((x) => optionLabel("role", x)).join(", ")}</dd>
              </div>
            </dl>
            <dl className="space-y-2 rounded-xl border p-5">
              <div>
                <dt className="type-small font-semibold text-muted-foreground">Source and author</dt>
                <dd>{SOURCE.author}</dd>
              </div>
              <div>
                <dt className="type-small font-semibold text-muted-foreground">Owner</dt>
                <dd>{SOURCE.owner}</dd>
              </div>
              <div>
                <dt className="type-small font-semibold text-muted-foreground">Version and date</dt>
                <dd>
                  {r.version} · {r.updated}
                </dd>
              </div>
            </dl>
            <div className="rounded-xl border-2 border-action p-5">
              <h2 className="type-title-3">Suggest an improvement</h2>
              <p className="mt-1">Confusing, inaccessible, or didn&apos;t fit your community? Tell us. A steward reviews every suggestion.</p>
              <Link to={`/playbook/contribute?kind=resource-feedback&resource=${r.slug}`} className={buttonVariants({ variant: "outline", className: "mt-3 w-full" })}>
                Suggest an improvement
              </Link>
              <Link to={`/playbook/contribute?kind=adaptation&resource=${r.slug}`} className="mt-2 inline-flex min-h-12 items-center underline underline-offset-4">
                Share how you adapted it
              </Link>
            </div>
            {scenarios.length > 0 && (
              <div className="rounded-xl border p-5">
                <h2 className="type-title-3">Practice it in the Decision Lab</h2>
                <ul className="mt-2">
                  {scenarios.map((s) => (
                    <li key={s.slug}>
                      <Link to={`/lab/${s.slug}`} className="inline-flex min-h-12 items-center underline underline-offset-4">
                        {s.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </PublicPage>
    </AppShell>
  )
}
