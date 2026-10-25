import { useId, useRef, useState, type FormEvent, type ReactNode } from "react"
import { Link, useLocation } from "react-router"
import { CreditConsent, ErrorSummary, FieldError, personalDataError, TextField, type FieldErrors } from "@/components/feedback/fields"
import { YourFeedback } from "@/components/feedback/your-feedback"
import { Icon } from "@/components/icon"
import { PillarChip, PromptList } from "@/components/library/library-page"
import { FieldNote } from "@/components/studio/field-note"
import { RoleBadge } from "@/components/studio/role-badge"
import { SyntheticBadge } from "@/components/synthetic-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { type PracticeChoice, type PracticeMoment } from "@/content/practice"
import { DEMO_MENTOR, DEMO_STUDENT } from "@/content/seed"
import { newId, nowLabel } from "@/lib/demo-store"
import { useConversationStarters } from "@/lib/evaluator/store"
import { isFrom, senderFor, useFeedbackItems, useFieldNotes } from "@/lib/feedback/store"
import type { AdaptationFeedback } from "@/lib/feedback/types"
import { useSession } from "@/lib/session"
import { cn } from "@/lib/utils"

type Level = 1 | 2

/** Long button labels wrap at 320px and under text spacing instead of pushing the page sideways. */
const WRAP = "max-w-full shrink whitespace-normal py-2 text-left"

/** Heading tags one level apart, so the moment fits as a page (h1) or inside a role page (h2). */
function headings(level: Level) {
  return { Title: `h${level}` as "h1" | "h2", Section: `h${level + 1}` as "h2" | "h3", Sub: `h${level + 2}` as "h3" | "h4" }
}

/** Pillars, time, roles and the synthetic label for a practice moment. */
export function MomentTags({ moment }: { moment: PracticeMoment }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
      <ul className="flex flex-wrap gap-x-1.5 gap-y-2" aria-label="Pillars">
        {moment.pillarIds.map((id) => (
          <li key={id}>
            <PillarChip id={id} />
          </li>
        ))}
      </ul>
      <span className="inline-flex items-center gap-1.5 type-small text-muted-foreground">
        <Icon name="clock" className="text-base" />
        About {moment.minutes} minutes
      </span>
      <SyntheticBadge />
    </div>
  )
}

export function MomentRoles({ moment }: { moment: PracticeMoment }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Written for">
      {moment.roles.map((r) => (
        <li key={r}>
          <RoleBadge role={r} />
        </li>
      ))}
    </ul>
  )
}

/**
 * A practice moment: a synthetic scenario, three choices, then BRIDGEGOOD's reasoning and what each option
 * costs. Never a score. The choice lives in this component's state only, so it stays private unless the
 * person shares it with their mentor.
 */
