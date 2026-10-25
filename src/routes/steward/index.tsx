import { useId, useState } from "react"
import { Link, useSearchParams } from "react-router"
import { PageHeader } from "@/components/app-shell"
import { FeaturedEvents } from "@/components/events/event-lists"
import { CommunityCard } from "@/components/feedback/community-card"
import { OutsideBadge } from "@/components/feedback/outside-badge"
import { KindTag, StatusTag, TargetTag } from "@/components/feedback/tags"
import { Icon } from "@/components/icon"
import { RoleBadge, STUDIO_ROLES } from "@/components/studio/role-badge"
import { SyntheticBadge } from "@/components/synthetic-badge"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/select"
import { PILLARS } from "@/content/framework"
import { FEEDBACK_KINDS, type CommunityFeedback, type FeedbackItem, type FeedbackKind } from "@/lib/feedback/types"
import { isOpen, itemSummary, itemTitle, KIND_INFO, targetTag } from "@/lib/feedback/logic"
import { useFramework, useInbox } from "@/lib/feedback/store"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Steward inbox")

type StatusFilter = "open" | "decided" | "all"

/** The tags an item can be filtered by: its pillars, plus its guide or prompt. */
function tagsFor(item: FeedbackItem) {
  const tags: string[] = item.pillarIds.map((p) => `pillar:${p}`)
  if (item.target.type === "guide") tags.push("guides")
  if (item.target.type === "prompt") tags.push("prompts")
  if (item.target.type === "practice") tags.push("practice")
  if (item.kind === "outside-community") tags.push("kit")
  if (item.kind === "event-learning") tags.push("events")
  return tags
}

