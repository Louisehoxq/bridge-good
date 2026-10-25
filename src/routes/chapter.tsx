import { useId, type ReactNode } from "react"
import { data, Link } from "react-router"
import type { Route } from "./+types/chapter"
import { AppShell } from "@/components/app-shell"
import { EventCard } from "@/components/events/event-parts"
import { Icon } from "@/components/icon"
import { FieldNote } from "@/components/studio/field-note"
import { SyntheticBadge } from "@/components/synthetic-badge"
import { buttonVariants } from "@/components/ui/button"
import { CHAPTER_MODEL_LABEL, chapterLabel, getChapter } from "@/content/chapters"
import { getPillar } from "@/content/framework"
import { getPracticeMoment } from "@/content/practice"
import { canHost, upcoming } from "@/lib/events/logic"
import { useEvents, useRsvps, whoFor } from "@/lib/events/store"
import { useFieldNotes } from "@/lib/feedback/store"
import { pageMeta } from "@/lib/meta"
import { useServerNow, useSession } from "@/lib/session"

export function loader({ params }: Route.LoaderArgs) {
  const chapter = getChapter(params.id)
  if (!chapter) throw data("Chapter not found", { status: 404 })
  return { chapterId: chapter.id }
}

export const meta = ({ params }: Route.MetaArgs) => {
  const chapter = getChapter(params.id)
  return pageMeta(chapter ? `${chapterLabel(chapter)} (proposed)` : "Chapter not found")
}

