import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DEMO_MENTOR, DEMO_STUDENT } from "@/content/seed"
import { newId, nowLabel } from "@/lib/demo-store"
import { RUBRIC_VERSION } from "@/lib/evaluator/rubric"
import { useConversationStarters, useReflections, type KeptQuestion } from "@/lib/evaluator/store"

/** One question the apprentice can edit, answer, keep and share. */
export type DraftQuestion = Omit<KeptQuestion, "answer"> & {
  key: string
  /** Shown above the question: what the companion noticed, or the standard prompt it came from. */
  context?: ReactNode
  /** Controls shown under the question, e.g. Useful / Not right. */
  footer?: ReactNode
  /** Whether to offer an answer field (reflection prompts) or only keep and share (observations). */
  answerable: boolean
}

type ItemState = { question: string; answer: string; keep: boolean; share: boolean }

/**
 * The apprentice's side of a review: every question is theirs to reword, answer, keep or share.
 * Nothing is kept or shared unless they tick it. Saving writes to the demo store only.
 */
export function QuestionList({
  items,
  stage,
  heading,
  intro,
  headingLevel = 3,
}: {
  items: DraftQuestion[]
  stage: string
  heading: string
  intro: ReactNode
  headingLevel?: 2 | 3
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3"
  const id = useId()
  const [, setReflections] = useReflections()
  const [, setStarters] = useConversationStarters()
  const [state, setState] = useState<Record<string, ItemState>>(() =>
    Object.fromEntries(items.map((i) => [i.key, { question: i.question, answer: "", keep: false, share: false }]))
  )
  const [error, setError] = useState("")
  const [saved, setSaved] = useState<{ kept: number; shared: number } | null>(null)
  const errorRef = useRef<HTMLParagraphElement>(null)
  const savedRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (error) errorRef.current?.focus()
  }, [error])
  useEffect(() => {
    if (saved) savedRef.current?.focus()
  }, [saved])

  const set = (key: string, patch: Partial<ItemState>) => setState((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }))

  function toKept(item: DraftQuestion): KeptQuestion {
    const s = state[item.key]
    const question = s.question.trim() || item.question
    return {
      pillar: item.pillar,
      promptIds: item.promptIds,
      question,
      answer: s.answer.trim(),
      origin: item.origin === "ai" && question !== item.question ? "ai-edited" : item.origin,
    }
  }

  function save(e: FormEvent) {
    e.preventDefault()
    // Anything answered counts as kept: the apprentice wrote it.
    const kept = items.filter((i) => state[i.key].keep || state[i.key].answer.trim())
    const shared = items.filter((i) => state[i.key].share)
    if (!kept.length && !shared.length) {
      setError("Tick “Keep” or “Share with your mentor” on at least one question, or answer one.")
      return
    }
    setError("")
    const at = nowLabel()
    if (kept.length) {
      setReflections((prev) => [...prev, { id: newId(), savedAt: at, stage, rubricVersion: RUBRIC_VERSION, questions: kept.map(toKept) }])
    }
    if (shared.length) {
      setStarters((prev) => [
        ...prev,
        // The question only: answers stay in the apprentice's own reflections.
        ...shared.map((i) => {
          const { pillar, promptIds, question, origin } = toKept(i)
          return { pillar, promptIds, question, origin, id: newId(), sharedAt: at, from: DEMO_STUDENT, mentor: DEMO_MENTOR, stage }
        }),
      ])
    }
    setSaved({ kept: kept.length, shared: shared.length })
  }

  if (saved) {
    return (
      <div className="rounded-2xl border-2 border-primary p-5">
        <Heading ref={savedRef} tabIndex={-1} className="text-lg font-bold">
          Saved your choices
        </Heading>
        <p role="status" className="mt-1">
          {saved.kept > 0 && `${saved.kept} ${saved.kept === 1 ? "question" : "questions"} kept in your reflections. `}
          {saved.shared > 0 &&
            `${saved.shared === 1 ? "1 question" : `${saved.shared} questions`} shared with ${DEMO_MENTOR} (your mentor) as ${saved.shared === 1 ? "a conversation starter" : "conversation starters"}.`}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">Demo: saved in this browser only. You can stop sharing any question from the list on this page.</p>
        <Button type="button" variant="outline" className="mt-3" onClick={() => setSaved(null)}>
          Back to these questions
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={save} noValidate aria-labelledby={`${id}-title`} className="space-y-4">
      <div>
        <Heading id={`${id}-title`} className="text-lg font-bold">
          {heading}
        </Heading>
        <div className="text-sm text-muted-foreground">{intro}</div>
      </div>
      <ol className="space-y-4">
        {items.map((item, n) => {
          const s = state[item.key]
          const base = `${id}-${n}`
          return (
            <li key={item.key} className="space-y-3 rounded-xl border bg-card p-4">
              {item.context}
              <div className="space-y-1">
                <Label htmlFor={`${base}-q`} className="font-bold">
                  Question <span className="font-normal text-muted-foreground">(you can reword it)</span>
                </Label>
                <Textarea id={`${base}-q`} value={s.question} onChange={(e) => set(item.key, { question: e.target.value })} rows={2} className="min-h-16" />
              </div>
              {item.answerable && (
                <div className="space-y-1">
                  <Label htmlFor={`${base}-a`} className="font-bold">
                    Your answer, in your own words (optional)
                  </Label>
                  <Textarea id={`${base}-a`} value={s.answer} onChange={(e) => set(item.key, { answer: e.target.value })} rows={3} />
                </div>
              )}
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <label className="inline-flex min-h-11 cursor-pointer items-center gap-2">
                  <input type="checkbox" checked={s.keep} onChange={(e) => set(item.key, { keep: e.target.checked })} className="size-5 accent-primary" />
                  Keep in my reflections
                </label>
                <label className="inline-flex min-h-11 cursor-pointer items-center gap-2">
                  <input type="checkbox" checked={s.share} onChange={(e) => set(item.key, { share: e.target.checked })} className="size-5 accent-primary" />
                  Share with {DEMO_MENTOR} (your mentor)
                </label>
              </div>
              {item.footer}
            </li>
          )
        })}
      </ol>
      {error && (
        <p ref={errorRef} tabIndex={-1} role="alert" className="rounded-lg border-2 border-destructive p-3 text-sm font-semibold">
          {error}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit">Save my choices</Button>
        <p className="text-sm text-muted-foreground">Your mentor sees only the questions you tick to share, not your answers or screenshots.</p>
      </div>
    </form>
  )
}
