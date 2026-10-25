import { useId, useRef, useState, type FormEvent, type ReactNode } from "react"
import { Link, useNavigate } from "react-router"
import { AppShell } from "@/components/app-shell"
import { ErrorSummary, FieldError, RadioGroup, TextField } from "@/components/feedback/fields"
import { Icon } from "@/components/icon"
import { PinnedNote } from "@/components/studio/pinned-note"
import { RoleBadge, STUDIO_ROLES } from "@/components/studio/role-badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/select"
import { KIT } from "@/content/carry-forward"
import { CHAPTERS, getChapter } from "@/content/chapters"
import { EVENT_TYPE_INFO, type EventTemplate } from "@/content/events"
import { newId } from "@/lib/demo-store"
import { addDays, canHost, DRAFT_LABELS, eventFromDraft, minutesToTime, todayFrom, typeNoun, validateDraft, zoneLabel, type DraftField, type EventDraft } from "@/lib/events/logic"
import { useEvents, whoFor } from "@/lib/events/store"
import { AUDIENCE_ROLES, EVENT_TYPES, type EventType } from "@/lib/events/types"
import { pageMeta } from "@/lib/meta"
import { accountFor } from "@/lib/roles"
import { useServerNow, useSession } from "@/lib/session"

export const meta = () => pageMeta("Host an event")

const fieldId = (field: DraftField) => `ev-${field}`
const LABELS = Object.fromEntries(Object.entries(DRAFT_LABELS).map(([k, v]) => [fieldId(k as DraftField), v]))

/** The fields a template fills in. Choosing another type only replaces the ones the host hasn't changed. */
function fromTemplate(t: EventTemplate, start: string): Partial<EventDraft> {
  const [h, m] = start.split(":").map(Number)
  return {
    title: t.title,
    summary: t.summary,
    capacity: String(t.capacity),
    format: t.format,
    forRoles: t.forRoles,
    end: minutesToTime(h * 60 + m + t.minutes),
    stepFree: t.format === "online" ? "yes" : "",
  }
}

/**
 * Host an event: chapter leads, company hosts, community partners, and mentors (many of them alumni). One template
 * per type; the critique circle comes from the carry-it-forward kit. Access details are required.
 */
export default function HostEvent() {
  const session = useSession()
  const who = whoFor(session)

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <Link to="/events" className="mb-4 inline-flex min-h-12 items-center gap-2 font-semibold text-primary underline underline-offset-4">
          All community events
        </Link>
        <div className="mb-8 max-w-3xl space-y-3">
          <h1 className="type-title-1">Host an event</h1>
          <p className="type-body-lg text-muted-foreground">
            Put a small, free event on your chapter&apos;s calendar. Pick a type and start from its template, then make it fit your
            community. Every event says how accessible it is before anyone RSVPs.
          </p>
        </div>
        {!session || !who ? (
          <Gate>
            <p>Hosting is for chapter leads, company hosts, community partners and mentors, including alumni who mentor. In this prototype, log in with one of those demo accounts.</p>
            <Link to={`/login?next=${encodeURIComponent("/events/host")}`} className={buttonVariants({ size: "lg" })}>
              <Icon name="log-in" />
              Log in to host
            </Link>
          </Gate>
        ) : !canHost(who.role) ? (
          <Gate>
            <p>
              {who.role === "apprentice"
                ? "Apprentices host events with their chapter lead. Tell your chapter lead what you'd like to run, and they'll put it on the calendar with you."
                : `As a ${STUDIO_ROLES[who.role].label}, you feature events rather than host them here. This form is for chapters, companies and partners.`}
            </p>
            <Link to="/events" className={buttonVariants({ variant: "outline" })}>
              See upcoming events
            </Link>
          </Gate>
        ) : (
          <HostForm defaultChapter={CHAPTERS.find((c) => `${accountFor(session).detail} ${accountFor(session).name}`.includes(c.city))?.id ?? ""} />
        )}
      </div>
    </AppShell>
  )
}

function Gate({ children }: { children: ReactNode }) {
  return <div className="max-w-2xl space-y-4 rounded-2xl border bg-card p-6">{children}</div>
}

