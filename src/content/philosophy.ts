import type { IconName } from "@/components/icon"

/**
 * BRIDGEGOOD's Design for Social Good philosophy, as drafted in the Welcome Page and Community Playbook concept.
 * DRAFT wording: review with BRIDGEGOOD so it reflects the organization's own language and approved practice.
 */

export type Principle = {
  id: string
  number: string
  title: string
  body: string
  /** The question to return to: principles are questions, not rules. */
  question: string
  /** Why it matters: the reasoning behind the principle. */
  reasoning: string
  /** A concrete design choice that shows the principle at work, with the generic alternative. */
  example: { choice: string; generic: string }
}

export const PRINCIPLES: Principle[] = [
  {
    id: "people-first",
    number: "01",
    title: "Start with people, not assumptions.",
    body: "Listen to lived experiences. Understand the context before jumping to solutions. Let the people closest to a challenge help shape what comes next.",
    question: "Who is affected by this design, and whose perspective might be missing?",
    reasoning:
      "The people closest to a challenge know things a design team can't see from a distance: what they've already tried, what they're afraid of, what a good day looks like. Starting from assumptions tends to solve the team's idea of the problem.",
    example: {
      choice: "Before sketching a food pantry booking flow, the team spends two sessions with visitors, and learns many book by phone for a neighbor.",
      generic: "The team designs an app from a survey, then 'validates' it with people who already use apps.",
    },
  },
  {
    id: "every-voice",
    number: "02",
    title: "Make room for every voice.",
    body: "Recognize whose perspectives are missing, confront barriers and bias, and create conditions for people to participate with dignity.",
    question: "Who isn't in the room yet, and what would make it possible for them to take part with dignity?",
    reasoning:
      "Inclusion means changing who decides, not only who is invited. Barriers such as language, disability, schedule, cost and trust decide who shows up, so they have to be removed on purpose.",
    example: {
      choice: "Interviews are offered by phone, text or in person, in three languages, at times that work around shift work, and participants are paid.",
      generic: "An online form in English is shared on social media, and whoever replies becomes 'the users'.",
    },
  },
  {
    id: "confidence",
    number: "03",
    title: "Build confidence, not dependency.",
    body: "Help people recognize their strengths, make informed choices, and see themselves as creators and problem-solvers.",
    question: "When this work ends, what can people do for themselves that they couldn't before?",
    reasoning:
      "BRIDGEGOOD's work is as much about the people doing the design as the design itself. Real responsibility, honest feedback and many definitions of success build confidence that lasts beyond one project.",
    example: {
      choice: "An emerging designer presents their own decisions to the partner, and the mentor stays in the background.",
      generic: "A senior designer presents the work, and the emerging designer's contribution goes unnamed.",
    },
  },
  {
    id: "learn-adapt",
    number: "04",
    title: "Learn, adapt, and give back.",
    body: "Treat feedback as a responsibility. Learn from what works and what doesn't, improve with the community, and share what you've learned.",
    question: "What did we learn from the people involved, and who else could use it?",
    reasoning:
      "Feedback that changes nothing teaches people not to give it. Acting on feedback, even when it's harder than the easiest option for the organization, keeps the work honest and the philosophy alive.",
    example: {
      choice: "A pilot shows older visitors struggle with the new flow; the team changes it and shares what they learned in the Playbook.",
      generic: "The team ships on schedule and files the feedback for 'phase two'.",
    },
  },
]

export type CycleStageId = "understand" | "practice" | "reflect" | "teach"

export type CycleStage = {
  id: CycleStageId
  number: number
  title: string
  tagline: string
  description: string
  question: string
  icon: IconName
  /** Where this stage lives on the site. */
  href: string
  places: { label: string; href: string }[]
}

export const CYCLE: CycleStage[] = [
  {
    id: "understand",
    number: 1,
    title: "Understand",
    tagline: "Explore the values and the reasoning behind them.",
    description:
      "Understand what Design for Social Good means at BRIDGEGOOD, why it matters, and how it differs from generic claims about inclusion or human-centered design.",
    question: "Who is affected by this design, and whose perspective might be missing?",
    icon: "book-open",
    href: "/understand",
    places: [{ label: "Understand", href: "/understand" }],
  },
  {
    id: "practice",
    number: 2,
    title: "Practice",
    tagline: "Put the mindset to work in a real or simulated situation.",
    description: "Apply the philosophy through projects, exercises, and conversations rather than only reading about it.",
    question: "How might we work with the people affected, rather than design for them from a distance?",
    icon: "pencil-ruler",
    href: "/lab",
    places: [
      { label: "Decision Lab", href: "/lab" },
      { label: "Practice Library", href: "/library" },
    ],
  },
  {
    id: "reflect",
    number: 3,
    title: "Reflect and Share",
    tagline: "Make learning visible without treating every experience as a success story.",
    description:
      "Examine what happened, what you learned, whose needs were met or missed, and what you would change. Sharing should be constructive, respectful, and privacy-conscious.",
    question: "What did we learn from the people involved, and what evidence changed our assumptions?",
    icon: "sticky-note",
    href: "/playbook",
    places: [{ label: "Living Playbook", href: "/playbook" }],
  },
  {
    id: "teach",
    number: 4,
    title: "Teach and Evolve",
    tagline: "Help the philosophy travel through people and communities.",
    description:
      "Alumni, mentors, educators, chapter leads, and partners pass on the mindset while adapting examples and methods to their local context, with BRIDGEGOOD's authorship and core values kept clear.",
    question: "How can someone else use what we learned, and what should be improved before it is shared more widely?",
    icon: "users",
    href: "/teach",
    places: [{ label: "Teach & Facilitate", href: "/teach" }],
  },
]

