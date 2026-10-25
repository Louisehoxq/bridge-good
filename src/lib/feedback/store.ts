import { useMemo } from "react"
import { SEED_CHANGELOG, SEED_DISAGREEMENTS, SEED_FEEDBACK, SEED_FIELD_NOTES } from "@/content/feedback-seed"
import type { PillarId } from "@/content/framework"
import { CURRENT_PUBLISHED } from "@/content/framework-history"
import { useCollection } from "@/lib/demo-store"
import { useEvaluatorFeedback } from "@/lib/evaluator/store"
import { currentVersion, officialWording, openDisagreementGroups } from "@/lib/feedback/logic"
import type { ChangelogEntry, DisagreementRecord, FeedbackItem, FeedbackSender, FieldNoteRecord, WordingVersion } from "@/lib/feedback/types"
import { accountFor, type Session } from "@/lib/roles"
import { STUDIO_ROLE_FOR } from "@/components/studio/role-badge"

/**
 * DEMO collections for the feedback loop, in this browser's localStorage (see demo-store.ts). Every role
 * shares them, so a chapter lead's proposal shows up in the steward's inbox, and the steward's decision
 * shows up back on the chapter lead's playbook and in the public changelog.
 */
const NONE: never[] = []

export const useFeedbackItems = () => useCollection<FeedbackItem>("feedback-inbox", SEED_FEEDBACK)
export const useChangelog = () => useCollection<ChangelogEntry>("framework-changelog", SEED_CHANGELOG)
export const useFieldNotes = () => useCollection<FieldNoteRecord>("field-notes", SEED_FIELD_NOTES)
export const useWordingVersions = () => useCollection<WordingVersion>("framework-wording", NONE)

/** The framework as it stands: the current version and each pillar's official wording. */
export function useFramework() {
  const [wordings] = useWordingVersions()
  return useMemo(
    () => ({
      version: currentVersion(CURRENT_PUBLISHED.version, wordings),
      wording: (pillarId: PillarId) => officialWording(pillarId, wordings),
    }),
    [wordings]
  )
}

/** "Not right" records: synthetic seed plus what people recorded with the Reflection Companion's controls. */
export function useDisagreementRecords(): DisagreementRecord[] {
  const [evaluatorFeedback] = useEvaluatorFeedback()
  return useMemo(
    () => [
      ...SEED_DISAGREEMENTS,
      ...evaluatorFeedback.flatMap((f) =>
        f.verdict !== "useful" && f.pillar ? [{ id: f.id, pillar: f.pillar, lens: f.lens, reason: f.reason, rubricVersion: f.rubricVersion }] : []
      ),
    ],
    [evaluatorFeedback]
  )
}

/** Everything in the steward's inbox: stored items plus open AI disagreement counts, newest first. */
export function useInbox() {
  const [items, setItems] = useFeedbackItems()
  const records = useDisagreementRecords()
  const all = useMemo(() => [...openDisagreementGroups(records, items), ...items.toReversed()], [records, items])
  return [all, setItems] as const
}

/** The sender details saved with feedback from this demo session. */
export function senderFor(session: Session): FeedbackSender {
  const account = accountFor(session)
  const role = session.role === "ambassador" ? (session.ambassadorKind ?? "chapter-lead") : STUDIO_ROLE_FOR[session.role]
  const group = session.role === "ambassador" ? account.detail.match(/(\w[\w ]*? chapter)/)?.[1] : session.role === "partner" ? account.name : undefined
  return { role, name: account.name, group }
}

/** Feedback this session sent, so they can see what happened to it. */
export function isFrom(item: FeedbackItem, sender: FeedbackSender) {
  return !!sender.name && item.from.name === sender.name && item.from.role === sender.role
}
