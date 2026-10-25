import { useId, type ReactNode } from "react"
import { Link } from "react-router"
import type { Route } from "./+types/feedback"
import { PageHeader } from "@/components/app-shell"
import { CommunityCard } from "@/components/feedback/community-card"
import { OutsideBadge } from "@/components/feedback/outside-badge"
import { DecisionForm } from "@/components/feedback/decision-form"
import { KindTag, StatusTag, TargetTag } from "@/components/feedback/tags"
import { Replies } from "@/components/feedback/your-feedback"
import { Icon } from "@/components/icon"
import { RoleBadge, STUDIO_ROLES } from "@/components/studio/role-badge"
import { SyntheticBadge } from "@/components/synthetic-badge"
import { GROUP_TYPES } from "@/content/carry-forward"
import { getPracticeMoment } from "@/content/practice"
import { typeNoun } from "@/lib/events/logic"
import { RUBRIC } from "@/lib/evaluator/rubric"
import { EFFECT_INFO, itemTitle, sourceLabel, targetLabel } from "@/lib/feedback/logic"
import { useFieldNotes, useFramework, useInbox } from "@/lib/feedback/store"
import type { FeedbackItem } from "@/lib/feedback/types"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Feedback")

const COMMUNITY_ROLE = {
  shaped: "They shaped the work: defined the problem or judged the result",
  consulted: "They were asked, but didn't make decisions",
  "not-yet": "Not yet",
} as const

/** One piece of feedback, with everything the steward needs to decide. The data lives in this browser. */
export default function StewardFeedback({ params }: Route.ComponentProps) {
  const [inbox] = useInbox()
  const item = inbox.find((i) => i.id === params.id)

  if (!item) {
    return (
      <>
        <PageHeader title="Feedback not found">
          It may have been decided already, or it was sent from another browser.
        </PageHeader>
        <Link to="/steward" className="inline-flex min-h-12 items-center font-semibold text-primary underline underline-offset-4">
          Back to the inbox
        </Link>
      </>
    )
  }

  return (
    <>
      <Link to="/steward" className="mb-4 inline-flex min-h-12 items-center gap-2 font-semibold text-primary underline underline-offset-4">
        Inbox
      </Link>
      <PageHeader title={itemTitle(item)}>{sourceLabel(item)}.</PageHeader>
      <div className="mb-8 flex flex-wrap items-center gap-2">
        <KindTag kind={item.kind} />
        <StatusTag status={item.status} />
        <TargetTag target={item.target} />
        {item.synthetic && <SyntheticBadge />}
      </div>

      <div className="grid gap-8 xl:grid-cols-[3fr_2fr]">
        <div className="min-w-0 space-y-8">
          <WhatWasSent item={item} />
          {item.replies.length > 0 && (
            <section aria-labelledby="replies-title" className="space-y-3">
              <h2 id="replies-title" className="type-title-2">
                Conversation
              </h2>
              <Replies item={item} stewardView />
            </section>
          )}
          <Context item={item} />
        </div>
        <div className="h-fit space-y-6">{item.decision ? <DecisionMade item={item} /> : <DecisionForm key={item.id} item={item} />}</div>
      </div>
    </>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <dt className="font-semibold">{label}</dt>
      <dd>{children || <span className="text-muted-foreground">Left blank</span>}</dd>
    </div>
  )
}

