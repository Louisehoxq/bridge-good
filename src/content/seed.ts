/**
 * SYNTHETIC seed data for the browser-only demo store. No real people.
 * The demo student is Ari Santos and the demo mentor is Jordan Lee (see ROLE_INFO).
 */
export const DEMO_STUDENT = "Ari Santos"
export const DEMO_MENTOR = "Jordan Lee"

export type Submission = {
  id: string
  studentName: string
  title: string
  activity: string
  link: string
  summary: string
  reflection: string
  submittedAt: string
}

export type Evaluation = {
  id: string
  submissionId: string
  mentorName: string
  scores: Record<string, number>
  strengths: string
  nextSteps: string
  at: string
}

export type Message = {
  id: string
  /** Student name: one thread per student with the demo mentor. */
  thread: string
  from: "student" | "mentor"
  fromName: string
  body: string
  at: string
}

export type Slot = {
  id: string
  mentorName: string
  when: string
  focus: string
  bookedBy?: string
  bookingNote?: string
}

export type Post = {
  id: string
  circle: string
  author: string
  body: string
  at: string
}

export const RUBRIC = [
  { id: "community", label: "Community voice", question: "Did the people affected shape the problem and the solution?" },
  { id: "access", label: "Inclusion & accessibility", question: "Does it work for people at the margins, including disabled users?" },
  { id: "iteration", label: "Feedback & iteration", question: "Did feedback visibly change the design?" },
  { id: "story", label: "Impact story", question: "Is it clear who it's for, what changed and why it matters?" },
  { id: "craft", label: "Design craft", question: "Is the work clear, usable and well executed?" },
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
    submittedAt: "Mon 21 Oct, 3:10 pm",
  },
  {
    id: "seed-dev",
    studentName: "Dev Patel",
    title: "Accessible event listings: low-fi prototype",
    activity: "Case study",
    link: "https://example.org/demo/dev-listings",
    summary: "Paper prototype of event listings that show captioning and interpretation up front.",
    reflection: "I need to test with Deaf users directly rather than guessing what they need.",
    submittedAt: "Tue 22 Oct, 10:45 am",
  },
  {
    id: "seed-ari",
    studentName: DEMO_STUDENT,
    title: "Design fundamentals: inclusive form redesign",
    activity: "Basic fundamentals",
    link: "https://example.org/demo/ari-forms",
    summary: "Redesigned a sign-up form with plain language, clear errors and larger tap targets.",
    reflection: "Writing error messages that don't blame people was harder than I expected.",
    submittedAt: "Wed 16 Oct, 6:20 pm",
  },
]

export const SEED_EVALUATIONS: Evaluation[] = [
  {
    id: "seed-eval-ari",
    submissionId: "seed-ari",
    mentorName: DEMO_MENTOR,
    scores: { community: 2, access: 4, iteration: 3, story: 3, craft: 3 },
    strengths: "Your error messages are kind and specific. The accessibility thinking is excellent.",
    nextSteps: "Test the form with two people who'd actually use it, and show what you changed afterwards.",
    at: "Fri 18 Oct, 9:00 am",
  },
]

export const SEED_MESSAGES: Message[] = [
  {
    id: "seed-m1",
    thread: DEMO_STUDENT,
    from: "mentor",
    fromName: DEMO_MENTOR,
    body: "Hi Ari, I left feedback on your form redesign. Happy to talk it through at office hours.",
    at: "Fri 18 Oct, 9:05 am",
  },
  {
    id: "seed-m2",
    thread: DEMO_STUDENT,
    from: "student",
    fromName: DEMO_STUDENT,
    body: "Thank you! How do I find people to test with without making it awkward?",
    at: "Fri 18 Oct, 12:30 pm",
  },
  {
    id: "seed-m3",
    thread: "Maya Okafor",
    from: "student",
    fromName: "Maya Okafor",
    body: "Could you look at my synthesis before Thursday?",
    at: "Mon 21 Oct, 3:15 pm",
  },
]

export const SEED_SLOTS: Slot[] = [
  { id: "slot-1", mentorName: DEMO_MENTOR, when: "Tue 29 Oct, 4:00–4:30 pm PT", focus: "Portfolio reviews" },
  {
    id: "slot-2",
    mentorName: DEMO_MENTOR,
    when: "Thu 31 Oct, 5:00–5:30 pm PT",
    focus: "Research & testing",
    bookedBy: "Maya Okafor",
    bookingNote: "Synthesis feedback",
  },
  { id: "slot-3", mentorName: "Sam Rivera", when: "Wed 30 Oct, 12:00–12:30 pm PT", focus: "Careers & interviews" },
  { id: "slot-4", mentorName: "Sam Rivera", when: "Fri 1 Nov, 9:00–9:30 am PT", focus: "Accessibility" },
]

export const CIRCLES = [
  { id: "research", name: "Research with care", description: "Recruiting, consent, and listening well." },
  { id: "access", name: "Accessibility guild", description: "Share tools, testing tips and wins." },
  { id: "careers", name: "Careers & confidence", description: "Interviews, portfolios, and imposter feelings." },
]

export const SEED_POSTS: Post[] = [
  {
    id: "seed-p1",
    circle: "research",
    author: "Maya Okafor",
    body: "Tip: offer a choice of phone, text or in person for interviews. More people said yes.",
    at: "Sun 20 Oct",
  },
  {
    id: "seed-p2",
    circle: "access",
    author: "Dev Patel",
    body: "Free screen reader testing checklist I've been using, happy to walk anyone through it.",
    at: "Mon 21 Oct",
  },
  {
    id: "seed-p3",
    circle: "careers",
    author: "Lin Zhao",
    body: "Anyone else nervous about talking about their background in interviews? Would love to swap notes.",
    at: "Tue 22 Oct",
  },
]
