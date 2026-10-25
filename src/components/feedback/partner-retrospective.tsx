import { useId, useRef, useState, type FormEvent } from "react"
import { CreditConsent, ErrorSummary, personalDataError, RadioGroup, TextField, type FieldErrors } from "@/components/feedback/fields"
import { YourFeedback } from "@/components/feedback/your-feedback"
import { Icon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import { PILLARS, type PillarId } from "@/content/framework"
import { newId, nowLabel } from "@/lib/demo-store"
import { isFrom, senderFor, useFeedbackItems } from "@/lib/feedback/store"
import type { RetrospectiveFeedback } from "@/lib/feedback/types"
import { useSession } from "@/lib/session"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/select"

const LABELS: Record<string, string> = {
  "retro-worked": "What worked",
  "retro-didnt": "What didn't",
  "retro-change": "What BRIDGEGOOD should change",
  "retro-community": "How the community took part",
}

/**
 * A partner retrospective after a project (src/content/adaptation.ts, "Run a retrospective"). Only patterns go
 * to BRIDGEGOOD; the steward decides with a reason, and the partner sees the outcome here.
 */
export function PartnerRetrospective({ projectId, projectTitle }: { projectId: string; projectTitle: string }) {
  const id = useId()
  const session = useSession()
  const [items, setItems] = useFeedbackItems()
  const [community, setCommunity] = useState<RetrospectiveFeedback["communityRole"] | undefined>(undefined)
  const [pillar, setPillar] = useState<PillarId | "">("")
  const [credit, setCredit] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [sent, setSent] = useState("")
  const summaryRef = useRef<HTMLDivElement>(null)

  if (session?.role !== "partner") return null
  const sender = senderFor(session)
  const mine = items.filter((i): i is RetrospectiveFeedback => i.kind === "retrospective" && isFrom(i, sender)).toReversed()

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const get = (k: string) => String(data.get(k) ?? "").trim()
    const next: FieldErrors = {}
    if (!get("retro-worked") && !get("retro-didnt") && !get("retro-change")) next["retro-worked"] = "Write something in at least one of the first three boxes."
    for (const field of ["retro-worked", "retro-didnt", "retro-change"]) {
      const problem = personalDataError(get(field))
      if (problem) next[field] = problem
    }
    if (!community) next["retro-community"] = "Choose how the community took part."
    setErrors(next)
    if (Object.keys(next).length > 0) {
      setSent("")
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }
    const item: RetrospectiveFeedback = {
      id: newId(),
      kind: "retrospective",
      at: nowLabel(),
      from: sender,
      target: pillar ? { type: "pillar", id: pillar } : { type: "project", id: projectId },
      pillarIds: pillar ? [pillar] : [],
      project: projectTitle,
      worked: get("retro-worked"),
      didnt: get("retro-didnt"),
      change: get("retro-change"),
      communityRole: community!,
      credit: credit && sender.name ? { consent: true, as: sender.name } : { consent: false },
      status: "new",
      replies: [],
    }
    setItems((prev) => [...prev, item])
    form.reset()
    setCommunity(undefined)
    setPillar("")
    setCredit(false)
    setSent("Sent to the BRIDGEGOOD steward. Their decision and reason will show here.")
  }

  return (
    <section id="retrospective" aria-labelledby={`${id}-title`} className="mt-12 grid scroll-mt-24 gap-6 xl:grid-cols-[3fr_2fr]">
      <form onSubmit={submit} noValidate className="space-y-5 rounded-2xl border bg-card p-6">
        <div className="space-y-2">
          <h2 id={`${id}-title`} className="type-title-2">
            Project retrospective
          </h2>
          <p className="text-muted-foreground">
            At the end of the sprint, tell BRIDGEGOOD what the project taught you about the Design for Social Good approach. Talk with
            your team and community first, then share the patterns. A BRIDGEGOOD steward reads it and replies with a decision and a
            reason.
          </p>
        </div>
        <ErrorSummary errors={errors} labels={LABELS} summaryRef={summaryRef} />
        <TextField id="retro-worked" label="What worked?" error={errors["retro-worked"]} />
        <TextField id="retro-didnt" label="What didn't?" error={errors["retro-didnt"]} />
        <TextField
          id="retro-change"
          label="What should BRIDGEGOOD change in how it works with partners?"
          hint="Describe what people said as a group. No names, and only what they agreed to share."
          error={errors["retro-change"]}
        />
        <RadioGroup
          name="retro-community"
          legend="How did the people you serve take part?"
          value={community}
          onChange={setCommunity}
          error={errors["retro-community"]}
          options={[
            { value: "shaped", label: "They shaped the work: defined the problem or judged the result" },
            { value: "consulted", label: "We asked them, but they didn't make decisions" },
            { value: "not-yet", label: "Not yet" },
          ]}
        />
        <div className="space-y-1.5">
          <Label htmlFor={`${id}-pillar`}>
            Which pillar does it touch most? <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <NativeSelect
            id={`${id}-pillar`}
            value={pillar}
            onChange={(e) => setPillar(e.target.value as PillarId | "")}
          >
            <option value="">Not sure</option>
            {PILLARS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.number}. {p.name}
              </option>
            ))}
          </NativeSelect>
        </div>
        {sender.name && <CreditConsent id={`${id}-credit`} checked={credit} onChange={setCredit} creditAs={sender.name} />}
        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" className="bg-archetype text-on-archetype hover:bg-archetype/90">
            <Icon name="send" />
            Send retrospective
          </Button>
          <p role="status" className="font-semibold">
            {sent}
          </p>
        </div>
      </form>
      <YourFeedback items={mine} title="Your retrospectives" empty="You haven't sent a retrospective yet." />
    </section>
  )
}
