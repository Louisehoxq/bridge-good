import { Icon } from "@/components/icon"
import { GROUP_TYPES } from "@/content/carry-forward"
import type { OutsideCommunityFeedback } from "@/lib/feedback/types"

/**
 * Who sent outside-community feedback: the kind of group, and its name only when it said yes to credit.
 * Not a BRIDGEGOOD role, so it shows in the steward's neutral colors with the globe icon and a word.
 */
export function OutsideBadge({ item }: { item: OutsideCommunityFeedback }) {
  return (
    <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-muted px-3 py-1 type-small font-semibold text-foreground">
      <Icon name="globe" className="text-base" />
      Outside BRIDGEGOOD: {item.credit.consent ? item.credit.as : GROUP_TYPES[item.groupType].label.toLowerCase()}
    </span>
  )
}
