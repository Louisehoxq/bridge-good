import { FRAMEWORK_META, PILLARS, type PillarId } from "@/content/framework"

/**
 * Published versions of the Design for Social Good framework. BRIDGEGOOD publishes each one; the current
 * version is FRAMEWORK_META.version in framework.ts, and the last entry here must match it.
 *
 * Only a change to BRIDGEGOOD's official wording publishes a new version. Field notes (recognized local
 * variants) and changes noted for the next review sit under the version they were made against.
 * In the demo, changes the steward accepts are kept in this browser and add versions on top of these.
 */
export type PublishedVersion = {
  version: string
  date: string
  summary: string
  /** The official meaning of each pillar in this version. */
  wording: Record<PillarId, string>
}

const wordingNow = Object.fromEntries(PILLARS.map((p) => [p.id, p.meaning])) as Record<PillarId, string>

export const FRAMEWORK_VERSIONS: PublishedVersion[] = [
  {
    version: "0.1",
    date: "Oct 24, 2026",
    summary:
      "First draft, written by the hackathon team from BRIDGEGOOD's challenge brief: five pillars, twelve reflection prompts and a learning outcome for each pillar. It's waiting for BRIDGEGOOD's review.",
    wording: wordingNow,
  },
]

/** The latest published version. A unit test checks it matches FRAMEWORK_META.version. */
export const CURRENT_PUBLISHED = FRAMEWORK_VERSIONS[FRAMEWORK_VERSIONS.length - 1]

export const PUBLISHED_BY = FRAMEWORK_META.author
