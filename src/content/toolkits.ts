/** DRAFT toolkit outlines. Downloads are placeholders until BRIDGEGOOD supplies real templates. */
export type ToolkitSection = { title: string; items: { name: string; description: string; format: string }[] }

export const PROBLEM_OWNER_TOOLKIT: ToolkitSection[] = [
  {
    title: "Recruit",
    items: [
      {
        name: "Who makes a good partner",
        description: "Signs of a strong fit: a real problem, a community the partner already works with and can bring in, and time to take part.",
        format: "Guide",
      },
      { name: "Outreach email & call script", description: "Plain-language invitations for local nonprofits. Adapt the tone to your community.", format: "Template" },
      {
        name: "One-page explainer for partners",
        description: "What a partner project involves (a four-week sprint that ends at Demo Day), what it costs (nothing), and what we ask of you.",
        format: "Handout",
      },
    ],
  },
  {
    title: "Onboard",
    items: [
      {
        name: "Scoping conversation guide",
        description: "Questions that turn a broad need into a problem a student team can work on in four weeks. Pairs with the AI scoping assistant.",
        format: "Guide",
      },
      { name: "Community consent plan", description: "How the partner introduces the team to the people they serve, with consent and care.", format: "Template" },
      { name: "Partnership agreement", description: "Roles, timeline, who owns the work, and what the partner receives at the end.", format: "Template" },
    ],
  },
  {
    title: "Support",
    items: [
      { name: "Check-in rhythm", description: "A 30-minute weekly check-in with the partner, the student team and the mentor during the sprint.", format: "Guide" },
      {
        name: "Handover pack",
        description: "What partners receive after Demo Day: files, documentation, and plain-language notes on how to keep it up to date.",
        format: "Template",
      },
      { name: "Partner feedback survey", description: "Asks how the collaboration felt and whether the result works for the community.", format: "Survey" },
    ],
  },
]

export const ORGANISATION_TOOLKIT: ToolkitSection[] = [
  {
    title: "Make the case",
    items: [
      {
        name: "Business case deck",
        description: "For leadership: how hosting a chapter helps your products work for more people, widens who you hire, and builds trust locally.",
        format: "Slides",
      },
      {
        name: "Budget & funding proposal",
        description:
          "Typical costs for a chapter cohort, and how to fund it from corporate social responsibility (CSR), employee resource group (ERG) or learning and development (L&D) budgets.",
        format: "Template",
      },
    ],
  },
  {
    title: "Engage people",
    items: [
      { name: "Mentor recruitment kit", description: "Internal announcement, FAQ, and what we ask of volunteer mentors.", format: "Kit" },
      { name: "Lunch-and-learn session", description: "A 45-minute intro to Design for Social Good for product teams.", format: "Workshop" },
    ],
  },
  {
    title: "Sustain",
    items: [
      {
        name: "Impact reporting template",
        description: "Report what changed in the community's own words, with evidence, rather than numbers that only look good, like page views.",
        format: "Template",
      },
      { name: "Attribution guidelines", description: "How to credit BRIDGEGOOD's philosophy and the students' work.", format: "Guide" },
    ],
  },
]

/** US-spelling alias for ORGANISATION_TOOLKIT. */
export const ORGANIZATION_TOOLKIT = ORGANISATION_TOOLKIT

/** `draft: true` marks answers that are our estimate until BRIDGEGOOD confirms them. */
export const PARTNER_FAQS: { q: string; a: string; draft?: boolean }[] = [
  {
    q: "Does it cost anything?",
    a: "No. Partner projects are part of apprentices' training. We ask for your time: a kickoff, weekly check-ins, and help connecting with your community.",
  },
  {
    q: "How long does a project take?",
    a: "Four weeks. Partner projects run as a sprint that ends at Demo Day, where the team shows a working prototype and explains its choices to you and to mentors. The scoping assistant and your ambassador help size the problem to fit.",
  },
  {
    q: "What is a capstone?",
    a: "It's the final project in a student's training, where they work on a real problem from a partner like you. On this site, \"capstone\" and \"partner project\" mean the same thing.",
  },
  {
    q: "How many hours will it take from us?",
    a: "Plan for about 1 to 2 hours a week over the four weeks: a 1-hour kickoff, a 30-minute weekly check-in, help setting up two or three conversations with community members, and Demo Day. This is our draft estimate. BRIDGEGOOD will confirm it.",
    draft: true,
  },
  {
    q: "Who can submit a problem?",
    a: "Nonprofits, community groups and public services that work directly with a community. The problem should be real, affect people you already serve, and be small enough for four weeks. You'll need one person who can take part throughout, and a way for the team to hear from community members, with their consent. We don't take on projects that are mainly free work for a well-funded company. This is our draft wording. BRIDGEGOOD makes the final call on every project.",
    draft: true,
  },
  {
    q: "Who owns the final work?",
    a: "The partnership agreement sets this out. Usually you get full rights to use what the team makes, and students may show it in their portfolios with your permission.",
  },
  {
    q: "What happens after Demo Day? Who keeps it running?",
    a: "You get a handover pack: the files, notes on how it works, and plain-language steps for updating it. The team designs with tools your staff can keep up, and says what upkeep it will need. The student team doesn't provide ongoing support after the sprint, so tell us early how much time your staff has for upkeep. Your ambassador can help you find support later. This is our draft wording. BRIDGEGOOD will confirm it.",
    draft: true,
  },
  {
    q: "We don't have a design brief. Is that OK?",
    a: "Yes. Describe what isn't working in plain language. The scoping assistant helps turn it into a brief, and a person at BRIDGEGOOD reviews it.",
  },
  {
    q: "What happens to screenshots I add?",
    a: "Screenshots you add to the scoping assistant are sent to the AI service with your message, so it can describe what it sees. They show in your chat in this browser, and they aren't saved with your brief. Before you add one, crop or cover names, faces, case numbers, addresses and anything else that could identify a person. The assistant is told to leave personal details out of the brief. BRIDGEGOOD will confirm how long the AI service keeps images.",
    draft: true,
  },
  {
    q: "How do you protect the people we serve?",
    a: "Community research needs consent. No personal stories or images are used without explicit permission, and you decide how the team meets your community.",
  },
  {
    q: "What if the result isn't right for our community?",
    a: "Tell us. Feedback is part of the process, and teams make changes before handover.",
  },
]

export const LEGAL_TEMPLATES = [
  { name: "Partnership agreement", description: "Roles, timeline, what the team delivers, and who is responsible for what." },
  { name: "Intellectual property & portfolio permissions", description: "Who owns the work, and how students can show it." },
  { name: "Community research consent form", description: "Plain-language consent for interviews and testing, which people can take back at any time." },
  { name: "Grant application budget template", description: "Standard budget lines for funding design work." },
  { name: "Volunteer & mentor agreement", description: "What we ask of volunteers, how we keep people safe, and our code of conduct." },
]
