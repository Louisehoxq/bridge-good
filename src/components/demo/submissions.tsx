import { useRef, useState, type FormEvent } from "react"
import { newId, nowLabel } from "@/lib/demo-store"
import { DEMO_MENTOR, DEMO_STUDENT, RUBRIC, type Submission } from "@/content/seed"
import { DECISION_MOMENT_INFO, getPrompt, PILLARS, promptsForMoment, type PillarId, type ReflectionPromptId } from "@/content/framework"
import type { GrowthFeedback, GrowthNote } from "@/content/journey"
import { CAPSTONE_ACTIVITY, useGrowthFeedback, useSubmissions } from "@/components/demo/journey-data"
import { Icon } from "@/components/icon"
import { PillarChip } from "@/components/library/library-page"
import { ErrorSummary, FieldMessage, Notice, type FieldError } from "@/components/notice"
import { Highlight } from "@/components/studio/highlight"
import { PeopleChip } from "@/components/studio/people-chip"
import { PinnedNote } from "@/components/studio/pinned-note"
import { SyntheticBadge } from "@/components/synthetic-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export const ACTIVITY_TYPES = ["Basic fundamentals", "Mock case", "Case study", CAPSTONE_ACTIVITY] as const

/** Only open http(s) links that students submit, never javascript: or other schemes. */
function isWebLink(value: string) {
  try {
    return ["http:", "https:"].includes(new URL(value).protocol)
  } catch {
    return false
  }
}

function useSubmissionData() {
  const [submissions, setSubmissions] = useSubmissions()
  const [feedback, setFeedback] = useGrowthFeedback()
  const feedbackFor = (id: string) => feedback.find((f) => f.submissionId === id)
  return { submissions, setSubmissions, setFeedback, feedbackFor }
}

/** A status tag: icon and word, never color alone. */
function ReplyTag({ replied, children }: { replied: boolean; children: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 type-small font-semibold",
        replied ? "bg-success-soft text-foreground" : "bg-muted text-foreground"
      )}
    >
      <Icon name={replied ? "circle-check" : "hourglass"} className={cn("text-base", replied && "text-success")} />
      {children}
    </span>
  )
}

/** The mentor's words, per pillar, as the apprentice sees them: a pinned note from their mentor. */
export function GrowthView({ feedback, submission }: { feedback: GrowthFeedback; submission?: Submission }) {
  return (
    <div className="space-y-4">
      {submission?.selfAssessment && (
        <div className="rounded-lg bg-muted p-3">
          <p className="font-bold">You said</p>
          <p>
            <span className="font-semibold">Working: </span>
            {submission.selfAssessment.working}
          </p>
          <p>
            <span className="font-semibold">Wanted help with: </span>
            {submission.selfAssessment.help}
          </p>
        </div>
      )}
      <PinnedNote
        icon="message-circle-heart"
        title={
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            From {feedback.mentorName}, your mentor
            <span className="type-small font-normal">· {feedback.at}</span>
            {feedback.synthetic && <SyntheticBadge />}
          </span>
        }
      >
        <ul className="space-y-3">
          {feedback.notes.map((n) => (
            <li key={n.pillarId} className="border-t border-[color-mix(in_srgb,var(--ink),transparent_80%)] pt-3 first:border-t-0 first:pt-0">
              <PillarChip id={n.pillarId} />
              <div className="mt-2 grid gap-3 lg:grid-cols-2">
                <p>
                  <span className="block font-bold">What&apos;s working</span>
                  {n.working}
                </p>
                <p>
                  <span className="block font-bold">One next step</span>
                  {n.nextStep}
                </p>
              </div>
            </li>
          ))}
        </ul>
        {feedback.question && (
          <p className="border-t border-[color-mix(in_srgb,var(--ink),transparent_80%)] pt-3">
            <span className="block font-bold">A question from {feedback.mentorName.split(" ")[0]}</span>
            {feedback.question}
          </p>
        )}
      </PinnedNote>
    </div>
  )
}

