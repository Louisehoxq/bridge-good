/**
 * Student self-check: "Is this a good fit for me right now?"
 * Questions only. Nothing the person types or picks is stored or sent anywhere, and
 * the answers decide nothing. BRIDGEGOOD sets the official criteria.
 * Asks about goals and barriers in the person's own words, never about identity.
 * DRAFT wording for BRIDGEGOOD to review.
 */
export const OFFICIAL_CRITERIA_URL = "https://bridgegood.com/apprenticeship"

export type SelfCheckQuestion = {
  id: string
  question: string
  hint?: string
  /** "open": think it through or write notes. "choice": pick one of `options`. */
  answerType: "open" | "choice"
  options?: string[]
}

export const SELF_CHECK = {
  title: "Is this a good fit for you right now?",
  intro:
    "These questions are just for you. Nothing you type or choose here is saved or sent, and your answers don't decide anything. They can help you think it through, or get ready to talk with BRIDGEGOOD.",
  privacy: "This self-check never asks about your income, race, ethnicity, gender, immigration status or health.",
  officialCriteria: {
    text: "BRIDGEGOOD sets the official eligibility criteria. Read them on the Apprenticeship page.",
    href: OFFICIAL_CRITERIA_URL,
  },
  questions: [
    {
      id: "hopes",
      question: "What do you hope to be able to do after the program?",
      hint: "For example: get a first design job, freelance, use design in the work you do now, or find out if design is for you.",
      answerType: "open",
    },
    {
      id: "interest",
      question: "What kind of design work interests you, and why?",
      answerType: "open",
    },
    {
      id: "experience",
      question: "What have you lived through or learned that could help you understand the people you design for?",
      hint: "Languages, places you've lived, jobs, caring for family, or anything else. You don't need design experience.",
      answerType: "open",
    },
    {
      id: "time",
      question: "Do you have time for regular sessions, practice and a team project during the program?",
      answerType: "choice",
      options: ["Yes", "Not sure yet", "Not right now"],
    },
    {
      id: "barriers",
      question: "What might make it hard to take part?",
      hint: "For example: money, work shifts, caring for family, transportation, or not having a computer. BRIDGEGOOD may be able to help with some of these, so it's worth asking.",
      answerType: "open",
    },
    {
      id: "feedback",
      question: "How do you feel about getting feedback on your work and explaining your choices to others?",
      hint: "It's OK to feel nervous. The question is whether you're open to trying.",
      answerType: "open",
    },
    {
      id: "location",
      question: "Can you take part from where you live, and in the program's time zone?",
      hint: "Check the Apprenticeship page for where and when the program runs.",
      answerType: "choice",
      options: ["Yes", "Not sure yet", "No"],
    },
  ] satisfies SelfCheckQuestion[],
  /** From BRIDGEGOOD's public pages. Always check the official page for current details. */
  whatBridgegoodProvides: {
    source: "From BRIDGEGOOD's public pages. Check the official page for current details.",
    items: [
      "No tuition, and no income share agreements",
      "Professional design software",
      "Meals and snacks during sessions",
      "One-to-one coaching and support",
      "Introductions to working professionals",
    ],
  },
  next: "If you're not sure about an answer, that's fine. Bring your questions to BRIDGEGOOD. A person, not this page, helps you decide.",
}
