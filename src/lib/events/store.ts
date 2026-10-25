import { SEED_EVENTS, SEED_RSVPS } from "@/content/events"
import { useCollection } from "@/lib/demo-store"
import type { CommunityEvent, EventHost, Rsvp } from "@/lib/events/types"
import { accountFor, type Session } from "@/lib/roles"
import { studioRoleFor } from "@/components/studio/role-badge"

/**
 * DEMO collections for community events, in this browser's localStorage (see demo-store.ts). Every role shares
 * them, so a chapter lead's new event shows up on the public calendar, and an apprentice's RSVP shows up in the
 * host's count.
 */
export const useEvents = () => useCollection<CommunityEvent>("community-events", SEED_EVENTS)
export const useRsvps = () => useCollection<Rsvp>("event-rsvps", SEED_RSVPS)

/** Who the signed-in demo session is, as an event host or guest: their role and synthetic account name. */
export function whoFor(session: Session | null): EventHost | undefined {
  return session ? { role: studioRoleFor(session), name: accountFor(session).name } : undefined
}