function HostForm({ defaultChapter }: { defaultChapter: string }) {
  const id = useId()
  const navigate = useNavigate()
  const session = useSession()
  const who = whoFor(session)!
  const now = useServerNow()
  const today = todayFrom(now)
  const [, setEvents] = useEvents()
  const [draft, setDraft] = useState<EventDraft>({
    type: "",
    title: "",
    summary: "",
    chapterId: defaultChapter,
    date: addDays(today, 14),
    start: "18:00",
    end: "19:00",
    format: "",
    area: "",
    stepFree: "",
    stepFreeNote: "",
    captions: "",
    languages: "English",
    childcare: "",
    accessNote: "",
    capacity: "",
    forRoles: [],
  })
  const [errors, setErrors] = useState<Partial<Record<DraftField, string>>>({})
  const summaryRef = useRef<HTMLDivElement>(null)
  const set = <K extends DraftField>(field: K, value: EventDraft[K]) => setDraft((d) => ({ ...d, [field]: value }))
  const err = (field: DraftField) => errors[field]
  const chapter = getChapter(draft.chapterId)
  const template = draft.type ? EVENT_TYPE_INFO[draft.type].template : undefined

  function chooseType(type: EventType) {
    setDraft((d) => {
      const before = d.type ? fromTemplate(EVENT_TYPE_INFO[d.type].template, d.start) : {}
      const after = fromTemplate(EVENT_TYPE_INFO[type].template, d.start)
      const next = { ...d, type }
      for (const key of Object.keys(after) as (keyof typeof after)[]) {
        const current = JSON.stringify(d[key])
        const untouched = current === JSON.stringify(before[key]) || current === '""' || current === "[]"
        if (untouched) Object.assign(next, { [key]: after[key] })
      }
      return next
    })
  }

  function submit(e: FormEvent) {
    e.preventDefault()
    const found = validateDraft(draft, today)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }
    const event = eventFromDraft(draft, { id: `ev-${newId()}`, host: who })
    setEvents((prev) => [...prev, event])
    navigate(`/events/${event.id}?hosted=1`)
  }

  const summaryErrors = Object.fromEntries(Object.entries(errors).map(([k, v]) => [fieldId(k as DraftField), v]))

  return (
    <form onSubmit={submit} noValidate className="grid gap-8 xl:grid-cols-[3fr_2fr]">
      <div className="min-w-0 space-y-8">
        <ErrorSummary errors={summaryErrors} labels={LABELS} summaryRef={summaryRef} />

        <section aria-labelledby={`${id}-what`} className="space-y-5 rounded-2xl border bg-card p-6">
          <h2 id={`${id}-what`} className="type-title-2">
            What kind of event
          </h2>
          <RadioGroup
            name={fieldId("type")}
            legend="Type of event"
            value={draft.type || undefined}
            onChange={chooseType}
            error={err("type")}
            options={EVENT_TYPES.map((t) => ({
              value: t,
              label: (
                <span className="inline-flex items-center gap-2 font-semibold">
                  <Icon name={EVENT_TYPE_INFO[t].icon} />
                  {EVENT_TYPE_INFO[t].label}
                </span>
              ),
              hint: EVENT_TYPE_INFO[t].blurb,
            }))}
          />
          <InputField field="title" label="Title" hint={template ? "From the template. Make it say what you'll look at." : undefined} value={draft.title} onChange={(v) => set("title", v)} error={err("title")} />
          <TextField id={fieldId("summary")} label="What it's about" hint="One or two sentences. Say who the work is for and who'll be in the room." value={draft.summary} onChange={(v) => set("summary", v)} error={err("summary")} />
        </section>

        <section aria-labelledby={`${id}-when`} className="space-y-5 rounded-2xl border bg-card p-6">
          <h2 id={`${id}-when`} className="type-title-2">
            When and where
          </h2>
          <div className="space-y-1.5">
            <Label htmlFor={fieldId("chapterId")}>Chapter calendar</Label>
            <NativeSelect
              id={fieldId("chapterId")}
              value={draft.chapterId}
              onChange={(e) => set("chapterId", e.target.value)}
              aria-invalid={err("chapterId") ? true : undefined}
              aria-describedby={err("chapterId") ? `${fieldId("chapterId")}-error` : undefined}
            >
              <option value="">Choose a chapter</option>
              {CHAPTERS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.city}, {c.country}
                </option>
              ))}
            </NativeSelect>
            {err("chapterId") && <FieldError id={`${fieldId("chapterId")}-error`}>{err("chapterId")}</FieldError>}
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <InputField field="date" label="Date" type="date" min={today} value={draft.date} onChange={(v) => set("date", v)} error={err("date")} />
            <InputField field="start" label="Starts" type="time" value={draft.start} onChange={(v) => set("start", v)} error={err("start")} />
            <InputField field="end" label="Ends" type="time" value={draft.end} onChange={(v) => set("end", v)} error={err("end")} />
          </div>
          <p className="type-small text-muted-foreground">
            {chapter ? `Times are in ${zoneLabel(chapter.timeZone)}, the ${chapter.city} chapter's time zone.` : "Times are in the chapter's time zone."}
          </p>
          <RadioGroup
            name={fieldId("format")}
            legend="In person or online"
            value={draft.format || undefined}
            onChange={(v) => setDraft((d) => ({ ...d, format: v, stepFree: v === "online" && !d.stepFree ? "yes" : d.stepFree }))}
            error={err("format")}
            options={[
              { value: "in-person", label: "In person" },
              { value: "online", label: "Online", hint: "People who RSVP see the join link." },
            ]}
          />
          {draft.format === "in-person" && (
            <InputField
              field="area"
              label="Area"
              hint="A neighborhood and the kind of place, like “Pilsen, a library community room”. Never a street address: share the exact place with people who RSVP."
              value={draft.area}
              onChange={(v) => set("area", v)}
              error={err("area")}
            />
          )}
        </section>

        <fieldset className="space-y-5 rounded-2xl border bg-card p-6">
          <legend className="float-left mb-1 w-full type-title-2">Access</legend>
          <p className="clear-left text-muted-foreground">Required for every event, so people can decide before they RSVP. Say what&apos;s true, even if the answer is no.</p>
          <RadioGroup
            name={fieldId("stepFree")}
            legend="Step-free access"
            value={draft.stepFree || undefined}
            onChange={(v) => set("stepFree", v)}
            error={err("stepFree")}
            options={[
              { value: "yes", label: "Step-free throughout", hint: draft.format === "online" ? "Choose this for online events." : undefined },
              { value: "partly", label: "Partly step-free" },
              { value: "no", label: "Not step-free" },
            ]}
          />
          {draft.stepFree && draft.stepFree !== "yes" && (
            <InputField field="stepFreeNote" label="What isn't step-free" value={draft.stepFreeNote} onChange={(v) => set("stepFreeNote", v)} error={err("stepFreeNote")} />
          )}
          <RadioGroup
            name={fieldId("captions")}
            legend="Captions or interpretation"
            value={draft.captions || undefined}
            onChange={(v) => set("captions", v)}
            error={err("captions")}
            options={[
              { value: "yes", label: "Yes", hint: "Live captions, a hearing loop, or a sign language interpreter." },
              { value: "no", label: "Not planned" },
            ]}
          />
          <InputField field="languages" label="Languages" hint="Separate them with commas. Include sign languages." value={draft.languages} onChange={(v) => set("languages", v)} error={err("languages")} />
          <RadioGroup
            name={fieldId("childcare")}
            legend="Childcare"
            value={draft.childcare || undefined}
            onChange={(v) => set("childcare", v)}
            error={err("childcare")}
            options={[
              { value: "yes", label: "Yes, on site" },
              { value: "no", label: "No" },
            ]}
          />
          <div className="space-y-1">
            <p className="type-label">Cost</p>
            <p className="flex items-center gap-2">
              <Icon name="wallet" />
              Free. Events on BridgeGoodx never charge.
            </p>
          </div>
          <TextField id={fieldId("accessNote")} label="Anything else about access" optional hint="Quiet room, breaks, food, transit, large print." value={draft.accessNote} onChange={(v) => set("accessNote", v)} error={err("accessNote")} />
        </fieldset>

        <section aria-labelledby={`${id}-who`} className="space-y-5 rounded-2xl border bg-card p-6">
          <h2 id={`${id}-who`} className="type-title-2">
            Who it&apos;s for
          </h2>
          <InputField field="capacity" label="How many people" type="number" inputMode="numeric" min={2} max={500} className="max-w-40" value={draft.capacity} onChange={(v) => set("capacity", v)} error={err("capacity")} />
          <fieldset id={fieldId("forRoles")} aria-describedby={err("forRoles") ? `${fieldId("forRoles")}-error` : undefined} className="space-y-1">
            <legend className="mb-1 type-label">Who it&apos;s for</legend>
            {AUDIENCE_ROLES.map((r) => (
              <label key={r} className="flex min-h-12 cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={draft.forRoles.includes(r)}
                  onChange={(e) => set("forRoles", e.target.checked ? [...draft.forRoles, r] : draft.forRoles.filter((x) => x !== r))}
                  className="size-6 shrink-0 accent-primary"
                />
                <RoleBadge role={r} />
              </label>
            ))}
            {err("forRoles") && <FieldError id={`${fieldId("forRoles")}-error`}>{err("forRoles")}</FieldError>}
          </fieldset>
        </section>

        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" size="lg" className="max-w-full whitespace-normal">
            <Icon name="calendar-plus" />
            {chapter ? `Publish to the ${chapter.city} calendar` : "Publish to the calendar"}
          </Button>
          <p className="text-muted-foreground">You can&apos;t charge for events here, and there are no tickets or waitlists.</p>
        </div>
      </div>

      <aside className="h-fit min-w-0 space-y-6 xl:sticky xl:top-24">
        <section aria-labelledby={`${id}-template`} className="space-y-3 rounded-2xl bg-muted p-6">
          <h2 id={`${id}-template`} className="type-title-3">
            {draft.type ? `The ${typeNoun(draft.type)} template` : "Templates"}
          </h2>
          {!template ? (
            <p>Choose a type and its template fills in the title, plan, length, size and who it&apos;s for. You can change any of it.</p>
          ) : (
            <>
              <p>{template.hostTip}</p>
              <h3 className="font-semibold">The plan ({template.minutes} minutes)</h3>
              <ol className="list-decimal space-y-1 pl-6">
                {template.agenda.map((a) => (
                  <li key={a.title}>
                    {a.title} <span className="text-muted-foreground">· {a.minutes} min</span>
                  </li>
                ))}
              </ol>
            </>
          )}
        </section>
        {draft.type === "critique-circle" && (
          <PinnedNote title="Pre-filled from the carry-it-forward kit" icon="printer">
            <p>Keep the kit&apos;s commitments, whatever else you change:</p>
            <ul className="list-disc space-y-1 pl-5">
              {KIT.keep.map((k) => (
                <li key={k}>{k}</li>
              ))}
            </ul>
            <Link to="/learn/carry-it-forward" className="inline-flex min-h-12 items-center font-semibold underline underline-offset-4">
              Open the kit and print the prompt cards
            </Link>
          </PinnedNote>
        )}
        <p className="flex flex-wrap items-center gap-2 type-small text-muted-foreground">
          Hosting as <RoleBadge role={who.role}>{who.name}</RoleBadge> (synthetic demo account)
        </p>
      </aside>
    </form>
  )
}

function InputField({
  field,
  label,
  hint,
  error,
  value,
  onChange,
  className,
  ...rest
}: {
  field: DraftField
  label: string
  hint?: string
  error?: string
  value: string
  onChange: (value: string) => void
  className?: string
} & Omit<React.ComponentProps<"input">, "value" | "onChange" | "id">) {
  const id = fieldId(field)
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {hint && (
        <p id={`${id}-hint`} className="type-small text-muted-foreground">
          {hint}
        </p>
      )}
      <Input id={id} name={id} value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={error ? true : undefined} aria-describedby={describedBy} className={className} {...rest} />
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  )
}
