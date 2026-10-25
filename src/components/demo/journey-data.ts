import { useCollection } from "@/lib/demo-store"
import { DEMO_MENTOR, DEMO_STUDENT, SEED_SUBMISSIONS, type Submission } from "@/content/seed"
import {
  PARTNER_PROBLEM_ID,
  SEED_GROWTH_FEEDBACK,
  SEED_INTERESTS,
  SEED_MATCHES,
  SPRINT_MILESTONES,
  type GrowthFeedback,
  type PartnerFeedback,
  type ProjectInterest,
  type TeamMatch,
} from "@/content/journey"
import type { SubmittedBrief } from "@/components/partner/scoping-studio"
import { PATHS, type PathKey } from "@/lib/paths"

/** Shared demo collections. Every role reads the same browser storage, so one person's action shows up for the others. */
export const useSubmissions = () => useCollection<Submission>("submissions", SEED_SUBMISSIONS)
export const useGrowthFeedback = () => useCollection<GrowthFeedback>("growth-feedback", SEED_GROWTH_FEEDBACK)
export const useInterests = () => useCollection<ProjectInterest>("interests", SEED_INTERESTS)
export const useMatches = () => useCollection<TeamMatch>("matches", SEED_MATCHES)

const NO_BRIEFS: SubmittedBrief[] = []
export const useBriefs = () => useCollection<SubmittedBrief>("briefs", NO_BRIEFS)

const NO_FEEDBACK: PartnerFeedback[] = []
export const usePartnerFeedback = () => useCollection<PartnerFeedback>("partner-feedback", NO_FEEDBACK)

export const CAPSTONE_ACTIVITY = "Partner project (capstone)"

/**
 * Where the signed-in demo account is on its path. The apprentice and partner paths follow
 * what's in the demo store; the others move with matching, and otherwise sit at a fixed demo stage.
 */
export function usePathProgress(key: PathKey) {
  const [submissions] = useSubmissions()
  const [feedback] = useGrowthFeedback()
  const [matches] = useMatches()
  const [partnerFeedback] = usePartnerFeedback()
  const stages = PATHS[key].stages

  let done: boolean[]
  switch (key) {
    case "student": {
      const mine = submissions.filter((s) => s.studentName === DEMO_STUDENT)
      const has = (activity: string) => mine.some((s) => s.activity === activity)
      const capstoneReviewed = mine.some((s) => s.activity === CAPSTONE_ACTIVITY && feedback.some((f) => f.submissionId === s.id))
      done = [has("Basic fundamentals"), has("Mock case"), matches.some((m) => m.apprentices.includes(DEMO_STUDENT)), capstoneReviewed, false]
      break
    }
    case "mentor": {
      const onTeam = matches.some((m) => m.mentorName === DEMO_MENTOR)
      done = [true, true, onTeam, false, false]
      break
    }
    case "chapter-lead": {
      const matchedHere = matches.some((m) => !m.synthetic)
      done = [true, true, true, matchedHere, false, false]
      break
    }
    case "company-host":
      done = [true, true, false, false, false, false]
      break
    case "partner": {
      const match = matches.find((m) => m.problemId === PARTNER_PROBLEM_ID)
      const reached = match?.milestone ?? -1
      const demoDay = SPRINT_MILESTONES.findIndex((m) => m.title.includes("Demo Day"))
      done = [
        true,
        true,
        !!match,
        reached >= demoDay - 1 && !!match,
        reached >= demoDay,
        partnerFeedback.some((f) => f.problemId === PARTNER_PROBLEM_ID),
      ]
      break
    }
  }

  const firstOpen = done.findIndex((d) => !d)
  const current = firstOpen === -1 ? stages.length - 1 : firstOpen
  return { path: PATHS[key], stages, done, current }
}
