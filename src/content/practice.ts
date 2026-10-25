import type { StudioRole } from "@/components/studio/role-badge"
import type { PillarId, ReflectionPromptId } from "@/content/framework"

/**
 * Practice moments: short, SYNTHETIC scenarios where people make a call, then see how BRIDGEGOOD reasons
 * about it. There's never a score or a right answer. A choice stays in the browser tab unless the person
 * shares it.
 *
 * DRAFT. The hackathon team wrote the scenarios and the reasoning from BRIDGEGOOD's brief and framework.
 * BRIDGEGOOD reviews, approves and owns the reasoning. The "what others chose" numbers are made up, to start
 * a conversation, not to rank anyone.
 */

/** The roles practice moments are written for. Each shows with its icon, label and color. */
export const PRACTICE_ROLES = ["apprentice", "mentor", "chapter-lead", "community-partner"] as const satisfies readonly StudioRole[]
export type PracticeRole = (typeof PRACTICE_ROLES)[number]

export type PracticeChoice = {
  id: "a" | "b" | "c"
  /** A short name, used in "what others chose" and in what a mentor sees. */
  short: string
  /** The option as the person reads it. */
  text: string
  /** What this option protects. */
  protects: string
  /** What it costs, and who pays. Every option costs something. */
  cost: string
  /** Synthetic share of people who chose it, in percent. The three add up to 100. */
  others: number
}

export type PracticeMoment = {
  slug: string
  title: string
  /** One line for the index card. */
  teaser: string
  minutes: number
  pillarIds: PillarId[]
  roles: PracticeRole[]
  /** The situation, all synthetic. */
  context: string
  /** What someone says, quoted in the scenario. Synthetic. */
  quote?: { who: string; text: string }
  choices: [PracticeChoice, PracticeChoice, PracticeChoice]
  reasoning: {
    /** BRIDGEGOOD's reasoning in plain words. Draft. */
    paragraphs: string[]
    /** The reflection prompts that matter most here. */
    promptIds: ReflectionPromptId[]
    /** What BRIDGEGOOD teams have often done, and why. Never "the right answer". */
    often: string
  }
}

