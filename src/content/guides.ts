import type { ReflectionPromptId } from "@/content/framework"

/**
 * Guides for mentors and ambassadors: mock case and real case how-tos, the AI & Social
 * Good teaching guide, the mentor commitment, and ambassador vetting criteria.
 * Each step says what to do and why, so the reasoning travels with the steps.
 * DRAFT wording for BRIDGEGOOD to review and own. Anything marked `draft` is our
 * proposal until BRIDGEGOOD confirms it. Examples are synthetic.
 */

export type GuideStep = {
  title: string
  /** What to do. */
  do: string
  /** Why it matters. */
  why: string
  /** Reflection prompts (framework.ts) to bring into this step. */
  promptIds?: ReflectionPromptId[]
}

export type HowToGuide = {
  id: string
  title: string
  audience: "mentor" | "ambassador"
  summary: string
  /** Suggested length or timing. */
  timing: string
  steps: GuideStep[]
  /** When to stop and bring in BRIDGEGOOD staff. */
  getHelp: string
  /** What this guide doesn't cover or can't decide. */
  limits: string
  draft: boolean
}

const GET_HELP =
  "If a conversation turns to identity, discrimination or conflict, or a student is dealing with a life challenge, bring in BRIDGEGOOD staff. BRIDGEGOOD's approach to conflict comes from social work, and those conversations need a trained person."

export const MOCK_CASE_GUIDE: HowToGuide = {
  id: "mock-case",
  title: "How to run a mock case",
  audience: "mentor",
  summary:
    "A mock case is a practice project with a made-up partner. Peers play community members. Students can try every step of a real project, and get things wrong, with no real people at risk.",
  timing: "Suggested: 1 to 2 weeks, part time. Adjust to your group. (Draft)",
  steps: [
    {
      title: "Set it up",
      do: "Pick a synthetic brief, such as the Riverside Youth Sports League. Tell students clearly that the organization and the people are made up.",
      why: "Students practice consent, interviews and critique without asking real community members for their time.",
    },
    {
      title: "Listen",
      do: "Students plan two short interviews and run them with peers playing parents. Play a parent yourself once, and give realistic details that don't fit their first idea.",
      why: "The point is to learn that listening changes the plan. A surprise in the role-play makes that real.",
      promptIds: [3, 4],
    },
    {
      title: "Frame the problem",
      do: "Students write one \"How might we…\" question and say what success means for parents, in the parents' words.",
      why: "Defining success in the community's terms is the habit that matters most later, on a real project.",
      promptIds: [8],
    },
    {
      title: "Make and test",
      do: "Students sketch a rough version, then test it with a peer using a screen reader or a translation tool. Try it with the keyboard yourself.",
      why: "Testing early, with different abilities and languages, shows barriers while they're still cheap to fix.",
      promptIds: [7],
    },
    {
      title: "Share and reflect",
      do: "Students submit their work with their own reflection. Read the reflection first, then give feedback. Use the rubric levels to start a conversation, not to grade.",
      why: "Starting from what the student noticed builds confidence and shows them their judgment counts.",
      promptIds: [3, 4, 8],
    },
  ],
  getHelp: GET_HELP,
  limits:
    "A mock case can't teach what real community members will say. It's practice for the real thing, not a test, and there's no pass or fail.",
  draft: true,
}

