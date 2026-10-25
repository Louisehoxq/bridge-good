import { useId, useRef, useState, type FormEvent } from "react"
import { Link } from "react-router"
import { Icon } from "@/components/icon"
import { ErrorSummary, FieldMessage, type FieldError } from "@/components/notice"
import { StatusTag, usePlaybook } from "@/components/playbook/shared"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { PRINCIPLES } from "@/content/philosophy"
import type { Entry } from "@/content/playbook"
import { newId, nowLabel } from "@/lib/demo-store"
import { chapterName, typeLabel } from "@/lib/events/logic"
import type { CommunityEvent } from "@/lib/events/types"
import { containsContactDetails } from "@/lib/playbook"
import { accountFor } from "@/lib/roles"
import { useSession } from "@/lib/session"

/** The form's heading. "Pretend this event has happened" moves focus here. */
export const WHAT_WE_LEARNED_HEADING = "what-we-learned"

/**
 * Reflect and share: after the event, the host shares what they learned as a Living Playbook contribution.
 * A BRIDGEGOOD steward reviews it like any other (relevance, consent, privacy, accessibility, alignment) before
 * it's published as a practice example. About the session and the approach, never about individual people.
 */
export function WhatWeLearned({ event }: { event: CommunityEvent }) {
  const id = useId()
  const session = useSession()
  const [entries, setEntries] = usePlaybook()
  const [learned, setLearned] = useState("")
  const [access, setAccess] = useState("")
  const [change, setChange] = useState("")
  const [attended, setAttended] = useState("")
  const [principle, setPrinciple] = useState("")
  const [credit, setCredit] = useState(true)
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<FieldError[]>([])
  const [sent, setSent] = useState("")
  const summaryRef = useRef<HTMLDivElement>(null)

  if (!session) return null
  const chapter = chapterName(event.chapterId)
  const creditAs = `${accountFor(session).name}, ${chapter} chapter`
  const mine = entries.filter((e) => e.mine && e.related?.kind === "event" && e.related.slug === event.id).toReversed()

  function submit(e: FormEvent) {
    e.preventDefault()
    const next: FieldError[] = []
    if (!learned.trim()) next.push({ field: "wwl-learned", message: "Write what you learned about the approach. A few sentences is enough." })
    if ([learned, access, change].some(containsContactDetails)) next.push({ field: "wwl-learned", message: "Remove email addresses and phone numbers first." })
    const count = attended.trim() ? Number(attended) : undefined
    if (count !== undefined && (!Number.isInteger(count) || count < 0 || count > 1000)) next.push({ field: "wwl-attended", message: "Enter a whole number, or leave it blank." })
    if (!consent) next.push({ field: "wwl-consent", message: "Confirm it doesn't name or identify anyone without their consent." })
    setErrors(next)
    if (next.length) {
      setSent("")
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }
    const at = nowLabel()
    const as = credit ? creditAs : "A community member"
    const entry: Entry = {
      id: newId(),
      type: "practice",
      kind: "event-learning",
      title: `What we learned: ${event.title}`,
      fields: {
        context: `${typeLabel(event.type)} on the ${chapter} calendar${count !== undefined ? `, about ${count} people came` : ""}.`,
        learned: learned.trim(),
        ...(change.trim() ? { change: change.trim() } : {}),
        ...(access.trim() ? { takeaway: `On access: ${access.trim()}` } : {}),
      },
      attribution: { mode: credit ? "role" : "anonymous", as },
      consentConfirmed: true,
      status: "submitted",
      checks: {},
      replies: [],
      history: [{ at, by: as, action: "Submitted", version: "0.1" }],
      version: "0.1",
      submittedAt: at,
      related: { kind: "event", slug: event.id },
      themes: ["events", ...(principle ? [principle] : [])],
      mine: true,
    }
    setEntries((prev) => [...prev, entry])
    setLearned("")
    setAccess("")
    setChange("")
    setAttended("")
    setPrinciple("")
    setConsent(false)
    setSent("Shared with the Living Playbook. A BRIDGEGOOD steward reviews it before it's published.")
  }

  const err = (field: string) => errors.find((x) => x.field === field)?.message

  return (
    <section aria-labelledby={WHAT_WE_LEARNED_HEADING} className="grid gap-6 xl:grid-cols-[3fr_2fr]">
      <form onSubmit={submit} noValidate className="space-y-5 rounded-2xl border bg-card p-6">
        <div className="space-y-2">
          <p className="flex items-center gap-2 type-small font-semibold text-action">
            <Icon name="sticky-note" />
            Reflect and share
          </p>
          <h2 id={WHAT_WE_LEARNED_HEADING} tabIndex={-1} className="type-title-2">
            What we learned
          </h2>
          <p className="text-muted-foreground">
            Share what this event taught you about the Design for Social Good approach. Write about the session and the approach,
            not about individual people. It goes to the Living Playbook, where a BRIDGEGOOD steward reviews it before it&apos;s
            published.
          </p>
        </div>
        <ErrorSummary errors={errors} summaryRef={summaryRef} title="There's a problem with what you wrote" />
        <div className="space-y-1.5">
          <Label htmlFor="wwl-learned">What did you learn about the approach?</Label>
          <Textarea
            id="wwl-learned"
            value={learned}
            onChange={(e) => setLearned(e.target.value)}
            aria-invalid={!!err("wwl-learned")}
            aria-describedby={err("wwl-learned") ? "wwl-learned-error" : undefined}
          />
          {err("wwl-learned") && <FieldMessage id="wwl-learned-error">{err("wwl-learned")}</FieldMessage>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="wwl-access">
            What worked, or didn&apos;t, for access? <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <p id="wwl-access-hint" className="type-small text-muted-foreground">
            Step-free access, captions, languages, childcare, timing.
          </p>
          <Textarea id="wwl-access" value={access} onChange={(e) => setAccess(e.target.value)} aria-describedby="wwl-access-hint" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="wwl-change">
            What would you change next time, or what should BRIDGEGOOD change in this template?{" "}
            <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Textarea id="wwl-change" value={change} onChange={(e) => setChange(e.target.value)} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="wwl-attended">
              About how many came? <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <p id="wwl-attended-hint" className="type-small text-muted-foreground">
              A number only. BRIDGEGOOD never asks who came.
            </p>
            <Input
              id="wwl-attended"
              type="number"
              inputMode="numeric"
              min={0}
              value={attended}
              onChange={(e) => setAttended(e.target.value)}
              className="max-w-40"
              aria-invalid={!!err("wwl-attended")}
              aria-describedby={["wwl-attended-hint", err("wwl-attended") && "wwl-attended-error"].filter(Boolean).join(" ")}
            />
            {err("wwl-attended") && <FieldMessage id="wwl-attended-error">{err("wwl-attended")}</FieldMessage>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`${id}-principle`}>
              Which principle does it touch most? <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <NativeSelect id={`${id}-principle`} value={principle} onChange={(e) => setPrinciple(e.target.value)}>
              <option value="">Not sure</option>
              {PRINCIPLES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.number}. {p.title}
                </option>
              ))}
            </NativeSelect>
          </div>
        </div>
        <label className="flex min-h-12 cursor-pointer items-start gap-3 rounded-lg border p-3">
          <input type="checkbox" checked={credit} onChange={(e) => setCredit(e.target.checked)} className="mt-1 size-5 shrink-0 accent-[var(--action)]" />
          <span>Credit this as &ldquo;{creditAs}&rdquo; if it&apos;s published. Untick to share anonymously.</span>
        </label>
        <label className="flex min-h-12 cursor-pointer items-start gap-3 rounded-lg border p-3">
          <input
            id="wwl-consent"
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            aria-invalid={!!err("wwl-consent")}
            aria-describedby={err("wwl-consent") ? "wwl-consent-error" : undefined}
            className="mt-1 size-5 shrink-0 accent-[var(--action)]"
          />
          <span>I confirm this doesn&apos;t name or identify anyone, or share anyone&apos;s story, without their consent.</span>
        </label>
        {err("wwl-consent") && <FieldMessage id="wwl-consent-error">{err("wwl-consent")}</FieldMessage>}
        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" className="max-w-full whitespace-normal">
            <Icon name="send" />
            Share in the Living Playbook
          </Button>
          <p role="status" className="font-semibold">
            {sent}
          </p>
        </div>
      </form>

      <section aria-labelledby={`${id}-mine`} className="h-fit space-y-3 rounded-2xl bg-surface-sunken p-5">
        <h3 id={`${id}-mine`} className="type-title-3">
          What happened to what you shared
        </h3>
        {mine.length === 0 ? (
          <p className="text-muted-foreground">You haven&apos;t shared anything for this event yet.</p>
        ) : (
          <ul className="space-y-2">
            {mine.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center gap-2 rounded-lg bg-card p-3">
                <Link to={`/playbook/${e.id}`} className="font-semibold underline underline-offset-4">
                  {e.title}
                </Link>
                <StatusTag status={e.status} />
              </li>
            ))}
          </ul>
        )}
        <Link to="/playbook?type=practice" className="inline-flex min-h-12 items-center underline underline-offset-4">
          Read what other hosts have learned
        </Link>
      </section>
    </section>
  )
}
