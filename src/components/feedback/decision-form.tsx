import { useId, useRef, useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router"
import { ErrorSummary, RadioGroup, TextField, type FieldErrors } from "@/components/feedback/fields"
import { Icon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import { newId, nowLabel } from "@/lib/demo-store"
import { addReply, allowedEffects, canReply as canReplyTo, decide, DecisionError, EFFECT_INFO, nextVersion, type DecisionInput } from "@/lib/feedback/logic"
import { useChangelog, useFeedbackItems, useFieldNotes, useFramework, useWordingVersions } from "@/lib/feedback/store"
import type { Effect, FeedbackItem } from "@/lib/feedback/types"
import { accountFor } from "@/lib/roles"
import { useSession } from "@/lib/session"

type Outcome = "accepted" | "declined" | "reply"

/** Prefill for the field note or the new wording: the sender's own words, which the steward can edit. */
function draftText(item: FeedbackItem, effect: Effect | undefined, currentWording: string) {
  if (effect === "wording") return currentWording
  if (effect === "field-note" && item.kind === "adaptation") return [item.changed, item.why, item.happened].filter(Boolean).join(" ")
  if (effect === "field-note" && item.kind === "outside-community") return item.changed
  return ""
}

/**
 * The steward's decision: accept, decline or reply, always with a reason. Accepting says what changes, and
 * publishes a changelog entry (credited only with consent), a field note, or a new official wording.
 */
export function DecisionForm({ item }: { item: FeedbackItem }) {
  const id = useId()
  const navigate = useNavigate()
  const session = useSession()
  const [, setItems] = useFeedbackItems()
  const [, setChangelog] = useChangelog()
  const [, setFieldNotes] = useFieldNotes()
  const [, setWordings] = useWordingVersions()
  const framework = useFramework()
  const effects = allowedEffects(item)
  const canReply = canReplyTo(item)
  const pillarId = item.target.type === "pillar" ? item.target.id : undefined
  const currentWording = pillarId ? framework.wording(pillarId).text : ""

  const [outcome, setOutcome] = useState<Outcome | undefined>(undefined)
  const [effect, setEffect] = useState<Effect | undefined>(effects.length === 1 ? effects[0] : undefined)
  const [reason, setReason] = useState("")
  const [summary, setSummary] = useState("")
  const [text, setText] = useState(() => draftText(item, effects.length === 1 ? effects[0] : undefined, currentWording))
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState("")
  const summaryRef = useRef<HTMLDivElement>(null)

  const ids = { outcome: `${id}-outcome`, effect: `${id}-effect`, reason: `${id}-reason`, summary: `${id}-summary`, text: `${id}-text` }
  const labels = { [ids.outcome]: "Decision", [ids.effect]: "What changes", [ids.reason]: outcome === "reply" ? "Reply" : "Reason", [ids.summary]: "What changes, in public", [ids.text]: effect === "wording" ? "New official wording" : "Field note" }

  function chooseEffect(next: Effect) {
    setEffect(next)
    setText(draftText(item, next, currentWording))
  }

  function fail(next: FieldErrors) {
    setErrors(next)
    requestAnimationFrame(() => summaryRef.current?.focus())
  }

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!session) return
    if (!outcome) return fail({ [ids.outcome]: "Choose accept, decline or reply." })
    const now = nowLabel()

    if (outcome === "reply") {
      if (!reason.trim()) return fail({ [ids.reason]: "Write your reply. The person who sent this will see it." })
      setItems((prev) => prev.map((i) => (i.id === item.id ? addReply(i, { id: newId(), from: "steward", text: reason, at: now }) : i)))
      setErrors({})
      setReason("")
      setOutcome(undefined)
      setStatus("Reply sent. It stays open until you accept or decline.")
      return
    }

    const input: DecisionInput = { outcome, reason, effect, summary, text }
    try {
      const result = decide(item, input, {
        by: session.role,
        byName: `${accountFor(session).name}, BRIDGEGOOD steward`,
        now,
        newId,
        version: framework.version,
        currentWording,
      })
      // Open AI disagreement counts aren't stored until a decision covers them.
      setItems((prev) => (prev.some((i) => i.id === item.id) ? prev.map((i) => (i.id === item.id ? result.item : i)) : [...prev, { ...result.item, id: `${item.id}-${newId()}` }]))
      if (result.changelog) setChangelog((prev) => [...prev, result.changelog!])
      if (result.fieldNote) setFieldNotes((prev) => [...prev, result.fieldNote!])
      if (result.wording) setWordings((prev) => [...prev, result.wording!])
      setErrors({})
      navigate(`/steward?decided=${encodeURIComponent(item.id)}`)
    } catch (err) {
      if (!(err instanceof DecisionError)) throw err
      const field = { reason: ids.reason, effect: ids.effect, text: ids.text, summary: ids.summary, by: ids.outcome, status: ids.outcome }[err.field]
      fail({ [field]: err.message })
    }
  }

  return (
    <form onSubmit={submit} noValidate aria-labelledby={`${id}-title`} className="space-y-5 rounded-2xl border bg-card p-6" data-archetype="steward">
      <div>
        <h2 id={`${id}-title`} className="type-title-2">
          Your decision
        </h2>
        <p className="mt-1 text-muted-foreground">
          Every decision needs a reason. {canReply ? "The person who sent this sees it, and" : "It"} appears in the public changelog if you
          accept.
        </p>
      </div>
      <ErrorSummary errors={errors} labels={labels} summaryRef={summaryRef} />
      <RadioGroup<Outcome>
        name={ids.outcome}
        legend="Decision"
        value={outcome}
        onChange={setOutcome}
        error={errors[ids.outcome]}
        options={[
          { value: "accepted", label: "Accept" },
          { value: "declined", label: "Decline" },
          ...(canReply ? [{ value: "reply" as const, label: "Reply first", hint: "Ask a question or say what you need. It stays open." }] : []),
        ]}
      />

      {outcome === "accepted" && (
        <RadioGroup<Effect>
          name={ids.effect}
          legend="What changes?"
          value={effect}
          onChange={chooseEffect}
          error={errors[ids.effect]}
          options={effects.map((e) => ({ value: e, label: EFFECT_INFO[e].label, hint: EFFECT_INFO[e].hint }))}
        />
      )}

      {outcome === "accepted" && (effect === "field-note" || effect === "wording") && (
        <TextField
          id={ids.text}
          label={effect === "wording" ? "New official wording" : `Field note, as it will appear on the ${item.target.type === "practice" ? "practice moment" : "pillar page"}`}
          hint={
            effect === "wording"
              ? `Starts from the current wording. Publishes version ${nextVersion(framework.version)}.`
              : "Starts from the sender's own words. Keep their meaning; they're credited only if they said yes."
          }
          value={text}
          onChange={setText}
          error={errors[ids.text]}
          rows={5}
        />
      )}

      {outcome === "accepted" && effect === "noted" && (
        <TextField
          id={ids.summary}
          label="What will BRIDGEGOOD change?"
          hint="One or two sentences for the public changelog."
          value={summary}
          onChange={setSummary}
          error={errors[ids.summary]}
        />
      )}

      {outcome && (
        <TextField
          id={ids.reason}
          label={outcome === "reply" ? "Your reply" : "Your reason"}
          hint={outcome === "reply" ? undefined : "Plain words. Say what you weighed, especially when you decline."}
          value={reason}
          onChange={setReason}
          error={errors[ids.reason]}
        />
      )}

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit">
          <Icon name={outcome === "reply" ? "reply" : "scroll-text"} />
          {outcome === "reply" ? "Send reply" : outcome === "declined" ? "Decline with this reason" : "Record decision"}
        </Button>
        <Link to="/steward" className="inline-flex min-h-12 items-center font-semibold text-primary underline underline-offset-4">
          Back to the inbox
        </Link>
      </div>
      <p role="status" className="font-semibold empty:hidden">
        {status}
      </p>
    </form>
  )
}
