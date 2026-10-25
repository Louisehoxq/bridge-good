import { useRef, useState, type FormEvent } from "react"
import { newId, nowLabel, useCollection } from "@/lib/demo-store"
import {
  DEMO_MENTOR,
  DEMO_STUDENT,
  RUBRIC,
  RUBRIC_LEVELS,
  SEED_EVALUATIONS,
  SEED_SUBMISSIONS,
  type Evaluation,
  type Submission,
} from "@/content/seed"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export const ACTIVITY_TYPES = ["Basic fundamentals", "Mock case", "Case study", "Capstone project"] as const

/** Only open http(s) links that students submit, never javascript: or other schemes. */
function isWebLink(value: string) {
  try {
    return ["http:", "https:"].includes(new URL(value).protocol)
  } catch {
    return false
  }
}

function useSubmissionData() {
  const [submissions, setSubmissions] = useCollection<Submission>("submissions", SEED_SUBMISSIONS)
  const [evaluations, setEvaluations] = useCollection<Evaluation>("evaluations", SEED_EVALUATIONS)
  const evaluationFor = (id: string) => evaluations.find((e) => e.submissionId === id)
  return { submissions, setSubmissions, evaluations, setEvaluations, evaluationFor }
}

export function EvaluationView({ evaluation }: { evaluation: Evaluation }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Feedback from {evaluation.mentorName} · {evaluation.at}
      </p>
      <dl className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
        {RUBRIC.map((c) => (
          <div key={c.id} className="rounded-lg bg-muted p-3">
            <dt className="text-xs font-bold">{c.label}</dt>
            <dd className="mt-1 font-semibold">{RUBRIC_LEVELS[(evaluation.scores[c.id] ?? 1) - 1]}</dd>
          </div>
        ))}
      </dl>
      <div className="grid gap-3 lg:grid-cols-2">
        <p>
          <span className="block font-bold">What&apos;s working</span>
          {evaluation.strengths}
        </p>
        <p>
          <span className="block font-bold">Next steps</span>
          {evaluation.nextSteps}
        </p>
      </div>
    </div>
  )
}

