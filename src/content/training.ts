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
    intro: "Start here before your first project. Each module pairs a design skill with the Design for Social Good mindset behind it.",
    modules: [
      { title: "What Design for Social Good means", format: "Video", duration: "12 min", summary: "The philosophy, the impact loop, and your place in it.", outcomes: ["Explain the philosophy in your own words", "Name the six principles"] },
      { title: "Your story is a strength", format: "Workshop", duration: "60 min", summary: "Recognise how your lived experience gives you design insight.", outcomes: ["Draft your designer story", "Spot assumptions others might miss"] },
      { title: "Listening before designing", format: "Self-paced", duration: "45 min", summary: "Interviewing with care, consent and curiosity.", outcomes: ["Plan a respectful interview", "Get informed consent"] },
      { title: "Accessibility from day one", format: "Self-paced", duration: "50 min", summary: "WCAG basics, testing with disabled people, plain language.", outcomes: ["Run a basic accessibility check", "Write in plain language"] },
      { title: "Telling an impact story", format: "One-pager", duration: "10 min", summary: "Turn a project into a portfolio case study that speaks for itself.", outcomes: ["Structure a case study", "Describe outcomes honestly"] },
    ],
    explainer: [
      { heading: "You're a designer already", body: "Your background, languages and experiences help you see problems others miss." },
      { heading: "Community first", body: "You design with the people affected, not for them, and they help decide what good looks like." },
      { heading: "Grow while you give", body: "Real projects build skills, relationships with mentors and a portfolio employers trust." },
    ],
    caseStudies: ["library-digital-skills", "refugee-welcome-kit"],
  },
  mentor: {
    label: "For mentors",
    tagline: "Support students with BRIDGEGOOD's care, tone and expectations.",
    intro: "Mentoring here is about more than critique. It's about confidence, belonging and honest insight into industry.",
    modules: [
      { title: "What it means to design for good (explainer)", format: "One-pager", duration: "8 min", summary: "The philosophy in one page, with example case studies.", outcomes: ["Describe what makes this different from pro-bono work"] },
      { title: "Mentoring with care", format: "Video", duration: "15 min", summary: "Tone, encouragement, and recognising imposter feelings.", outcomes: ["Give feedback that builds confidence", "Ask before advising"] },
      { title: "Evaluating against the principles", format: "Workshop", duration: "45 min", summary: "Use the rubric to assess community voice, accessibility, iteration, story and craft.", outcomes: ["Score consistently", "Write useful next steps"] },
      { title: "Difficult conversations", format: "Workshop", duration: "60 min", summary: "A social-worker-informed approach to identity, bias and conflict, and when to involve staff.", outcomes: ["Respond calmly to conflict", "Know when to escalate"] },
      { title: "Sharing your real path", format: "Self-paced", duration: "20 min", summary: "Talk about careers without steering students towards one definition of success.", outcomes: ["Present multiple paths honestly"] },
    ],
    explainer: [
      { heading: "Care is the method", body: "Encouragement and trust come first. Students do their best work when they feel they belong." },
      { heading: "Feedback that grows people", body: "Be specific, kind and actionable. Always connect feedback to the principles." },
      { heading: "Students lead", body: "Ask questions before giving answers. Credit students visibly." },
    ],
    caseStudies: ["wheelchair-transit-map", "library-digital-skills"],
  },
  ambassador: {
    label: "For ambassadors",
    tagline: "Carry the philosophy into your city and organisation, responsibly.",
    intro: "Ambassadors are vetted by BRIDGEGOOD. This track prepares you to start a chapter, adapt the philosophy locally, and rally support.",
    modules: [
      { title: "The philosophy in depth", format: "Video", duration: "20 min", summary: "Principles, origins and what must not be diluted.", outcomes: ["Explain what makes this distinctive"] },
      { title: "Adapt, don't copy", format: "Workshop", duration: "60 min", summary: "What stays the same everywhere, and what to adapt for your community.", outcomes: ["Draft a local adaptation plan"] },
      { title: "Recruiting partners & problem owners", format: "Self-paced", duration: "40 min", summary: "Find, onboard and support partners with real case studies.", outcomes: ["Use the Problem Owner Toolkit"] },
      { title: "Making the case inside your organisation", format: "Workshop", duration: "45 min", summary: "Secure funding, mentors and resources from your company.", outcomes: ["Use the Organisation Toolkit", "Write a proposal"] },
      { title: "Closing the loop", format: "One-pager", duration: "10 min", summary: "Collecting feedback and sharing learnings back with BRIDGEGOOD.", outcomes: ["Run a cohort retrospective"] },
    ],
    explainer: [
      { heading: "A steward, not a franchise", body: "You adapt the philosophy to your community, while BRIDGEGOOD keeps authorship and the core commitments." },
      { heading: "Open doors", body: "Use your position to bring students and community members into rooms where decisions are made." },
      { heading: "Feedback keeps it alive", body: "What your chapter learns improves the philosophy for everyone." },
    ],
    caseStudies: ["refugee-welcome-kit", "wheelchair-transit-map"],
  },
  company: {
    label: "For companies",
    tagline: "Bring inclusive, community-centred design into your products and culture.",
    intro: "For partner companies and corporate stakeholders who fund, host or mentor, and want to learn from the approach.",
    modules: [
      { title: "Why Design for Social Good", format: "Video", duration: "10 min", summary: "How it differs from CSR and pro-bono design, and why it matters for products.", outcomes: ["Explain the business and community case"] },
      { title: "Inclusive design in product teams", format: "Workshop", duration: "90 min", summary: "Apply the principles to your own roadmap and research practice.", outcomes: ["Audit one product flow for inclusion"] },
      { title: "Hosting mentors & capstones", format: "One-pager", duration: "10 min", summary: "What partnering with a chapter involves: time, people and funding.", outcomes: ["Scope a partnership"] },
      { title: "Hiring for potential", format: "Self-paced", duration: "30 min", summary: "Recognise talent from non-traditional paths in portfolios and interviews.", outcomes: ["Adjust interview practice"] },
    ],
    explainer: [
      { heading: "More than giving back", body: "Partnering builds inclusive products, a stronger talent pipeline, and real community trust." },
      { heading: "Respect the community's lead", body: "Partners and communities define problems. Companies support rather than steer." },
      { heading: "Credit and authorship", body: "The philosophy is BRIDGEGOOD's. Partners practise it with attribution." },
    ],
    caseStudies: ["library-digital-skills"],
  },
}