function WhatWasSent({ item }: { item: FeedbackItem }) {
  const id = useId()
  if (item.kind === "community") return <CommunityCard item={item} />
  return (
    <section aria-labelledby={`${id}-title`} className="space-y-4 rounded-2xl border bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id={`${id}-title`} className="type-title-2">
          What was sent
        </h2>
        <span className="type-small text-muted-foreground">{item.at}</span>
      </div>
      <p className="flex flex-wrap items-center gap-2">
        {item.from.role ? (
          <RoleBadge role={item.from.role}>
            {STUDIO_ROLES[item.from.role].label}
            {item.from.group && item.from.group !== item.from.name ? `, ${item.from.group}` : ""}
          </RoleBadge>
        ) : item.kind === "outside-community" ? (
          <OutsideBadge item={item} />
        ) : (
          <span className="text-muted-foreground">Counts only, with no names</span>
        )}
        {item.from.name && <span className="type-small text-muted-foreground">Sent by {item.from.name} (synthetic demo account)</span>}
      </p>
      <dl className="space-y-4">
        {item.kind === "adaptation" && (
          <>
            <Row label="What they changed">{item.changed}</Row>
            <Row label="Why it fits their community">{item.why}</Row>
            <Row label="Core commitments they kept">{item.kept}</Row>
            {item.target.type !== "practice" && <Row label="What happened">{item.happened}</Row>}
            <Row label="What they're asking for">{item.ask === "core" ? "Consider changing BRIDGEGOOD's official wording" : "Recognize it as a local variant"}</Row>
          </>
        )}
        {item.kind === "didnt-fit" && (
          <>
            <Row label="About">{targetLabel(item.target)}</Row>
            <Row label="Their note">{item.note}</Row>
          </>
        )}
        {item.kind === "outside-community" && (
          <>
            <Row label="Kind of group">{GROUP_TYPES[item.groupType].label}</Row>
            <Row label="What they changed about the session">{item.changed}</Row>
            <Row label="What didn't fit their community">{item.didntFit}</Row>
            <Row label="How they read your reply">
              With a reply code. BRIDGEGOOD has no name or email for them, so they see only what you write here.
            </Row>
          </>
        )}
        {item.kind === "event-learning" && (
          <>
            <Row label="Event">
              {item.target.type === "event" ? (
                <Link to={`/events/${item.eventId}`} className="underline underline-offset-4">
                  {item.target.title}
                </Link>
              ) : null}
              {` (${typeNoun(item.eventType)}, ${item.chapter})`}
            </Row>
            <Row label="What they learned about the approach">{item.learned}</Row>
            <Row label="What worked, or didn't, for access">{item.access}</Row>
            <Row label="What BRIDGEGOOD should change">{item.change}</Row>
            <Row label="About how many came">{item.attended === undefined ? "" : `${item.attended} (a number only, no names)`}</Row>
          </>
        )}
        {item.kind === "retrospective" && (
          <>
            <Row label="Project">{item.project}</Row>
            <Row label="What worked">{item.worked}</Row>
            <Row label="What didn't">{item.didnt}</Row>
            <Row label="What BRIDGEGOOD should change">{item.change}</Row>
            <Row label="How the community took part">{COMMUNITY_ROLE[item.communityRole]}</Row>
          </>
        )}
        {item.kind !== "ai-disagreement" && (
          <Row label="Credit in the changelog">{item.credit.consent ? `Yes, as ${item.credit.as}` : "No. Don't name them."}</Row>
        )}
      </dl>
      {item.kind === "ai-disagreement" && <Disagreements item={item} />}
    </section>
  )
}

