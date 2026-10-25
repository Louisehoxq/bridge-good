/** DRAFT toolkit outlines. Downloads are placeholders until BRIDGEGOOD supplies real templates. */
export type ToolkitSection = { title: string; items: { name: string; description: string; format: string }[] }

export const PROBLEM_OWNER_TOOLKIT: ToolkitSection[] = [
  {
    title: "Recruit",
    items: [
      { name: "Who makes a good partner", description: "Signs of a strong fit: a real problem, an underserved community, and time to collaborate.", format: "Checklist" },
      { name: "Outreach email & call script", description: "Plain-language invitations for local non-profits. Adapt the tone to your community.", format: "Template" },
      { name: "One-page explainer for partners", description: "What a capstone involves, what it costs (nothing), and what's expected.", format: "Handout" },
    ],
  },
  {
    title: "Onboard",
    items: [
      { name: "Scoping conversation guide", description: "Questions to turn a broad need into a capstone-sized problem. Pairs with the AI scoping assistant.", format: "Guide" },
      { name: "Community consent plan", description: "How the partner introduces the team to the people they serve, with consent and care.", format: "Template" },
      { name: "Partnership agreement", description: "Roles, timeline, IP and handover expectations.", format: "Template" },
    ],
  },
  {
    title: "Support",
    items: [
      { name: "Check-in rhythm", description: "Fortnightly check-ins with the partner, the student team and the mentor.", format: "Guide" },
      { name: "Handover pack", description: "What partners receive at the end: files, documentation and maintenance notes.", format: "Checklist" },
      { name: "Partner feedback survey", description: "Captures how the collaboration felt and whether the result works for the community.", format: "Survey" },
    ],
  },
]

export const ORGANISATION_TOOLKIT: ToolkitSection[] = [
  {
    title: "Make the case",
    items: [
      { name: "Business case deck", description: "Inclusive products, a stronger talent pipeline, and community trust, framed for leadership.", format: "Slides" },
      { name: "Budget & funding proposal", description: "Typical costs for a chapter cohort, and how to fund it from CSR, ERG or L&D budgets.", format: "Template" },
    ],
  },
  {
    title: "Engage people",
    items: [
      { name: "Mentor recruitment kit", description: "Internal announcement, FAQ, and expectations for volunteer mentors.", format: "Kit" },
      { name: "Lunch-and-learn session", description: "A 45-minute intro to Design for Social Good for product teams.", format: "Workshop" },
    ],
  },
  {
    title: "Sustain",
    items: [
      { name: "Impact reporting template", description: "Report outcomes in the community's terms, not vanity metrics.", format: "Template" },
      { name: "Attribution guidelines", description: "How to credit BRIDGEGOOD's philosophy and the students' work.", format: "Guide" },
    ],
  },
]

export const PARTNER_FAQS: { q: string; a: string }[] = [
  { q: "Does it cost anything?", a: "No. Capstones are part of students' learning. We ask for your time: a kickoff, regular check-ins, and help connecting with your community." },
  { q: "How long does a capstone take?", a: "Usually 8–12 weeks, depending on scope. The scoping assistant and your ambassador help size it." },
  { q: "Who owns the final work?", a: "The partnership agreement sets this out. Typically you receive full rights to use the deliverables, and students may show it in portfolios with your permission." },
  { q: "We don't have a design brief. Is that OK?", a: "Yes. Describe what isn't working in plain language. The scoping assistant helps turn it into a brief, and a person at BRIDGEGOOD reviews it." },
  { q: "How do you protect the people we serve?", a: "Community research needs consent. No personal stories or images are used without explicit permission, and you decide how the team meets your community." },
  { q: "What if the result isn't right for our community?", a: "Tell us. Feedback is part of the process, and teams iterate before handover." },
]

export const LEGAL_TEMPLATES = [
  { name: "Partnership agreement", description: "Roles, timeline, deliverables and responsibilities." },
  { name: "Intellectual property & portfolio permissions", description: "Who owns what, and how students can show the work." },
  { name: "Community research consent form", description: "Plain-language, revocable consent for interviews and testing." },
  { name: "Grant application budget template", description: "Standard budget lines for funding design capacity." },
  { name: "Volunteer & mentor agreement", description: "Expectations, safeguarding and code of conduct." },
]
