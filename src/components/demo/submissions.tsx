import { useRef, useState, type FormEvent, type RefObject } from "react"
import { newId, nowLabel } from "@/lib/demo-store"
import { DEMO_MENTOR, DEMO_STUDENT, RUBRIC, type Submission } from "@/content/seed"
import { DECISION_MOMENT_INFO, getPrompt, PILLARS, promptsForMoment, type PillarId, type ReflectionPromptId } from "@/content/framework"
import type { GrowthFeedback, GrowthNote } from "@/content/journey"
import { CAPSTONE_ACTIVITY, useGrowthFeedback, useSubmissions } from "@/components/demo/journey-data"
import { PillarChip } from "@/components/library/library-page"
import { SyntheticBadge } from "@/components/synthetic-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

type FieldError = { field: string; message: string }

function ErrorSummary({ errors, summaryRef, title }: { errors: FieldError[]; summaryRef: RefObject<HTMLDivElement | null>; title: string }) {
  if (errors.length === 0) return null
  return (
    <div ref={summaryRef} tabIndex={-1} role="alert" className="rounded-lg border-2 border-destructive p-3">
      <p className="font-bold">{title}</p>
      <ul className="list-disc pl-5">
        {errors.map((er) => (
          <li key={er.field}>
            <a href={`#${er.field}`} className="font-medium text-destructive underline underline-offset-4">
              {er.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** The mentor's words, per pillar, as the apprentice sees them. */
export function GrowthView({ feedback, submission }: { feedback: GrowthFeedback; submission?: Submission }) {
  return (
    <div className="space-y-4">
      <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        From {feedback.mentorName} · {feedback.at}
        {feedback.synthetic && <SyntheticBadge />}
      </p>
      {submission?.selfAssessment && (
        <div className="rounded-lg bg-muted p-3 text-sm">
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
      <ul className="space-y-3">
        {feedback.notes.map((n) => (
          <li key={n.pillarId} className="rounded-lg border p-3">
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
        <p className="rounded-lg bg-archetype-soft p-3">
          <span className="block font-bold">A question from {feedback.mentorName.split(" ")[0]}</span>
          {feedback.question}
        </p>
      )}
    </div>
  )
}

export function StudentSubmissions() {
  const { submissions, setSubmissions, feedbackFor } = useSubmissionData()
  const [errors, setErrors] = useState<FieldError[]>([])
  const [justSubmitted, setJustSubmitted] = useState(false)
  const summaryRef = useRef<HTMLDivElement>(null)
  const has = (field: string) => errors.some((er) => er.field === field)
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

  const describedBy = (field: string, hint?: string) => [hint, has(field) && `${field}-error`].filter(Boolean).join(" ") || undefined

  return (
    <div className="grid gap-8 xl:grid-cols-[2fr_3fr]">
      <form onSubmit={submit} noValidate className="h-fit space-y-4 rounded-2xl border bg-card p-6" aria-labelledby="new-sub">
        <h2 id="new-sub" className="text-xl font-bold">
          Submit your work
        </h2>
        <ErrorSummary errors={errors} summaryRef={summaryRef} title="Please fix the following:" />
        {justSubmitted && errors.length === 0 && (
          <p role="status" className="rounded-lg bg-archetype-soft p-3">
            Submitted. Your mentor reads your self-assessment first, then replies here.
          </p>
        )}
        <div className="space-y-1">
          <Label htmlFor="sub-title" className="font-bold">
            Title
          </Label>
          <Input id="sub-title" name="title" aria-invalid={has("sub-title") || undefined} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="sub-activity" className="font-bold">
            Activity type
          </Label>
          <select id="sub-activity" name="activity" className="min-h-12 w-full rounded-xs border border-input bg-transparent px-4">
            {ACTIVITY_TYPES.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="sub-link" className="font-bold">
            Link to your work <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Input id="sub-link" name="link" type="url" placeholder="https://" aria-invalid={has("sub-link") || undefined} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="sub-summary" className="font-bold">
            What did you do, and for whom?
          </Label>
          <Textarea id="sub-summary" name="summary" aria-invalid={has("sub-summary") || undefined} />
        </div>

        <fieldset className="space-y-3 rounded-xl border p-4">
          <legend className="px-1 font-bold">Your self-assessment</legend>
          <p id="self-hint" className="text-sm text-muted-foreground">
            Your mentor reads this before anything else, and starts the conversation from it.
          </p>
          <div className="space-y-1">
            <Label htmlFor="sub-working" className="font-bold">
              What do you think is working?
            </Label>
            <Textarea id="sub-working" name="working" aria-describedby="self-hint" aria-invalid={has("sub-working") || undefined} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="sub-help" className="font-bold">
              Where do you want help next?
            </Label>
            <Textarea id="sub-help" name="help" aria-invalid={has("sub-help") || undefined} />
          </div>
        </fieldset>

        <fieldset className="space-y-3 rounded-xl bg-archetype-soft p-4">
          <legend className="px-1 font-bold">{moment.label}</legend>
          <p id="prompts-hint" className="text-sm">
            {moment.intro} These are optional.
          </p>
          {prompts.map((p) => (
            <div key={p.id} className="space-y-1">
              <Label htmlFor={`sub-prompt-${p.id}`}>{p.text}</Label>
              <Textarea id={`sub-prompt-${p.id}`} name={`prompt-${p.id}`} rows={2} aria-describedby="prompts-hint" />
            </div>
          ))}
          <label className="flex min-h-12 cursor-pointer items-center gap-3">
            <input type="checkbox" name="share-answers" className="size-5 accent-[var(--archetype)]" />
            Share my answers to these questions with my mentor
          </label>
        </fieldset>

        <div className="space-y-1">
          <Label htmlFor="sub-reflection" className="font-bold">
            Reflection: what did you learn, and who did it help?
          </Label>
          <Textarea id="sub-reflection" name="reflection" aria-describedby={describedBy("sub-reflection")} aria-invalid={has("sub-reflection") || undefined} />
        </div>
        <Button type="submit" size="lg" className="bg-archetype text-on-archetype hover:bg-archetype/90">
          Submit for a growth conversation
        </Button>
      </form>

      <section aria-labelledby="my-subs">
        <h2 id="my-subs" className="mb-4 text-xl font-bold">
          Your submissions
        </h2>
        <ul className="space-y-4">
          {mine.map((s) => {
            const fb = feedbackFor(s.id)
            return (
              <li key={s.id} className="rounded-xl border bg-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="flex flex-wrap items-center gap-2 text-lg font-bold">
                      {s.title}
                      {s.synthetic && <SyntheticBadge />}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {s.activity} · submitted {s.submittedAt}
                    </p>
                  </div>
                  <span className={cn("rounded-full px-3 py-1 text-sm font-bold", fb ? "bg-archetype text-on-archetype" : "bg-muted text-foreground")}>
                    {fb ? "Mentor replied" : "Waiting for your mentor"}
                  </span>
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
        <p className="mb-3 text-sm text-muted-foreground">{waiting} waiting for you</p>
        <ul className="space-y-2">
          {ordered.map((s) => {
            const done = !!feedbackFor(s.id)
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(s.id)}
                  aria-current={selected?.id === s.id ? "true" : undefined}
                  className="w-full rounded-xl border p-3 text-left hover:bg-muted aria-[current=true]:border-archetype aria-[current=true]:bg-archetype-soft"
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-bold">{s.studentName}</span>
                    <span className={cn("text-xs font-bold", done ? "text-muted-foreground" : "text-archetype")}>{done ? "Replied" : "To reply"}</span>
                  </span>
                  <span className="mt-0.5 block text-sm">{s.title}</span>
                  {s.synthetic && (
                    <span className="mt-1 block">
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

  const has = (field: string) => errors.some((er) => er.field === field)

  return (
    <article aria-labelledby="review-title" className="space-y-6 rounded-2xl border bg-card p-6">
      <header>
        <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          {submission.activity} · {submission.submittedAt}
          {submission.synthetic && <SyntheticBadge />}
        </p>
        <h2 id="review-title" className="text-2xl font-bold">
          {submission.title}
        </h2>
        <p className="font-semibold">by {submission.studentName}</p>
      </header>

      <section aria-labelledby="self-title" className="rounded-xl border-2 border-archetype bg-archetype-soft p-5">
        <h3 id="self-title" className="text-lg font-bold">
          Start here: {first}&apos;s self-assessment
        </h3>
        {submission.selfAssessment ? (
          <dl className="mt-2 grid gap-4 lg:grid-cols-2">
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
          <p className="mt-2">
            {first} didn&apos;t add a self-assessment. Ask them what they think is working before you write anything.
          </p>
        )}
        {submission.promptAnswers && submission.promptAnswers.length > 0 && (
          <div className="mt-4 border-t pt-3">
            <p className="font-bold">Answers {first} chose to share</p>
            <dl className="mt-1 space-y-2">
              {submission.promptAnswers.map((a) => (
                <div key={a.promptId}>
                  <dt className="text-sm font-semibold">{getPrompt(a.promptId as ReflectionPromptId).text}</dt>
                  <dd>{a.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </section>

      <dl className="grid gap-4 lg:grid-cols-2">
        <div>
          <dt className="font-bold">Their reflection</dt>
          <dd>{submission.reflection}</dd>
        </div>
        <div>
          <dt className="font-bold">What they did</dt>
          <dd>{submission.summary}</dd>
        </div>
        {submission.link && (
          <div>
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
          <h3 className="text-xl font-bold">Your reply, pillar by pillar</h3>
          <p className="mt-1 text-muted-foreground">
            Write about the pillars that matter most for this piece. One is enough. For each, say what&apos;s working and
            one next step. There are no scores and no pass or fail. {first} sees exactly what you write.
          </p>
        </div>
        <div className="rounded-xl bg-muted p-4">
          <p className="font-bold">{DECISION_MOMENT_INFO.mentorReview.label}</p>
          <p className="text-sm">{DECISION_MOMENT_INFO.mentorReview.intro}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {prompts.map((p) => (
              <li key={p.id}>{p.text}</li>
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
            return (
              <details key={p.id} open={started || errors.some((er) => er.field.startsWith(`${submission.id}-${p.id}`)) || undefined} className="group rounded-xl border">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 p-4 font-bold [&::-webkit-details-marker]:hidden">
                  <span>
                    {p.number}. {p.name}
                    {started && <span className="ml-2 text-sm font-normal text-muted-foreground">(started)</span>}
                  </span>
                  <span className="text-2xl leading-none text-archetype transition-transform group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </summary>
                <fieldset className="space-y-3 border-t p-4">
                  <legend className="sr-only">{p.name}</legend>
                  {rows.length > 0 && (
                    <p id={hintId} className="text-sm text-muted-foreground">
                      To think about: {rows.map((r) => r.question).join(" ")}
                    </p>
                  )}
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="space-y-1">
                      <Label htmlFor={workingId} className="font-bold">
                        What&apos;s working
                      </Label>
                      <Textarea
                        id={workingId}
                        value={draft[p.id].working}
                        onChange={(e) => update(p.id, "working", e.target.value)}
                        aria-describedby={rows.length ? hintId : undefined}
                        aria-invalid={has(workingId) || undefined}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={nextId} className="font-bold">
                        One next step
                      </Label>
                      <Textarea
                        id={nextId}
                        value={draft[p.id].nextStep}
                        onChange={(e) => update(p.id, "nextStep", e.target.value)}
                        aria-invalid={has(nextId) || undefined}
                      />
                    </div>
                  </div>
                </fieldset>
              </details>
            )
          })}
        </div>
        <div className="space-y-1">
          <Label htmlFor={`${submission.id}-question`} className="font-bold">
            A question for {first} <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Textarea id={`${submission.id}-question`} value={question} onChange={(e) => setQuestion(e.target.value)} rows={2} />
        </div>
        {saved && errors.length === 0 && (
          <p role="status" className="rounded-lg bg-archetype-soft p-3">
            Sent. {submission.studentName} sees your words on their submissions page.
          </p>
        )}
        <Button type="submit" size="lg" className="bg-archetype text-on-archetype hover:bg-archetype/90">
          {existing ? "Update your reply" : "Send your reply"}
        </Button>
      </form>
    </article>
  )
}
