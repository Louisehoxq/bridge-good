import { PILLARS } from "@/content/framework"
import type { AmbassadorKind, Role, Session } from "@/lib/roles"

/**
 * Each role's path: the stages a person moves through, in order. Stages link to the page in the
 * role area where the work happens, and to the library pages (`learn`) that support it.
 * Stage wording is DRAFT for BRIDGEGOOD to review.
 */
export type PathStage = {
  id: string
  title: string
  summary: string
  /** Where the work for this stage happens. */
  href: string
  /** Library pages that belong to this stage. */
  learn: { label: string; href: string }[]
}

export type PathKey = "student" | "mentor" | "chapter-lead" | "company-host" | "partner"

const pillarLinks = PILLARS.map((p) => ({ label: p.name, href: `/learn/pillars/${p.id}` }))

export const PATHS: Record<PathKey, { title: string; home: string; stages: PathStage[] }> = {
  student: {
    title: "Your apprentice path",
    home: "/student/path",
    stages: [
      {
        id: "bootcamp",
        title: "Bootcamp",
        summary: "Learn the five pillars and practice the basic skills behind each one.",
        href: "/student/activities#fundamentals",
        learn: [{ label: "Apprentice track", href: "/learn/tracks/apprentices" }, ...pillarLinks],
      },
      {
        id: "mini-project",
        title: "Mini project",
        summary: "Run a mock case end to end, with peers playing community members, and submit it for a growth conversation.",
        href: "/student/activities#mock-case",
        learn: [{ label: "The 12 reflection prompts", href: "/learn/prompts" }],
      },
      {
        id: "choose-project",
        title: "Choose a project",
        summary: "Read the open briefs from community partners and tell your chapter lead which one you'd like to work on, and why.",
        href: "/student/projects",
        learn: [],
      },
      {
        id: "capstone",
        title: "Capstone",
        summary: "A four-week partner project with a team and a mentor. It ends at Demo Day, where you show your work and explain your choices.",
        href: "/student/submissions",
        learn: [{ label: "Teaching AI and social good", href: "/learn/guides/ai-and-social-good" }],
      },
      {
        id: "alumni",
        title: "Alumni",
        summary: "Two portfolio pieces with evidence behind them. Many alumni come back as mentors or start a chapter.",
        href: "/student/path#alumni",
        learn: [
          { label: "Mentor track", href: "/learn/tracks/mentors" },
          { label: "What mentoring asks of you", href: "/learn/guides/mentor-commitment" },
        ],
      },
    ],
  },
  mentor: {
    title: "Your mentor path",
    home: "/mentor/prepare",
    stages: [
      {
        id: "prepare",
        title: "Prepare",
        summary: "Read the framework, what mentoring asks of you, and how growth conversations work.",
        href: "/mentor/prepare",
        learn: [
          { label: "Mentor track", href: "/learn/tracks/mentors" },
          { label: "What mentoring asks of you", href: "/learn/guides/mentor-commitment" },
          ...pillarLinks,
        ],
      },
      {
        id: "meet",
        title: "Meet your mentee",
        summary: "Ask how they're doing and what they hope to get from the program before you talk about the work.",
        href: "/mentor/mentee",
        learn: [],
      },
      {
        id: "mock-case",
        title: "Support a mock case",
        summary: "Play a community member once, then hold a growth conversation on their mini project.",
        href: "/mentor/submissions",
        learn: [{ label: "How to run a mock case", href: "/learn/guides/mock-case" }],
      },
      {
        id: "real-case",
        title: "Support a real case",
        summary: "Guide a team through a four-week partner project, from kickoff to Demo Day.",
        href: "/mentor/mentee",
        learn: [
          { label: "How to support a real case", href: "/learn/guides/real-case" },
          { label: "Teaching AI and social good", href: "/learn/guides/ai-and-social-good" },
        ],
      },
      {
        id: "final",
        title: "Final conversation",
        summary: "Join the retrospective, write growth feedback from each apprentice's self-assessment, and tell your chapter lead what you learned.",
        href: "/mentor/submissions",
        learn: [{ label: "The 12 reflection prompts", href: "/learn/prompts" }],
      },
    ],
  },
  "chapter-lead": {
    title: "Your chapter lead playbook",
    home: "/ambassador/playbook",
    stages: [
      {
        id: "vetted",
        title: "Get vetted",
        summary: "Talk with BRIDGEGOOD staff about why you want to start a chapter. BRIDGEGOOD makes the decision.",
        href: "/ambassador/playbook#vetted",
        learn: [{ label: "What BRIDGEGOOD looks for", href: "/learn/guides/ambassador-vetting" }],
      },
      {
        id: "adapt",
        title: "Adapt locally",
        summary: "Decide what your chapter adapts for its community, and what stays the same everywhere.",
        href: "/ambassador/playbook#adapt",
        learn: [
          { label: "Adapt, don't copy", href: "/learn/guides/adapt-locally" },
          { label: "Chapter lead track", href: "/learn/tracks/ambassadors" },
        ],
      },
      {
        id: "recruit",
        title: "Find partners and mentors",
        summary: "Bring in community partners with real problems, and mentors, including alumni and community members.",
        href: "/ambassador/projects",
        learn: [{ label: "Inclusive language guide", href: "/learn/guides/inclusive-language" }],
      },
      {
        id: "match",
        title: "Match teams",
        summary: "Read what apprentices said about the briefs, talk with them, and form teams with a mentor.",
        href: "/ambassador/matching",
        learn: [],
      },
      {
        id: "milestones",
        title: "Sprint to Demo Day",
        summary: "Keep each four-week project on track: kickoff, weekly check-ins, Demo Day and handover.",
        href: "/ambassador/matching#milestones",
        learn: [{ label: "How to support a real case", href: "/learn/guides/real-case" }],
      },
      {
        id: "send-back",
        title: "Send learning back",
        summary: "Run a retrospective and send BRIDGEGOOD what you changed, why, and what happened.",
        href: "/ambassador/playbook#send-back",
        learn: [{ label: "Adapt, don't copy", href: "/learn/guides/adapt-locally" }],
      },
    ],
  },
  "company-host": {
    title: "Your company host playbook",
    home: "/ambassador/playbook",
    stages: [
      {
        id: "vetted",
        title: "Get vetted",
        summary: "Talk with BRIDGEGOOD staff, and say openly how your company could benefit.",
        href: "/ambassador/playbook#vetted",
        learn: [{ label: "What BRIDGEGOOD looks for", href: "/learn/guides/ambassador-vetting" }],
      },
      {
        id: "make-the-case",
        title: "Make the case inside your company",
        summary: "Secure time for mentors, funding for seats and meals, and a room to meet in.",
        href: "/ambassador/toolkits",
        learn: [{ label: "Company host track", href: "/learn/tracks/company-hosts" }],
      },
      {
        id: "host-mentors",
        title: "Host mentors",
        summary: "Bring colleagues in as mentors, and prepare them with the mentor track and commitment.",
        href: "/ambassador/playbook#host-mentors",
        learn: [
          { label: "What mentoring asks of you", href: "/learn/guides/mentor-commitment" },
          { label: "Mentor track", href: "/learn/tracks/mentors" },
        ],
      },
      {
        id: "sponsor",
        title: "Sponsor a partner project",
        summary: "Fund a project a chapter has already taken on. Partners and the chapter choose the problems, not your company.",
        href: "/ambassador/projects",
        learn: [],
      },
      {
        id: "demo-day",
        title: "Demo Day",
        summary: "Host Demo Day, credit the apprentices, and open doors to interviews.",
        href: "/ambassador/matching#milestones",
        learn: [],
      },
      {
        id: "send-back",
        title: "Send learning back",
        summary: "Tell BRIDGEGOOD what your company changed in its own product work, and what got in the way.",
        href: "/ambassador/playbook#send-back",
        learn: [{ label: "Adapt, don't copy", href: "/learn/guides/adapt-locally" }],
      },
    ],
  },
  partner: {
    title: "Your partner path",
    home: "/partner/project",
    stages: [
      {
        id: "share",
        title: "Share a problem",
        summary: "Describe what isn't working, and how the people you serve will shape the work.",
        href: "/partner/submit",
        learn: [{ label: "The 12 reflection prompts", href: "/learn/prompts" }],
      },
      {
        id: "review",
        title: "BRIDGEGOOD review",
        summary: "A person at BRIDGEGOOD reads your brief, asks questions, and looks for a chapter and team.",
        href: "/partner/project",
        learn: [],
      },
      {
        id: "matched",
        title: "Meet your team",
        summary: "A chapter lead matches apprentices and a mentor to your project.",
        href: "/partner/project#team",
        learn: [],
      },
      {
        id: "sprint",
        title: "Four-week sprint",
        summary: "Kickoff, weekly check-ins, and helping the team hear from your community, with consent.",
        href: "/partner/project#timeline",
        learn: [{ label: "How a real case runs", href: "/learn/guides/real-case" }],
      },
      {
        id: "demo-day",
        title: "Demo Day and handover",
        summary: "The team shows a working prototype and explains its choices. You get a handover pack.",
        href: "/partner/project#timeline",
        learn: [],
      },
      {
        id: "feedback",
        title: "Tell us how it went",
        summary: "Share what changed for the people you serve, and what didn't work. It goes to BRIDGEGOOD.",
        href: "/partner/project#feedback",
        learn: [],
      },
    ],
  },
}

export function pathKeyFor(session: Session): PathKey {
  return session.role === "ambassador" ? ((session.ambassadorKind ?? "chapter-lead") satisfies AmbassadorKind) : (session.role satisfies Role)
}