function Disagreements({ item }: { item: Extract<FeedbackItem, { kind: "ai-disagreement" }> }) {
  const reasons = Object.entries(item.byReason).sort((a, b) => b[1] - a[1])
  return (
    <div className="space-y-4">
      <p>
        {item.total} times, someone said an AI question or observation about this pillar was &ldquo;not right&rdquo; (rubric{" "}
        {item.rubricVersion}). Only the pillar and the reason were saved, never the work, the AI&apos;s text or who said it.
      </p>
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">Reasons given, with counts</caption>
        <thead>
          <tr className="border-b">
            <th scope="col" className="py-2 pr-3 font-semibold">
              Reason
            </th>
            <th scope="col" className="w-24 py-2 text-right font-semibold">
              Times
            </th>
          </tr>
        </thead>
        <tbody>
          {reasons.map(([reason, count]) => (
            <tr key={reason} className="border-b last:border-0">
              <td className="py-2 pr-3">{reason}</td>
              <td className="py-2 text-right font-semibold tabular-nums">{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="type-small text-muted-foreground">
        From the Reflection Companion (apprentices): {item.byLens.student ?? 0}. From mentor critique prep: {item.byLens.mentor ?? 0}.
      </p>
    </div>
  )
}

/** The wording and notes the feedback is about, so the steward decides with the current text in front of them. */
function Context({ item }: { item: FeedbackItem }) {
  const { wording, version } = useFramework()
  const [notes] = useFieldNotes()
  if (item.target.type === "practice") {
    const slug = item.target.id
    return <PracticeContext slug={slug} count={notes.filter((n) => n.practice === slug).length} />
  }
  if (item.target.type !== "pillar") return null
  const pillarId = item.target.id
  const current = wording(pillarId)
  const rubric = RUBRIC.find((r) => r.id === pillarId)
  const count = notes.filter((n) => n.pillarId === pillarId).length
  return (
    <section aria-labelledby="context-title" className="space-y-4 rounded-2xl bg-muted p-6">
      <h2 id="context-title" className="type-title-2">
        The framework today
      </h2>
      <div>
        <h3 className="type-title-3">Official wording, version {current.version ?? version}</h3>
        <p className="mt-1 type-body-lg">{current.text}</p>
        <p className="mt-1 type-small text-muted-foreground">
          {count} {count === 1 ? "field note" : "field notes"} on this pillar.{" "}
          <Link to={`/learn/pillars/${pillarId}`} className="underline underline-offset-4">
            Open the pillar page
          </Link>
        </p>
      </div>
      {item.kind === "ai-disagreement" && rubric && (
        <div>
          <h3 className="type-title-3">What the AI is told to look for</h3>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            {rubric.aiMayNotice.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
          <p className="mt-2 type-small text-muted-foreground">Only people judge: {rubric.humanOnly.join("; ")}.</p>
        </div>
      )}
    </section>
  )
}

/** For an adaptation on a practice moment: BRIDGEGOOD's current reasoning, which the field note would sit beneath. */
function PracticeContext({ slug, count }: { slug: string; count: number }) {
  const moment = getPracticeMoment(slug)
  if (!moment) return null
  return (
    <section aria-labelledby="context-title" className="space-y-4 rounded-2xl bg-muted p-6">
      <h2 id="context-title" className="type-title-2">
        The practice moment today
      </h2>
      <div className="space-y-2">
        <h3 className="type-title-3">{moment.title}</h3>
        <p>{moment.context}</p>
        <h4 className="font-semibold">BRIDGEGOOD&apos;s reasoning (draft)</h4>
        {moment.reasoning.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <p className="type-small text-muted-foreground">
          {count} {count === 1 ? "field note" : "field notes"} on this practice moment.{" "}
          <Link to={`/learn/practice/${slug}`} className="underline underline-offset-4">
            Open the practice moment
          </Link>
        </p>
      </div>
    </section>
  )
}

function DecisionMade({ item }: { item: FeedbackItem }) {
  const decision = item.decision!
  return (
    <section aria-labelledby="decided-title" className="space-y-3 rounded-2xl border bg-card p-6" data-archetype="steward">
      <h2 id="decided-title" className="flex items-center gap-2 type-title-2">
        <Icon name={decision.outcome === "accepted" ? "circle-check" : "info"} />
        {decision.outcome === "accepted" ? "Accepted" : "Declined"}
      </h2>
      {decision.effect && <p className="font-semibold">{EFFECT_INFO[decision.effect].label}</p>}
      <p>{decision.reason}</p>
      <p className="type-small text-muted-foreground">
        {decision.by}, {decision.at}
      </p>
      {decision.changelogId && (
        <Link to={`/learn/changelog#${decision.changelogId}`} className="inline-flex min-h-12 items-center font-semibold text-primary underline underline-offset-4">
          See it in the public changelog
        </Link>
      )}
    </section>
  )
}
