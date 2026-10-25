import { SEED_EVENTS } from "@/content/events"
import { scenarioBySlug } from "@/content/lab"
import type { Entry } from "@/content/playbook"
import { resourceBySlug } from "@/content/practice-library"

/** A Playbook entry's related resource, scenario or community event, as a link. */
export function relatedLink(related: Entry["related"]) {
  if (!related) return null
  if (related.kind === "event") {
    const ev = SEED_EVENTS.find((e) => e.id === related.slug)
    return { label: `Community event: ${ev?.title ?? "the event page"}`, href: `/events/${related.slug}` }
  }
  if (related.kind === "resource") {
    const r = resourceBySlug(related.slug)
    return r ? { label: `Practice Library: ${r.title}`, href: `/library/${r.slug}` } : null
  }
  const s = scenarioBySlug(related.slug)
  return s ? { label: `Decision Lab: ${s.title}`, href: `/lab/${s.slug}` } : null
}
