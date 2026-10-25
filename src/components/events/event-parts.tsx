import { Link } from "react-router"
import { Icon, type IconName } from "@/components/icon"
import { RoleBadge } from "@/components/studio/role-badge"
import { SyntheticBadge } from "@/components/synthetic-badge"
import { EVENT_TYPE_INFO } from "@/content/events"
import { chapterName, formatDay, formatTimes, FORMAT_INFO, goingCount, placeLabel, spotsLeft, STEP_FREE_INFO, todayFrom } from "@/lib/events/logic"
import type { CommunityEvent, EventType, Rsvp } from "@/lib/events/types"
import { cn } from "@/lib/utils"

const tag = "inline-flex max-w-full items-center gap-1.5 rounded-full px-3 py-1 type-small font-semibold"

/** The event's type, with its icon and a word. */
export function EventTypeTag({ type, className }: { type: EventType; className?: string }) {
  const info = EVENT_TYPE_INFO[type]
  return (
    <span className={cn(tag, "border border-input bg-card text-foreground", className)}>
      <Icon name={info.icon} className="text-base" />
      {info.label}
    </span>
  )
}

/** Date, time and place, each with an icon. Times are always in the event's own time zone. */
export function EventFacts({ event, now, className }: { event: CommunityEvent; now: number; className?: string }) {
  const today = todayFrom(now)
  return (
    <ul className={cn("space-y-1", className)}>
      <li className="flex items-start gap-2">
        <Icon name="calendar" className="mt-1" />
        <span>
          {formatDay(event, today)}, {formatTimes(event, today)}
        </span>
      </li>
      <li className="flex items-start gap-2">
        <Icon name={FORMAT_INFO[event.format].icon} className="mt-1" />
        <span>
          {FORMAT_INFO[event.format].label}
          {event.format === "in-person" ? `: ${placeLabel(event)}` : ""}
        </span>
      </li>
    </ul>
  )
}

/** One event in a list: what, when, where, who's hosting, and how many spots are left. */
export function EventCard({ event, now, rsvps, headingLevel = 3, ended }: { event: CommunityEvent; now: number; rsvps: Rsvp[]; headingLevel?: 2 | 3 | 4; ended?: boolean }) {
  const Heading = `h${headingLevel}` as const
  const left = spotsLeft(event, rsvps)
  return (
    <article className="flex h-full flex-col gap-3 rounded-2xl border bg-card p-5">
      <div className="flex flex-wrap items-center gap-2">
        <EventTypeTag type={event.type} />
        {event.synthetic && <SyntheticBadge />}
      </div>
      <Heading className="type-title-3">
        <Link to={`/events/${event.id}`} className="underline-offset-4 hover:underline">
          {event.title}
        </Link>
      </Heading>
      <EventFacts event={event} now={now} />
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
        <RoleBadge role={event.host.role}>{event.host.name}</RoleBadge>
        <span className="type-small text-muted-foreground">{chapterName(event.chapterId)}</span>
      </div>
      <p className="flex flex-wrap gap-x-4 gap-y-1 type-small text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Icon name="accessibility" className="text-base" />
          {STEP_FREE_INFO[event.access.stepFree]}
          {event.access.captions ? ", captions" : ""}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Icon name="users" className="text-base" />
          {ended ? `${goingCount(event, rsvps)} went` : left === 0 ? "Full" : `${left} of ${event.capacity} spots left`}
        </span>
      </p>
    </article>
  )
}

function AccessRow({ icon, label, children }: { icon: IconName; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <Icon name={icon} className="mt-1 text-[1.5rem]" />
      <div>
        <dt className="font-semibold">{label}</dt>
        <dd>{children}</dd>
      </div>
    </div>
  )
}

/** Required for every event: what people need to know to decide whether they can come. */
export function AccessBlock({ event, headingId }: { event: CommunityEvent; headingId: string }) {
  const { access } = event
  return (
    <section aria-labelledby={headingId} className="rounded-2xl border bg-card p-6">
      <h2 id={headingId} className="type-title-2">
        Access
      </h2>
      <p className="mt-1 text-muted-foreground">Every event on BridgeGoodx says this up front, so you can decide before you RSVP.</p>
      <dl className="mt-2 divide-y">
        <AccessRow icon="accessibility" label={event.format === "online" ? "Getting in" : "Step-free access"}>
          {event.format === "online" ? "Online, nothing to travel to." : STEP_FREE_INFO[access.stepFree] + "."}
          {access.stepFreeNote && <span className="block">{access.stepFreeNote}</span>}
        </AccessRow>
        <AccessRow icon="captions" label="Captions or interpretation">
          {access.captions ? "Yes." : "Not planned. Ask the host when you RSVP if you need them."}
        </AccessRow>
        <AccessRow icon="languages" label="Languages">
          {access.languages.join(", ")}
        </AccessRow>
        <AccessRow icon="baby" label="Childcare">
          {access.childcare ? "Yes, on site." : event.format === "online" ? "Not needed for an online event." : "Not this time."}
        </AccessRow>
        <AccessRow icon="wallet" label="Cost">
          Free. Events on BridgeGoodx never charge.
        </AccessRow>
        {access.note && (
          <AccessRow icon="info" label="Also good to know">
            {access.note}
          </AccessRow>
        )}
      </dl>
    </section>
  )
}
