import { useId, useRef, useState, type FormEvent } from "react"
import { Link } from "react-router"
import { CopyButton } from "@/components/copy-button"
import { ErrorSummary, FieldError, personalDataError, RadioGroup, TextField, type FieldErrors } from "@/components/feedback/fields"
import { Icon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/select"
import { GROUP_TYPES, type GroupType } from "@/content/carry-forward"
import { PILLARS, type PillarId } from "@/content/framework"
import { newId, nowLabel } from "@/lib/demo-store"
import { newReplyCode } from "@/lib/feedback/logic"
import { useFeedbackItems } from "@/lib/feedback/store"
import type { OutsideCommunityFeedback } from "@/lib/feedback/types"

const LABELS = {
  "kit-group": "What kind of group ran it",
  "kit-changed": "What you changed",
  "kit-didnt-fit": "What didn't fit",
  "kit-credit-as": "Name to credit",
}

/**
 * "Tell BRIDGEGOOD what you changed": for groups outside BRIDGEGOOD. No names, no email and no account.
 * The group gets a reply code to check BRIDGEGOOD's answer, and is credited by name only if they say yes.
 */
export function KitFeedbackForm() {
  const id = useId()
  const [, setItems] = useFeedbackItems()
  const [group, setGroup] = useState<GroupType | undefined>(undefined)
  const [pillar, setPillar] = useState<PillarId | "">("")
  const [credit, setCredit] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [code, setCode] = useState("")
  const summaryRef = useRef<HTMLDivElement>(null)
  const doneRef = useRef<HTMLHeadingElement>(null)

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const get = (k: string) => String(data.get(k) ?? "").trim()
    const next: FieldErrors = {}
    if (!group) next["kit-group"] = "Choose the kind of group that ran the session."
    const changed = get("kit-changed")
    const changedProblem = !changed ? "Say what you changed about the session, even if it's “nothing”." : personalDataError(changed)
    if (changedProblem) next["kit-changed"] = changedProblem
    const didnt = personalDataError(get("kit-didnt-fit"))
    if (didnt) next["kit-didnt-fit"] = didnt
    const creditAs = get("kit-credit-as")
    if (credit) {
      const problem = !creditAs ? "Write the group name BRIDGEGOOD may use, or untick the box." : personalDataError(creditAs)
      if (problem) next["kit-credit-as"] = problem
    }
    setErrors(next)
    if (Object.keys(next).length > 0) {
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }
    const replyCode = newReplyCode()
    const item: OutsideCommunityFeedback = {
      id: newId(),
      kind: "outside-community",
      at: nowLabel(),
      from: {},
      groupType: group!,
      target: pillar ? { type: "pillar", id: pillar } : { type: "kit" },
      pillarIds: pillar ? [pillar] : [],
      changed,
      didntFit: get("kit-didnt-fit"),
      replyCode,
      credit: credit ? { consent: true, as: creditAs } : { consent: false },
      status: "new",
      replies: [],
    }
    setItems((prev) => [...prev, item])
    setCode(replyCode)
    requestAnimationFrame(() => doneRef.current?.focus())
  }

  function reset() {
    setCode("")
    setGroup(undefined)
    setPillar("")
    setCredit(false)
  }

  return (
    <section id="tell-bridgegood" aria-labelledby={`${id}-title`} className="max-w-3xl scroll-mt-24 space-y-4 print:hidden">
      <div className="space-y-2">
        <h2 id={`${id}-title`} className="type-title-2">
          Tell BRIDGEGOOD what you changed
        </h2>
        <p className="type-body-lg text-muted-foreground">
          This goes to the BRIDGEGOOD steward, who reads every note. Please don&apos;t include names or personal details. You&apos;ll get
          a code to check BRIDGEGOOD&apos;s reply, so you don&apos;t need to leave an email.
        </p>
        <p className="text-muted-foreground">
          If BRIDGEGOOD uses your change, it shows in the{" "}
          <Link to="/learn/changelog" className="underline underline-offset-4">
            public changelog
          </Link>
          , and can become a field note on a pillar page. Your group is named only if you say yes.
        </p>
      </div>

      {code ? (
        <div className="space-y-4 rounded-2xl border-2 border-success bg-success-soft p-5">
          <h3 ref={doneRef} tabIndex={-1} className="flex items-center gap-2 type-title-3 focus:outline-none">
            <Icon name="circle-check" className="text-success" />
            Sent to BRIDGEGOOD
          </h3>
          <p>Your reply code is:</p>
          <p className="font-mono text-2xl font-bold tracking-wider">{code}</p>
          <p>
            Keep it somewhere safe. It&apos;s the only way to read BRIDGEGOOD&apos;s reply, because we didn&apos;t ask who you are.
          </p>
          <CopyButton text={code} label="Copy reply code" />
          <div className="flex flex-wrap gap-4">
            <Link
              to="/learn/carry-it-forward/reply"
              state={{ code }}
              className="inline-flex min-h-12 items-center gap-2 font-semibold text-primary underline underline-offset-4"
            >
              <Icon name="key-round" />
              Check for a reply
            </Link>
            <Button type="button" variant="ghost" onClick={reset}>
              Send something else
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-5 rounded-2xl border bg-card p-4 sm:p-6">
          <ErrorSummary errors={errors} labels={LABELS} summaryRef={summaryRef} />
          <RadioGroup<GroupType>
            name="kit-group"
            legend="What kind of group ran it?"
            value={group}
            onChange={setGroup}
            error={errors["kit-group"]}
            options={(Object.keys(GROUP_TYPES) as GroupType[]).map((g) => ({ value: g, label: GROUP_TYPES[g].label }))}
          />
          <TextField id="kit-changed" label="What did you change about the session?" hint="Timing, language, which prompts, where you met. Patterns, not stories about people." error={errors["kit-changed"]} />
          <TextField id="kit-didnt-fit" label="What didn't fit your community?" optional error={errors["kit-didnt-fit"]} />
          <div className="space-y-1.5">
            <Label htmlFor="kit-pillar">
              Is it mostly about one pillar? <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <NativeSelect id="kit-pillar" value={pillar} onChange={(e) => setPillar(e.target.value as PillarId | "")}>
              <option value="">Not sure, or the whole session</option>
              {PILLARS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.number}. {p.name}
                </option>
              ))}
            </NativeSelect>
          </div>
          <div className="flex items-start gap-3 py-2">
            <input
              id="kit-credit"
              type="checkbox"
              checked={credit}
              onChange={(e) => setCredit(e.target.checked)}
              aria-describedby="kit-credit-hint"
              className="mt-3 size-6 shrink-0 accent-primary"
            />
            <div>
              <label htmlFor="kit-credit" className="flex min-h-12 cursor-pointer items-center">
                BRIDGEGOOD may credit our group by name if they use our change (optional)
              </label>
              <p id="kit-credit-hint" className="type-small text-muted-foreground">
                Leave it unticked and BRIDGEGOOD won&apos;t name you anywhere.
              </p>
            </div>
          </div>
          {credit && (
            <div className="space-y-1.5">
              <Label htmlFor="kit-credit-as">Group name to credit</Label>
              <p id="kit-credit-as-hint" className="type-small text-muted-foreground">
                Your group or organization, not a person.
              </p>
              <Input
                id="kit-credit-as"
                name="kit-credit-as"
                aria-invalid={errors["kit-credit-as"] ? true : undefined}
                aria-describedby={`kit-credit-as-hint${errors["kit-credit-as"] ? " kit-credit-as-error" : ""}`}
              />
              {errors["kit-credit-as"] && <FieldError id="kit-credit-as-error">{errors["kit-credit-as"]}</FieldError>}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-4">
            <Button type="submit">
              <Icon name="send" />
              Send to BRIDGEGOOD
            </Button>
            <p className="text-muted-foreground">You&apos;ll see a reply code next.</p>
          </div>
        </form>
      )}
      <p>
        Already sent something?{" "}
        <Link to="/learn/carry-it-forward/reply" className="underline underline-offset-4">
          Check a reply with your code
        </Link>
        .
      </p>
    </section>
  )
}
