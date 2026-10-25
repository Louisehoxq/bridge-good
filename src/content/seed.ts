import type { PillarId } from "@/content/framework"

/**
 * SYNTHETIC seed data for the browser-only demo store. No real people.
 * Every seeded record carries `synthetic: true` so the UI can label it "Synthetic example".
 * Records people create in the demo leave the flag unset.
 * The demo student is Ari Santos and the demo mentor is Jordan Lee (see ROLE_INFO).
 */
export const DEMO_STUDENT = "Ari Santos"
export const DEMO_MENTOR = "Jordan Lee"

/** Label to show next to any seeded person, post or project. */
export const SYNTHETIC_LABEL = "Synthetic example"

export type Submission = {
  id: string
  studentName: string
  title: string
  activity: string
  link: string
  summary: string
  reflection: string
  /** The apprentice's own view of the work, read by the mentor before anything else. */
  selfAssessment?: { working: string; help: string }
  /** Answers to the "before you submit" prompts, kept only when the apprentice chose to share them. */
  promptAnswers?: { promptId: number; answer: string }[]
  submittedAt: string
  synthetic?: boolean
}

export type Evaluation = {
  id: string
  submissionId: string
  mentorName: string
  scores: Record<string, number>
  strengths: string
  nextSteps: string
  at: string
  synthetic?: boolean
}

export type Message = {
  id: string
  /** Student name: one thread per student with the demo mentor. */
  thread: string
  from: "student" | "mentor"
  fromName: string
  body: string
  at: string
  synthetic?: boolean
}

export type Slot = {
  id: string
  mentorName: string
  when: string
  focus: string
  bookedBy?: string
  bookingNote?: string
  synthetic?: boolean
}

export type Post = {
  id: string
  circle: string
  author: string
  body: string
  at: string
  synthetic?: boolean
}

/**
 * Mentor rubric. Levels describe where the work is now, as a starting point for a
 * growth conversation. They are not a pass or fail. `pillarIds` links each row to the
 * framework pillars it draws on (see docs/ai-evaluator.md, section 3).
 */
export const RUBRIC = [
  {
    id: "community",
    label: "Community voice",
    question: "Did the people affected shape the problem and the solution?",
    pillarIds: ["design-for-good"] as PillarId[],
  },
  {
    id: "access",
    label: "Inclusion & accessibility",
    question: "Does it work for the people most likely to be left out, including disabled people?",
    pillarIds: ["access-inclusion"] as PillarId[],
  },
  {
    id: "iteration",
    label: "Feedback & iteration",
    question: "Did feedback from the people affected visibly change the design?",
    pillarIds: ["responsible-ai"] as PillarId[],
  },
  {
    id: "story",
    label: "Impact story",
    question: "Is it clear who it's for, what changed for them, and how you know?",
    pillarIds: ["design-for-good", "ethics-impact"] as PillarId[],
  },
  {
    id: "craft",
    label: "Design craft",
    question: "Is the work clear, usable and well made, with a strong hierarchy?",
    pillarIds: ["craft"] as PillarId[],
  },
] as const

export const RUBRIC_LEVELS = ["Emerging", "Developing", "Proficient", "Exemplary"] as const

export const SEED_SUBMISSIONS: Submission[] = [
  {
    id: "seed-maya",
    studentName: "Maya Okafor",
    title: "Food pantry SMS booking: research synthesis",
    activity: "Mock case",
    link: "https://example.org/demo/maya-synthesis",
    summary: "Interviewed 6 (synthetic) pantry visitors and mapped the booking journey. Proposed a 3-message SMS flow.",
    reflection: "I assumed everyone had smartphones. Listening changed my whole direction.",
    selfAssessment: {
      working: "The interview notes changed the plan: the SMS flow came straight from what visitors said.",
      help: "I'm not sure the three messages are clear for people who don't read much English.",
    },
    submittedAt: "Mon, Oct 21, 3:10 PM",
    synthetic: true,
  },
  {
    id: "seed-dev",
    studentName: "Dev Patel",
    title: "Accessible event listings: low-fi prototype",
    activity: "Case study",
    link: "https://example.org/demo/dev-listings",
    summary: "Paper prototype of event listings that show captioning and interpretation up front.",
    reflection: "I need to test with Deaf people directly rather than guessing what they need.",
    selfAssessment: {
      working: "Putting captioning and interpretation at the top of each listing.",
      help: "How to find Deaf testers without asking a community group for free labor.",
    },
    submittedAt: "Tue, Oct 22, 10:45 AM",
    synthetic: true,
  },
  {
    id: "seed-ari",
    studentName: DEMO_STUDENT,
    title: "Design fundamentals: inclusive form redesign",
    activity: "Basic fundamentals",
    link: "https://example.org/demo/ari-forms",
    summary: "Redesigned a sign-up form with plain language, clear errors and larger tap targets.",
    reflection: "Writing error messages that don't blame people was harder than I expected.",
    selfAssessment: {
      working: "The error messages say what went wrong and how to fix it.",
      help: "I haven't tested it with anyone yet, so I don't know if the questions make sense.",
    },
    submittedAt: "Wed, Oct 16, 6:20 PM",
    synthetic: true,
  },
]

