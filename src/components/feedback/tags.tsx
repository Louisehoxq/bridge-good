import { Link } from "react-router"
import { Icon, type IconName } from "@/components/icon"
import { KIND_INFO, targetHref, targetTag } from "@/lib/feedback/logic"
import type { FeedbackKind, FeedbackStatus, FeedbackTarget } from "@/lib/feedback/types"
import { cn } from "@/lib/utils"

const tag = "inline-flex max-w-full items-center gap-1.5 rounded-full px-3 py-1 type-small font-semibold"

export const KIND_ICON: Record<FeedbackKind, IconName> = {
  adaptation: "map-pin",
  "didnt-fit": "flag",
  "ai-disagreement": "bot",
  retrospective: "heart-handshake",
  community: "users",
  "outside-community": "globe",
}

const STATUS: Record<FeedbackStatus, { label: string; icon: IconName; className: string }> = {
  new: { label: "New", icon: "inbox", className: "bg-muted text-foreground" },
  "in-conversation": { label: "In conversation", icon: "reply", className: "bg-marker text-ink" },
  accepted: { label: "Accepted", icon: "circle-check", className: "bg-success-soft text-success" },
  declined: { label: "Declined, with a reason", icon: "info", className: "bg-muted text-foreground" },
}

/** Status always shows an icon and a word, never color alone. */
export function StatusTag({ status, className }: { status: FeedbackStatus; className?: string }) {
  const s = STATUS[status]
  return (
    <span className={cn(tag, s.className, className)}>
      <Icon name={s.icon} className="text-base" />
      {s.label}
    </span>
  )
}

export function KindTag({ kind }: { kind: FeedbackKind }) {
  return (
    <span className={cn(tag, "border border-input bg-card text-foreground")}>
      <Icon name={KIND_ICON[kind]} className="text-base" />
      {KIND_INFO[kind].label}
    </span>
  )
}

/** What it's about: a pillar, guide or prompt. Links to the page when there is one. */
export function TargetTag({ target, link }: { target: FeedbackTarget; link?: boolean }) {
  const href = targetHref(target)
  const label = targetTag(target)
  if (link && href) {
    return (
      <Link to={href} className="inline-flex min-h-12 items-center font-semibold text-primary underline underline-offset-4">
        {label}
      </Link>
    )
  }
  return <span className={cn(tag, "bg-accent text-accent-foreground")}>{label}</span>
}
