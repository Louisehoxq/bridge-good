import { Link, useSearchParams } from "react-router"
import { AppShell } from "@/components/app-shell"
import { PublicPage } from "@/components/cycle"
import { Icon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import { CATEGORIES, FILTERS, optionLabel, RESOURCES, type FilterKey, type Resource } from "@/content/practice-library"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Practice Library")

const FILTER_KEYS = Object.keys(FILTERS) as FilterKey[]

function matches(r: Resource, key: FilterKey, value: string) {
  if (key === "role") return (r.roles as string[]).includes(value)
  if (key === "goal") return (r.goals as string[]).includes(value)
  return r[key] === value
}

/** Filters live in the URL, so a filtered view can be shared or linked from a pathway. */
export default function LibraryIndex() {
  const [params, setParams] = useSearchParams()
  const q = params.get("q") ?? ""
  const active = FILTER_KEYS.filter((k) => params.get(k)).map((k) => [k, params.get(k)!] as const)

  const visible = RESOURCES.filter(
    (r) =>
      active.every(([k, v]) => matches(r, k, v)) &&
      (!q.trim() || `${r.title} ${r.helps} ${r.when}`.toLowerCase().includes(q.trim().toLowerCase()))
  )

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true, preventScrollReset: true })
  }

  return (
    <AppShell>
      <PublicPage
        title="Practice Library"
        stage="practice"
        next={{ label: "Reflect and share in the Living Playbook", href: "/playbook" }}
        lede="Practical tools organized around real tasks and moments of need, so you can apply the philosophy in your own setting without needing a BRIDGEGOOD team member to explain every step."
      >
        <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
          <form role="search" aria-label="Filter resources" className="space-y-5 lg:sticky lg:top-24 lg:self-start" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-1.5">
              <label htmlFor="q" className="font-semibold">
                Search
              </label>
              <input
                id="q"
                type="search"
                value={q}
                onChange={(e) => set("q", e.target.value)}
                placeholder="e.g. interview, conflict"
                className="h-12 w-full rounded-lg border-[1.5px] border-input bg-card px-3"
              />
            </div>
            {FILTER_KEYS.map((key) => (
              <div key={key} className="space-y-1.5">
                <label htmlFor={`f-${key}`} className="font-semibold">
                  {FILTERS[key].label}
                </label>
                <select
                  id={`f-${key}`}
                  value={params.get(key) ?? ""}
                  onChange={(e) => set(key, e.target.value)}
                  className="h-12 w-full rounded-lg border-[1.5px] border-input bg-card px-3"
                >
                  <option value="">Any</option>
                  {FILTERS[key].options.map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            {(active.length > 0 || q) && (
              <Button type="button" variant="outline" onClick={() => setParams(new URLSearchParams(), { replace: true })}>
                Clear filters
              </Button>
            )}
          </form>

          <div className="min-w-0 space-y-10">
            <p role="status" className="text-muted-foreground">
              {visible.length} of {RESOURCES.length} resources
              {active.length > 0 && <> · filtered by {active.map(([k, v]) => optionLabel(k, v)).join(", ")}</>}
            </p>
            {visible.length === 0 && (
              <p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
                Nothing matches those filters yet. Try fewer filters, or{" "}
                <Link to="/playbook/contribute?kind=question" className="underline underline-offset-4">
                  tell us what you needed
                </Link>
                .
              </p>
            )}
            {CATEGORIES.map((c) => {
              const items = visible.filter((r) => r.category === c.id)
              if (items.length === 0) return null
              return (
                <section key={c.id} aria-labelledby={`cat-${c.id}`}>
                  <h2 id={`cat-${c.id}`} className="mb-4 type-title-2">
                    {c.label}
                  </h2>
                  <ul className="grid gap-4 md:grid-cols-2">
                    {items.map((r) => (
                      <li key={r.slug}>
                        <Link to={`/library/${r.slug}`} className="group flex h-full flex-col gap-2 rounded-xl border bg-card p-5 hover:border-action">
                          <span className="type-title-3">{r.title}</span>
                          <span className="text-muted-foreground">{r.helps}</span>
                          <span className="mt-auto flex flex-wrap gap-2 pt-2 type-small">
                            <span className="rounded-full bg-muted px-2.5 py-0.5 font-semibold">{optionLabel("format", r.format)}</span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 font-semibold">
                              <Icon name="clock" className="text-sm" />
                              {optionLabel("time", r.time)}
                            </span>
                            <span className="rounded-full bg-muted px-2.5 py-0.5 font-semibold">{optionLabel("level", r.level)}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )
            })}
          </div>
        </div>
      </PublicPage>
    </AppShell>
  )
}