export const SEED_EVALUATIONS: Evaluation[] = [
  {
    id: "seed-eval-ari",
    submissionId: "seed-ari",
    mentorName: DEMO_MENTOR,
    scores: { community: 2, access: 4, iteration: 3, story: 3, craft: 3 },
    strengths: "Your error messages are kind and specific. You checked contrast, labels and tap targets without being asked.",
    nextSteps: "Test the form with two people who'd actually use it, and show what you changed afterward.",
    at: "Fri, Oct 18, 9:00 AM",
    synthetic: true,
  },
]

export const SEED_MESSAGES: Message[] = [
  {
    id: "seed-m1",
    thread: DEMO_STUDENT,
    from: "mentor",
    fromName: DEMO_MENTOR,
    body: "Hi Ari, I left feedback on your form redesign. Happy to talk it through at office hours.",
    at: "Fri, Oct 18, 9:05 AM",
    synthetic: true,
  },
  {
    id: "seed-m2",
    thread: DEMO_STUDENT,
    from: "student",
    fromName: DEMO_STUDENT,
    body: "Thank you! How do I find people to test with without making it awkward?",
    at: "Fri, Oct 18, 12:30 PM",
    synthetic: true,
  },
  {
    id: "seed-m3",
    thread: "Maya Okafor",
    from: "student",
    fromName: "Maya Okafor",
    body: "Could you look at my synthesis before Thursday?",
    at: "Mon, Oct 21, 3:15 PM",
    synthetic: true,
  },
]

export const SEED_SLOTS: Slot[] = [
  { id: "slot-1", mentorName: DEMO_MENTOR, when: "Tue, Oct 29, 4:00–4:30 PM PT", focus: "Portfolio reviews", synthetic: true },
  {
    id: "slot-2",
    mentorName: DEMO_MENTOR,
    when: "Thu, Oct 31, 5:00–5:30 PM PT",
    focus: "Research & testing",
    bookedBy: "Maya Okafor",
    bookingNote: "Synthesis feedback",
    synthetic: true,
  },
  { id: "slot-3", mentorName: "Sam Rivera", when: "Wed, Oct 30, 12:00–12:30 PM PT", focus: "Careers & interviews", synthetic: true },
  { id: "slot-4", mentorName: "Sam Rivera", when: "Fri, Nov 1, 9:00–9:30 AM PT", focus: "Accessibility", synthetic: true },
]

export const CIRCLES = [
  { id: "research", name: "Research with care", description: "Recruiting, consent, and listening well." },
  { id: "access", name: "Accessibility guild", description: "Share tools, testing tips and what worked." },
  { id: "careers", name: "Careers & confidence", description: "Interviews, portfolios, and feeling like you don't belong yet." },
]

export const SEED_POSTS: Post[] = [
  {
    id: "seed-p1",
    circle: "research",
    author: "Maya Okafor",
    body: "Tip: offer a choice of phone, text or in person for interviews. More people said yes.",
    at: "Sun, Oct 20",
    synthetic: true,
  },
  {
    id: "seed-p2",
    circle: "access",
    author: "Dev Patel",
    body: "I wrote up the steps I use to test a page with a free screen reader. Happy to walk anyone through them.",
    at: "Mon, Oct 21",
    synthetic: true,
  },
  {
    id: "seed-p3",
    circle: "careers",
    author: "Lin Zhao",
    body: "Anyone else nervous about talking about their background in interviews? Would love to swap notes.",
    at: "Tue, Oct 22",
    synthetic: true,
  },
]
