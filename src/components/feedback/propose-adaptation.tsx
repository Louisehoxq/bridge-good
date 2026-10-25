import { useId, useRef, useState, type FormEvent } from "react"
import { Link } from "react-router"
import { CreditConsent, ErrorSummary, personalDataError, RadioGroup, TextField, type FieldErrors } from "@/components/feedback/fields"
import { YourFeedback } from "@/components/feedback/your-feedback"
import { Icon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/select"
import { PILLARS, type PillarId } from "@/content/framework"
import { newId, nowLabel } from "@/lib/demo-store"
import { isFrom, senderFor, useFeedbackItems } from "@/lib/feedback/store"
import type { AdaptationFeedback } from "@/lib/feedback/types"
import { useSession } from "@/lib/session"

const LABELS: Record<string, string> = {
  "adapt-pillar": "Which pillar",
  "adapt-changed": "What you changed",
  "adapt-why": "Why",
  "adapt-kept": "What you kept",
  "adapt-happened": "What happened",
  "adapt-ask": "What you're asking for",
}

/**
 * "Propose an adaptation" for chapter leads (docs/social-good.md, recommendation 5). The note goes to the
 * BRIDGEGOOD steward's inbox; the steward decides, with a reason, and the chapter lead sees the outcome here.
 */
export function ProposeAdaptation() {
  const id = useId()
  const session = useSession()
  const [items, setItems] = useFeedbackItems()
  const [pillar, setPillar] = useState<PillarId | "">("")
  const [ask, setAsk] = useState<"local" | "core" | undefined>(undefined)
  const [credit, setCredit] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [sent, setSent] = useState("")
  const summaryRef = useRef<HTMLDivElement>(null)

  if (!session || session.role !== "ambassador" || session.ambassadorKind === "company-host") return null
  const sender = senderFor(session)
  const chapter = sender.group ?? "your chapter"
  const mine = items.filter((i): i is AdaptationFeedback => i.kind === "adaptation" && isFrom(i, sender)).toReversed()

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const get = (k: string) => String(data.get(k) ?? "").trim()
    const next: FieldErrors = {}
    if (!pillar) next["adapt-pillar"] = "Choose the pillar your adaptation is about."
    for (const [field, message] of [
      ["adapt-changed", "Say what your chapter does differently."],
      ["adapt-why", "Say why the change fits your community."],
      ["adapt-kept", "Say which core commitments you kept."],
    ] as const) {
      const value = get(field)
      const problem = !value ? message : personalDataError(value)
      if (problem) next[field] = problem
    }
    const happened = personalDataError(get("adapt-happened"))
    if (happened) next["adapt-happened"] = happened
    if (!ask) next["adapt-ask"] = "Choose whether this stays local or should change the core."
    setErrors(next)
    if (Object.keys(next).length > 0) {
      setSent("")
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }
    const item: AdaptationFeedback = {
      id: newId(),
      kind: "adaptation",
      at: nowLabel(),
      from: sender,
      chapter,
      target: { type: "pillar", id: pillar as PillarId },
      pillarIds: [pillar as PillarId],
      changed: get("adapt-changed"),
      why: get("adapt-why"),
      kept: get("adapt-kept"),
      happened: get("adapt-happened"),
      ask: ask!,
      credit: credit ? { consent: true, as: chapter } : { consent: false },
      status: "new",
      replies: [],
    }
    setItems((prev) => [...prev, item])
    form.reset()
    setPillar("")
    setAsk(undefined)
    setCredit(false)
    setSent("Sent to the BRIDGEGOOD steward. You'll see their decision and reason below.")
  }

  return (
    <section id="propose" aria-labelledby={`${id}-title`} className="mt-14 grid scroll-mt-24 gap-8 xl:grid-cols-[3fr_2fr]">
      <form onSubmit={submit} noValidate className="space-y-5 rounded-2xl border bg-card p-6">
        <div className="space-y-2">
          <h2 id={`${id}-title`} className="type-title-2">
            Propose an adaptation
          </h2>
          <p className="text-muted-foreground">
            When {chapter === "your chapter" ? "your chapter" : `the ${chapter}`} practices something differently, tell BRIDGEGOOD what you
            changed and why. A steward reads every note and decides, with a reason: it can stay local, appear as a field note on the
            pillar page, or change BRIDGEGOOD&apos;s official wording. See{" "}
            <Link to="/learn/guides/adapt-locally" className="underline underline-offset-4">
              what every chapter keeps the same
            </Link>
            .
          </p>
        </div>
        <ErrorSummary errors={errors} labels={LABELS} summaryRef={summaryRef} />
        <div className="space-y-1.5">
          <Label htmlFor="adapt-pillar">Which pillar is it about?</Label>
          <NativeSelect
            id="adapt-pillar"
            value={pillar}
            onChange={(e) => setPillar(e.target.value as PillarId | "")}
            aria-invalid={errors["adapt-pillar"] ? true : undefined}
            aria-describedby={errors["adapt-pillar"] ? "adapt-pillar-error" : undefined}
          >
            <option value="">Choose a pillar</option>
            {PILLARS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.number}. {p.name}
              </option>
            ))}
          </NativeSelect>
          {errors["adapt-pillar"] && (
            <p id="adapt-pillar-error" className="font-semibold text-destructive">
              {errors["adapt-pillar"]}
            </p>
          )}
        </div>
        <TextField id="adapt-changed" label="What did you change?" error={errors["adapt-changed"]} />
        <TextField
          id="adapt-why"
          label="Why does it fit your community better?"
          hint="Describe your community as a group. No names or personal details."
          error={errors["adapt-why"]}
        />
        <TextField id="adapt-kept" label="Which core commitments did you keep?" error={errors["adapt-kept"]} />
        <TextField id="adapt-happened" label="What happened?" optional hint="Patterns, not quotes. Named quotes need the person's consent." error={errors["adapt-happened"]} />
        <RadioGroup
          name="adapt-ask"
          legend="What are you asking BRIDGEGOOD for?"
          value={ask}
          onChange={setAsk}
          error={errors["adapt-ask"]}
          options={[
            { value: "local", label: "Recognize it as our local variant", hint: "The official wording stays the same." },
            { value: "core", label: "Consider changing the official wording", hint: "BRIDGEGOOD decides, and only a steward can change the wording." },
          ]}
        />
        <CreditConsent id={`${id}-credit`} checked={credit} onChange={setCredit} creditAs={`the ${chapter}`} />
        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" className="bg-archetype text-on-archetype hover:bg-archetype/90">
            <Icon name="send" />
            Send to BRIDGEGOOD
          </Button>
          <p role="status" className="font-semibold">
            {sent}
          </p>
        </div>
      </form>
      <YourFeedback items={mine} title="Your proposals" empty="You haven't proposed an adaptation yet." />
    </section>
  )
}