export const REAL_CASE_GUIDE: HowToGuide = {
  id: "real-case",
  title: "How to support a real case",
  audience: "mentor",
  summary:
    "A real case is a partner project with a real organization and the community it serves. It runs as a four-week sprint and ends at Demo Day, where the team shows a working prototype and explains its choices.",
  timing: "Four weeks, ending at Demo Day.",
  steps: [
    {
      title: "Before week 1: get ready",
      do: "Read the brief and BRIDGEGOOD's review notes. Check there's a community consent plan, and ask your ambassador how community members will be paid for their time. Know which BRIDGEGOOD staff member to contact.",
      why: "Real people are involved now. Consent and payment need to be settled before anyone is asked to share their experience.",
    },
    {
      title: "Week 1: listen",
      do: "Join the kickoff with the partner. Review the team's interview plan and consent script before they talk to anyone.",
      why: "The partner's account of the problem is a starting point to test with the community, not a finding.",
      promptIds: [4, 10],
    },
    {
      title: "Week 2: frame and sketch",
      do: "Ask the team what they heard and who they haven't heard from yet. Ask \"How do you know?\" before \"What do you think?\"",
      why: "Choices need evidence from the people affected. Gaps found now are easier to fill than gaps found at Demo Day.",
      promptIds: [6, 8],
    },
    {
      title: "Week 3: make and test",
      do: "The team tests with community members, including disabled people, on the devices they really use. Check keyboard and screen reader use yourself.",
      why: "Accessibility is part of the work from day one. Hands-on checks catch what reviews of screenshots miss.",
      promptIds: [7, 9],
    },
    {
      title: "Week 4: Demo Day",
      do: "Help the team rehearse. Students present and answer questions. You don't present for them. Make sure the handover pack is ready for the partner.",
      why: "Explaining choices to the partner and mentors builds confidence, and the students get visible credit.",
      promptIds: [11],
    },
    {
      title: "After Demo Day: reflect",
      do: "Join the retrospective with the partner and team. Write growth feedback that starts from each student's self-assessment. Share what you learned with your ambassador.",
      why: "Feedback changes the plan. What this team learned helps the next team and can improve the philosophy.",
    },
  ],
  getHelp: GET_HELP,
  limits:
    "This guide can't tell you whether the community was truly heard. Only the community and the partner can. You don't decide whether a student passes or fails.",
  draft: true,
}

export const MENTOR_GUIDES: HowToGuide[] = [MOCK_CASE_GUIDE, REAL_CASE_GUIDE]

export type TeachingSection = {
  title: string
  /** What to talk about. */
  talkAbout: string
  /** A short activity. Examples are synthetic. */
  tryThis: string
  promptIds: ReflectionPromptId[]
}

/**
 * AI & Social Good teaching guide. A conversation guide for mentors, ambassadors and
 * outside teachers, not a course. Each section takes about 15 to 30 minutes.
 */
export const AI_SOCIAL_GOOD_GUIDE = {
  title: "Teaching AI and social good",
  audience: "Mentors, ambassadors, and teachers or community leaders running a session",
  summary:
    "A guide for talking with students about when AI helps a community and when it causes harm. It goes with the Responsible AI pillar. Use one section per session, or all of them over a few weeks.",
  groundRules: [
    "AI is a tool, held to the same standard as any other tool.",
    "Decisions about people stay with people.",
    "Say when you used AI, and check what it made.",
  ],
  sections: [
    {
      title: "Is AI the right tool here?",
      talkAbout: "Ask what the team would do without AI. Is AI better for the community here, or just faster for us?",
      tryThis:
        "Take a synthetic task, like writing reminder texts for a food pantry. Draft one by hand and one with AI. Compare which one a visitor would understand more easily, and why.",
      promptIds: [8, 1],
    },
    {
      title: "Who does AI leave out?",
      talkAbout:
        "AI tools learn from data that underrepresents many languages, accents, disabilities and communities. Talk about who that leaves out.",
      tryThis:
        "Run an automatic caption tool on two short clips: one with a common accent and one with a less common accent. Count the errors in each, and talk about who would be affected.",
      promptIds: [2, 7],
    },
    {
      title: "Decisions about people stay with people",
      talkAbout: "AI should not decide who gets a service, a grade, or a place in a program. Talk about why a person needs to make those calls.",
      tryThis:
        "Look at a synthetic benefits form that uses AI to flag \"suspicious\" applications. List who could be flagged unfairly, and redesign it so a person reviews every flag.",
      promptIds: [9, 1],
    },
    {
      title: "Say when you used AI",
      talkAbout: "Being open about AI builds trust with partners, employers and the community. Hiding it does the opposite.",
      tryThis: "Rewrite a paragraph of a case study so it says where AI was used, what you checked, and what you changed.",
      promptIds: [9],
    },
    {
      title: "Data and consent",
      talkAbout: "Pasting interview notes into an AI tool can share people's words without their consent. Check what a tool does with data before you use it.",
      tryThis: "Take synthetic interview notes and remove everything that could identify a person before any AI tool sees them.",
      promptIds: [9],
    },
    {
      title: "Let the community shape it",
      talkAbout: "Ask the people affected whether they want AI in the service at all, and what would make them trust it.",
      tryThis: "Write three questions you could ask community members about an AI feature before you build it.",
      promptIds: [10, 12],
    },
  ] satisfies TeachingSection[],
  limits:
    "This guide doesn't make anyone an AI expert, and facts about specific tools change fast. Check current documentation, and follow BRIDGEGOOD's latest guidance on AI tools. AI features in this app are labeled as AI, produce drafts you can edit, and are reviewed by a person at BRIDGEGOOD.",
  draft: true,
}

