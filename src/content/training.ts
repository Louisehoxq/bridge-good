import type { PillarId } from "@/content/framework"

/**
 * Training materials per audience. DRAFT curriculum outlines. Videos and downloads
 * are placeholders until BRIDGEGOOD supplies real assets.
 */
export const AUDIENCES = ["student", "mentor", "ambassador", "company"] as const
export type Audience = (typeof AUDIENCES)[number]

export type Module = {
  title: string
  format: "Video" | "One-pager" | "Workshop" | "Self-paced"
  duration: string
  summary: string
  outcomes: string[]
  /** Framework pillars this module teaches (see framework.ts). */
  pillarIds?: PillarId[]
}

export type TrainingTrack = {
  label: string
  tagline: string
  intro: string
  modules: Module[]
  /** One-page explainer: what designing for good means for this audience. */
  explainer: { heading: string; body: string }[]
  /** IDs from problems.ts used as example case studies. */
  caseStudies: string[]
}

export const TRAINING: Record<Audience, TrainingTrack> = {
  student: {
    label: "For students",
    tagline: "Build skills, confidence and a portfolio on real community work.",
    intro: "Start here before your first project. Each module pairs a design skill with one of the five pillars behind it.",
    modules: [
      {
        title: "What Design for Social Good means",
        format: "Video",
        duration: "12 min",
        summary: "The philosophy, the five pillars, and how your work connects to the community and to BRIDGEGOOD.",
        outcomes: ["Explain the philosophy in your own words", "Say what each pillar asks of you"],
        pillarIds: ["design-for-good"],
      },
      {
        title: "Your lived experience as design insight",
        format: "Workshop",
        duration: "60 min",
        summary: "Recognize how your own experience helps you notice what others miss.",
        outcomes: ["Draft your designer story", "Spot assumptions others might miss"],
        pillarIds: ["design-for-good", "access-inclusion"],
      },
      {
        title: "Listening before designing",
        format: "Self-paced",
        duration: "45 min",
        summary: "Interviewing with care, consent and curiosity.",
        outcomes: ["Plan a respectful interview", "Get informed consent"],
        pillarIds: ["design-for-good"],
      },
      {
        title: "Accessibility from day one",
        format: "Self-paced",
        duration: "50 min",
        summary: "WCAG basics, testing with disabled people, and plain language.",
        outcomes: ["Find and fix common accessibility barriers", "Write in plain language"],
        pillarIds: ["access-inclusion"],
      },
      {
        title: "Using AI with care",
        format: "Workshop",
        duration: "45 min",
        summary: "When AI helps, when it doesn't, how to check its output, and how to say where you used it.",
        outcomes: ["Decide whether AI is the right tool for a task", "Check and disclose AI-made content"],
        pillarIds: ["responsible-ai"],
      },
      {
        title: "Clear layouts and strong hierarchy",
        format: "Self-paced",
        duration: "50 min",
        summary: "Layout, type, spacing and writing that put what people need most first.",
        outcomes: ["Order a screen by what the community needs first", "Design error and empty states"],
        pillarIds: ["craft"],
      },
      {
        title: "Spotting harmful patterns",
        format: "Workshop",
        duration: "45 min",
        summary: "Dark patterns, collecting too much data, and risky defaults, and how to redesign them.",
        outcomes: ["Name a harmful pattern in a real product", "Redesign it so people stay in control"],
        pillarIds: ["ethics-impact"],
      },
      {
        title: "Telling an impact story",
        format: "One-pager",
        duration: "10 min",
        summary: "Turn a project into a portfolio case study that shows what changed and how you know.",
        outcomes: ["Structure a case study", "Describe outcomes honestly"],
        pillarIds: ["design-for-good", "ethics-impact"],
      },
    ],
    explainer: [
      {
        heading: "Your experience counts as insight",
        body: "Your background, languages and experiences help you see problems others miss. Use them as evidence in research and in your portfolio.",
      },
      {
        heading: "The community helps decide",
        body: "You design with the people affected, not only for them. They help decide what the problem is and whether your solution works.",
      },
      {
        heading: "What a real project gives you",
        body: "A portfolio piece with evidence behind it, feedback from working designers, and people who can speak to your work.",
      },
    ],
    caseStudies: ["library-digital-skills", "refugee-welcome-kit"],
  },
  mentor: {
    label: "For mentors",
    tagline: "Support students with BRIDGEGOOD's care, tone and expectations.",
    intro: "Mentoring here is about more than critique. It's about confidence, belonging and honest insight into industry.",
    modules: [
      {
        title: "What it means to design for good (explainer)",
        format: "One-pager",
        duration: "8 min",
        summary: "The philosophy and the five pillars in one page, with example case studies.",
        outcomes: ["Describe what makes this different from pro bono work"],
        pillarIds: ["design-for-good"],
      },
      {
        title: "Mentoring with care",
        format: "Video",
        duration: "15 min",
        summary: "Tone, encouragement, and noticing when a student feels they don't belong.",
        outcomes: ["Give feedback that builds confidence", "Ask before advising"],
      },
      {
        title: "Growth conversations with the rubric",
        format: "Workshop",
        duration: "45 min",
        summary:
          "Start from the student's own reflection. Use the rubric levels to talk about where the work is now and what to try next. The levels are not a pass or fail.",
        outcomes: ["Use the rubric levels consistently", "Write next steps the student can act on"],
        pillarIds: ["design-for-good", "access-inclusion", "craft"],
      },
      {
        title: "Running mock cases and real cases",
        format: "One-pager",
        duration: "15 min",
        summary: "How to guide a practice project, and how to support a team on a real partner project.",
        outcomes: ["Run a mock case session", "Support a team through a four-week partner sprint"],
      },
      {
        title: "Teaching AI and social good",
        format: "One-pager",
        duration: "15 min",
        summary: "Questions and examples for talking with students about when AI helps a community and when it causes harm.",
        outcomes: ["Lead a 30-minute conversation on AI with students"],
        pillarIds: ["responsible-ai", "ethics-impact"],
      },
      {
        title: "Difficult conversations",
        format: "Workshop",
        duration: "60 min",
        summary:
          "How BRIDGEGOOD handles identity, bias and conflict, using an approach that comes from social work, and when to bring in trained staff.",
        outcomes: ["Respond calmly to conflict", "Know when to bring in BRIDGEGOOD staff"],
      },
      {
        title: "Sharing your real path",
        format: "Self-paced",
        duration: "20 min",
        summary: "Talk about careers without steering students toward one definition of success.",
        outcomes: ["Share several career paths honestly"],
      },
    ],
    explainer: [
      {
        heading: "Start with encouragement and trust",
        body: "Students do their best work when they feel they belong. Ask how they're doing before you talk about the work.",
      },
      {
        heading: "Make feedback specific and usable",
        body: "Name what works, then one or two things to try next. Connect each point to a pillar or a reflection prompt.",
      },
      { heading: "Students lead", body: "Ask questions before giving answers. Let students make the decisions, and credit them visibly." },
    ],
    caseStudies: ["wheelchair-transit-map", "library-digital-skills"],
  },
  ambassador: {
    label: "For ambassadors",
    tagline: "Start a chapter in your city or organization, and send what you learn back to BRIDGEGOOD.",
    intro:
      "Ambassadors are vetted by BRIDGEGOOD. It prepares you to start a chapter, adapt the philosophy locally, and gather support.",
    modules: [
      {
        title: "The philosophy in depth",
        format: "Video",
        duration: "20 min",
        summary: "The pillars, the principles, where they come from, and the core commitments every chapter keeps.",
        outcomes: ["Explain what makes this different from other social impact design"],
      },
      {
        title: "Adapt, don't copy",
        format: "Workshop",
        duration: "60 min",
        summary: "What stays the same everywhere, and what to adapt for your community.",
        outcomes: ["Draft a local adaptation plan"],
      },
      {
        title: "Vetting and matching",
        format: "Self-paced",
        duration: "30 min",
        summary: "How BRIDGEGOOD vets ambassadors, and how you match students, mentors and partners without collecting sensitive data.",
        outcomes: ["Run a vetting conversation", "Match a team to a partner project"],
      },
      {
        title: "Recruiting partners & problem owners",
        format: "Self-paced",
        duration: "40 min",
        summary: "Find, onboard and support partners, with example case studies.",
        outcomes: ["Use the Problem Owner Toolkit"],
      },
      {
        title: "Making the case inside your organization",
        format: "Workshop",
        duration: "45 min",
        summary: "Secure funding, mentors and resources from your company.",
        outcomes: ["Use the Organization Toolkit", "Write a proposal"],
      },
      {
        title: "Closing the loop",
        format: "One-pager",
        duration: "10 min",
        summary: "Collecting feedback and sharing what you learn with BRIDGEGOOD.",
        outcomes: ["Run a cohort retrospective"],
      },
    ],
    explainer: [
      {
        heading: "What you can change, and what stays the same",
        body: "You adapt how the philosophy is practiced in your community: focus areas, languages, schedules and partners. BRIDGEGOOD keeps authorship and the core commitments, and approves any change to them.",
      },
      { heading: "Open doors", body: "Use your position to bring students and community members into rooms where decisions are made." },
      {
        heading: "Send what you learn back",
        body: "After each project, write a short note: what you changed, why, and what happened. BRIDGEGOOD reviews it and may add it to the philosophy, with credit to your chapter.",
      },
    ],
    caseStudies: ["refugee-welcome-kit", "wheelchair-transit-map"],
  },
  company: {
    label: "For companies",
    tagline: "Learn how to host mentors and partner projects, and use the approach in your own product work.",
    intro: "For partner companies and corporate stakeholders who fund, host or mentor, and want to learn from the approach.",
    modules: [
      {
        title: "Why Design for Social Good",
        format: "Video",
        duration: "10 min",
        summary: "How it differs from corporate social responsibility (CSR) programs and pro bono design, and what it means for your products.",
        outcomes: ["Explain the business and community case"],
      },
      {
        title: "Inclusive design in product teams",
        format: "Workshop",
        duration: "90 min",
        summary: "Apply the pillars to your own roadmap and research practice.",
        outcomes: ["Check one product flow for who it leaves out"],
        pillarIds: ["access-inclusion", "ethics-impact"],
      },
      {
        title: "Hosting mentors & partner projects",
        format: "One-pager",
        duration: "10 min",
        summary: "What partnering with a chapter involves: time, people and funding.",
        outcomes: ["Scope a partnership"],
      },
      {
        title: "Hiring for potential",
        format: "Self-paced",
        duration: "30 min",
        summary: "Recognize talent from nontraditional paths in portfolios and interviews.",
        outcomes: ["Change one step in how you interview"],
      },
    ],
    explainer: [
      {
        heading: "What your company gives and gets",
        body: "You give mentors' time, funding or space. You get products tested with more kinds of people, and a wider pool of designers to hire from.",
      },
      { heading: "Respect the community's lead", body: "Partners and communities define problems. Companies support rather than steer." },
      { heading: "Credit and authorship", body: "The philosophy is BRIDGEGOOD's. Partners practice it with attribution." },
    ],
    caseStudies: ["library-digital-skills"],
  },
}
