/**
 * Company host: a company that hosts mentors, sponsors partner projects, and carries the approach into its own
 * product work. Kept from the earlier prototype as an extra role on top of the community playbook.
 * DRAFT content, to be reviewed with BRIDGEGOOD.
 */
export const HOST_MODULES = [
  {
    title: "Why Design for Social Good",
    format: "Video",
    duration: "10 min",
    summary: "How it differs from corporate social responsibility (CSR) programs and pro bono design, and what it means for your products.",
    outcomes: ["Explain the business and community case"],
  },
  {
    title: "Inclusive design in product teams",
    format: "Workshop",
    duration: "90 min",
    summary: "Apply the four principles to your own roadmap and research practice.",
    outcomes: ["Check one product flow for who it leaves out"],
  },
  {
    title: "Hosting mentors & partner projects",
    format: "One-pager",
    duration: "10 min",
    summary: "What partnering with a chapter involves: time, people and funding.",
    outcomes: ["Scope a partnership"],
  },
  {
    title: "Hiring for potential",
    format: "Self-paced",
    duration: "30 min",
    summary: "Recognize talent from nontraditional paths in portfolios and interviews.",
    outcomes: ["Change one step in how you interview"],
  },
]

export const HOST_EXPLAINER = [
  {
    heading: "What your company gives and gets",
    body: "You give mentors' time, funding or space. You get products tested with more kinds of people, and a wider pool of designers to hire from.",
  },
  { heading: "Respect the community's lead", body: "Partners and communities define problems. Companies support rather than steer." },
  { heading: "Credit and authorship", body: "The philosophy is BRIDGEGOOD's. Partners practice it with attribution." },
]

export const HOST_GIVES = [
  "Mentors' time, prepared with the mentor onboarding guide",
  "Funding for seats, meals, software and transportation",
  "A room for showcases, and introductions to hiring managers",
]

export const HOST_LINE =
  "Company hosts don't choose which problems a chapter takes on, and partner projects are never free work for your company. Say openly if your company could benefit."

/** The company host path. Each stage links to where it happens. */
export const HOST_STAGES = [
  { id: "vetted", title: "Get vetted", summary: "Talk with BRIDGEGOOD staff, and say openly how your company could benefit.", href: "/host/guide#vetted" },
  { id: "make-the-case", title: "Make the case inside your company", summary: "Secure time for mentors, funding for seats and meals, and a room to meet in.", href: "/host/toolkit" },
  { id: "host-mentors", title: "Host mentors", summary: "Bring colleagues in as mentors, and prepare them with the mentor onboarding guide.", href: "/library/mentor-onboarding" },
  { id: "sponsor", title: "Sponsor a partner project", summary: "Fund a project a chapter has already taken on. Partners and the chapter choose the problems, not your company.", href: "/host/projects" },
  { id: "workplace", title: "Bring it to your workplace", summary: "Practice the principles in your own product work, with the Decision Lab and Practice Library.", href: "/host/workplace" },
  { id: "send-back", title: "Send learning back", summary: "Tell BRIDGEGOOD what your company changed in its own product work, and what got in the way.", href: "/playbook/contribute?about=workplace" },
]

export const VETTING = {
  howItWorks:
    "Vetting happens in conversation with BRIDGEGOOD staff, plus references. BRIDGEGOOD makes the final decision. This app never scores or ranks applicants, and AI is never used to vet people.",
  criteria: [
    { name: "Understands the core commitments", lookFor: "Can explain in their own words why the community defines the problem, and why the designers' growth counts as an outcome." },
    { name: "Open about conflicts of interest", lookFor: "Says openly if their employer could benefit, for example by wanting free design work." },
    { name: "A plan to remove barriers", lookFor: "Thinks about how to cover costs for students, such as seats, meals, software and transportation." },
    { name: "Sends learning back to BRIDGEGOOD", lookFor: "Agrees to share what changed, and to credit BRIDGEGOOD as the author of the philosophy." },
    { name: "Protects privacy", lookFor: "Won't collect sensitive personal data about students or community members." },
  ],
  neverAsked: "Vetting never asks about race, ethnicity, gender, income, immigration status, religion or health.",
}
