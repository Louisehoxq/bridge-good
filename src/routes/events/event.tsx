import { useId, useSyncExternalStore } from "react"
import { Link, useSearchParams } from "react-router"
import type { Route } from "./+types/event"
import { AppShell } from "@/components/app-shell"
import { CycleStageBar } from "@/components/cycle"
import { AccessBlock, EventFacts, EventTypeTag } from "@/components/events/event-parts"
import { PretendEnded, RsvpPanel } from "@/components/events/rsvp-panel"
import { WhatWeLearned } from "@/components/events/what-we-learned"
import { Icon } from "@/components/icon"
import { RoleBadge, STUDIO_ROLES } from "@/components/studio/role-badge"
import { SyntheticBadge } from "@/components/synthetic-badge"
import { SEED_EVENTS } from "@/content/events"
import { scenarioBySlug } from "@/content/lab"
import { resourceBySlug } from "@/content/practice-library"
import { chapterName, hasEnded, isHost, typeNoun } from "@/lib/events/logic"
import { useEvents, whoFor } from "@/lib/events/store"
import { pageMeta } from "@/lib/meta"
import { useServerNow, useSession } from "@/lib/session"

export const meta = ({ params }: Route.MetaArgs) => pageMeta(SEED_EVENTS.find((e) => e.id === params.id)?.title ?? "Event")

const noop = () => () => {}

/** One event: what it is, when and where, the access details, the plan, and an RSVP. */
export default function EventPage({ params }: Route.ComponentProps) {
  const id = useId()
  const [search] = useSearchParams()
  const now = useServerNow()
  const session = useSession()
  const who = whoFor(session)
  const [events] = useEvents()
  // Events someone hosted live in this browser only, so the server can't find them. Wait for the browser before saying "not found".
  const hydrated = useSyncExternalStore(noop, () => true, () => false)
  const event = events.find((e) => e.id === params.id)

  if (!event) {
    return (
      <AppShell>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <h1 className="type-title-1">{hydrated ? "Event not found" : "Event"}</h1>
          {hydrated && (
            <p className="mt-3 max-w-3xl type-body-lg text-muted-foreground">
              It may have been hosted from another browser. Demo data lives in this browser only.
            </p>
          )}
          <Link to="/events" className="mt-4 inline-flex min-h-12 items-center font-semibold text-primary underline underline-offset-4">
            All community events
          </Link>
        </div>
      </AppShell>
    )
  }

  const ended = hasEnded(event, now)
  const hosting = isHost(event, who)
  const scenario = event.links.scenario ? scenarioBySlug(event.links.scenario) : undefined
  const resources = event.links.resources.map(resourceBySlug).filter((r) => r !== undefined)
  const agendaMinutes = event.agenda.reduce((sum, a) => sum + a.minutes, 0)

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <CycleStageBar stage="reflect" next={{ label: "Living Playbook", href: "/playbook" }} />
        <Link to={`/events?chapter=${event.chapterId}`} className="mb-4 inline-flex min-h-12 items-center gap-2 font-semibold text-primary underline underline-offset-4">
          {chapterName(event.chapterId)} calendar
        </Link>

        {search.get("hosted") && hosting && (
          <p role="status" className="mb-6 flex flex-wrap items-center gap-2 rounded-xl bg-success-soft p-4">
            <Icon name="circle-check" className="text-success" />
            <span className="font-semibold">Your event is on the {chapterName(event.chapterId)} calendar.</span>
            People in the chapter can RSVP now.
          </p>
        )}

        <div className="mb-8 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <EventTypeTag type={event.type} />
            {event.synthetic && <SyntheticBadge />}
            {ended && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 type-small font-semibold">
                <Icon name="history" className="text-base" />
                Past event
              </span>
            )}
          </div>
          <h1 className="type-title-1">{event.title}</h1>
          <p className="type-body-lg">{event.summary}</p>
          <EventFacts event={event} now={now} className="type-body-lg" />
          <p className="flex flex-wrap items-center gap-2">
            <span>Hosted by</span>
            <RoleBadge role={event.host.role}>
              {event.host.name}, {STUDIO_ROLES[event.host.role].label.toLowerCase()}
            </RoleBadge>
            <span className="text-muted-foreground">on the {chapterName(event.chapterId)} calendar</span>
          </p>
        </div>

        <div className="grid gap-8 xl:grid-cols-[3fr_2fr]">
          <div className="min-w-0 space-y-8">
            <AccessBlock event={event} headingId={`${id}-access`} />

            <section aria-labelledby={`${id}-plan`} className="space-y-3">
              <h2 id={`${id}-plan`} className="type-title-2">
                The plan
              </h2>
              <p className="text-muted-foreground">
                {agendaMinutes} minutes, from the {typeNoun(event.type)} template.
              </p>
              <ol className="space-y-3">
                {event.agenda.map((step, i) => (
                  <li key={step.title} className="flex gap-4 rounded-xl border bg-card p-4">
                    <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted font-semibold">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold">
                        {step.title} <span className="font-normal text-muted-foreground">· {step.minutes} min</span>
                      </h3>
                      {step.text && <p>{step.text}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section aria-labelledby={`${id}-who`} className="space-y-3">
              <h2 id={`${id}-who`} className="type-title-2">
                Who it&apos;s for
              </h2>
              <ul className="flex flex-wrap gap-2">
                {event.forRoles.map((r) => (
                  <li key={r}>
                    <RoleBadge role={r} />
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby={`${id}-links`} className="space-y-3">
              <h2 id={`${id}-links`} className="type-title-2">
                Before you come
              </h2>
              <p className="text-muted-foreground">Tools and a warm-up from BRIDGEGOOD&apos;s Practice Library and Decision Lab.</p>
              <ul className="space-y-1">
                {resources.map((r) => (
                  <li key={r.slug}>
                    <Link to={`/library/${r.slug}`} className="inline-flex min-h-12 items-center gap-2 font-semibold text-primary underline underline-offset-4">
                      <Icon name="pencil-ruler" />
                      Practice Library: {r.title}
                    </Link>
                  </li>
                ))}
                {scenario && (
                  <li>
                    <Link to={`/lab/${scenario.slug}`} className="inline-flex min-h-12 items-center gap-2 font-semibold text-primary underline underline-offset-4">
                      <Icon name="scale" />
                      Decision Lab: {scenario.title}
                    </Link>
                  </li>
                )}
              </ul>
            </section>

            <section aria-labelledby={`${id}-reflect`} className="space-y-2 rounded-2xl bg-surface-sunken p-5">
              <h2 id={`${id}-reflect`} className="type-title-3">
                Afterwards: reflect and share
              </h2>
              <p>
                After the event, the host shares what the group learned in the Living Playbook. A BRIDGEGOOD steward reviews it
                before it&apos;s published, so other chapters can learn from it too.
              </p>
              <Link to="/playbook?type=practice" className="inline-flex min-h-12 items-center gap-1 font-semibold text-primary underline underline-offset-4">
                What other events have taught us
                <Icon name="arrow-right" className="text-base" />
              </Link>
            </section>
          </div>

          <div className="h-fit min-w-0 space-y-6">
            <RsvpPanel event={event} now={now} />
            {hosting && !ended && <PretendEnded event={event} />}
          </div>
        </div>

        {hosting && ended && (
          <div className="mt-12">
            <WhatWeLearned event={event} />
          </div>
        )}
      </div>
    </AppShell>
  )
}
