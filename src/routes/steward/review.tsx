import { useState, type FormEvent } from "react"
import { Link } from "react-router"
import type { Route } from "./+types/review"
import { PageHeader } from "@/components/app-shell"
import { Icon } from "@/components/icon"
import { Notice } from "@/components/notice"
import { StatusTag, TypeBadge, usePlaybook } from "@/components/playbook/shared"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CONTRIBUTION_KINDS, ENTRY_TYPES, REVIEW_CHECKS, TEMPLATE_FIELDS, type Entry, type EntryType } from "@/content/playbook"
import { newId, nowLabel } from "@/lib/demo-store"
import { addReply, allChecksPassed, decline, publish } from "@/lib/playbook"
import { ROLE_INFO } from "@/lib/roles"
import { pageMeta } from "@/lib/meta"
import { relatedLink } from "@/lib/related"

export function loader({ params }: Route.LoaderArgs) {
  return { id: params.id }
}

export const meta = () => pageMeta("Review a contribution")

const STEWARD = `${ROLE_INFO.steward.demoAccount.name} (steward)`
/** Community entries can't be labelled as core philosophy: only BRIDGEGOOD authors that. */
const COMMUNITY_TYPES = ENTRY_TYPES.filter((t) => t.id !== "core")

export default function ReviewPage({ loaderData }: Route.ComponentProps) {
  const [entries, setEntries] = usePlaybook()
  const entry = entries.find((e) => e.id === loaderData.id)
  const [message, setMessage] = useState("")
  const [type, setType] = useState<EntryType | null>(null)
  const [reason, setReason] = useState("")
  const [theme, setTheme] = useState("")
  const [error, setError] = useState("")
  const [done, setDone] = useState("")

  if (!entry || entry.type === "core") {
    return (
      <>
        <PageHeader title="Contribution not found" />
        <Link to="/steward" className="underline underline-offset-4">
          Back to the review queue
        </Link>
      </>
    )
  }

  const id = entry.id
  const update = (fn: (e: Entry) => Entry) => setEntries((prev) => prev.map((x) => (x.id === id ? fn(x) : x)))
  const chosenType = type ?? entry.type
  const related = relatedLink(entry.related)
  const closed = entry.status === "published" || entry.status === "declined"

  function sendMessage(e: FormEvent) {
    e.preventDefault()
    if (!message.trim()) return
    update((x) => addReply(x, "steward", message, newId(), nowLabel(), STEWARD))
    setMessage("")
  }

  function onPublish() {
    setError("")
    try {
      update((x) => publish(x, chosenType, nowLabel(), STEWARD))
      setDone("Published. It now appears in the Living Playbook with the contributor's chosen attribution.")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't publish.")
    }
  }

  function onDecline() {
    setError("")
    try {
      update((x) => decline(x, reason, nowLabel(), STEWARD))
      setDone("Declined. The contributor can see your reason.")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't decline.")
    }
  }

  function addTheme(e: FormEvent) {
    e.preventDefault()
    const t = theme.trim().toLowerCase()
    if (!t) return
    update((x) => ({ ...x, themes: x.themes.includes(t) ? x.themes : [...x.themes, t] }))
    setTheme("")
  }

  return (
    <>
      <p className="mb-4">
        <Link to="/steward" className="inline-flex min-h-12 items-center gap-1 underline underline-offset-4">
          Review queue
        </Link>
      </p>
      <PageHeader title={entry.title}>
        <span className="flex flex-wrap items-center gap-2">
          <TypeBadge entry={{ type: chosenType }} />
          <StatusTag status={entry.status} />
          <span>
            {CONTRIBUTION_KINDS.find((k) => k.id === entry.kind)?.label} · from {entry.attribution.as} · v{entry.version}
          </span>
        </span>
      </PageHeader>

      <div className="grid gap-8 xl:grid-cols-[3fr_2fr]">
        <div className="min-w-0 space-y-4">
          <dl className="space-y-3">
            {TEMPLATE_FIELDS.filter((f) => entry.fields[f.key]).map((f) => (
              <div key={f.key} className="rounded-xl border bg-card p-4">
                <dt className="font-bold">{f.label}</dt>
                <dd className="mt-1 whitespace-pre-wrap">{entry.fields[f.key]}</dd>
              </div>
            ))}
          </dl>
          {related && (
            <p>
              Related:{" "}
              <Link to={related.href} className="underline underline-offset-4">
                {related.label}
              </Link>
            </p>
          )}
          <p className="flex items-center gap-2">
            <Icon name={entry.consentConfirmed ? "circle-check" : "circle-alert"} />
            The contributor {entry.consentConfirmed ? "confirmed" : "did not confirm"} that it discloses nothing personal or confidential without consent.
          </p>

          <section aria-labelledby="discuss-title" className="space-y-3 rounded-2xl bg-surface-sunken p-5">
            <h2 id="discuss-title" className="type-title-3">
              Discuss with the contributor
            </h2>
            <ol className="space-y-2" aria-live="polite">
              {entry.replies.length === 0 && <li className="text-muted-foreground">No messages yet.</li>}
              {entry.replies.map((r) => (
                <li key={r.id} className="rounded-lg bg-card p-3">
                  <p className="type-small font-semibold text-muted-foreground">
                    {r.from === "steward" ? "You (steward)" : entry.attribution.as} · {r.at}
                  </p>
                  <p>{r.text}</p>
                </li>
              ))}
            </ol>
            {!closed && (
              <form onSubmit={sendMessage} className="space-y-2">
                <Label htmlFor="msg">Ask a question or invite clarification</Label>
                <Textarea id="msg" value={message} onChange={(e) => setMessage(e.target.value)} />
                <Button type="submit" variant="outline">
                  Send to contributor
                </Button>
              </form>
            )}
          </section>
        </div>

        <aside className="space-y-5" aria-label="Review decision">
          <fieldset className="space-y-2 rounded-2xl border bg-card p-5" disabled={closed}>
            <legend className="type-title-3">Review checklist</legend>
            {REVIEW_CHECKS.map((c) => (
              <label key={c.id} className="grid min-h-12 cursor-pointer grid-cols-[auto_1fr] items-start gap-x-3 rounded-lg p-2 hover:bg-muted">
                <input
                  id={`check-${c.id}`}
                  type="checkbox"
                  checked={!!entry.checks[c.id]}
                  onChange={(e) => update((x) => ({ ...x, checks: { ...x.checks, [c.id]: e.target.checked } }))}
                  className="row-span-2 mt-1 size-5 shrink-0 accent-[var(--action)]"
                />
                <span className="font-semibold">{c.label}</span>
                <span className="text-muted-foreground">{c.question}</span>
              </label>
            ))}
          </fieldset>

          <fieldset className="space-y-2 rounded-2xl border bg-card p-5" disabled={closed}>
            <legend className="type-title-3">Label it as</legend>
            <p className="text-muted-foreground">Core philosophy is reserved for BRIDGEGOOD-authored guidance.</p>
            {COMMUNITY_TYPES.map((t) => (
              <label key={t.id} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border p-3 has-checked:border-action has-checked:bg-surface-sunken">
                <input type="radio" name="type" checked={chosenType === t.id} onChange={() => setType(t.id)} className="size-5 shrink-0 accent-[var(--action)]" />
                <Icon name={t.icon} />
                {t.label}
              </label>
            ))}
          </fieldset>

          <div role="status">{done && <Notice tone="success">{done}</Notice>}</div>
          {error && (
            <div role="alert">
              <Notice tone="error">{error}</Notice>
            </div>
          )}

          {!closed && (
            <div className="space-y-4 rounded-2xl border-2 border-action p-5">
              <Button onClick={onPublish} className="w-full" aria-describedby="publish-hint">
                Publish
              </Button>
              <p id="publish-hint" className="type-small text-muted-foreground">
                {allChecksPassed(entry) ? "All checks passed." : "Tick every check before publishing."}
              </p>
              <div className="space-y-1.5 border-t pt-4">
                <Label htmlFor="reason">Reason for not publishing</Label>
                <Textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} />
                <Button variant="outline" onClick={onDecline} className="w-full">
                  Don&apos;t publish
                </Button>
              </div>
            </div>
          )}

          <form onSubmit={addTheme} className="space-y-2 rounded-2xl border bg-card p-5">
            <Label htmlFor="theme" className="type-title-3">
              Recurring themes
            </Label>
            <p className="text-muted-foreground">Tag themes so patterns can improve resources and scenarios.</p>
            {entry.themes.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {entry.themes.map((t) => (
                  <li key={t} className="rounded-full bg-muted px-2.5 py-0.5 type-small font-semibold">
                    {t}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex gap-2">
              <Input id="theme" value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="e.g. access, consent" />
              <Button type="submit" variant="outline">
                Add
              </Button>
            </div>
          </form>
        </aside>
      </div>
    </>
  )
}
