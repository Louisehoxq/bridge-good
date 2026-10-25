import { useId, useRef, useState, type FormEvent } from "react"
import { Link } from "react-router"
import { CreditConsent, personalDataError, TextField } from "@/components/feedback/fields"
import { YourFeedback } from "@/components/feedback/your-feedback"
import { Icon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/select"
import { getPillar, getPrompt, type PillarId, type ReflectionPromptId } from "@/content/framework"
import { newId, nowLabel } from "@/lib/demo-store"
import { isFrom, senderFor, useFeedbackItems } from "@/lib/feedback/store"
import type { DidntFitFeedback, FeedbackTarget } from "@/lib/feedback/types"
import { useSession } from "@/lib/session"

const sameTarget = (a: FeedbackTarget, b: FeedbackTarget) =>
  a.type === b.type && ("id" in a ? a.id : undefined) === ("id" in b ? b.id : undefined)

/**
 * "This didn't fit": one tap sends a flag to the BRIDGEGOOD steward; a note is optional. For apprentices and
 * mentors. The flag carries the page and its pillars, never anything about the person beyond their demo role.
 */
export function DidntFit({
  target,
  pillarIds,
  promptChoices,
  what = "this page",
}: {
  target: FeedbackTarget
  pillarIds: PillarId[]
  /** On a page of prompts, let them say which prompt after the tap. */
  promptChoices?: ReflectionPromptId[]
  what?: string
}) {
  const id = useId()
  const session = useSession()
  const [items, setItems] = useFeedbackItems()
  const [flagId, setFlagId] = useState<string | null>(null)
  const [note, setNote] = useState("")
  const [prompt, setPrompt] = useState("")
  const [credit, setCredit] = useState(false)
  const [error, setError] = useState("")
  const [status, setStatus] = useState("")
  const headingRef = useRef<HTMLHeadingElement>(null)

  const allowed = session?.role === "student" || session?.role === "mentor"
  if (!session || !allowed) {
    return (
      <aside aria-labelledby={`${id}-title`} className="rounded-2xl border border-dashed p-5">
        <h2 id={`${id}-title`} className="flex items-center gap-2 type-title-3">
          <Icon name="flag" />
          Did this fit your community?
        </h2>
        <p className="mt-1 text-muted-foreground">
          Apprentices and mentors can flag {what} with one tap when it didn&apos;t fit. A BRIDGEGOOD steward reads every flag, and
          accepted changes appear in the{" "}
          <Link to="/learn/changelog" className="underline underline-offset-4">
            public changelog
          </Link>
          .
        </p>
      </aside>
    )
  }

  const sender = senderFor(session)
  const mine = items.filter((i): i is DidntFitFeedback => i.kind === "didnt-fit" && isFrom(i, sender) && i.target.type === target.type && (target.type !== "prompt" ? sameTarget(i.target, target) : true)).toReversed()
  const current = flagId ? items.find((i) => i.id === flagId) : undefined

  function flag() {
    const item: DidntFitFeedback = {
      id: newId(),
      kind: "didnt-fit",
      at: nowLabel(),
      from: { role: sender.role, name: sender.name },
      target,
      pillarIds,
      credit: { consent: false },
      status: "new",
      replies: [],
    }
    setItems((prev) => [...prev, item])
    setFlagId(item.id)
    setStatus("Flag sent to the BRIDGEGOOD steward. You can add a note if you like.")
  }

  function addNote(e: FormEvent) {
    e.preventDefault()
    const problem = personalDataError(note)
    setError(problem)
    if (problem || !flagId) return
    const promptId = prompt ? (Number(prompt) as ReflectionPromptId) : undefined
    setItems((prev) =>
      prev.map((i) =>
        i.id === flagId && i.kind === "didnt-fit"
          ? {
              ...i,
              note: note.trim() || undefined,
              target: promptId ? { type: "prompt", id: promptId } : i.target,
              pillarIds: promptId ? getPrompt(promptId).pillarIds : i.pillarIds,
              credit: credit && sender.name ? { consent: true, as: sender.name } : { consent: false },
            }
          : i
      )
    )
    setFlagId(null)
    setNote("")
    setPrompt("")
    setCredit(false)
    setStatus("Thanks. Your note is with the flag.")
    requestAnimationFrame(() => headingRef.current?.focus())
  }

  function takeBack() {
    if (!flagId) return
    setItems((prev) => prev.filter((i) => i.id !== flagId))
    setFlagId(null)
    setStatus("Flag taken back.")
    requestAnimationFrame(() => headingRef.current?.focus())
  }

  return (
    <aside aria-labelledby={`${id}-title`} className="space-y-4 rounded-2xl border bg-card p-5">
      <div>
        <h2 id={`${id}-title`} ref={headingRef} tabIndex={-1} className="flex items-center gap-2 type-title-3 focus:outline-none">
          <Icon name="flag" />
          Did this fit your community?
        </h2>
        <p className="mt-1 text-muted-foreground">
          If {what} didn&apos;t fit your work or your community, flag it. A BRIDGEGOOD steward reads every flag and decides what
          changes, with a reason you&apos;ll see here.
        </p>
      </div>
      {!current && (
        <Button type="button" variant="outline" onClick={flag}>
          <Icon name="flag" />
          This didn&apos;t fit
        </Button>
      )}
      <p role="status" className="font-semibold empty:hidden">
        {status}
      </p>
      {current && (
        <form onSubmit={addNote} noValidate className="space-y-4">
          {promptChoices && (
            <div className="space-y-1.5">
              <Label htmlFor={`${id}-prompt`}>
                Which prompt? <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <NativeSelect
                id={`${id}-prompt`}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              >
                <option value="">The prompts in general</option>
                {promptChoices.map((p) => (
                  <option key={p} value={p}>
                    {p}. {getPrompt(p).text}
                  </option>
                ))}
              </NativeSelect>
            </div>
          )}
          <TextField
            id={`${id}-note`}
            label="What didn't fit?"
            optional
            hint="What happened, in a sentence or two. No names or personal details."
            value={note}
            onChange={setNote}
            error={error}
          />
          {sender.name && <CreditConsent id={`${id}-credit`} checked={credit} onChange={setCredit} creditAs="you by name" />}
          <div className="flex flex-wrap gap-3">
            <Button type="submit" variant="outline">
              <Icon name="send" />
              Add note
            </Button>
            <Button type="button" variant="ghost" onClick={takeBack}>
              Take the flag back
            </Button>
          </div>
        </form>
      )}
      {mine.length > 0 && <YourFeedback items={mine} title="Your flags here" />}
    </aside>
  )
}

const GUIDE_PILLARS: Record<string, PillarId[]> = {
  "mock-case": ["design-for-good", "craft"],
  "real-case": ["design-for-good"],
  "ai-and-social-good": ["responsible-ai"],
  "mentor-commitment": ["design-for-good"],
  "ambassador-vetting": ["design-for-good"],
  "adapt-locally": ["design-for-good"],
  "inclusive-language": ["access-inclusion"],
}

/** Tag a guide page: the guide, plus the pillars it teaches. */
export const guideTarget = (slug: string): { target: FeedbackTarget; pillarIds: PillarId[]; what: string } => ({
  target: { type: "guide", id: slug },
  pillarIds: GUIDE_PILLARS[slug] ?? [],
  what: "this guide",
})

/** Tag a pillar page: the pillar itself. */
export const pillarTarget = (id: PillarId): { target: FeedbackTarget; pillarIds: PillarId[]; what: string } => ({
  target: { type: "pillar", id },
  pillarIds: [id],
  what: `the ${getPillar(id).name} pillar`,
})
