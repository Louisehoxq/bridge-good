import { useId, useRef, useState, type FormEvent } from "react"
import { CreditConsent, ErrorSummary, FieldError, personalDataError, TextField, type FieldErrors } from "@/components/feedback/fields"
import { YourFeedback } from "@/components/feedback/your-feedback"
import { Icon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/select"
import { getPillar, PILLARS, type PillarId } from "@/content/framework"
import { newId, nowLabel } from "@/lib/demo-store"
import { chapterName } from "@/lib/events/logic"
import type { CommunityEvent } from "@/lib/events/types"
import { isFrom, senderFor, useFeedbackItems } from "@/lib/feedback/store"
import type { EventLearningFeedback } from "@/lib/feedback/types"
import { useSession } from "@/lib/session"

/** The form's heading. "Pretend this event has happened" moves focus here. */
export const WHAT_WE_LEARNED_HEADING = "what-we-learned"

const LABELS: Record<string, string> = {
  "wwl-learned": "What you learned",
  "wwl-access": "Access",
  "wwl-change": "What BRIDGEGOOD should change",
  "wwl-attended": "About how many came",
}

/**
 * After the event, the host tells BRIDGEGOOD what they learned. It lands in the steward inbox as an
 * "event-learning" item: the steward decides with a reason, credit only with consent, and no personal data.
 */
export function WhatWeLearned({ event }: { event: CommunityEvent }) {
  const id = useId()
  const session = useSession()
  const [items, setItems] = useFeedbackItems()
  const [pillar, setPillar] = useState<PillarId | "">("")
  const [credit, setCredit] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [sent, setSent] = useState("")
  const summaryRef = useRef<HTMLDivElement>(null)

  if (!session) return null
  const sender = senderFor(session)
  const mine = items.filter((i): i is EventLearningFeedback => i.kind === "event-learning" && i.eventId === event.id && isFrom(i, sender)).toReversed()
  const creditAs = sender.group ?? sender.name

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const get = (k: string) => String(data.get(k) ?? "").trim()
    const next: FieldErrors = {}
    if (!get("wwl-learned")) next["wwl-learned"] = "Write what you learned about the approach. A few sentences is enough."
    for (const field of ["wwl-learned", "wwl-access", "wwl-change"]) {
      const problem = personalDataError(get(field))
      if (problem && !next[field]) next[field] = problem
    }
    const attendedText = get("wwl-attended")
    const attended = attendedText ? Number(attendedText) : undefined
    if (attended !== undefined && (!Number.isInteger(attended) || attended < 0 || attended > 1000)) next["wwl-attended"] = "Enter a whole number, or leave it blank."
    setErrors(next)
    if (Object.keys(next).length > 0) {
      setSent("")
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }
    const pillarIds = pillar ? [pillar, ...event.links.pillarIds.filter((p) => p !== pillar)] : event.links.pillarIds
    const item: EventLearningFeedback = {
      id: newId(),
      kind: "event-learning",
      at: nowLabel(),
      from: { ...sender, group: sender.group ?? chapterName(event.chapterId) },
      target: { type: "event", id: event.id, title: event.title },
      pillarIds,
      eventId: event.id,
      eventType: event.type,
      chapter: chapterName(event.chapterId),
      learned: get("wwl-learned"),
      access: get("wwl-access"),
      change: get("wwl-change"),
      attended,
      credit: credit && creditAs ? { consent: true, as: creditAs } : { consent: false },
      status: "new",
      replies: [],
    }
    setItems((prev) => [...prev, item])
    form.reset()
    setPillar("")
    setCredit(false)
    setSent("Sent to the BRIDGEGOOD steward. Their reply and decision will show here.")
  }

  return (
    <section aria-labelledby={WHAT_WE_LEARNED_HEADING} className="grid gap-6 xl:grid-cols-[3fr_2fr]">
      <form onSubmit={submit} noValidate className="space-y-5 rounded-2xl border bg-card p-6">
        <div className="space-y-2">
          <h2 id={WHAT_WE_LEARNED_HEADING} tabIndex={-1} className="type-title-2">
            What we learned
          </h2>
          <p className="text-muted-foreground">
            Tell BRIDGEGOOD what this event taught you about the Design for Social Good approach. Write about the session and the
            approach, not about individual people: no names, and only what people agreed to share. A BRIDGEGOOD steward reads it and
            replies with a reason.
          </p>
        </div>
        <ErrorSummary errors={errors} labels={LABELS} summaryRef={summaryRef} />
        <TextField id="wwl-learned" label="What did you learn about the approach?" error={errors["wwl-learned"]} />
        <TextField
          id="wwl-access"
          label="What worked, or didn't, for access?"
          hint="Step-free access, captions, languages, childcare, timing."
          optional
          error={errors["wwl-access"]}
        />
        <TextField
          id="wwl-change"
          label="What should BRIDGEGOOD change in the framework, the kit or this template?"
          optional
          error={errors["wwl-change"]}
        />
        <div className="space-y-1.5">
          <Label htmlFor="wwl-attended">
            About how many came? <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <p id="wwl-attended-hint" className="type-small text-muted-foreground">
            A number only. BRIDGEGOOD never asks who came.
          </p>
          <Input
            id="wwl-attended"
            name="wwl-attended"
            type="number"
            inputMode="numeric"
            min={0}
            className="max-w-40"
            aria-invalid={errors["wwl-attended"] ? true : undefined}
            aria-describedby={["wwl-attended-hint", errors["wwl-attended"] && "wwl-attended-error"].filter(Boolean).join(" ")}
          />
          {errors["wwl-attended"] && <FieldError id="wwl-attended-error">{errors["wwl-attended"]}</FieldError>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${id}-pillar`}>
            Which pillar does it touch most? <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <NativeSelect id={`${id}-pillar`} value={pillar} onChange={(e) => setPillar(e.target.value as PillarId | "")}>
            <option value="">{event.links.pillarIds.length ? `The event's pillars (${event.links.pillarIds.map((p) => getPillar(p).name).join(", ")})` : "Not sure"}</option>
            {PILLARS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.number}. {p.name}
              </option>
            ))}
          </NativeSelect>
        </div>
        {creditAs && <CreditConsent id={`${id}-credit`} checked={credit} onChange={setCredit} creditAs={creditAs} />}
        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" className="max-w-full whitespace-normal">
            <Icon name="send" />
            Send to BRIDGEGOOD
          </Button>
          <p role="status" className="font-semibold">
            {sent}
          </p>
        </div>
      </form>
      <YourFeedback items={mine} title="What happened to what you sent" empty="You haven't sent anything for this event yet." />
    </section>
  )
}