export function StudentSubmissions() {
  const { submissions, setSubmissions, evaluationFor } = useSubmissionData()
  const [errors, setErrors] = useState<{ field: string; message: string }[]>([])
  const [justSubmitted, setJustSubmitted] = useState(false)
  const summaryRef = useRef<HTMLDivElement>(null)
  const has = (field: string) => errors.some((er) => er.field === field)
  const mine = submissions.filter((s) => s.studentName === DEMO_STUDENT).toReversed()

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const get = (k: string) => String(data.get(k) ?? "").trim()
    const missing = [
      !get("title") && { field: "sub-title", message: "Give your project a title" },
      get("link") && !isWebLink(get("link")) && { field: "sub-link", message: "Use a full web address starting with https://" },
      !get("summary") && { field: "sub-summary", message: "Describe what you did" },
      !get("reflection") && { field: "sub-reflection", message: "Add a short reflection" },
    ].filter(Boolean) as { field: string; message: string }[]
    setErrors(missing)
    if (missing.length) {
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }
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
        submittedAt: nowLabel(),
      },
    ])
    form.reset()
    setJustSubmitted(true)
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[2fr_3fr]">
      <form onSubmit={submit} noValidate className="h-fit space-y-4 rounded-2xl border bg-card p-6" aria-labelledby="new-sub">
        <h2 id="new-sub" className="text-xl font-bold">
          Submit a project
        </h2>
        {errors.length > 0 && (
          <div ref={summaryRef} tabIndex={-1} role="alert" className="rounded-lg border-2 border-destructive p-3">
            <p className="font-bold">Please fix the following:</p>
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
        )}
        {justSubmitted && errors.length === 0 && (
          <p role="status" className="rounded-lg bg-archetype-soft p-3">
            Submitted. Your mentor will see it in their review queue.
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
        <div className="space-y-1">
          <Label htmlFor="sub-reflection" className="font-bold">
            Reflection: what did you learn?
          </Label>
          <Textarea id="sub-reflection" name="reflection" aria-invalid={has("sub-reflection") || undefined} />
        </div>
        <Button type="submit" size="lg" className="bg-archetype text-on-archetype hover:bg-archetype/90">
          Submit for feedback
        </Button>
      </form>

      <section aria-labelledby="my-subs">
        <h2 id="my-subs" className="mb-4 text-xl font-bold">
          Your submissions
        </h2>
        <ul className="space-y-4">
          {mine.map((s) => {
            const ev = evaluationFor(s.id)
            return (
              <li key={s.id} className="rounded-xl border bg-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-lg font-bold">{s.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {s.activity} · submitted {s.submittedAt}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-sm font-bold",
                      ev ? "bg-archetype text-on-archetype" : "bg-muted text-foreground"
                    )}
                  >
                    {ev ? "Feedback ready" : "Awaiting review"}
                  </span>
                </div>
                {ev && (
                  <div className="mt-4 border-t pt-4">
                    <EvaluationView evaluation={ev} />
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
  const { submissions, setEvaluations, evaluationFor } = useSubmissionData()
  const ordered = submissions.toSorted((a, b) => Number(!!evaluationFor(a.id)) - Number(!!evaluationFor(b.id)))
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = ordered.find((s) => s.id === selectedId) ?? ordered[0]
  const waiting = submissions.filter((s) => !evaluationFor(s.id)).length

  return (
    <div className="grid gap-6 xl:grid-cols-[22rem_1fr]">
      <nav aria-label="Submissions queue">
        <p className="mb-3 text-sm text-muted-foreground">{waiting} awaiting review</p>
        <ul className="space-y-2">
          {ordered.map((s) => {
            const done = !!evaluationFor(s.id)
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
                    <span className={cn("text-xs font-bold", done ? "text-muted-foreground" : "text-archetype")}>
                      {done ? "Reviewed" : "To review"}
                    </span>
                  </span>
                  <span className="mt-0.5 block text-sm">{s.title}</span>
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
          existing={evaluationFor(selected.id)}
          onSave={(ev) => setEvaluations((prev) => [...prev.filter((e) => e.submissionId !== ev.submissionId), ev])}
        />
      )}
    </div>
  )
}

function ReviewPanel({
  submission,
  existing,
  onSave,
}: {
  submission: Submission
  existing?: Evaluation
  onSave: (ev: Evaluation) => void
}) {
  const [scores, setScores] = useState<Record<string, number>>(existing?.scores ?? {})
  const [strengths, setStrengths] = useState(existing?.strengths ?? "")
  const [nextSteps, setNextSteps] = useState(existing?.nextSteps ?? "")
  const [error, setError] = useState("")
  const [saved, setSaved] = useState(false)

  function save(e: FormEvent) {
    e.preventDefault()
    if (RUBRIC.some((c) => !scores[c.id]) || !strengths.trim() || !nextSteps.trim()) {
      setError("Score every criterion and add both strengths and next steps.")
      return
    }
    setError("")
    onSave({
      id: existing?.id ?? newId(),
      submissionId: submission.id,
      mentorName: DEMO_MENTOR,
      scores,
      strengths: strengths.trim(),
      nextSteps: nextSteps.trim(),
      at: nowLabel(),
    })
    setSaved(true)
  }

  return (
    <article aria-labelledby="review-title" className="space-y-6 rounded-2xl border bg-card p-6">
      <header>
        <p className="text-sm text-muted-foreground">
          {submission.activity} · {submission.submittedAt}
        </p>
        <h2 id="review-title" className="text-2xl font-bold">
          {submission.title}
        </h2>
        <p className="font-semibold">by {submission.studentName}</p>
      </header>
      <dl className="grid gap-4 lg:grid-cols-2">
        <div>
          <dt className="font-bold">What they did</dt>
          <dd>{submission.summary}</dd>
        </div>
        <div>
          <dt className="font-bold">Their reflection</dt>
          <dd>{submission.reflection}</dd>
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

      <form onSubmit={save} className="space-y-5 border-t pt-5">
        <h3 className="text-xl font-bold">Evaluate against the principles</h3>
        {RUBRIC.map((c) => (
          <fieldset key={c.id} className="space-y-2">
            <legend className="font-bold">{c.label}</legend>
            <p className="text-sm text-muted-foreground">{c.question}</p>
            <div className="flex flex-wrap gap-2">
              {RUBRIC_LEVELS.map((level, i) => {
                const id = `${submission.id}-${c.id}-${i}`
                return (
                  <label
                    key={level}
                    htmlFor={id}
                    className="flex min-h-12 cursor-pointer items-center gap-2 rounded-lg border px-3 has-checked:border-archetype has-checked:bg-archetype-soft has-checked:font-bold"
                  >
                    <input
                      id={id}
                      type="radio"
                      name={`${submission.id}-${c.id}`}
                      checked={scores[c.id] === i + 1}
                      onChange={() => setScores({ ...scores, [c.id]: i + 1 })}
                      className="size-4 accent-[var(--archetype)]"
                    />
                    {level}
                  </label>
                )
              })}
            </div>
          </fieldset>
        ))}
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="rv-strengths" className="font-bold">
              What&apos;s working
            </Label>
            <Textarea id="rv-strengths" value={strengths} onChange={(e) => setStrengths(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="rv-next" className="font-bold">
              Next steps
            </Label>
            <Textarea id="rv-next" value={nextSteps} onChange={(e) => setNextSteps(e.target.value)} />
          </div>
        </div>
        {error && (
          <p role="alert" className="font-semibold text-destructive">
            {error}
          </p>
        )}
        {saved && !error && (
          <p role="status" className="rounded-lg bg-archetype-soft p-3">
            Feedback saved. {submission.studentName} will see it on their submissions page.
          </p>
        )}
        <Button type="submit" size="lg" className="bg-archetype text-on-archetype hover:bg-archetype/90">
          {existing ? "Update feedback" : "Send feedback"}
        </Button>
      </form>
    </article>
  )
}