/** Mentor commitment. DRAFT for BRIDGEGOOD to set. */
export const MENTOR_COMMITMENT = {
  title: "What mentoring asks of you",
  time: "Our draft: about 2 hours a week during a four-week partner sprint, plus office hours at times you choose. BRIDGEGOOD will confirm.",
  commitments: [
    { do: "Show up when you said you would, or tell your student early if you can't.", why: "Students plan around you, often alongside work and family." },
    { do: "Start from the student's own reflection before you give feedback.", why: "It shows their judgment counts, and it tells you what they already noticed." },
    { do: "Ask questions before giving answers.", why: "Students learn more by making the decision and owning the result." },
    { do: "Make feedback specific and kind, and connect it to a pillar.", why: "Vague praise or criticism doesn't help anyone improve." },
    { do: "Share your real career path, including detours.", why: "There's more than one definition of success. Don't steer students toward yours." },
    {
      do: "Keep students' work, stories and messages private unless they say you can share them.",
      why: "Consent comes first, and trust is hard to rebuild.",
    },
    { do: "Bring in BRIDGEGOOD staff for conflict, discrimination or life challenges.", why: "Those conversations need a trained person." },
    { do: "Don't promise jobs or referrals you can't give.", why: "A broken promise hurts more than no promise." },
    { do: "Tell BRIDGEGOOD how mentoring is going, and ask your student how it's landing.", why: "Feedback changes the plan, for mentors too." },
  ],
  bridgegoodOffers:
    "Our draft: training before you start, a named BRIDGEGOOD staff contact, and credit for your time. BRIDGEGOOD will confirm what it offers mentors.",
  draft: true,
}

/**
 * Ambassador vetting criteria. BRIDGEGOOD vets ambassadors through conversation and
 * references, not a scored form. DRAFT for BRIDGEGOOD to confirm.
 */
export const AMBASSADOR_VETTING = {
  title: "What BRIDGEGOOD looks for in an ambassador",
  howItWorks:
    "Vetting happens in conversation with BRIDGEGOOD staff, plus references. BRIDGEGOOD makes the final decision. This app never scores or ranks applicants, and AI is never used to vet people.",
  criteria: [
    {
      name: "Understands the core commitments",
      lookFor: "Can explain in their own words why the community defines the problem, and why the designers' growth counts as an outcome.",
    },
    {
      name: "Real ties to a community",
      lookFor: "Already works with local nonprofits, schools or community groups, or has a clear plan to build those ties with local partners.",
    },
    { name: "Time to do it well", lookFor: "Can give steady time to a cohort, around their day job. (BRIDGEGOOD will set the expected hours.)" },
    {
      name: "Open about conflicts of interest",
      lookFor: "Says openly if their employer could benefit, for example by wanting free design work. Company hosts don't choose which problems the chapter takes on.",
    },
    {
      name: "A plan to remove barriers locally",
      lookFor: "Thinks about how to cover costs for students, such as seats, meals, software and transportation, with sponsors.",
    },
    {
      name: "Sends learning back to BRIDGEGOOD",
      lookFor: "Agrees to send adaptation notes and retrospectives to BRIDGEGOOD, and to credit BRIDGEGOOD as the author of the philosophy.",
    },
    { name: "Handles conflict with care", lookFor: "Knows when a situation needs BRIDGEGOOD staff, and hands it over." },
    { name: "Protects privacy", lookFor: "Won't collect sensitive personal data about students or community members." },
  ],
  neverAsked:
    "Vetting never asks about race, ethnicity, gender, income, immigration status, religion or health. Who a chapter serves is discussed in conversation, never stored as a form field.",
  draft: true,
}