export function PracticeMomentView({ moment, level = 1, embedded }: { moment: PracticeMoment; level?: Level; embedded?: boolean }) {
  const id = useId()
  const { Title, Section } = headings(level)
  const [choice, setChoice] = useState<PracticeChoice["id"] | undefined>(undefined)
  const [revealed, setRevealed] = useState(false)
  const [error, setError] = useState(false)
  const revealRef = useRef<HTMLHeadingElement>(null)
  const chosen = moment.choices.find((c) => c.id === choice)

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!choice) {
      setError(true)
      return
    }
    setError(false)
    setRevealed(true)
    requestAnimationFrame(() => revealRef.current?.focus())
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <MomentTags moment={moment} />
        <Title className={level === 1 ? "type-title-1" : "type-title-2"}>{moment.title}</Title>
        <MomentRoles moment={moment} />
        <p className="max-w-[70ch] type-body-lg">{moment.context}</p>
        {moment.quote && (
          <figure className="max-w-[70ch] border-l-4 border-gold pl-4">
            <blockquote className="type-body-lg">&ldquo;{moment.quote.text}&rdquo;</blockquote>
            <figcaption className="mt-1 type-small text-muted-foreground">{moment.quote.who} (synthetic)</figcaption>
          </figure>
        )}
      </div>

      <form onSubmit={submit} noValidate className="max-w-3xl space-y-4">
        <fieldset aria-describedby={`${id}-private${error ? ` ${id}-error` : ""}`}>
          <legend className="mb-3 type-title-3">What would you do?</legend>
          <div className="space-y-3">
            {moment.choices.map((c) => (
              <label
                key={c.id}
                className={cn(
                  "flex min-h-12 cursor-pointer items-start gap-3 rounded-md border-[1.5px] border-input bg-card p-4",
                  choice === c.id && "border-2 border-primary"
                )}
              >
                <input
                  type="radio"
                  name={`${id}-choice`}
                  value={c.id}
                  checked={choice === c.id}
                  onChange={() => {
                    setChoice(c.id)
                    setError(false)
                  }}
                  className="mt-0.5 size-6 shrink-0 accent-primary"
                />
                <span>{c.text}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <p id={`${id}-private`} className="flex items-start gap-2 text-muted-foreground">
          <Icon name="info" className="mt-0.5" />
          There&apos;s no score and no right answer. Your choice isn&apos;t saved or sent anywhere unless you share it.
        </p>
        {error && <FieldError id={`${id}-error`}>Choose an option first.</FieldError>}
        <Button type="submit" variant={revealed ? "outline" : "default"} className={WRAP}>
          <Icon name="scale" />
          {revealed ? "Update with my new choice" : "See how BRIDGEGOOD reasons about it"}
        </Button>
      </form>

      {revealed && chosen && (
        <section aria-labelledby={`${id}-reasoning`} className="space-y-8 rounded-2xl border bg-card p-4 sm:p-6">
          <div className="space-y-3">
            <Section id={`${id}-reasoning`} ref={revealRef} tabIndex={-1} className="type-title-2 focus:outline-none">
              How BRIDGEGOOD reasons about it
            </Section>
            <p className="font-semibold">You chose: {chosen.short}.</p>
            <div className="max-w-[70ch] space-y-3 type-body-lg">
              {moment.reasoning.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
          <Reasoning moment={moment} chosen={chosen} level={level} />
          <Actions moment={moment} chosen={chosen} level={level} />
        </section>
      )}

      <PracticeFieldNotes slug={moment.slug} level={level} />
      {embedded ? (
        <Link to={`/learn/practice/${moment.slug}`} className="inline-flex min-h-12 items-center gap-2 font-semibold text-primary underline underline-offset-4">
          Open this practice moment in the library
          <Icon name="arrow-right" />
        </Link>
      ) : null}
    </div>
  )
}

function Reasoning({ moment, chosen, level }: { moment: PracticeMoment; chosen: PracticeChoice; level: Level }) {
  const id = useId()
  const { Sub } = headings(level)
  return (
    <>
      <div className="space-y-3">
        <Sub id={`${id}-prompts`} className="type-title-3">
          The prompts that matter here
        </Sub>
        <PromptList prompts={moment.reasoning.promptIds} showPillars />
      </div>

      <div className="space-y-3">
        <Sub className="type-title-3">Every option costs something</Sub>
        <ul className="grid gap-3 lg:grid-cols-3">
          {moment.choices.map((c) => (
            <li key={c.id} className={cn("space-y-2 rounded-xl border p-4", c.id === chosen.id && "border-2 border-primary")}>
              <p className="font-semibold">
                {c.short}
                {c.id === chosen.id && (
                  <span className="ml-2 inline-flex items-center gap-1 type-small font-semibold text-primary">
                    <Icon name="check" className="text-base" />
                    Your choice
                  </span>
                )}
              </p>
              <p>
                <span className="font-semibold">Protects: </span>
                {c.protects}
              </p>
              <p>
                <span className="font-semibold">Costs: </span>
                {c.cost}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="max-w-[70ch] space-y-2">
        <Sub className="type-title-3">What BRIDGEGOOD teams have often done</Sub>
        <p className="type-body-lg">{moment.reasoning.often}</p>
      </div>

      <div className="max-w-3xl space-y-3">
        <Sub className="type-title-3">What others chose</Sub>
        <p className="text-muted-foreground">Synthetic numbers, to start a conversation, not to rank anyone.</p>
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">What others chose, in percent (synthetic)</caption>
          <thead className="sr-only">
            <tr>
              <th scope="col">Option</th>
              <th scope="col">Share</th>
            </tr>
          </thead>
          <tbody>
            {moment.choices.map((c) => (
              <tr key={c.id} className="align-middle">
                <th scope="row" className="w-2/5 py-1.5 pr-3 font-normal">
                  {c.short}
                </th>
                <td className="py-1.5">
                  <span className="flex items-center gap-3">
                    <span aria-hidden="true" className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                      <span className="block h-full rounded-full bg-line-strong" style={{ width: `${c.others}%` }} />
                    </span>
                    <span className="w-12 text-right font-semibold tabular-nums">{c.others}%</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function Actions({ moment, chosen, level }: { moment: PracticeMoment; chosen: PracticeChoice; level: Level }) {
  const { Sub } = headings(level)
  return (
    <div className="space-y-6 border-t pt-6">
      <Sub className="type-title-3">Take it further</Sub>
      <div className="grid gap-6 xl:grid-cols-2">
        <TalkToMentor moment={moment} chosen={chosen} />
        <PlaysOutDifferently moment={moment} />
      </div>
    </div>
  )
}

/** Apprentices save the moment as a conversation starter, the same way the Reflection Companion shares questions. */
function TalkToMentor({ moment, chosen }: { moment: PracticeMoment; chosen: PracticeChoice }) {
  const id = useId()
  const session = useSession()
  const [, setStarters] = useConversationStarters()
  const [includeChoice, setIncludeChoice] = useState(false)
  const [saved, setSaved] = useState(false)

  if (session?.role === "mentor") {
    return (
      <Panel icon="message-circle-heart" title="Use it in a growth conversation">
        Ask your apprentice which option they&apos;d pick, and what it would cost. Start from their reasoning, not from BRIDGEGOOD&apos;s.
      </Panel>
    )
  }
  if (session?.role !== "student") {
    return (
      <Panel icon="message-circle-heart" title="Talk it over with a mentor">
        Apprentices can save this as a conversation starter for their mentor. If you&apos;re running a session yourself, try it as a
        group:{" "}
        <Link to="/learn/carry-it-forward" className="underline underline-offset-4">
          the carry-it-forward kit
        </Link>{" "}
        shows how.
      </Panel>
    )
  }

  const question = `Practice moment ${moment.title}${includeChoice ? `: I leaned towards “${chosen.short}”.` : "."} Can we talk through what each option costs?`

  function save() {
    setStarters((prev) => [
      ...prev,
      {
        id: newId(),
        sharedAt: nowLabel(),
        from: DEMO_STUDENT,
        mentor: DEMO_MENTOR,
        stage: "Practice moment",
        pillar: moment.pillarIds[0],
        promptIds: moment.reasoning.promptIds,
        question,
        origin: "practice",
      },
    ])
    setSaved(true)
  }

  return (
    <Panel icon="message-circle-heart" title="Talk it over with my mentor">
      <p>Save this as a conversation starter for your next session with {DEMO_MENTOR}. They&apos;ll see exactly this:</p>
      <p className="rounded-lg bg-muted p-3">{question}</p>
      <div className="flex items-start gap-3">
        <input
          id={`${id}-include`}
          type="checkbox"
          checked={includeChoice}
          onChange={(e) => {
            setIncludeChoice(e.target.checked)
            setSaved(false)
          }}
          className="mt-3 size-6 shrink-0 accent-primary"
        />
        <label htmlFor={`${id}-include`} className="flex min-h-12 cursor-pointer items-center">
          Include which option I chose (optional)
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" variant="outline" onClick={save} disabled={saved} className={WRAP}>
          <Icon name="send" />
          Talk it over with my mentor
        </Button>
        <p role="status" className="font-semibold">
          {saved && (
            <>
              Saved for {DEMO_MENTOR}.{" "}
              <Link to="/student/reflection" className="font-normal underline underline-offset-4">
                See or stop sharing
              </Link>
            </>
          )}
        </p>
      </div>
    </Panel>
  )
}

const LABELS = { group: "Your community or chapter", changed: "What would play out differently", why: "Why", kept: "What you'd keep" }

/** "This would play out differently in my community": a local adaptation on this moment, to the steward's inbox. */
function PlaysOutDifferently({ moment }: { moment: PracticeMoment }) {
  const id = useId()
  const session = useSession()
  const location = useLocation()
  const [items, setItems] = useFeedbackItems()
  const [open, setOpen] = useState(false)
  const [credit, setCredit] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [sent, setSent] = useState("")
  const summaryRef = useRef<HTMLDivElement>(null)
  const openRef = useRef<HTMLButtonElement>(null)
  const ids = { group: `${id}-group`, changed: `${id}-changed`, why: `${id}-why`, kept: `${id}-kept` }

  if (session?.role === "steward") return null
  if (!session) {
    return (
      <Panel icon="map-pin" title="This would play out differently in my community">
        <Link to={`/login?next=${encodeURIComponent(location.pathname)}`} className="underline underline-offset-4">
          Sign in with a demo account
        </Link>{" "}
        to tell BRIDGEGOOD. Outside BRIDGEGOOD? Use{" "}
        <Link to="/learn/carry-it-forward#tell-bridgegood" className="underline underline-offset-4">
          the kit&apos;s feedback form
        </Link>
        , no account needed.
      </Panel>
    )
  }
  const sender = senderFor(session)
  const mine = items.filter((i): i is AdaptationFeedback => i.kind === "adaptation" && isFrom(i, sender) && i.target.type === "practice" && i.target.id === moment.slug).toReversed()

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const get = (k: string) => String(data.get(k) ?? "").trim()
    const next: FieldErrors = {}
    for (const [field, message] of [
      [ids.group, "Name your chapter or community as a group, like “Chicago chapter”."],
      [ids.changed, "Say what would play out differently."],
      [ids.why, "Say why it's different in your community."],
    ] as const) {
      const value = get(field)
      const problem = !value ? message : personalDataError(value)
      if (problem) next[field] = problem
    }
    const kept = personalDataError(get(ids.kept))
    if (kept) next[ids.kept] = kept
    setErrors(next)
    if (Object.keys(next).length > 0) {
      setSent("")
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }
    const group = get(ids.group)
    const item: AdaptationFeedback = {
      id: newId(),
      kind: "adaptation",
      at: nowLabel(),
      from: { ...sender, group: sender.group ?? group },
      chapter: group,
      target: { type: "practice", id: moment.slug },
      pillarIds: moment.pillarIds,
      changed: get(ids.changed),
      why: get(ids.why),
      kept: get(ids.kept),
      happened: "",
      ask: "local",
      credit: credit ? { consent: true, as: group } : { consent: false },
      status: "new",
      replies: [],
    }
    setItems((prev) => [...prev, item])
    form.reset()
    setCredit(false)
    close()
    setSent("Sent to the BRIDGEGOOD steward. You'll see their decision and reason here.")
  }

  function close() {
    setOpen(false)
    setErrors({})
    requestAnimationFrame(() => openRef.current?.focus())
  }

  return (
    <Panel icon="map-pin" title="This would play out differently in my community">
      <p>
        Tell BRIDGEGOOD how it goes where you are. A steward reads every note and decides, with a reason. If they recognize it, it
        shows here as a field note.
      </p>
      {!open ? (
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setOpen(true)
            setSent("")
            requestAnimationFrame(() => document.getElementById(ids.group)?.focus())
          }}
          ref={openRef}
          aria-expanded={false}
          className={`self-start ${WRAP}`}
        >
          <Icon name="map-pin" />
          This would play out differently
        </Button>
      ) : (
        <form id={`${id}-form`} onSubmit={submit} noValidate className="space-y-4">
          <ErrorSummary errors={errors} labels={{ [ids.group]: LABELS.group, [ids.changed]: LABELS.changed, [ids.why]: LABELS.why, [ids.kept]: LABELS.kept }} summaryRef={summaryRef} />
          <TextInput id={ids.group} label="Your community or chapter" hint="A group or place, not a person." defaultValue={sender.group ?? ""} error={errors[ids.group]} />
          <TextField id={ids.changed} label="What would play out differently?" error={errors[ids.changed]} />
          <TextField id={ids.why} label="Why is it different in your community?" hint="Describe your community as a group. No names or personal details." error={errors[ids.why]} />
          <TextField id={ids.kept} label="What would you keep the same?" optional error={errors[ids.kept]} />
          <CreditConsent id={`${id}-credit`} checked={credit} onChange={setCredit} creditAs="your community or chapter" />
          <div className="flex flex-wrap gap-3">
            <Button type="submit">
              <Icon name="send" />
              Send to BRIDGEGOOD
            </Button>
            <Button type="button" variant="ghost" onClick={close}>
              Cancel
            </Button>
          </div>
        </form>
      )}
      <p role="status" className="font-semibold empty:hidden">
        {sent}
      </p>
      {mine.length > 0 && <YourFeedback items={mine} title="What you've sent about this moment" />}
    </Panel>
  )
}

function TextInput({ id, label, hint, error, defaultValue }: { id: string; label: string; hint?: string; error?: string; defaultValue?: string }) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {hint && (
        <p id={`${id}-hint`} className="type-small text-muted-foreground">
          {hint}
        </p>
      )}
      <Input id={id} name={id} defaultValue={defaultValue} aria-invalid={error ? true : undefined} aria-describedby={describedBy} />
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  )
}

function Panel({ icon, title, children }: { icon: "map-pin" | "message-circle-heart"; title: string; children: ReactNode }) {
  const id = useId()
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3 rounded-xl bg-muted p-4 sm:p-5">
      <p id={id} className="flex items-center gap-2 type-label">
        <Icon name={icon} />
        {title}
      </p>
      {children}
    </section>
  )
}

/** Local adaptations BRIDGEGOOD recognized for this moment. They sit beneath BRIDGEGOOD's reasoning, never replace it. */
export function PracticeFieldNotes({ slug, level = 1 }: { slug: string; level?: Level }) {
  const id = useId()
  const { Section } = headings(level)
  const [notes] = useFieldNotes()
  const mine = notes.filter((n) => n.practice === slug).toReversed()
  return (
    <section aria-labelledby={id} className="max-w-3xl space-y-4">
      <div>
        <Section id={id} className="type-title-2">
          Field notes
        </Section>
        <p className="mt-1 text-muted-foreground">How chapters play this out locally, recognized by BRIDGEGOOD. They sit beneath BRIDGEGOOD&apos;s reasoning and don&apos;t replace it.</p>
      </div>
      {mine.length === 0 ? (
        <p className="rounded-xl border border-dashed p-4 text-muted-foreground">No field notes yet. If this would play out differently where you are, tell BRIDGEGOOD after you choose.</p>
      ) : (
        <ul className="space-y-5">
          {mine.map((n) => (
            <li key={n.id}>
              <FieldNote chapter={n.chapter}>
                <p>{n.text}</p>
                <p className="flex flex-wrap items-center gap-2 type-small">
                  Recognized by BRIDGEGOOD on {n.at}, against version {n.version}.
                  <Link to={`/learn/changelog#${n.changelogId}`} className="underline underline-offset-4">
                    Why
                  </Link>
                  {n.synthetic && <SyntheticBadge />}
                </p>
              </FieldNote>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
