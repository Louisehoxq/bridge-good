import { useEffect, useRef, useState, type FormEvent } from "react"
import { Link, useSearchParams } from "react-router"
import { AppShell } from "@/components/app-shell"
import { PublicPage } from "@/components/cycle"
import { ErrorSummary, FieldMessage, Notice, type FieldError } from "@/components/notice"
import { usePlaybook } from "@/components/playbook/shared"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { scenarioBySlug } from "@/content/lab"
import { ATTRIBUTION_MODES, CONTRIBUTION_KINDS, TEMPLATE_FIELDS, type AttributionMode, type ContributionKind, type Entry, type TemplateKey } from "@/content/playbook"
import { resourceBySlug } from "@/content/practice-library"
import { newId, nowLabel } from "@/lib/demo-store"
import { useSession } from "@/lib/session"
import { accountFor } from "@/lib/roles"
import { createEntry, validateDraft } from "@/lib/playbook"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Contribute to the Living Playbook")

const isKind = (v: string | null): v is ContributionKind => CONTRIBUTION_KINDS.some((k) => k.id === v)

/** Fields that only matter for a lesson-style contribution. Questions and requests need fewer. */
const OPTIONAL_FOR: Partial<Record<ContributionKind, TemplateKey[]>> = {
  question: ["tried", "learned", "change"],
  "resource-feedback": ["tried", "learned", "change"],
  withdrawal: ["tried", "learned", "change", "takeaway"],
}

