/**
 * Design Decision Lab scenarios. All SYNTHETIC: no real participants, organizations or stories.
 * There is no "correct" answer. Each approach shows benefits, risks, and who might be helped or left out,
 * so people practice judgment rather than chase a score.
 */
export type Approach = {
  id: string
  label: string
  benefits: string[]
  risks: string[]
  helped: string[]
  leftOut: string[]
}

export type Perspective = { who: string; says: string }

export type Scenario = {
  slug: string
  title: string
  theme: string
  situation: string
  context: string[]
  approaches: Approach[]
  perspectives: Perspective[]
  /** Practice Library resources that help take this into practice. */
  related: string[]
  /** Highlighted for company hosts on the workplace page. */
  workplace?: boolean
}

export const REFLECTION_PROMPTS = [
  { id: "assumption", label: "What assumption did you make?" },
  { id: "voice", label: "Whose voice would you seek next?" },
  { id: "change", label: "What would make you change your mind?" },
] as const

export type ReflectionPromptId = (typeof REFLECTION_PROMPTS)[number]["id"]

export const LAB_SCENARIOS: Scenario[] = [
  {
    slug: "community-service-redesign",
    title: "A community service is being redesigned",
    theme: "Limited budgets and unequal access",
    situation:
      "The team has a limited budget and a tight timeline. Some users want a simple mobile-first service; others have limited data access, use older devices, or need support in a language not yet offered.",
    context: [
      "The service helps residents book appointments at a neighborhood benefits office.",
      "Funding covers eight weeks of design and build.",
      "Most current users book by phone, and phone lines are overloaded.",
    ],
    approaches: [
      {
        id: "mobile-first",
        label: "Prioritize a mobile-first launch to reach the largest number quickly.",
        benefits: ["Fastest relief for the overloaded phone lines", "Fits the budget and timeline"],
        risks: ["Bakes in barriers that are expensive to remove later", "May look like success while the hardest-to-reach drop away"],
        helped: ["People with recent smartphones and data plans", "Staff, if call volume drops"],
        leftOut: ["People with limited data or older devices", "People who need another language", "People who rely on someone else to book"],
      },
      {
        id: "consult-first",
        label: "Pause to consult people who face access barriers before finalizing the design.",
        benefits: ["Designs around real constraints, not assumptions", "Builds trust with people often overlooked"],
        risks: ["Uses scarce time, so something else must be cut", "Consultation can become a box-ticking exercise if nothing changes"],
        helped: ["People facing access barriers, whose needs shape the core design"],
        leftOut: ["People waiting for relief now, if the launch slips"],
      },
      {
        id: "pilot",
        label: "Pilot a smaller, more accessible version with a representative group, then iterate.",
        benefits: ["Real evidence before scaling", "Keeps momentum while including people facing barriers"],
        risks: ["A 'representative' group is hard to recruit well", "A small pilot can stall without a plan to scale"],
        helped: ["Pilot participants, and everyone after if lessons are acted on"],
        leftOut: ["People outside the pilot, for now"],
      },
    ],
    perspectives: [
      { who: "A resident who books for an elderly neighbor", says: "I don't need an app. I need someone to pick up the phone, or a text I can reply to." },
      { who: "The office manager", says: "Our staff spend half the day on hold queues. Anything that reduces calls helps everyone." },
      { who: "A funder", says: "We need to report numbers at eight weeks. Reach matters to us." },
      { who: "A community organizer", says: "If you design for the people who are easiest to reach, you'll never hear from the rest." },
    ],
    related: ["who-might-be-left-out", "small-pilot-planner", "listening-session-planner"],
  },
  {
    slug: "feedback-challenges-plan",
    title: "Feedback that challenges the original plan",
    theme: "Responding to feedback that challenges the team's plan",
    situation:
      "Two weeks before handover, testing with community members shows the new sign-up flow confuses people who are new to the country. Fixing it properly means reworking the core flow.",
    context: [
      "The partner organization is happy with the current design.",
      "The team has already presented the design publicly.",
      "Three of eight testers couldn't finish signing up.",
    ],
    approaches: [
      {
        id: "ship",
        label: "Ship as planned and note the issue for a later phase.",
        benefits: ["Keeps the commitment to the partner", "Avoids rework under pressure"],
        risks: ["Teaches testers that their feedback doesn't change anything", "'Later' often never comes"],
        helped: ["The team's schedule", "People who found the flow easy"],
        leftOut: ["Newcomers, the group that struggled most"],
      },
      {
        id: "rework",
        label: "Tell the partner what you found and rework the core flow.",
        benefits: ["Acts on evidence", "Shows the community their input matters"],
        risks: ["Handover slips", "The partner may lose confidence in the team"],
        helped: ["Newcomers", "Trust between the team, partner and community"],
        leftOut: ["Anyone waiting on the original date"],
      },
      {
        id: "interim",
        label: "Ship with a supported path (a helper line or paper option) while you fix the flow.",
        benefits: ["Nobody is locked out in the meantime", "Keeps most of the timeline"],
        risks: ["The workaround becomes permanent", "Extra load on partner staff"],
        helped: ["Newcomers, through the supported path"],
        leftOut: ["People who won't ask for help, even when it's offered"],
      },
    ],
    perspectives: [
      { who: "A tester who couldn't finish", says: "I thought I was doing something wrong. I almost gave up." },
      { who: "The partner's program lead", says: "We loved the design. I'd rather know now than after launch, but I need a plan." },
      { who: "A team member", says: "We're exhausted. Reworking this now feels impossible." },
    ],
    related: ["iteration-decision-log", "prototype-feedback-guide", "difficult-conversation-guide"],
  },
  {
    slug: "participant-story-permission",
    title: "A powerful story, and a question of permission",
    theme: "Ethical use of participant stories and creative work",
    situation:
      "During interviews, a participant shared a moving story about losing housing. The partner wants to feature it, with a photo, on their fundraising page. The participant agreed to an interview, not to publicity.",
    context: [
      "The participant said 'use whatever helps' at the end of the interview.",
      "The fundraising campaign launches next week.",
      "The story would likely raise significant funds for the partner.",
    ],
    approaches: [
      {
        id: "use",
        label: "Use it: they said 'use whatever helps'.",
        benefits: ["Could raise funds that help many people"],
        risks: ["'Use whatever helps' isn't informed consent to publicity", "Exposure could harm the participant, and future trust"],
        helped: ["The campaign"],
        leftOut: ["The participant's control over their own story"],
      },
      {
        id: "ask",
        label: "Go back and ask, explaining exactly where and how it would appear, with a real option to say no.",
        benefits: ["Respects dignity and consent", "The participant can shape how they're shown"],
        risks: ["They may say no", "Takes time before the launch"],
        helped: ["The participant", "Long-term trust between the partner and community"],
        leftOut: ["The campaign's timeline"],
      },
      {
        id: "anonymize",
        label: "Use an anonymized, composite version without the photo.",
        benefits: ["Shares the lesson without exposing anyone"],
        risks: ["Composites can still identify people in small communities", "Less emotionally powerful"],
        helped: ["Privacy"],
        leftOut: ["The participant's own choice, if they'd have wanted to be named"],
      },
    ],
    perspectives: [
      { who: "The participant", says: "I wanted to help other people avoid what happened to me. I didn't think about my face being online." },
      { who: "The partner's fundraiser", says: "Real stories move people. Without them, we raise less, and help fewer families." },
      { who: "A BRIDGEGOOD steward", says: "No story, photo or piece of work is used without explicit permission. That isn't negotiable." },
    ],
    related: ["community-interview-guide", "participation-representation-guide"],
  },
  {
    slug: "conflicting-stakeholder-needs",
    title: "The partner and the community want different things",
    theme: "Conflicting stakeholder needs",
    situation:
      "A youth center asks for a polished website to attract donors. In listening sessions, the young people who use the center say what they need is a simple way to find out what's on this week, from their phones.",
    context: ["The partner is funding staff time for the project.", "Young people's needs and donors' needs overlap only partly.", "There's capacity for one main deliverable."],
    approaches: [
      {
        id: "partner",
        label: "Build what the partner asked for: they're the client.",
        benefits: ["Clear brief, happy partner", "Donations could fund more programs"],
        risks: ["The people the center serves aren't served by the design"],
        helped: ["The partner", "Donors"],
        leftOut: ["The young people who use the center"],
      },
      {
        id: "community",
        label: "Build what the young people asked for, and explain why.",
        benefits: ["Serves the people closest to the challenge"],
        risks: ["The partner may feel overruled", "Funding gaps could hurt the center"],
        helped: ["Young people"],
        leftOut: ["The partner's fundraising goal"],
      },
      {
        id: "together",
        label: "Bring both together to agree what success means, then scope a shared first step.",
        benefits: ["Surfaces the overlap", "Partner and young people shape the decision"],
        risks: ["Takes facilitation skill", "Power imbalances can still drown out young voices"],
        helped: ["Everyone, if facilitated with care"],
        leftOut: ["No one obviously, but quieter voices can still be missed"],
      },
    ],
    perspectives: [
      { who: "A 16-year-old at the center", says: "Nobody reads a website. Just tell me on my phone if there's basketball tonight." },
      { who: "The center's director", says: "Without donors, there is no basketball tonight." },
      { who: "A mentor", says: "Ask what each side would count as success. You might be surprised how much they share." },
    ],
    related: ["stakeholder-influence-map", "facilitating-viewpoints", "community-project-brief"],
  },
  {
    slug: "team-conflict-trust",
    title: "A comment in critique that landed badly",
    theme: "Trust, conflict resolution, bias and identity",
    situation:
      "In a design critique, a team member says another's idea is 'too niche', referring to a feature for Spanish-speaking parents. The designer who proposed it, who grew up translating for their own parents, goes quiet for the rest of the week.",
    context: ["The team is four weeks into an eight-week project.", "The comment was made in front of the whole team and a mentor.", "Nobody has raised it since."],
    approaches: [
      {
        id: "move-on",
        label: "Let it go: it was one comment, and the project is on track.",
        benefits: ["Avoids an uncomfortable conversation"],
        risks: ["The designer's lived experience is silenced", "The team loses a perspective it needs"],
        helped: ["Short-term comfort"],
        leftOut: ["The designer", "Spanish-speaking parents"],
      },
      {
        id: "private",
        label: "Check in privately with the designer first, then decide together what to do.",
        benefits: ["Puts the affected person's wishes first", "Builds trust"],
        risks: ["The wider team may never reflect on it"],
        helped: ["The designer"],
        leftOut: ["The team's shared learning, unless it follows"],
      },
      {
        id: "team",
        label: "Name it in the next team session, framed around how we critique, not who said what.",
        benefits: ["The whole team learns", "Sets expectations for respectful critique"],
        risks: ["Can feel like public blame", "May put the designer on the spot"],
        helped: ["Team norms"],
        leftOut: ["The designer, if they weren't asked first"],
      },
    ],
    perspectives: [
      { who: "The designer who proposed the feature", says: "It's not niche to me. It's my whole childhood." },
      { who: "The team member who made the comment", says: "I meant we have limited time. I didn't mean it like that." },
      { who: "The mentor", says: "If a conversation needs more support than I can give, I bring in BRIDGEGOOD staff." },
    ],
    related: ["conflict-reflection", "difficult-conversation-guide", "mentor-conversation-starters"],
  },
  {
    slug: "limited-budget-unequal-access",
    title: "An accessibility fix versus a launch date",
    theme: "Workplace: limited budgets and unequal access",
    workplace: true,
    situation:
      "At a company, a product team is a week from launching a new payment feature. An accessibility review finds that screen reader users can't complete payment. Fixing it pushes the launch past a marketing campaign that's already paid for.",
    context: ["The company sponsors a BRIDGEGOOD chapter.", "Leadership has publicly committed to inclusive design.", "About one in fifty current customers uses a screen reader (synthetic figure)."],
    approaches: [
      {
        id: "launch",
        label: "Launch on time and fix it in the next release.",
        benefits: ["Keeps the campaign and revenue on track"],
        risks: ["Some customers can't pay at all", "Contradicts the public commitment"],
        helped: ["The campaign", "Most customers"],
        leftOut: ["Screen reader users"],
      },
      {
        id: "delay",
        label: "Delay the launch until everyone can pay.",
        benefits: ["Nobody is locked out", "Matches what the company says it values"],
        risks: ["Lost campaign spend", "Pressure on the team"],
        helped: ["Screen reader users", "Trust in the company's commitments"],
        leftOut: ["The campaign's timing"],
      },
      {
        id: "partial",
        label: "Launch to a smaller group, test with disabled customers, and widen when it works for them.",
        benefits: ["Keeps some momentum", "Evidence from the people affected"],
        risks: ["The smaller group still excludes people", "Can be used to delay a fix indefinitely"],
        helped: ["Disabled customers who are included in testing"],
        leftOut: ["Everyone outside the first group, for now"],
      },
    ],
    perspectives: [
      { who: "A blind customer", says: "When I can't pay, I don't wait for the next release. I switch providers." },
      { who: "The marketing lead", says: "We can't get this money back. Is there a middle path?" },
      { who: "An engineer", says: "The fix is two days. The hard part is admitting we missed it." },
    ],
    related: ["accessibility-review-prompts", "who-might-be-left-out", "small-pilot-planner"],
  },
]

export const scenarioBySlug = (slug: string) => LAB_SCENARIOS.find((s) => s.slug === slug)
