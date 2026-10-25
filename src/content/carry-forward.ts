/**
 * The carry-it-forward kit: everything a teacher, organizer or design lead outside BRIDGEGOOD needs to run
 * a critique circle with BRIDGEGOOD's Design for Social Good framework, keep its core commitments, credit
 * BRIDGEGOOD, and tell BRIDGEGOOD what they changed.
 *
 * DRAFT. The hackathon team wrote this from the framework and the "Adapt, don't copy" guide. BRIDGEGOOD
 * reviews, approves and owns the wording.
 */

export const KIT = {
  title: "Run a critique circle in your community",
  forWho:
    "For teachers, community organizers and design leads who want to practice BRIDGEGOOD's Design for Social Good approach without BRIDGEGOOD staff in the room. You don't need to be a designer.",
  facts: [
    { icon: "clock", label: "60 minutes" },
    { icon: "users", label: "4 to 12 people" },
    { icon: "file-text", label: "One piece of work to discuss" },
    { icon: "printer", label: "Printed prompt cards" },
  ],
  materials: [
    "One piece of work the group can see: a flyer, a form, a website, a sign or a sketch. Real or practice.",
    "The 12 prompt cards on this page, printed and cut out.",
    "Paper and pens, or a shared document, to write down what you notice.",
    "Someone to keep time. They can take part too.",
  ],
  steps: [
    {
      title: "Set up",
      minutes: 5,
      text: "Agree how you'll talk: be kind, credit other people's ideas, and don't share anyone's personal story without their permission.",
    },
    {
      title: "Share the work",
      minutes: 10,
      text: "Someone shows the work and says who it's for. The group asks questions to understand it, not to judge it yet.",
    },
    {
      title: "Critique with the prompts",
      minutes: 30,
      text: "Draw three prompt cards. Talk through each one. Write down what you notice, not who's right. If someone the work is for is in the room, they speak first.",
    },
    {
      title: "Decide one change",
      minutes: 10,
      text: "Agree on one change you'll test with the people the work is for. Say how you'll ask them, and when.",
    },
    {
      title: "Tell BRIDGEGOOD",
      minutes: 5,
      text: "Share what you changed about the session and what didn't fit your community, using the form at the end of this page.",
    },
  ],
  keep: [
    "The people affected by the work help shape it, not only react to it.",
    "Access from day one: different abilities, devices, languages, money and time.",
    "Credit people's ideas, and BRIDGEGOOD as the author of the framework.",
    "No personal stories or photos of people without their permission.",
  ],
  adapt: ["Language and examples", "Timing and group size", "Which prompts you use, and how many", "Where you meet, in person or online"],
  credit: (version: string, group: string) =>
    `Based on BRIDGEGOOD's Design for Social Good framework, version ${version} (bridgegood.com). Adapted by ${group || "[your group]"}.`,
} as const

/** Kinds of group that run the kit. A choice, so nobody has to describe themselves in free text. */
export const GROUP_TYPES = {
  classroom: { label: "A school or college class", noun: "a school or college class" },
  "community-org": { label: "A community organization", noun: "a community organization" },
  "youth-program": { label: "A youth or library program", noun: "a youth or library program" },
  "faith-group": { label: "A faith or cultural group", noun: "a faith or cultural group" },
  workplace: { label: "A team at work", noun: "a team at work" },
  other: { label: "Another kind of group", noun: "a community group" },
} as const satisfies Record<string, { label: string; noun: string }>

export type GroupType = keyof typeof GROUP_TYPES
