import { useState, type FormEvent } from "react"
import { Link } from "react-router"
import type { Route } from "./+types/entry"
import { AppShell } from "@/components/app-shell"
import { PublicPage } from "@/components/cycle"
import { Icon } from "@/components/icon"
import { Notice } from "@/components/notice"
import { StatusTag, TypeBadge, usePlaybook } from "@/components/playbook/shared"
import { SyntheticBadge } from "@/components/synthetic-badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CONTRIBUTION_KINDS, TEMPLATE_FIELDS } from "@/content/playbook"
import { newId, nowLabel } from "@/lib/demo-store"
import { addReply } from "@/lib/playbook"
import { relatedLink } from "@/lib/related"
import { pageMeta } from "@/lib/meta"

export function loader({ params }: Route.LoaderArgs) {
  return { id: params.id }
}

export const meta = () => pageMeta("Living Playbook")

export default function EntryPage({ loaderData }: Route.ComponentProps) {
  const [entries, setEntries] = usePlaybook()
  const entry = entries.find((e) => e.id === loaderData.id)
  const [reply, setReply] = useState("")

  // Unpublished contributions are only visible to the person who made them (in this browser) and to stewards.
  if (!entry || (entry.status !== "published" && !entry.mine)) {
    return (
      <AppShell>
        <PublicPage title="We can't find that entry" lede="It may still be in review, or the link may be out of date.">
          <Link to="/playbook" className="underline underline-offset-4">
            Back to the Living Playbook
          </Link>
        </PublicPage>
      </AppShell>
    )
  }

  const related = relatedLink(entry.related)
  const kind = CONTRIBUTION_KINDS.find((k) => k.id === entry.kind)

  function sendReply(e: FormEvent) {
    e.preventDefault()
    if (!reply.trim() || !entry) return
    setEntries((prev) => prev.map((x) => (x.id === entry.id ? addReply(x, "contributor", reply, newId(), nowLabel(), x.attribution.as) : x)))
    setReply("")
  }

  return (
    <AppShell>
      <PublicPage
        title={entry.title}
        stage="reflect"
        next={{ label: "Contribute your own", href: "/playbook/contribute" }}
        lede={
          <span className="flex flex-wrap items-center gap-2">
            <TypeBadge entry={entry} />
            {entry.status !== "published" && <StatusTag status={entry.status} />}
            {entry.type !== "core" && <SyntheticBadge />}
          </span>
        }
      >
        <div className="grid gap-8 lg:grid-cols-[3fr_1fr]">
          <article className="min-w-0 space-y-5">
            {entry.type === "core" ? (
              <div className="rounded-2xl border-l-4 border-action bg-card p-6">
                <p className="type-body-lg">{entry.body}</p>
              </div>
            ) : (
              <dl className="space-y-4">
                {TEMPLATE_FIELDS.filter((f) => entry.fields[f.key]).map((f) => (
                  <div key={f.key} className="rounded-xl border bg-card p-5">
                    <dt className="type-title-3">{f.label}</dt>
                    <dd className="mt-1 whitespace-pre-wrap">{entry.fields[f.key]}</dd>
                  </div>
                ))}
              </dl>
            )}
            {entry.type === "adaptation" && (
              <Notice>This is one community&apos;s adaptation. It may not be right for every context; check what stays grounded in the philosophy.</Notice>
            )}
            {entry.status === "declined" && entry.declineReason && (
              <Notice tone="warning">
                <p className="font-semibold">Why this wasn&apos;t published</p>
                <p>{entry.declineReason}</p>
              </Notice>
            )}

            {entry.mine && entry.status !== "published" && (
              <section aria-labelledby="conv-title" className="space-y-3 rounded-2xl bg-surface-sunken p-5">
                <h2 id="conv-title" className="type-title-3">
                  Conversation with the steward
                </h2>
                {entry.replies.length === 0 && <p className="text-muted-foreground">No messages yet. A steward will review this soon.</p>}
                <ol className="space-y-2" aria-live="polite">
                  {entry.replies.map((r) => (
                    <li key={r.id} className="rounded-lg bg-card p-3">
                      <p className="type-small font-semibold text-muted-foreground">
                        {r.from === "steward" ? "BRIDGEGOOD steward" : "You"} · {r.at}
                      </p>
                      <p>{r.text}</p>
                    </li>
                  ))}
                </ol>
                {entry.status === "in-discussion" && (
                  <form onSubmit={sendReply} className="space-y-2">
                    <Label htmlFor="reply">Reply to the steward</Label>
                    <Textarea id="reply" value={reply} onChange={(e) => setReply(e.target.value)} />
                    <Button type="submit">Send reply</Button>
                  </form>
                )}
              </section>
            )}
          </article>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start" aria-label="About this entry">
            <dl className="space-y-2 rounded-xl bg-surface-sunken p-5">
              <div>
                <dt className="type-small font-semibold text-muted-foreground">{entry.type === "core" ? "Author" : "Contributed by"}</dt>
                <dd>{entry.attribution.as}</dd>
              </div>
              {kind && (
                <div>
                  <dt className="type-small font-semibold text-muted-foreground">Kind of contribution</dt>
                  <dd>{kind.label}</dd>
                </div>
              )}
              <div>
                <dt className="type-small font-semibold text-muted-foreground">Version</dt>
                <dd>{entry.version}</dd>
              </div>
              <div>
                <dt className="type-small font-semibold text-muted-foreground">{entry.reviewedAt ? "Last reviewed" : "Submitted"}</dt>
                <dd>{entry.reviewedAt ?? entry.submittedAt}</dd>
              </div>
            </dl>
            {related && (
              <Link to={related.href} className="flex min-h-12 items-center gap-2 rounded-xl border p-4 font-semibold text-action underline underline-offset-4">
                <Icon name="arrow-right" />
                {related.label}
              </Link>
            )}
            <details className="rounded-xl border">
              <summary className="flex min-h-12 cursor-pointer items-center px-4 font-semibold">Version history</summary>
              <ol className="space-y-2 border-t p-4">
                {entry.history.map((h, i) => (
                  <li key={i} className="type-small">
                    <span className="font-semibold">v{h.version}</span> · {h.action} · {h.by} · {h.at}
                  </li>
                ))}
              </ol>
            </details>
            <Link to="/about#withdraw" className="inline-flex min-h-12 items-center underline underline-offset-4">
              Request a correction or withdrawal
            </Link>
          </aside>
        </div>
      </PublicPage>
    </AppShell>
  )
}