/** One chapter in the proposed model: who runs it, who it works with, its calendar and its field notes. */
export default function ChapterPage({ loaderData }: Route.ComponentProps) {
  const id = useId()
  const chapter = getChapter(loaderData.chapterId)!
  const now = useServerNow()
  const session = useSession()
  const who = whoFor(session)
  const [events] = useEvents()
  const [rsvps] = useRsvps()
  const [notes] = useFieldNotes()
  const next = upcoming(
    events.filter((e) => e.chapterId === chapter.id),
    now
  )
  const label = chapterLabel(chapter)
  const ownNotes = notes.filter((n) => n.chapter === label)
  const hostHref = `/events/host?chapter=${chapter.id}`

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <Link to="/chapters" className="mb-4 inline-flex min-h-12 items-center gap-2 font-semibold text-primary underline underline-offset-4">
          All chapters and the map
        </Link>

        <div className="mb-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <p className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-muted-foreground px-3 py-1 type-small font-semibold text-muted-foreground">
              <Icon name="info" className="text-base" />
              {CHAPTER_MODEL_LABEL}
            </p>
            <SyntheticBadge />
          </div>
          <h1 className="type-title-1">
            {label}, {chapter.country}
          </h1>
          <p className="type-body-lg text-muted-foreground">
            A made-up chapter in the proposed model, not a BRIDGEGOOD chapter. The people, companies and partners here are synthetic, and the
            location is the city only.
          </p>
        </div>

        <div className="grid gap-10 xl:grid-cols-[2fr_3fr]">
          <div className="min-w-0 space-y-8">
            <section aria-labelledby={`${id}-about`} className="space-y-4 rounded-2xl border bg-card p-5">
              <h2 id={`${id}-about`} className="type-title-2">
                About the chapter
              </h2>
              <dl className="grid gap-4">
                <Fact icon="map-pin" term="Region">
                  {chapter.region}
                </Fact>
                <Fact icon="message-circle-heart" term="Chapter lead">
                  {chapter.lead}, {chapter.leadOrg}
                </Fact>
                <Fact icon="sprout" term="Focus">
                  {chapter.focus.join(", ")}
                </Fact>
                <Fact icon="calendar" term="Meets">
                  {chapter.meets}
                </Fact>
                <Fact icon="users" term="Members">
                  {chapter.members} apprentices, mentors and partners
                </Fact>
                <Fact icon="building-2" term="Company hosts">
                  <List items={chapter.companyHosts} />
                </Fact>
                <Fact icon="heart-handshake" term="Community partners">
                  <List items={chapter.communityPartners} />
                </Fact>
                <Fact icon="mail" term="Contact">
                  <a href={`mailto:${chapter.inbox}`} className="inline-flex min-h-12 max-w-full items-center font-semibold text-primary underline underline-offset-4">
                    <span className="min-w-0 [overflow-wrap:anywhere]">{chapter.inbox}</span>
                  </a>
                  <span className="block text-muted-foreground">A shared chapter inbox that the chapter lead and BRIDGEGOOD read, not a personal address.</span>
                </Fact>
              </dl>
            </section>

            <section aria-labelledby={`${id}-notes`} className="space-y-4">
              <h2 id={`${id}-notes`} className="type-title-2">
                Local field notes
              </h2>
              <p className="text-muted-foreground">
                How this chapter adapts the philosophy, once BRIDGEGOOD has recognized the adaptation. BRIDGEGOOD&apos;s official wording stays the same
                everywhere.
              </p>
              {ownNotes.length === 0 ? (
                <p className="rounded-2xl border border-dashed p-6 text-center text-muted-foreground">No field notes from this chapter yet.</p>
              ) : (
                <ul className="space-y-6">
                  {ownNotes.map((note) => {
                    const practice = note.practice ? getPracticeMoment(note.practice) : undefined
                    const where = practice
                      ? { to: `/learn/practice/${practice.slug}`, name: `the practice moment “${practice.title}”` }
                      : note.pillarId
                        ? { to: `/learn/pillars/${note.pillarId}`, name: `the ${getPillar(note.pillarId).name} pillar` }
                        : undefined
                    return (
                      <li key={note.id} className="space-y-2">
                        <FieldNote chapter={`the ${label}`}>
                          <p>{note.text}</p>
                        </FieldNote>
                        {where && (
                          <Link to={where.to} className="inline-flex min-h-12 items-center gap-2 font-semibold text-primary underline underline-offset-4">
                            Read it on {where.name}
                          </Link>
                        )}
                      </li>
                    )
                  })}
                </ul>
              )}
            </section>
          </div>

          <section aria-labelledby={`${id}-events`} className="min-w-0 space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id={`${id}-events`} className="type-title-2">
                Upcoming events
              </h2>
              <div className="flex flex-wrap gap-3">
                <Link to={`/events?chapter=${chapter.id}`} className={buttonVariants({ variant: "outline" })}>
                  <Icon name="calendar" />
                  {chapter.city} calendar
                </Link>
                {who && canHost(who.role) && (
                  <Link to={hostHref} className={buttonVariants()}>
                    <Icon name="calendar-plus" />
                    Host an event here
                  </Link>
                )}
              </div>
            </div>
            {!who && (
              <p className="text-muted-foreground">
                Chapter leads, company hosts, community partners and mentors can host an event here.{" "}
                <Link to={`/login?next=${encodeURIComponent(hostHref)}`} className="inline-flex min-h-12 items-center font-semibold text-primary underline underline-offset-4">
                  Log in to host
                </Link>
              </p>
            )}
            {who?.role === "apprentice" && (
              <p className="text-muted-foreground">Apprentices host events with their chapter lead. Tell {chapter.lead} what you&apos;d like to run.</p>
            )}
            {next.length === 0 ? (
              <p className="rounded-2xl border border-dashed p-6 text-center text-muted-foreground">Nothing on the {chapter.city} calendar yet.</p>
            ) : (
              <ul className="grid gap-5 md:grid-cols-2">
                {next.map((e) => (
                  <li key={e.id}>
                    <EventCard event={e} now={now} rsvps={rsvps} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </AppShell>
  )
}

function Fact({ icon, term, children }: { icon: Parameters<typeof Icon>[0]["name"]; term: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="flex items-center gap-2 font-semibold">
        <Icon name={icon} className="text-muted-foreground" />
        {term}
      </dt>
      <dd className="pl-7">{children}</dd>
    </div>
  )
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}
