/**
 * A critique circle anyone can run without BRIDGEGOOD staff in the room. Used as the template for
 * critique-circle events. DRAFT wording for BRIDGEGOOD to review.
 */
export const CRITIQUE_CIRCLE = {
  title: "Run a critique circle in your community",
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
      title: "Critique with the principles",
      minutes: 30,
      text: "Take the four principles as questions. Talk through each one. Write down what you notice, not who's right. If someone the work is for is in the room, they speak first.",
    },
    {
      title: "Decide one change",
      minutes: 10,
      text: "Agree on one change you'll test with the people the work is for. Say how you'll ask them, and when.",
    },
    {
      title: "Reflect and share",
      minutes: 5,
      text: "Note what you learned and what didn't fit your community, then share it in the Living Playbook.",
    },
  ],
  keep: [
    "The people affected by the work help shape it, not only react to it.",
    "Access from day one: different abilities, devices, languages, money and time.",
    "Credit people's ideas, and BRIDGEGOOD as the author of the philosophy.",
    "No personal stories or photos of people without their permission.",
  ],
} as const