export function StudentSubmissions() {
  const { submissions, setSubmissions, feedbackFor } = useSubmissionData()
  const [errors, setErrors] = useState<FieldError[]>([])
  const [justSubmitted, setJustSubmitted] = useState(false)
  const summaryRef = useRef<HTMLDivElement>(null)
  const errorFor = (field: string) => errors.find((er) => er.field === field)
  const mine = submissions.filter((s) => s.studentName === DEMO_STUDENT).toReversed()
  const prompts = promptsForMoment("studentSubmit")
  const moment = DECISION_MOMENT_INFO.studentSubmit

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const get = (k: string) => String(data.get(k) ?? "").trim()
    const missing = [
      !get("title") && { field: "sub-title", message: "Give your project a title" },
      get("link") && !isWebLink(get("link")) && { field: "sub-link", message: "Use a full web address starting with https://" },
      !get("summary") && { field: "sub-summary", message: "Describe what you did" },
      !get("working") && { field: "sub-working", message: "Say what you think is working" },
      !get("help") && { field: "sub-help", message: "Say where you'd like help next" },
      !get("reflection") && { field: "sub-reflection", message: "Add a short reflection" },
    ].filter(Boolean) as FieldError[]
    setErrors(missing)
    if (missing.length) {
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }
    const share = data.get("share-answers") === "on"
    const promptAnswers = share
      ? prompts.map((p) => ({ promptId: p.id, answer: get(`prompt-${p.id}`) })).filter((a) => a.answer)
      : undefined
    setSubmissions((prev) => [
      ...prev,
      {
        id: newId(),
        studentName: DEMO_STUDENT,
        title: get("title"),
        activity: get("activity"),
        link: get("link"),
        summary: get("summary"),
        reflection: get("reflection"),
        selfAssessment: { working: get("working"), help: get("help") },
        promptAnswers: promptAnswers?.length ? promptAnswers : undefined,
        submittedAt: nowLabel(),
      },
    ])
    form.reset()
    setJustSubmitted(true)
  }

  /** Hint and error ids for a field, and its error message below it. */
  const field = (id: string, hint?: string) => {
    const error = errorFor(id)
    return {
      props: {
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": [hint, error && `${id}-error`].filter(Boolean).join(" ") || undefined,
      },
      message: error && <FieldMessage id={`${id}-error`}>{error.message}</FieldMessage>,
    }
  }
  const title = field("sub-title")
  const link = field("sub-link")
  const summary = field("sub-summary")
  const working = field("sub-working", "self-hint")
  const help = field("sub-help", "self-hint")
  const reflection = field("sub-reflection")

  return (
    <div className="grid gap-8 xl:grid-cols-[2fr_3fr]">
      <form onSubmit={submit} noValidate className="h-fit min-w-0 space-y-4 rounded-2xl border bg-card p-4 sm:p-6" aria-labelledby="new-sub">
        <h2 id="new-sub" className="type-title-3">
          Submit your work
        </h2>
        <ErrorSummary errors={errors} summaryRef={summaryRef} title="Please fix the following:" />
        <div role="status">
          {justSubmitted && errors.length === 0 && (
            <Notice tone="success">
              <p>Submitted. Your mentor reads your self-assessment first, then replies here.</p>
            </Notice>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="sub-title">Title</Label>
          <Input name="title" {...title.props} />
          {title.message}
        </div>
        <div className="space-y-1">
          <Label htmlFor="sub-activity">Activity type</Label>
          <NativeSelect id="sub-activity" name="activity">
            {ACTIVITY_TYPES.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </NativeSelect>
        </div>
        <div className="space-y-1">
          <Label htmlFor="sub-link">
            Link to your work <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Input name="link" type="url" placeholder="https://" {...link.props} />
          {link.message}
        </div>
        <div className="space-y-1">
          <Label htmlFor="sub-summary">What did you do, and for whom?</Label>
          <Textarea name="summary" {...summary.props} />
          {summary.message}
        </div>

        <fieldset className="min-w-0 space-y-3 rounded-xl border p-4">
          <legend className="px-1 font-bold">Your self-assessment</legend>
          <p id="self-hint" className="text-muted-foreground">
            Your mentor reads this before anything else, and starts the conversation from it.
          </p>
          <div className="space-y-1">
            <Label htmlFor="sub-working">What do you think is working?</Label>
            <Textarea name="working" {...working.props} />
            {working.message}
          </div>
          <div className="space-y-1">
            <Label htmlFor="sub-help">Where do you want help next?</Label>
            <Textarea name="help" {...help.props} />
            {help.message}
          </div>
        </fieldset>

        <fieldset className="min-w-0 space-y-3 rounded-xl border bg-archetype-soft p-4">
          <legend className="px-1 font-bold">{moment.label}</legend>
          <p id="prompts-hint">{moment.intro} These are optional.</p>
          {prompts.map((p, i) => (
            <div key={p.id} className="space-y-1">
              <Label htmlFor={`sub-prompt-${p.id}`}>{i === 0 ? <Highlight>{p.text}</Highlight> : p.text}</Label>
              <Textarea id={`sub-prompt-${p.id}`} name={`prompt-${p.id}`} rows={2} aria-describedby="prompts-hint" />
            </div>
          ))}
          <label className="flex min-h-12 cursor-pointer items-center gap-3">
            <input type="checkbox" name="share-answers" className="size-6 shrink-0 accent-[var(--archetype)]" />
            Share my answers to these questions with my mentor
          </label>
        </fieldset>

        <div className="space-y-1">
          <Label htmlFor="sub-reflection">Reflection: what did you learn, and who did it help?</Label>
          <Textarea name="reflection" {...reflection.props} />
          {reflection.message}
        </div>
        <Button type="submit" size="lg" className="h-auto w-full bg-archetype py-3 whitespace-normal text-on-archetype hover:bg-archetype/90 sm:w-auto">
          Submit for a growth conversation
        </Button>
      </form>

      <section aria-labelledby="my-subs" className="min-w-0">
        <h2 id="my-subs" className="mb-4 type-title-3">
          Your submissions
        </h2>
        <ul className="space-y-4">
          {mine.map((s) => {
            const fb = feedbackFor(s.id)
            return (
              <li key={s.id} className="rounded-xl border bg-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-sans type-label">{s.title}</h3>
                      {s.synthetic && <SyntheticBadge />}
                    </div>
                    <p className="type-small text-muted-foreground">
                      {s.activity} · submitted {s.submittedAt}
                    </p>
                  </div>
                  <ReplyTag replied={!!fb}>{fb ? "Mentor replied" : "Waiting for your mentor"}</ReplyTag>
                </div>
                {fb && (
                  <div className="mt-4 border-t pt-4">
                    <GrowthView feedback={fb} submission={s} />
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}

export function MentorReview() {
  const { submissions, setFeedback, feedbackFor } = useSubmissionData()
  const ordered = submissions.toSorted((a, b) => Number(!!feedbackFor(a.id)) - Number(!!feedbackFor(b.id)))
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = ordered.find((s) => s.id === selectedId) ?? ordered[0]
  const waiting = submissions.filter((s) => !feedbackFor(s.id)).length

  return (
    <div className="grid gap-6 xl:grid-cols-[22rem_1fr]">
      <nav aria-label="Submissions waiting for a growth conversation">
        <p className="mb-3 text-muted-foreground">{waiting} waiting for you</p>
        <ul className="space-y-2">
          {ordered.map((s) => {
            const done = !!feedbackFor(s.id)
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(s.id)}
                  aria-current={selected?.id === s.id ? "true" : undefined}
                  className="w-full space-y-2 rounded-xl border bg-card p-3 text-left hover:bg-muted aria-[current=true]:border-2 aria-[current=true]:border-archetype aria-[current=true]:bg-archetype-soft"
                >
                  <span className="flex flex-wrap items-center justify-between gap-2">
                    <PeopleChip name={s.studentName} role="apprentice" />
                    <ReplyTag replied={done}>{done ? "Replied" : "To reply"}</ReplyTag>
                  </span>
                  <span className="block">{s.title}</span>
                  {s.synthetic && (
                    <span className="block">
                      <SyntheticBadge />
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
      {selected && (
        <ReviewPanel
          key={selected.id}
          submission={selected}
          existing={feedbackFor(selected.id)}
          onSave={(fb) => setFeedback((prev) => [...prev.filter((f) => f.submissionId !== fb.submissionId), fb])}
        />
      )}
    </div>
  )
}

type Draft = Record<PillarId, { working: string; nextStep: string }>

const emptyDraft = (existing?: GrowthFeedback): Draft =>
  Object.fromEntries(
    PILLARS.map((p) => {
      const note = existing?.notes.find((n) => n.pillarId === p.id)
      return [p.id, { working: note?.working ?? "", nextStep: note?.nextStep ?? "" }]
    })
  ) as Draft

function ReviewPanel({ submission, existing, onSave }: { submission: Submission; existing?: GrowthFeedback; onSave: (fb: GrowthFeedback) => void }) {
  const [draft, setDraft] = useState<Draft>(() => emptyDraft(existing))
  const [question, setQuestion] = useState(existing?.question ?? "")
  const [errors, setErrors] = useState<FieldError[]>([])
  const [saved, setSaved] = useState(false)
  const summaryRef = useRef<HTMLDivElement>(null)
  const first = submission.studentName.split(" ")[0]
  const prompts = promptsForMoment("mentorReview")

  function update(id: PillarId, key: "working" | "nextStep", value: string) {
    setDraft((prev) => ({ ...prev, [id]: { ...prev[id], [key]: value } }))
    setSaved(false)
  }

  function save(e: FormEvent) {
    e.preventDefault()
    const notes: GrowthNote[] = []
    const problems: FieldError[] = []
    for (const p of PILLARS) {
      const working = draft[p.id].working.trim()
      const nextStep = draft[p.id].nextStep.trim()
      if (!working && !nextStep) continue
      if (!working) problems.push({ field: `${submission.id}-${p.id}-working`, message: `${p.name}: add what's working` })
      if (!nextStep) problems.push({ field: `${submission.id}-${p.id}-next`, message: `${p.name}: add one next step` })
      if (working && nextStep) notes.push({ pillarId: p.id, working, nextStep })
    }
    if (problems.length === 0 && notes.length === 0) {
      problems.push({ field: `${submission.id}-${PILLARS[0].id}-working`, message: "Write about at least one pillar" })
    }
    setErrors(problems)
    if (problems.length) {
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }
    onSave({
      id: existing?.id ?? newId(),
      submissionId: submission.id,
      mentorName: DEMO_MENTOR,
      notes,
      question: question.trim() || undefined,
      at: nowLabel(),
    })
    setSaved(true)
  }

  const errorFor = (field: string) => errors.find((er) => er.field === field)

  return (
    <article aria-labelledby="review-title" className="min-w-0 space-y-6 rounded-2xl border bg-card p-4 sm:p-6">
      <header>
        <p className="flex flex-wrap items-center gap-2 type-small text-muted-foreground">
          {submission.activity} · {submission.submittedAt}
          {submission.synthetic && <SyntheticBadge />}
        </p>
        <h2 id="review-title" className="type-title-2">
          {submission.title}
        </h2>
        <p className="font-semibold">by {submission.studentName}</p>
      </header>

      <PinnedNote title={<span id="self-title">Start here: {first}&apos;s self-assessment</span>} icon="sprout">
        {submission.selfAssessment ? (
          <dl className="grid gap-4 lg:grid-cols-2">
            <div>
              <dt className="font-bold">What they think is working</dt>
              <dd>{submission.selfAssessment.working}</dd>
            </div>
            <div>
              <dt className="font-bold">Where they want help</dt>
              <dd>{submission.selfAssessment.help}</dd>
            </div>
          </dl>
        ) : (
          <p>{first} didn&apos;t add a self-assessment. Ask them what they think is working before you write anything.</p>
        )}
        <div>
          <p className="font-bold">Their reflection</p>
          <p>{submission.reflection}</p>
        </div>
        {submission.promptAnswers && submission.promptAnswers.length > 0 && (
          <div className="border-t border-[color-mix(in_srgb,var(--ink),transparent_80%)] pt-3">
            <p className="font-bold">Answers {first} chose to share</p>
            <dl className="mt-1 space-y-2">
              {submission.promptAnswers.map((a) => (
                <div key={a.promptId}>
                  <dt className="font-semibold">{getPrompt(a.promptId as ReflectionPromptId).text}</dt>
                  <dd>{a.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </PinnedNote>

      <dl className="grid gap-4 lg:grid-cols-2">
        <div>
          <dt className="font-bold">What they did</dt>
          <dd>{submission.summary}</dd>
        </div>
        {submission.link && (
          <div className="min-w-0">
            <dt className="font-bold">Link</dt>
            <dd>
              {isWebLink(submission.link) ? (
                <a href={submission.link} target="_blank" rel="noopener noreferrer" className="break-all underline underline-offset-4">
                  {submission.link}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                <span className="break-all">{submission.link}</span>
              )}
            </dd>
          </div>
        )}
      </dl>

      <form onSubmit={save} noValidate className="space-y-5 border-t pt-5">
        <div>
          <h3 className="type-title-3">Your reply, pillar by pillar</h3>
          <p className="mt-1 text-muted-foreground">
            Write about the pillars that matter most for this piece. One is enough. For each, say what&apos;s working and
            one next step. There are no scores and no pass or fail. {first} sees exactly what you write.
          </p>
        </div>
        <div className="rounded-xl border bg-muted p-4">
          <p className="font-bold">{DECISION_MOMENT_INFO.mentorReview.label}</p>
          <p>{DECISION_MOMENT_INFO.mentorReview.intro}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {prompts.map((p, i) => (
              <li key={p.id}>{i === 0 ? <Highlight>{p.text}</Highlight> : p.text}</li>
            ))}
          </ul>
        </div>
        <ErrorSummary errors={errors} summaryRef={summaryRef} title="Before sending:" />
        <div className="space-y-3">
          {PILLARS.map((p) => {
            const rows = RUBRIC.filter((r) => r.pillarIds.includes(p.id))
            const started = !!(draft[p.id].working || draft[p.id].nextStep)
            const workingId = `${submission.id}-${p.id}-working`
            const nextId = `${submission.id}-${p.id}-next`
            const hintId = `${submission.id}-${p.id}-hint`
            const workingError = errorFor(workingId)
            const nextError = errorFor(nextId)
            return (
              <details key={p.id} open={started || errors.some((er) => er.field.startsWith(`${submission.id}-${p.id}`)) || undefined} className="group rounded-xl border">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 p-4 font-bold [&::-webkit-details-marker]:hidden">
                  <span>
                    {p.number}. {p.name}
                    {started && <span className="ml-2 font-normal text-muted-foreground">(started)</span>}
                  </span>
                  <Icon name="chevron-down" className="text-archetype transition-transform group-open:rotate-180" />
                </summary>
                <fieldset className="min-w-0 space-y-3 border-t p-4">
                  <legend className="sr-only">{p.name}</legend>
                  {rows.length > 0 && (
                    <p id={hintId} className="text-muted-foreground">
                      To think about: {rows.map((r) => r.question).join(" ")}
                    </p>
                  )}
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="space-y-1">
                      <Label htmlFor={workingId}>What&apos;s working</Label>
                      <Textarea
                        id={workingId}
                        value={draft[p.id].working}
                        onChange={(e) => update(p.id, "working", e.target.value)}
                        aria-describedby={[rows.length && hintId, workingError && `${workingId}-error`].filter(Boolean).join(" ") || undefined}
                        aria-invalid={workingError ? true : undefined}
                      />
                      {workingError && <FieldMessage id={`${workingId}-error`}>{workingError.message}</FieldMessage>}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={nextId}>One next step</Label>
                      <Textarea
                        id={nextId}
                        value={draft[p.id].nextStep}
                        onChange={(e) => update(p.id, "nextStep", e.target.value)}
                        aria-describedby={nextError ? `${nextId}-error` : undefined}
                        aria-invalid={nextError ? true : undefined}
                      />
                      {nextError && <FieldMessage id={`${nextId}-error`}>{nextError.message}</FieldMessage>}
                    </div>
                  </div>
                </fieldset>
              </details>
            )
          })}
        </div>
        <div className="space-y-1">
          <Label htmlFor={`${submission.id}-question`}>
            A question for {first} <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Textarea id={`${submission.id}-question`} value={question} onChange={(e) => setQuestion(e.target.value)} rows={2} />
        </div>
        <div role="status">
          {saved && errors.length === 0 && (
            <Notice tone="success">
              <p>Sent. {submission.studentName} sees your words on their submissions page.</p>
            </Notice>
          )}
        </div>
        <Button type="submit" size="lg" className="bg-archetype text-on-archetype hover:bg-archetype/90">
          {existing ? "Update your reply" : "Send your reply"}
        </Button>
      </form>
    </article>
  )
}
