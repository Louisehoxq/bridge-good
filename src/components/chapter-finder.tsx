import { useId, useMemo, useRef, useState } from "react"
import { Link } from "react-router"
import { ChapterMap } from "@/components/chapters/chapter-map"
import { Icon } from "@/components/icon"
import { CHAPTERS, FOCUS_AREAS, REGIONS, type Chapter } from "@/content/chapters"
import { SyntheticBadge } from "@/components/synthetic-badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/select"
import { formatDay, todayFrom, upcoming } from "@/lib/events/logic"
import { useEvents } from "@/lib/events/store"
import { useServerNow } from "@/lib/session"
import type { CommunityEvent } from "@/lib/events/types"
import { cn } from "@/lib/utils"

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`

/**
 * Find a chapter: filters, a map and a list that always show the same chapters. The list is the full alternative to
 * the map: every chapter, every detail and every action is there, by keyboard, with or without the map.
 */
export function ChapterFinder() {
  const id = useId()
  const now = useServerNow()
  const [events] = useEvents()
  const [region, setRegion] = useState("")
  const [focus, setFocus] = useState("")
  const [withEvents, setWithEvents] = useState(false)
  const [query, setQuery] = useState("")
  const [selection, setSelection] = useState<{ id: string; from: "pin" | "list" } | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const nextEvents = useMemo(() => {
    const byChapter = new Map<string, CommunityEvent[]>()
    for (const e of upcoming(events, now)) byChapter.set(e.chapterId, [...(byChapter.get(e.chapterId) ?? []), e])
    return byChapter
  }, [events, now])
  const today = todayFrom(now)

  const q = query.trim().toLowerCase()
  const visible = useMemo(
    () =>
      CHAPTERS.filter(
        (c) =>
          (!region || c.region === region) &&
          (!focus || c.focus.includes(focus as Chapter["focus"][number])) &&
          (!withEvents || nextEvents.has(c.id)) &&
          `${c.city} ${c.country} ${c.focus.join(" ")} ${c.lead}`.toLowerCase().includes(q)
      ),
    [region, focus, withEvents, q, nextEvents]
  )
  const selected = visible.find((c) => c.id === selection?.id) ?? null

  const pinLabel = (c: Chapter) => {
    const n = nextEvents.get(c.id)?.length ?? 0
    return `${c.city} chapter, ${c.country}: ${n ? plural(n, "upcoming event") : "no upcoming events"}`
  }

  const selectFromPin = (chapterId: string | null) => {
    setSelection(chapterId ? { id: chapterId, from: "pin" } : null)
    // Bring the chapter's list entry into view inside the list, without scrolling the page.
    const list = listRef.current
    const item = chapterId ? list?.querySelector<HTMLElement>(`#chapter-${chapterId}`) : null
    if (list && item && list.scrollHeight > list.clientHeight) list.scrollTop = item.offsetTop - list.offsetTop - 8
  }

  const clear = () => {
    setRegion("")
    setFocus("")
    setWithEvents(false)
    setQuery("")
  }
  const filtered = !!(region || focus || withEvents || q)

  return (
    <div className="space-y-6">
      <form role="search" aria-label="Filter chapters" onSubmit={(e) => e.preventDefault()} className="flex flex-wrap items-end gap-4 rounded-2xl border bg-card p-4">
        <div className="flex min-w-0 flex-1 basis-56 flex-col gap-1">
          <Label htmlFor={`${id}-search`}>Search</Label>
          <Input id={`${id}-search`} type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="City, country, focus or lead" />
        </div>
        <div className="flex min-w-0 flex-1 basis-48 flex-col gap-1">
          <Label htmlFor={`${id}-region`}>Region</Label>
          <NativeSelect id={`${id}-region`} value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="">All regions</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </NativeSelect>
        </div>
        <div className="flex min-w-0 flex-1 basis-48 flex-col gap-1">
          <Label htmlFor={`${id}-focus`}>Focus</Label>
          <NativeSelect id={`${id}-focus`} value={focus} onChange={(e) => setFocus(e.target.value)}>
            <option value="">Any focus</option>
            {FOCUS_AREAS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </NativeSelect>
        </div>
        <label className="inline-flex min-h-12 cursor-pointer items-center gap-3 font-semibold">
          <input type="checkbox" checked={withEvents} onChange={(e) => setWithEvents(e.target.checked)} className="size-5 accent-[var(--action)]" />
          Has upcoming events
        </label>
        {filtered && (
          <button type="button" onClick={clear} className="inline-flex min-h-12 items-center gap-2 rounded-md px-3 font-semibold text-primary underline underline-offset-4">
            <Icon name="x" className="text-base" />
            Clear filters
          </button>
        )}
      </form>

      <div className="grid gap-8 xl:grid-cols-[3fr_2fr]">
        <ChapterMap
          chapters={visible}
          selected={selected}
          focusPopup={selection?.from === "pin"}
          onSelect={selectFromPin}
          pinLabel={pinLabel}
          popup={selected && <ChapterPopup chapter={selected} next={nextEvents.get(selected.id)?.[0]} today={today} />}
        />

        <section aria-labelledby={`${id}-list`} className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h2 id={`${id}-list`} className="type-title-3">
              Chapter list
            </h2>
            <SyntheticBadge />
          </div>
          <p role="status" className="text-muted-foreground">
            {plural(visible.length, "chapter")}
            {filtered ? (visible.length === 1 ? " matches your filters" : " match your filters") : ""}
            {selected ? `. Showing ${selected.city} on the map.` : ""}
          </p>
          {visible.length === 0 ? (
            <p className="rounded-2xl border border-dashed p-6 text-center text-muted-foreground">
              No chapters match. Try another region or focus, or clear the filters.
            </p>
          ) : (
            <div ref={listRef} className="relative xl:max-h-[40rem] xl:overflow-y-auto xl:pr-1" role="region" aria-label="Chapters" tabIndex={0}>
              <ul className="space-y-3">
                {visible.map((c) => {
                  const next = nextEvents.get(c.id) ?? []
                  const on = selected?.id === c.id
                  return (
                    <li key={c.id} id={`chapter-${c.id}`} className={cn("rounded-xl border bg-card p-4", on && "border-primary ring-2 ring-primary")}>
                      <article aria-labelledby={`chapter-${c.id}-title`} className="space-y-2">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <h3 id={`chapter-${c.id}-title`} className="type-title-3">
                            {c.city}, {c.country}
                          </h3>
                        </div>
                        <p>
                          Chapter lead: <span className="font-bold">{c.lead}</span>, {c.leadOrg}
                        </p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <Icon name="map-pin" className="mt-1 text-base" /> <span>Focus: {c.focus.join(", ")}</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Icon name="calendar" className="mt-1 text-base" /> <span>Meets: {c.meets}</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Icon name="users" className="mt-1 text-base" /> <span>{plural(c.members, "member")}</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Icon name="calendar-clock" className="mt-1 text-base" />
                            <span>
                              {next.length ? `Next: ${formatDay(next[0], today, true)}, ${next[0].title}` : "No upcoming events"}
                              {next.length > 1 && ` (and ${plural(next.length - 1, "more", "more")})`}
                            </span>
                          </li>
                        </ul>
                        <div className="flex flex-wrap gap-x-4">
                          <Link
                            to={`/chapters/${c.id}`}
                            className="inline-flex min-h-12 items-center gap-2 font-semibold text-primary underline underline-offset-4"
                          >
                            <Icon name="arrow-right" className="text-base" />
                            {c.city} chapter page
                          </Link>
                          <button
                            type="button"
                            aria-pressed={on}
                            onClick={() => setSelection(on ? null : { id: c.id, from: "list" })}
                            className="inline-flex min-h-12 items-center gap-2 font-semibold text-primary underline underline-offset-4"
                          >
                            <Icon name="map" className="text-base" />
                            Show on the map<span className="sr-only">: {c.city}</span>
                          </button>
                        </div>
                      </article>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function ChapterPopup({ chapter, next, today }: { chapter: Chapter; next?: CommunityEvent; today: string }) {
  return (
    <div className="space-y-1">
      <p className="font-heading text-lg font-semibold">
        {chapter.city}, {chapter.country}
      </p>
      <p>Chapter lead: {chapter.lead}</p>
      <p className="text-muted-foreground">{chapter.focus.join(", ")}</p>
      <p className="text-muted-foreground">{next ? `Next: ${formatDay(next, today, true)}, ${next.title}` : "No upcoming events"}</p>
      <Link to={`/chapters/${chapter.id}`} className="inline-flex min-h-12 items-center gap-2 font-semibold text-primary underline underline-offset-4">
        Open the chapter page
        <Icon name="arrow-right" className="text-base" />
      </Link>
    </div>
  )
}
