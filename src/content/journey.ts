import type { PillarId } from "@/content/framework"
import { DEMO_MENTOR, DEMO_STUDENT } from "@/content/seed"

/**
 * SYNTHETIC records that connect the role paths: growth feedback, project interest, team
 * matches and sprint milestones. No real people. Seeded records carry `synthetic: true`.
 */

/** One pillar's worth of mentor feedback. No scores, levels or pass/fail. */
export type GrowthNote = { pillarId: PillarId; working: string; nextStep: string }

export type GrowthFeedback = {
  id: string
  submissionId: string
  mentorName: string
  notes: GrowthNote[]
  /** Optional opener, e.g. a question back to the apprentice. */
  question?: string
  at: string
  synthetic?: boolean
}

export const SEED_GROWTH_FEEDBACK: GrowthFeedback[] = [
  {
    id: "seed-growth-ari",
    submissionId: "seed-ari",
    mentorName: DEMO_MENTOR,
    notes: [
      {
        pillarId: "access-inclusion",
        working: "Your error messages are kind and specific. You checked contrast, labels and tap targets without being asked.",
        nextStep: "Test the form with two people who'd actually use it, and show what you changed afterward.",
      },
      {
        pillarId: "design-for-good",
        working: "You named who the form is for in your summary, which most first drafts skip.",
        nextStep: "Ask one of those testers what they'd remove from the form, and try removing it.",
      },
    ],
    question: "You said the error messages were harder than you expected. What made them hard?",
    at: "Fri, Oct 18, 9:00 AM",
    synthetic: true,
  },
]

/** An apprentice saying which open brief they'd like to work on. It informs matching; it decides nothing. */
export type ProjectInterest = {
  id: string
  problemId: string
  apprenticeName: string
  why: string
  bring: string
  at: string
  synthetic?: boolean
}

export const SEED_INTERESTS: ProjectInterest[] = [
  {
    id: "seed-int-maya",
    problemId: "food-pantry-booking",
    apprenticeName: "Maya Okafor",
    why: "My mock case was an SMS booking flow, and I want to try it with real visitors.",
    bring: "I speak Igbo and some Spanish, and I've volunteered at a pantry.",
    at: "Tue, Oct 22, 7:40 PM",
    synthetic: true,
  },
  {
    id: "seed-int-dev",
    problemId: "tenant-rights-site",
    apprenticeName: "Dev Patel",
    why: "Information architecture is what I enjoy most, and 60 PDFs is a real puzzle.",
    bring: "I've tested pages with a screen reader for the accessibility guild.",
    at: "Wed, Oct 23, 8:15 AM",
    synthetic: true,
  },
]

/** The sprint milestones every partner project moves through. */
export const SPRINT_MILESTONES = [
  { title: "Kickoff", detail: "The team, mentor and partner meet. Consent plan and community payment agreed." },
  { title: "Week 1: listen", detail: "Interviews with community members, after the mentor reviews the plan." },
  { title: "Week 2: frame and sketch", detail: "The team shares what they heard and who they haven't heard from yet." },
  { title: "Week 3: make and test", detail: "Testing with community members, including disabled people, on their own devices." },
  { title: "Week 4: Demo Day", detail: "The team presents a working prototype and explains its choices." },
  { title: "Retrospective sent", detail: "The chapter lead shares what changed, and why, with the community chapter." },
] as const

/** A team formed by a chapter lead: apprentices plus a mentor, on one project. */
export type TeamMatch = {
  id: string
  problemId: string
  apprentices: string[]
  mentorName: string
  /** Index into SPRINT_MILESTONES of the last milestone reached. */
  milestone: number
  at: string
  synthetic?: boolean
}

export const SEED_MATCHES: TeamMatch[] = [
  {
    id: "seed-match-clinic",
    problemId: "clinic-intake",
    apprentices: ["Lin Zhao", "Jamal Hughes", "Rosa Mendez"],
    mentorName: "Sam Rivera",
    milestone: 2,
    at: "Mon, Oct 7, 6:00 PM",
    synthetic: true,
  },
]

/** Mentors the demo chapter lead can match. Synthetic. Jordan is a BRIDGEGOOD alum. */
export const CHAPTER_MENTORS = [
  { name: DEMO_MENTOR, note: "BRIDGEGOOD alum, product designer. Free on weekday evenings." },
  { name: "Sam Rivera", note: "Accessibility specialist. Mentoring one team already." },
]

/** The demo apprentice, in their own words. Synthetic. Goals and barriers, never identity. */
export const MENTEE_PROFILE = {
  name: DEMO_STUDENT,
  hopes: "Get a first design job, and use what I learned helping my family with housing paperwork.",
  barriers: "I work evening shifts twice a week, so weekend office hours are easiest.",
  synthetic: true,
}

/** The demo community partner's own project in the pipeline (see problems.ts). */
export const PARTNER_PROBLEM_ID = "tenant-rights-site"

export type PartnerFeedback = {
  id: string
  problemId: string
  whatChanged: string
  communityHeard: string
  notWorking: string
  at: string
}
