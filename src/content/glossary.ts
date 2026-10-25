/**
 * Terms of reference: each term gets a concrete, practical meaning so that words like
 * "inclusion" or "social good" don't turn into branding.
 * DRAFT wording for BRIDGEGOOD to review and own.
 */
export const GLOSSARY: { term: string; definition: string; inPractice: string }[] = [
  {
    term: "Design for Social Good",
    definition: "BRIDGEGOOD's philosophy of design that serves community benefit and grows the confidence, access and economic mobility of the people doing it.",
    inPractice: "A project counts when the community shaped it, it works for people at the margins, and the designers grew through it.",
  },
  {
    term: "Social impact",
    definition: "A real, observable change for a community, such as time saved, access gained, or trust built.",
    inPractice: "Describe it in the community's terms, with evidence. Avoid vanity measures like page views.",
  },
  {
    term: "Lived experience",
    definition: "Knowledge that comes from living through something, rather than studying it.",
    inPractice: "Treated as expertise: in research, in hiring and mentoring, and in a student's own portfolio story.",
  },
  {
    term: "Community voice",
    definition: "The people affected by a problem take part in defining it and judging the solution.",
    inPractice: "Co-design sessions, paid participation, and community sign-off before a capstone is called done.",
  },
  {
    term: "Inclusion",
    definition: "Changing who decides, not only who is invited.",
    inPractice: "Overlooked groups are named at the start of a project, and they hold real decision-making roles.",
  },
  {
    term: "Access / accessibility",
    definition: "Everyone, including disabled people, can perceive, understand, use and afford what is designed.",
    inPractice: "WCAG 2.2 AA as the minimum, plus testing with disabled people, plain language, and low-bandwidth options.",
  },
  {
    term: "Human-centred design",
    definition: "Designing around user needs. It's a foundation BRIDGEGOOD builds on, not the whole philosophy.",
    inPractice: "Design for Social Good adds who benefits, who holds power, and who grows through the work.",
  },
  {
    term: "Partner (problem owner)",
    definition: "A non-profit or social organisation that brings a real problem and stays involved throughout the project.",
    inPractice: "Shares context, connects the team with the community (with consent), and gives feedback on the result.",
  },
  {
    term: "Capstone project",
    definition: "A scoped, real-world project from a partner, completed by a student team with mentor support.",
    inPractice: "It has a brief, community involvement, a handover, and a reflection.",
  },
  {
    term: "Ambassador",
    definition: "A BRIDGEGOOD-vetted person who carries the philosophy into a city or organisation.",
    inPractice: "Recruits partners and mentors, secures resources, and feeds learnings back to BRIDGEGOOD.",
  },
  {
    term: "Chapter",
    definition: "A local group led by an ambassador that runs projects and community events.",
    inPractice: "Adapts the philosophy to local context while keeping its core commitments.",
  },
  {
    term: "Mentor",
    definition: "A working professional who supports students with care, honesty and industry insight.",
    inPractice: "Gives feedback against the principles, holds office hours, and shares real career paths.",
  },
  {
    term: "Community of practice",
    definition: "A peer group of students learning together around a shared topic.",
    inPractice: "Students swap tips, review each other's work, and support each other through job searches.",
  },
  {
    term: "Consent",
    definition: "Clear, informed, revocable agreement to take part or to have your story or work used.",
    inPractice: "No personal stories, images, portfolios or artwork are used without explicit permission.",
  },
]

export const COMPARISON = {
  approaches: ["Human-centred design", "Design thinking (as a process)", "Pro-bono / CSR design", "Design for Social Good"],
  rows: [
    {
      question: "Who defines the problem?",
      answers: ["The design team, informed by user research", "The team, using workshops", "The client or the company", "The community and the partner, with the team"],
    },
    {
      question: "Who does the design work?",
      answers: ["Professional designers", "Cross-functional teams", "Volunteer professionals", "Emerging designers from under-represented backgrounds, with mentors"],
    },
    {
      question: "How is accessibility treated?",
      answers: ["Often a later consideration", "Varies by team", "Varies by volunteer", "A requirement from day one, tested with disabled people"],
    },
    {
      question: "What counts as success?",
      answers: ["A usable product", "A validated concept", "A delivered deliverable", "Community benefit and growth for the designers"],
    },
    {
      question: "What happens afterwards?",
      answers: ["The product ships", "Handover", "Engagement ends", "Feedback improves the philosophy, and the designers carry it into their careers"],
    },
  ],
}