export const AUDIENCES = ["student", "alumnus", "mentor-volunteer", "chapter-partner-educator", "company-host"] as const
export type Audience = (typeof AUDIENCES)[number]

export type Pathway = {
  id: Audience
  title: string
  body: string
  cta: string
  icon: IconName
  /** The Practice Library role filter that fits this audience. */
  libraryRole: string
  /** One suggestion per cycle stage, so people can enter wherever makes sense. */
  steps: Record<CycleStageId, { label: string; href: string; why: string }>
}

export const PATHWAYS: Pathway[] = [
  {
    id: "student",
    title: "I'm a student",
    body: "Discover the mindset, develop your voice, and apply it to real-world challenges.",
    cta: "Start exploring",
    icon: "sprout",
    libraryRole: "student",
    steps: {
      understand: { label: "The principles behind the practice", href: "/understand", why: "Four questions to return to, with the reasoning behind each." },
      practice: { label: "Try a scenario in the Decision Lab", href: "/lab/community-service-redesign", why: "Make a real trade-off and see who it helps and who it leaves out." },
      reflect: { label: "Weekly reflection prompts", href: "/library/weekly-reflection", why: "Short prompts to notice what changed your thinking this week." },
      teach: { label: "Share a lesson in the Living Playbook", href: "/playbook/contribute", why: "What you learned might help the next student." },
    },
  },
  {
    id: "alumnus",
    title: "I'm an alumnus",
    body: "Bring the philosophy into your career, mentor others, and share lessons from practice.",
    cta: "Continue your journey",
    icon: "route",
    libraryRole: "alumnus",
    steps: {
      understand: { label: "How this differs from generic human-centered design", href: "/understand#different", why: "Language for explaining the approach at work and in interviews." },
      practice: { label: "Responding to feedback that challenges the plan", href: "/lab/feedback-challenges-plan", why: "A workplace dilemma many alumni recognize." },
      reflect: { label: "Career decision reflection", href: "/library/career-decision-reflection", why: "Make an informed choice instead of following one definition of success." },
      teach: { label: "Mentor onboarding guide", href: "/library/mentor-onboarding", why: "Pass on what you were given." },
    },
  },
  {
    id: "mentor-volunteer",
    title: "I'm a mentor or volunteer",
    body: "Find facilitation guides, reflection prompts, and practical ways to support others.",
    cta: "Access the toolkit",
    icon: "message-circle-heart",
    libraryRole: "mentor",
    steps: {
      understand: { label: "Build confidence, not dependency", href: "/understand#confidence", why: "The principle that most shapes how you mentor." },
      practice: { label: "Mentor–student conversation starters", href: "/library/mentor-conversation-starters", why: "Open a conversation that starts from the student's own view." },
      reflect: { label: "Conflict reflection prompts", href: "/library/conflict-reflection", why: "Make sense of a tense moment, with care." },
      teach: { label: "Facilitator and mentor guides", href: "/teach#guides", why: "Run a session without needing the core team in the room." },
    },
  },
  {
    id: "chapter-partner-educator",
    title: "I'm a chapter, partner, or educator",
    body: "Adapt the approach to your community while keeping its values at the center.",
    cta: "Bring it to your community",
    icon: "map-pin",
    libraryRole: "chapter",
    steps: {
      understand: { label: "What's foundational and what can adapt", href: "/teach#adapt", why: "Keep the core while making it fit your community." },
      practice: { label: "Community-centered project brief", href: "/library/community-project-brief", why: "Plan a project with the people affected." },
      reflect: { label: "Local adaptations in the Playbook", href: "/playbook?type=adaptation", why: "See how other communities adapted tools, and what they kept." },
      teach: { label: "Chapter starter kit", href: "/library/chapter-starter-kit", why: "Everything you need to start practicing together." },
    },
  },
  {
    id: "company-host",
    title: "I'm a company host",
    body: "Host mentors, sponsor partner projects, and carry the approach into your own product work, without steering what communities work on.",
    cta: "Bring it to your company",
    icon: "building-2",
    libraryRole: "company",
    steps: {
      understand: { label: "Why companies support rather than steer", href: "/host/guide", why: "The host guide, including where the line is." },
      practice: { label: "Workplace scenarios in the Decision Lab", href: "/lab/limited-budget-unequal-access", why: "Budget, timeline and access trade-offs you'll meet at work." },
      reflect: { label: "Share a workplace reflection", href: "/playbook/contribute?about=workplace", why: "Tell BRIDGEGOOD what changed in your own product work." },
      teach: { label: "Organization toolkit", href: "/host/toolkit", why: "Make the case inside your company, and recruit mentors." },
    },
  },
]

export const isAudience = (v: unknown): v is Audience => typeof v === "string" && (AUDIENCES as readonly string[]).includes(v)
