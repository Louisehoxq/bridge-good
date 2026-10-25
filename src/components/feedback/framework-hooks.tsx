import { Link } from "react-router"
import { SyntheticBadge } from "@/components/synthetic-badge"
import { FieldNote } from "@/components/studio/field-note"
import { getPillar, type PillarId } from "@/content/framework"
import { useFieldNotes, useFramework, useInbox } from "@/lib/feedback/store"

/**
 * Small pieces the existing library pages render, so the versioned framework shows up there
 * without those pages knowing about the feedback loop.
 */

/** BRIDGEGOOD's official meaning of a pillar, in the current version. Only a steward can change it. */
export function OfficialWording({ pillarId }: { pillarId: PillarId }) {
  const { wording } = useFramework()
  const { text, version } = wording(pillarId)
  return (
    <>
      <p className="type-body-lg">{text}</p>
      <p className="mt-2 type-small text-muted-foreground">
        BRIDGEGOOD&apos;s official wording{version ? `, changed in version ${version}` : ""}.{" "}
        <Link to="/learn/changelog" className="underline underline-offset-4">
          See what changed and why
        </Link>
      </p>
    </>
  )
}

/** The current framework version, including changes a steward published in this browser. */
export function FrameworkVersion() {
  return <>{useFramework().version}</>
}

/** Recognized local variants for a pillar, beneath the official wording. Always labelled as local. */
export function FieldNotes({ pillarId }: { pillarId: PillarId }) {
  const [notes] = useFieldNotes()
  const mine = notes.filter((n) => n.pillarId === pillarId).toReversed()
  const name = getPillar(pillarId).name
  return (
    <section aria-labelledby="field-notes-title" className="space-y-4">
      <div>
        <h2 id="field-notes-title" className="type-title-2">
          Field notes
        </h2>
        <p className="mt-1 text-muted-foreground">
          How chapters practice {name} locally. These are local adaptations BRIDGEGOOD has recognized. They sit beneath the official
          wording above and don&apos;t replace it.
        </p>
      </div>
      {mine.length === 0 ? (
        <p className="rounded-xl border border-dashed p-4 text-muted-foreground">No field notes for this pillar yet. Chapter leads can propose one from their playbook.</p>
      ) : (
        <ul className="space-y-5">
          {mine.map((n) => (
            <li key={n.id}>
              <FieldNote chapter={n.chapter}>
                <p>{n.text}</p>
                <p className="flex flex-wrap items-center gap-2 type-small">
                  Recognized by BRIDGEGOOD on {n.at}, against version {n.version}.
                  <Link to={`/learn/changelog#${n.changelogId}`} className="underline underline-offset-4">
                    Why
                  </Link>
                  {n.synthetic && <SyntheticBadge />}
                </p>
              </FieldNote>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

/**
 * Under the Reflection Companion's "Not right" control: where the record goes, and BRIDGEGOOD's latest
 * decision on AI disagreements for this pillar, so people see their feedback lead somewhere.
 */
export function SentToSteward({ pillar }: { pillar: PillarId }) {
  const [inbox] = useInbox()
  const latest = inbox.find((i) => i.kind === "ai-disagreement" && i.decision && i.pillarIds.includes(pillar))
  return (
    <p className="type-small text-muted-foreground">
      Only the pillar and your reason go to BRIDGEGOOD&apos;s steward, counted with everyone else&apos;s. Never your work or your name.{" "}
      {latest?.decision && `Latest decision on ${getPillar(pillar).name}: ${latest.decision.outcome}. `}
      <Link to="/learn/changelog" className="underline underline-offset-4">
        See what changed
      </Link>
    </p>
  )
}
