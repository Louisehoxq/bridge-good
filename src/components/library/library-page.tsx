import { ChevronRight } from "lucide-react"
import type { ReactNode } from "react"
import { Link } from "react-router"
import { Icon } from "@/components/icon"
import { getPillar, getPrompt, type PillarId, type ReflectionPrompt, type ReflectionPromptId } from "@/content/framework"
import { libraryEntry, libraryNeighbors, sectionLabel } from "@/lib/library"

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="size-4 text-muted-foreground" aria-hidden="true" />}
            {item.href ? (
              <Link to={item.href} className="inline-flex min-h-12 items-center underline underline-offset-4">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-semibold">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

/**
 * Frame for every library page: breadcrumbs from the library index, a heading, the page's content,
 * and previous/next links in reading order. `href` is the page's own stable URL.
 */
export function LibraryPage({ href, title, intro, children }: { href: string; title?: string; intro?: ReactNode; children: ReactNode }) {
  const entry = libraryEntry(href)
  const { previous, next } = libraryNeighbors(href)
  const heading = title ?? entry?.title ?? ""

  return (
    <article className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Breadcrumbs
        items={[
          { label: "Library", href: "/learn" },
          ...(entry ? [{ label: sectionLabel(entry.section), href: `/learn#${entry.section}` }] : []),
          { label: heading },
        ]}
      />
      <header className="mb-10 max-w-3xl space-y-3">
        <h1 className="type-title-1">{heading}</h1>
        {intro && <div className="type-body-lg max-w-[70ch] text-muted-foreground">{intro}</div>}
      </header>
      {children}
      <nav aria-label="Library pages" className="mt-16 grid gap-4 border-t pt-8 sm:grid-cols-2">
        {previous ? (
          <Link to={previous.href} className="group flex flex-col rounded-xl border bg-card p-4 hover:bg-muted">
            <span className="type-small text-muted-foreground">Previous</span>
            <span className="font-bold">{previous.title}</span>
          </Link>
        ) : (
          <span />
        )}
        <Link to={next?.href ?? "/learn"} className="group flex flex-col rounded-xl border-2 border-primary bg-card p-4 text-right hover:bg-muted sm:col-start-2">
          <span className="type-small text-muted-foreground">Next</span>
          <span className="inline-flex items-center justify-end gap-2 font-bold">
            {next?.title ?? "Back to the library"}
            <Icon name="arrow-right" className="text-base transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      </nav>
    </article>
  )
}

/**
 * A link to a pillar's library page. A 10px-radius link, not a pill: tags are round, links and controls aren't.
 * It looks 40px tall, and an invisible layer pads the hit area to 48px (DESIGN.md target size). Lists of these
 * need at least 8px between rows so the padded areas don't overlap.
 */
export function PillarChip({ id }: { id: PillarId }) {
  const pillar = getPillar(id)
  return (
    <Link
      to={`/learn/pillars/${id}`}
      className="relative inline-flex min-h-10 items-center rounded-md border border-input bg-card px-3 type-small font-semibold text-primary underline-offset-4 after:absolute after:inset-x-0 after:-inset-y-1 after:content-[''] hover:underline"
    >
      <span className="sr-only">Pillar: </span>
      {pillar.name}
    </Link>
  )
}

/** Reflection prompts, numbered with their canonical ids so they match the evaluator schema. */
export function PromptList({ prompts, showPillars }: { prompts: (ReflectionPrompt | ReflectionPromptId)[]; showPillars?: boolean }) {
  const items = prompts.map((p) => (typeof p === "number" ? getPrompt(p) : p))
  return (
    <ul className="space-y-3">
      {items.map((p) => (
        <li key={p.id} className="flex gap-4 rounded-xl border bg-card p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted font-bold" aria-hidden="true">
            {p.id}
          </span>
          <div className="min-w-0 space-y-2">
            <p className="type-body-lg">
              <span className="sr-only">Prompt {p.id}: </span>
              {p.text}
            </p>
            {showPillars && (
              <ul className="flex flex-wrap gap-x-1.5 gap-y-2" aria-label="Pillars">
                {p.pillarIds.map((id) => (
                  <li key={id}>
                    <PillarChip id={id} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}

/** Authorship note shown on framework pages: BRIDGEGOOD owns the wording. */
export function DraftNote({ children }: { children: ReactNode }) {
  return (
    <p className="flex gap-3 rounded-xl border border-dashed border-input p-4 text-muted-foreground">
      <Icon name="scroll-text" className="mt-0.5" />
      <span>{children}</span>
    </p>
  )
}