export default function ContributePage() {
  const [params] = useSearchParams()
  const session = useSession()
  const [, setEntries] = usePlaybook()
  const kindParam = params.get("kind") ?? (params.get("about") === "workplace" ? "workplace" : params.get("about") === "withdrawal" ? "withdrawal" : null)
  const resourceSlug = params.get("resource")
  const scenarioSlug = params.get("scenario")
  const related: Entry["related"] = resourceSlug && resourceBySlug(resourceSlug)
    ? { kind: "resource", slug: resourceSlug }
    : scenarioSlug && scenarioBySlug(scenarioSlug)
      ? { kind: "scenario", slug: scenarioSlug }
      : undefined
  const relatedTitle = related ? (related.kind === "resource" ? resourceBySlug(related.slug)?.title : scenarioBySlug(related.slug)?.title) : undefined

  const [kind, setKind] = useState<ContributionKind | "">(isKind(kindParam) ? kindParam : "")
  const [title, setTitle] = useState("")
  const [fields, setFields] = useState<Partial<Record<TemplateKey, string>>>({})
  const [mode, setMode] = useState<AttributionMode>("role")
  const [as, setAs] = useState(session?.role === "company-host" ? `A company host (${accountFor(session).name})` : "")
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<FieldError[]>([])
  const [doneId, setDoneId] = useState<string | null>(null)
  const summaryRef = useRef<HTMLDivElement>(null)
  const doneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (doneId) doneRef.current?.focus()
  }, [doneId])

  function submit(e: FormEvent) {
    e.preventDefault()
    const draft = { kind, title, fields, attributionMode: mode, attributionAs: as, consent, related }
    const errs = validateDraft(draft)
    setErrors(errs)
    if (errs.length) {
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }
    const entry = createEntry(draft, newId(), nowLabel())
    setEntries((prev) => [...prev, entry])
    setDoneId(entry.id)
  }

  const err = (field: string) => errors.find((x) => x.field === field)?.message

  if (doneId) {
    return (
      <AppShell>
        <PublicPage title="Thank you for contributing">
          <div ref={doneRef} tabIndex={-1} role="status" className="max-w-3xl space-y-4 rounded-2xl border-2 border-action p-6 focus:outline-none">
            <p className="type-body-lg">Your contribution is submitted for review.</p>
            <ol className="list-decimal space-y-1 pl-5">
              <li>A BRIDGEGOOD steward checks relevance, consent, privacy, accessibility, and alignment with the philosophy.</li>
              <li>If anything needs clarifying, they&apos;ll ask you here first.</li>
              <li>If it&apos;s published, it&apos;s shared with the attribution you chose, and labelled as a community contribution.</li>
            </ol>
            <p className="text-muted-foreground">Demo: saved in this browser only. Log in as the steward to review it.</p>
            <div className="flex flex-wrap gap-3">
              <Link to={`/playbook/${doneId}`} className={buttonVariants()}>
                See your contribution
              </Link>
              <Link to="/playbook" className={buttonVariants({ variant: "outline" })}>
                Back to the Playbook
              </Link>
            </div>
          </div>
        </PublicPage>
      </AppShell>
    )
  }

  const optional = kind ? (OPTIONAL_FOR[kind] ?? []) : []

  return (
    <AppShell>
      <PublicPage
        title="Contribute to the Living Playbook"
        stage="reflect"
        lede="Make learning visible without treating every experience as a success story. Share only what you have permission to share."
      >
        <form noValidate onSubmit={submit} className="grid max-w-5xl gap-8 lg:grid-cols-[3fr_2fr]">
          <div className="space-y-6">
            <ErrorSummary errors={errors} summaryRef={summaryRef} title="There's a problem with your contribution" />

            <fieldset className="space-y-2" aria-describedby={err("kind") ? "kind-error" : undefined}>
              <legend id="kind" tabIndex={-1} className="mb-1 type-title-3">
                What are you contributing?
              </legend>
              {err("kind") && <FieldMessage id="kind-error">{err("kind")}</FieldMessage>}
              {CONTRIBUTION_KINDS.map((k) => (
                <label key={k.id} className="flex min-h-12 cursor-pointer items-start gap-3 rounded-lg border p-3 has-checked:border-action has-checked:bg-surface-sunken">
                  <input type="radio" name="kind" value={k.id} checked={kind === k.id} onChange={() => setKind(k.id)} className="mt-1 size-5 shrink-0 accent-[var(--action)]" />
                  <span>{k.label}</span>
                </label>
              ))}
            </fieldset>

            {relatedTitle && <Notice>About: {relatedTitle}</Notice>}

            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} aria-invalid={!!err("title")} aria-describedby={err("title") ? "title-error" : undefined} />
              {err("title") && <FieldMessage id="title-error">{err("title")}</FieldMessage>}
            </div>

            {TEMPLATE_FIELDS.map((f, i) => {
              const required = f.key === "context" || f.key === "challenge"
              const isOptional = !required
              const e = err(f.key)
              return (
                <div key={f.key} className="space-y-1.5">
                  <Label htmlFor={f.key}>
                    {i + 1}. {f.label}
                    {isOptional && <span className="font-normal text-muted-foreground"> (optional{optional.includes(f.key) ? " for this kind" : ""})</span>}
                  </Label>
                  <p id={`${f.key}-hint`} className="text-muted-foreground">
                    {f.prompt}
                  </p>
                  <Textarea
                    id={f.key}
                    value={fields[f.key] ?? ""}
                    onChange={(ev) => setFields({ ...fields, [f.key]: ev.target.value })}
                    aria-invalid={!!e}
                    aria-describedby={[`${f.key}-hint`, e ? `${f.key}-error` : ""].filter(Boolean).join(" ")}
                  />
                  {e && <FieldMessage id={`${f.key}-error`}>{e}</FieldMessage>}
                </div>
              )
            })}

            <fieldset className="space-y-3">
              <legend className="mb-1 type-title-3">7. Permission and attribution</legend>
              <p className="text-muted-foreground">How should your contribution be credited if it&apos;s published?</p>
              {ATTRIBUTION_MODES.map((m) => (
                <label key={m.id} className="grid min-h-12 cursor-pointer grid-cols-[auto_1fr] items-start gap-x-3 rounded-lg border p-3 has-checked:border-action has-checked:bg-surface-sunken">
                  <input type="radio" name="mode" value={m.id} checked={mode === m.id} onChange={() => setMode(m.id)} className="row-span-2 mt-1 size-5 shrink-0 accent-[var(--action)]" />
                  <span className="font-semibold">{m.label}</span>
                  <span className="text-muted-foreground">{m.hint}</span>
                </label>
              ))}
              {mode !== "anonymous" && (
                <div className="space-y-1.5">
                  <Label htmlFor="attributionAs">Credit me as</Label>
                  <Input
                    id="attributionAs"
                    value={as}
                    onChange={(e) => setAs(e.target.value)}
                    placeholder={mode === "role" ? "e.g. A mentor in Chicago" : "Your name"}
                    aria-invalid={!!err("attributionAs")}
                    aria-describedby={err("attributionAs") ? "attributionAs-error" : undefined}
                  />
                  {err("attributionAs") && <FieldMessage id="attributionAs-error">{err("attributionAs")}</FieldMessage>}
                </div>
              )}
              <label className="flex min-h-12 cursor-pointer items-start gap-3 rounded-lg border p-3">
                <input
                  id="consent"
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  aria-invalid={!!err("consent")}
                  aria-describedby={err("consent") ? "consent-error" : undefined}
                  className="mt-1 size-5 shrink-0 accent-[var(--action)]"
                />
                <span>
                  I confirm this contribution doesn&apos;t disclose personal or confidential information, or anyone&apos;s story,
                  identity, portfolio or artwork, without their explicit consent.
                </span>
              </label>
              {err("consent") && <FieldMessage id="consent-error">{err("consent")}</FieldMessage>}
            </fieldset>

            <Button type="submit" size="lg">
              Submit for review
            </Button>
          </div>

          <aside className="h-fit space-y-4 rounded-2xl bg-surface-sunken p-6 lg:sticky lg:top-24" aria-label="How your contribution will be used">
            <h2 className="type-title-3">How your contribution will be used</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>A person at BRIDGEGOOD reviews it before anything is published. Nothing is published automatically.</li>
              <li>If published, it&apos;s labelled as a practice example, local adaptation, or open question, never as BRIDGEGOOD&apos;s core philosophy.</li>
              <li>It&apos;s credited the way you choose, with its source, review date and version recorded.</li>
              <li>Recurring themes help improve tools, scenarios, and facilitator guidance.</li>
              <li>You can ask for a correction or withdrawal at any time.</li>
            </ul>
            <p className="text-muted-foreground">Don&apos;t include email addresses, phone numbers, or anyone&apos;s personal details.</p>
          </aside>
        </form>
      </PublicPage>
    </AppShell>
  )
}
