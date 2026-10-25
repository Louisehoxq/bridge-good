/**
 * Terms of reference: each term gets a concrete, practical meaning so that words like
 * "inclusion" or "social good" don't turn into branding.
 * `notThis` says what the term doesn't mean. `missingWhen` says how you'd notice it's missing.
 * DRAFT wording for BRIDGEGOOD to review and own.
 */
export const GLOSSARY: { term: string; definition: string; inPractice: string; notThis?: string; missingWhen?: string }[] = [
  {
    term: "Design for Social Good",
    definition:
      "BRIDGEGOOD's philosophy of design. The work must help the community it's for, and grow the confidence, access and earning power of the people doing it.",
    inPractice: "A project counts when the community shaped it, it works for the people most likely to be left out, and the designers grew through it.",
    notThis: "A cause area (\"we did a project for a food bank\") or a feeling of having helped.",
    missingWhen: "Nobody from the community saw the work before it was called done, or the student team isn't credited.",
  },
  {
    term: "Social impact",
    definition: "A real change for a community that you can see, such as time saved, a service people can now reach, or trust built.",
    inPractice:
      "Describe it in the community's words, with evidence. Numbers that only look good, like page views or downloads, don't count on their own.",
  },
  {
    term: "Lived experience",
    definition: "Knowledge that comes from living through something, rather than studying it.",
    inPractice: "Treated as expertise: in research, in hiring and mentoring, and in a student's own portfolio story.",
  },
  {
    term: "Community voice",
    definition: "The people affected by a problem take part in defining it and judging the solution.",
    inPractice:
      "Design sessions with community members, paying people for their time, and community sign-off before a project is called done.",
  },
  {
    term: "Inclusion",
    definition: "Changing who decides, not only who is invited.",
    inPractice: "The groups most likely to be left out are named at the start of a project, and they hold real decision-making roles.",
    notThis: "A diverse stock photo, an \"everyone welcome\" line, or asking people after the decisions are made.",
    missingWhen: "Personas were invented instead of met, or the same voices speak in every critique.",
  },
  {
    term: "Access / accessibility",
    definition:
      "Everyone, including disabled people, can perceive, understand, use and afford what is designed, and can take part in the program that makes it. That covers ability, cost, time, tools, devices, language, reading level and networks.",
    inPractice:
      "WCAG 2.2 AA as the minimum, plus testing with disabled people, plain language, options that work on a slow connection, and removing costs that keep people from taking part.",
    notThis: "An accessibility check added at the end, or a \"free\" program with hidden costs like unpaid time or required equipment.",
    missingWhen: "The work assumes a laptop, fast internet or a reading level above grade 8, or people drop out for money or time reasons and nobody asks why.",
  },
  {
    term: "Human-centered design",
    definition: "Designing around user needs. It's a foundation BRIDGEGOOD builds on, not the whole philosophy.",
    inPractice: "Design for Social Good adds who benefits, who holds power, and who grows through the work.",
    notThis: "A method name, a persona deck, or an AI feature with \"human in the loop\" in small print.",
    missingWhen: "The first and last thing a person meets is a form or a chatbot, and nobody can tell who reviews their work.",
  },
  {
    term: "Evidence over assumption",
    definition: "Design choices rest on what you heard and saw from the people affected, not on guesses or invented personas.",
    inPractice: "Every major choice in a case study points to an interview, a test or partner feedback that led to it.",
  },
  {
    term: "Apprentice",
    definition: "The word BRIDGEGOOD uses for people in its programs. In this app, the same person uses the \"student\" role.",
    inPractice: "Apprentices pay no tuition, work on real projects, and get coaching and introductions to working professionals.",
  },
  {
    term: "Partner (problem owner)",
    definition: "A nonprofit or community organization that brings a real problem and stays involved throughout the project.",
    inPractice: "Shares context, connects the team with the community (with consent), and gives feedback on the result.",
  },
  {
    term: "Capstone project",
    definition:
      "The final project in a student's training: a real problem from a partner, worked on by a student team with mentor support. Partner projects run as a four-week sprint that ends at Demo Day.",
    inPractice: "It has a brief, community involvement, a handover, and a reflection.",
  },
  {
    term: "Demo Day",
    definition: "The last day of a partner project sprint. The team shows a working prototype and explains its choices to the partner and mentors.",
    inPractice: "The partner hears what the team learned from the community, and decides what to use.",
  },
  {
    term: "Ambassador",
    definition: "A person vetted by BRIDGEGOOD who carries the philosophy into a city or organization.",
    inPractice: "Recruits partners and mentors, secures resources, and sends what they learn back to BRIDGEGOOD.",
  },
  {
    term: "Chapter",
    definition: "Proposed chapter model (concept): a local group led by an ambassador that runs projects and community events.",
    inPractice: "Adapts the philosophy to local needs while keeping its core commitments.",
  },
  {
    term: "Mentor",
    definition: "A working professional, alum or community member who supports students with care, honesty and industry insight.",
    inPractice: "Starts from the student's own reflection, holds office hours, and shares real career paths.",
  },
  {
    term: "Community of practice",
    definition: "A peer group of students learning together around a shared topic.",
    inPractice: "Students swap tips, review each other's work, and support each other through job searches.",
  },
  {
    term: "Pillar",
    definition: "One of the five areas students learn in: Design for Good, Accessibility & Inclusion, Responsible AI, Good Design Craft, and Ethics & Impact.",
    inPractice: "Each pillar has a learning outcome and a few reflection prompts that come up at real decision points.",
  },
  {
    term: "Reflection prompt",
    definition: "One of 12 open questions that help people check a decision against the philosophy, such as \"Who might be left out?\"",
    inPractice: "Shown at the moment a choice is made. People answer in their own words, and nobody scores the answers.",
  },
  {
    term: "Consent",
    definition: "Clear, informed agreement, which can be taken back at any time, to take part or to have your story or work used.",
    inPractice: "No personal stories, images, portfolios or artwork are used without explicit permission.",
  },
]

export const COMPARISON = {
  approaches: ["Human-centered design", "Design thinking (as a process)", "Pro bono or corporate volunteer design", "Design for Social Good"],
  rows: [
    {
      question: "Who defines the problem?",
      answers: ["The design team, informed by user research", "The team, using workshops", "The client or the company", "The community and the partner, with the team"],
    },
    {
      question: "Who does the design work?",
      answers: [
        "Professional designers",
        "Cross-functional teams",
        "Volunteer professionals",
        "BRIDGEGOOD apprentices: emerging designers from groups underrepresented in design, with mentors",
      ],
    },
    {
      question: "How is accessibility treated?",
      answers: ["Often a later step", "Varies by team", "Varies by volunteer", "A requirement from day one, tested with disabled people"],
    },
    {
      question: "Who pays to take part, and what barriers are removed?",
      answers: [
        "Not part of the method",
        "Not part of the method",
        "Volunteers give time. Barriers for the community aren't usually addressed",
        "Apprentices pay no tuition. BRIDGEGOOD also covers things like software, meals and coaching",
      ],
    },
    {
      question: "How are identity, discrimination and conflict handled?",
      answers: [
        "Usually outside the method",
        "Usually outside the method",
        "Rarely discussed",
        "Talked about openly, with trained staff who support people through conflict",
      ],
    },
    {
      question: "What counts as success?",
      answers: ["A usable product", "A tested concept", "The work is delivered", "The community benefits and the designers grow"],
    },
    {
      question: "What happens afterward?",
      answers: ["The product ships", "Handover", "Engagement ends", "Feedback improves the philosophy, and the designers carry it into their careers"],
    },
  ],
}