export const PRACTICE_MOMENTS: PracticeMoment[] = [
  {
    slug: "skip-the-interviews",
    title: "“Can we skip the interviews?”",
    teaser: "The deadline is tight, and your partner wants to go with what staff already know.",
    minutes: 5,
    pillarIds: ["design-for-good", "access-inclusion"],
    roles: ["apprentice", "community-partner"],
    context:
      "You're two weeks into a four-week sprint with a food pantry. The intake form confuses families, and many give up halfway. The pantry director has an idea to save time.",
    quote: {
      who: "The pantry director",
      text: "We're short on time. My staff know what families need. Let's skip the interviews and design from what we know.",
    },
    choices: [
      {
        id: "a",
        short: "Agree",
        text: "Agree. Staff see families every week, and the deadline is real.",
        protects: "The deadline, and the director's trust in the team.",
        cost: "You design for what staff think families need. If staff are wrong, families pay for it, and nobody finds out until the form is live.",
        others: 15,
      },
      {
        id: "b",
        short: "Something small",
        text: "Propose something small: two 20-minute conversations with families at Saturday distribution, then design.",
        protects: "Families' voice in the work, and most of the deadline.",
        cost: "Two conversations aren't a full picture, and they take a Saturday. You need consent, and an interpreter if families want one.",
        others: 62,
      },
      {
        id: "c",
        short: "Push back",
        text: "Push back. Hold the design until there's a full round of interviews, even if the sprint slips.",
        protects: "The principle that the people affected shape the work.",
        cost: "The sprint slips, the partner may lose trust in the team, and families wait longer for a form that works.",
        others: 23,
      },
    ],
    reasoning: {
      paragraphs: [
        "There isn't one right answer here, but the reasoning matters. The director knows a lot, and staff knowledge is real evidence. It's still secondhand: staff see the families who reach the desk, not the ones who gave up on the form.",
        "Pushing back protects the principle but can cost the partner's trust, and a team that loses the partner can't help the families either. Agreeing keeps the deadline but risks designing for staff instead of families.",
      ],
      promptIds: [4, 3, 8],
      often:
        "BRIDGEGOOD teams have often chosen the small option: short conversations where families already are, with consent, and an interpreter when needed. It respects the deadline and the families, and it shows the director what families say in their own words.",
    },
  },
  {
    slug: "the-ai-wrote-the-persona",
    title: "“The AI wrote the persona”",
    teaser: "A teammate used AI to write user personas. They look polished. Nobody talked to anyone.",
    minutes: 5,
    pillarIds: ["responsible-ai", "design-for-good"],
    roles: ["apprentice", "mentor"],
    context:
      "Your team is redesigning sign-up for a youth sports league. A teammate asked an AI tool for three parent personas. They came back with names, photos, quotes and goals, and they look ready for the slide deck. Nobody on the team has talked to a parent yet, and the team shares its research with the partner tomorrow.",
    choices: [
      {
        id: "a",
        short: "Use them",
        text: "Use them as they are. They look right, and the team needs to move.",
        protects: "Tomorrow's meeting, and your teammate's effort.",
        cost: "The partner sees made-up quotes as if parents said them. Decisions rest on the AI's guesses, and the parents it left out stay invisible.",
        others: 12,
      },
      {
        id: "b",
        short: "Keep as guesses",
        text: "Keep them as guesses to check. Label them as AI-written, take out the made-up quotes, and test them in two conversations with parents.",
        protects: "Honesty with the partner, and a starting point the team can use.",
        cost: "More work this week, and an awkward conversation with your teammate about what AI personas can and can't tell you.",
        others: 66,
      },
      {
        id: "c",
        short: "Throw them out",
        text: "Throw them out and start again from interviews only.",
        protects: "Research that comes only from parents.",
        cost: "You lose a useful list of questions to ask, your teammate may feel shut down, and tomorrow's meeting has nothing to show.",
        others: 22,
      },
    ],
    reasoning: {
      paragraphs: [
        "AI is a tool, held to the same standard as any other tool. A persona the AI wrote is a guess about people, written in a confident voice. That makes it easy to forget it's a guess, especially when it has a name and a quote.",
        "The problem isn't that AI was used. It's presenting made-up people as research. Keeping the personas as clearly labelled guesses, and checking them with real parents, keeps the work honest and still uses what the AI got right.",
      ],
      promptIds: [4, 6, 10],
      often:
        "Mentors at BRIDGEGOOD often ask the team to say where AI was used, then turn each persona into questions for parents: “Is this true for you? What's missing?” The answers usually change at least one persona a lot.",
    },
  },
  {
    slug: "pre-tick-the-consent-box",
    title: "“Pre-tick the consent box”",
    teaser: "A partner asks for the newsletter box to be ticked by default, to grow their list.",
    minutes: 6,
    pillarIds: ["ethics-impact", "design-for-good"],
    roles: ["apprentice", "chapter-lead"],
    context:
      "Your team is redesigning a youth sports league's registration form so parents who speak Spanish or Vietnamese can sign up their children. Near the end, the league director makes a request.",
    quote: {
      who: "The league director",
      text: "Can you tick the “Send me news and offers” box by default? We need a bigger list for fundraising, and most parents won't mind.",
    },
    choices: [
      {
        id: "a",
        short: "Tick it",
        text: "Tick it. It's the league's form, and fundraising keeps the league running.",
        protects: "The partner's goal, and a smooth handover.",
        cost: "Parents get messages they didn't choose. Parents who read English less easily are the most likely to miss the box, so they carry most of the cost.",
        others: 9,
      },
      {
        id: "b",
        short: "Offer another way",
        text: "Leave it unticked, explain why, and offer another way to grow the list, like a clear invitation on the confirmation screen.",
        protects: "Parents' choice, and the league's fundraising goal.",
        cost: "The list grows more slowly, and you need a careful conversation with the director about why.",
        others: 71,
      },
      {
        id: "c",
        short: "Remove the box",
        text: "Remove the newsletter box from the form completely.",
        protects: "A short form that only asks what registration needs.",
        cost: "The league loses a way to reach parents who'd like the news, and the director may feel the team ignored their request.",
        others: 20,
      },
    ],
    reasoning: {
      paragraphs: [
        "A pre-ticked box is a small dark pattern: a design trick that pushes people into a choice they didn't mean to make. The people most likely to miss it are the people this form was redesigned for. In some places, like the EU, a pre-ticked box doesn't count as consent at all.",
        "The director's goal is real, though. A league that can't raise money can't run a season. Saying no without offering another way treats the partner as the problem instead of as part of the team.",
      ],
      promptIds: [9, 11, 8],
      often:
        "BRIDGEGOOD teams have often left the box unticked and shown the partner a better way to grow the list, then measured it. A clear invitation at the right moment often gets people who actually want the news.",
    },
  },
  {
    slug: "polish-or-fix",
    title: "“Polish or fix?”",
    teaser: "Two days to Demo Day. You have time to polish the landing page or fix the form, not both.",
    minutes: 5,
    pillarIds: ["craft", "access-inclusion"],
    roles: ["apprentice", "mentor"],
    context:
      "Your capstone is a sign-up site for a tenants' rights group. Demo Day is in two days. The landing page still needs the bold header the partner loved in the sketch. In testing yesterday, you found that a screen reader doesn't read out the form's error messages, and the form doesn't fit on an older phone. You have time for one of them.",
    choices: [
      {
        id: "a",
        short: "Polish the page",
        text: "Polish the landing page. It's what people see first at Demo Day.",
        protects: "A strong first impression, and the partner's excitement.",
        cost: "Tenants who use a screen reader or an older phone still can't sign up, and the site goes live that way.",
        others: 21,
      },
      {
        id: "b",
        short: "Fix the form",
        text: "Fix the form first. Show the plainer page at Demo Day, and explain why.",
        protects: "Tenants who'd otherwise be shut out.",
        cost: "The demo looks less finished, and you have to explain a trade-off in front of people.",
        others: 58,
      },
      {
        id: "c",
        short: "Half of each",
        text: "Split the time and do half of each.",
        protects: "Some progress on both.",
        cost: "Two half-finished things. A form that's half fixed can still stop people from signing up.",
        others: 21,
      },
    ],
    reasoning: {
      paragraphs: [
        "Craft is how clearly the work communicates, and an error message nobody can hear communicates nothing. Polish should serve what the community needs most, not only the portfolio.",
        "That doesn't make the landing page unimportant. People do judge a site by its first screen. But a beautiful page that leads to a form some tenants can't finish isn't good design for them.",
      ],
      promptIds: [7, 8, 11],
      often:
        "Mentors at BRIDGEGOOD often encourage apprentices to fix the form and to talk about the trade-off at Demo Day. Explaining a hard choice clearly is part of the craft, and partners usually remember it.",
    },
  },
]

export function getPracticeMoment(slug: string): PracticeMoment | undefined {
  return PRACTICE_MOMENTS.find((m) => m.slug === slug)
}

/** Where each role area embeds a practice moment, next to the decisions it's about. */
export const PRACTICE_EMBEDS = {
  /** The apprentice's mini project: a registration form for a youth sports league. */
  miniProject: "pre-tick-the-consent-box",
  /** The mentor's Prepare page. */
  mentorPrepare: "the-ai-wrote-the-persona",
  /** The partner toolkit. */
  partnerToolkit: "skip-the-interviews",
} as const
