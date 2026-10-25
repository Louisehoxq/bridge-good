import { useId, useState, type FormEvent } from "react"
import { Link } from "react-router"
import { PageHeader } from "@/components/app-shell"
import { TextField } from "@/components/feedback/fields"
import { Icon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import { FRAMEWORK_META, PILLARS, type Pillar } from "@/content/framework"
import { newId, nowLabel } from "@/lib/demo-store"
import { changeWording, DecisionError, nextVersion } from "@/lib/feedback/logic"
import { useChangelog, useFieldNotes, useFramework, useWordingVersions } from "@/lib/feedback/store"
import { accountFor } from "@/lib/roles"
import { useSession } from "@/lib/session"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Versions and wording")

/** The steward's view of the framework: the current version, each pillar's official wording, and how to change it. */
export default function StewardFramework() {
  const { version } = useFramework()
  const [notes] = useFieldNotes()
  return (
    <>
      <PageHeader title="Versions and wording">
        You&apos;re the only role that can change its official
        wording. Each change publishes a new version, with the old and new wording and your reason in the public changelog.
      </PageHeader>
      <p className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-1">
        <span className="type-title-3">Version {version}</span>
        <span className="text-muted-foreground">
          {notes.length} {notes.length === 1 ? "field note" : "field notes"} recognized across the pillars
        </span>
        <Link to="/learn/changelog" className="inline-flex min-h-12 items-center font-semibold text-primary underline underline-offset-4">
          Public changelog
        </Link>
      </p>
      <ol className="space-y-6">
        {PILLARS.map((p) => (
          <li key={p.id}>
            <PillarWording pillar={p} fieldNotes={notes.filter((n) => n.pillarId === p.id).length} />
          </li>
        ))}
      </ol>
    </>
  )
}

function PillarWording({ pillar, fieldNotes }: { pillar: Pillar; fieldNotes: number }) {
  const id = useId()
  const session = useSession()
  const framework = useFramework()
  const [, setChangelog] = useChangelog()
  const [, setWordings] = useWordingVersions()
  const current = framework.wording(pillar.id)
  const [text, setText] = useState(current.text)
  const [reason, setReason] = useState("")
  const [error, setError] = useState<{ field: string; message: string } | null>(null)
  const [status, setStatus] = useState("")

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!session) return
    try {
      const result = changeWording(
        pillar.id,
        { text, reason },
        { by: session.role, byName: `${accountFor(session).name}, BRIDGEGOOD steward`, now: nowLabel(), newId, version: framework.version, currentWording: current.text }
      )
      setChangelog((prev) => [...prev, result.changelog])
      setWordings((prev) => [...prev, result.wording])
      setReason("")
      setError(null)
      setStatus(`Published version ${result.wording.version}.`)
    } catch (err) {
      if (!(err instanceof DecisionError)) throw err
      setError({ field: err.field === "reason" ? `${id}-reason` : `${id}-text`, message: err.message })
      requestAnimationFrame(() => document.getElementById(err.field === "reason" ? `${id}-reason` : `${id}-text`)?.focus())
    }
  }

  return (
    <article aria-labelledby={`${id}-title`} className="space-y-3 rounded-2xl border bg-card p-6">
      <h2 id={`${id}-title`} className="type-title-3">
        {pillar.number}. {pillar.name}
      </h2>
      <p className="type-body-lg">{current.text}</p>
      <p className="type-small text-muted-foreground">
        {current.version ? `Changed in version ${current.version}` : `Unchanged since version ${FRAMEWORK_META.version}`} · {fieldNotes}{" "}
        {fieldNotes === 1 ? "field note" : "field notes"} ·{" "}
        <Link to={`/learn/pillars/${pillar.id}`} className="underline underline-offset-4">
          Pillar page
        </Link>
      </p>
      <details className="rounded-lg border p-3">
        <summary className="min-h-12 cursor-pointer py-2.5 font-semibold">Change the official wording</summary>
        <form onSubmit={submit} noValidate className="mt-3 space-y-4">
          <TextField
            id={`${id}-text`}
            label="New official wording"
            hint={`Publishes version ${nextVersion(framework.version)}.`}
            value={text}
            onChange={setText}
            rows={4}
            error={error?.field === `${id}-text` ? error.message : undefined}
          />
          <TextField
            id={`${id}-reason`}
            label="Why it's changing"
            hint="Shown in the public changelog."
            value={reason}
            onChange={setReason}
            error={error?.field === `${id}-reason` ? error.message : undefined}
          />
          <div className="flex flex-wrap items-center gap-4">
            <Button type="submit" variant="outline">
              <Icon name="scroll-text" />
              Publish new wording
            </Button>
            <p role="status" className="font-semibold">
              {status}
            </p>
          </div>
        </form>
      </details>
    </article>
  )
}