export default function StewardInbox() {
  const id = useId()
  const [params] = useSearchParams()
  const decided = params.get("decided")
  const [inbox] = useInbox()
  const { version } = useFramework()
  const [status, setStatus] = useState<StatusFilter>("open")
  const [kind, setKind] = useState<FeedbackKind | "all">("all")
  const [tag, setTag] = useState("all")

  const shown = inbox.filter(
    (i) =>
      (status === "all" || (status === "open") === isOpen(i)) && (kind === "all" || i.kind === kind) && (tag === "all" || tagsFor(i).includes(tag))
  )
  const open = inbox.filter(isOpen)
  const community = inbox.filter((i): i is CommunityFeedback => i.kind === "community")

  return (
    <>
      <PageHeader title="Inbox">
        Every piece of feedback on the Design for Social Good framework, in one place: local adaptations, &ldquo;this didn&apos;t
        fit&rdquo; flags, disagreements with the AI, partner retrospectives, community feedback, groups outside BRIDGEGOOD that
        ran the carry-it-forward kit, and what hosts learned from community events. You decide what changes, always with a reason, and the people who sent it see the
        outcome.
      </PageHeader>

      {decided && (
        <p role="status" className="mb-6 flex flex-wrap items-center gap-2 rounded-xl bg-success-soft p-4">
          <Icon name="circle-check" className="text-success" />
          <span className="font-semibold">Decision recorded.</span>
          The sender can see it now.
          <Link to="/learn/changelog" className="inline-flex min-h-12 items-center font-semibold text-primary underline underline-offset-4">
            Open the public changelog
          </Link>
        </p>
      )}

      <div className="grid gap-8 xl:grid-cols-[3fr_2fr]">
        <section aria-labelledby={`${id}-list`} className="min-w-0 space-y-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id={`${id}-list`} className="type-title-2">
              Feedback
            </h2>
            <p className="text-muted-foreground">
              {open.length} open · framework version {version}
            </p>
          </div>

          <fieldset className="grid gap-4 rounded-2xl border bg-card p-4 sm:grid-cols-3">
            <legend className="sr-only">Filter the inbox</legend>
            <div className="space-y-1.5">
              <Label htmlFor={`${id}-status`}>Show</Label>
              <NativeSelect id={`${id}-status`} value={status} onChange={(e) => setStatus(e.target.value as StatusFilter)}>
                <option value="open">Open</option>
                <option value="decided">Decided</option>
                <option value="all">Everything</option>
              </NativeSelect>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`${id}-kind`}>Type</Label>
              <NativeSelect id={`${id}-kind`} value={kind} onChange={(e) => setKind(e.target.value as FeedbackKind | "all")}>
                <option value="all">All types</option>
                {FEEDBACK_KINDS.map((k) => (
                  <option key={k} value={k}>
                    {KIND_INFO[k].plural}
                  </option>
                ))}
              </NativeSelect>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`${id}-tag`}>Tagged</Label>
              <NativeSelect id={`${id}-tag`} value={tag} onChange={(e) => setTag(e.target.value)}>
                <option value="all">Any pillar, guide or prompt</option>
                {PILLARS.map((p) => (
                  <option key={p.id} value={`pillar:${p.id}`}>
                    Pillar: {p.name}
                  </option>
                ))}
                <option value="guides">Guides</option>
                <option value="prompts">Reflection prompts</option>
                <option value="practice">Practice moments</option>
                <option value="kit">The carry-it-forward kit</option>
                <option value="events">Community events</option>
              </NativeSelect>
            </div>
          </fieldset>
          <p role="status" className="type-small text-muted-foreground">
            Showing {shown.length} of {inbox.length}.
          </p>

          {shown.length === 0 ? (
            <p className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">Nothing here with these filters.</p>
          ) : (
            <ul className="space-y-4">
              {shown.map((item) => (
                <li key={item.id}>
                  <InboxItem item={item} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside className="h-fit space-y-6">
          {community.map((c) => (
            <CommunityCard key={c.id} item={c} link />
          ))}
          <FeaturedEvents />
          <section aria-labelledby={`${id}-how`} className="space-y-2 rounded-2xl bg-muted p-5">
            <h2 id={`${id}-how`} className="type-title-3">
              How decisions work
            </h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>Accept, decline or reply. Each needs a reason the sender can read.</li>
              <li>Accepted local adaptations can become field notes on a pillar page. The official wording stays above them.</li>
              <li>Only a steward changes BRIDGEGOOD&apos;s official wording. Each change publishes a new version.</li>
              <li>The public changelog credits people only when they said yes.</li>
              <li>AI disagreements and community cards are counts and themes, with no names.</li>
              <li>Outside communities leave no name or email. They read your reply with a code, so reply in plain words.</li>
            </ul>
          </section>
        </aside>
      </div>
    </>
  )
}

function InboxItem({ item }: { item: FeedbackItem }) {
  const sender = item.from.role ? STUDIO_ROLES[item.from.role].label : undefined
  return (
    <article className="space-y-3 rounded-2xl border bg-card p-5">
      <div className="flex flex-wrap items-center gap-2">
        <KindTag kind={item.kind} />
        <StatusTag status={item.status} />
        {item.synthetic && <SyntheticBadge />}
      </div>
      <h3 className="type-title-3">
        <Link to={`/steward/feedback/${item.id}`} className="underline-offset-4 hover:underline">
          {itemTitle(item)}
        </Link>
      </h3>
      <p>{itemSummary(item)}</p>
      <div className="flex flex-wrap items-center gap-2">
        <span className="sr-only">Tagged:</span>
        <TargetTag target={item.target} />
        {item.pillarIds
          .filter((p) => !(item.target.type === "pillar" && item.target.id === p))
          .map((p) => (
            <span key={p} className="inline-flex items-center rounded-full bg-accent px-3 py-1 type-small font-semibold text-accent-foreground">
              {targetTag({ type: "pillar", id: p })}
            </span>
          ))}
      </div>
      <p className="flex flex-wrap items-center gap-2 type-small text-muted-foreground">
        {item.from.role ? (
          <RoleBadge role={item.from.role}>
            {sender}
            {item.from.group && item.from.group !== item.from.name ? `, ${item.from.group}` : ""}
          </RoleBadge>
        ) : item.kind === "outside-community" ? (
          <OutsideBadge item={item} />
        ) : (
          <span>Counts only, no names</span>
        )}
        <span>{item.at}</span>
      </p>
    </article>
  )
}
