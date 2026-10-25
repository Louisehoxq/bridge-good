export const ARCHETYPES = ["student", "ambassador", "problem-owner"] as const

export type Archetype = (typeof ARCHETYPES)[number]

export const ARCHETYPE_COOKIE = "bgx-archetype"

type ArchetypeInfo = {
  label: string
  /** How the visitor would describe themselves on the chooser. */
  iAm: string
  summary: string
  href: string
  /** Their part in the problem → people → work → feedback loop. */
  loopRole: string
  nav: { label: string; href: string }[]
}

export const ARCHETYPE_INFO: Record<Archetype, ArchetypeInfo> = {
  student: {
    label: "Students & early-career designers",
    iAm: "I want to learn design and build a career doing work that matters",
    summary:
      "Learn UI/UX and design thinking by working on real problems from community organisations, with mentors from industry and a portfolio that shows what you changed.",
    href: "/students",
    loopRole: "Do the design work with the community, and build your portfolio from it",
    nav: [
      { label: "Your path", href: "#path" },
      { label: "Open projects", href: "#projects" },
      { label: "Portfolio", href: "#portfolio" },
      { label: "Careers", href: "#careers" },
    ],
  },
  ambassador: {
    label: "Ambassadors",
    iAm: "I want to bring Design for Social Good to my city or organisation",
    summary:
      "Learn the philosophy and frameworks, adapt them for your community, and rally funding, mentors and resources around problems that matter locally.",
    href: "/ambassadors",
    loopRole: "Bring together the mentors, funding and resources that make the work possible",
    nav: [
      { label: "Philosophy", href: "#philosophy" },
      { label: "Playbook", href: "#playbook" },
      { label: "Needs a sponsor", href: "#problems" },
      { label: "Get involved", href: "#apply" },
    ],
  },
  "problem-owner": {
    label: "Problem owners",
    iAm: "My organisation has a problem that better design could help solve",
    summary:
      "Non-profits and social organisations can share a design challenge, from a website to an accessible service, and work with students and mentors to solve it with your community.",
    href: "/problem-owners",
    loopRole: "Bring the problem and your community's voice, and stay a partner throughout",
    nav: [
      { label: "What's possible", href: "#possible" },
      { label: "What to expect", href: "#expect" },
      { label: "Share a problem", href: "#submit" },
    ],
  },
}

export function isArchetype(value: unknown): value is Archetype {
  return typeof value === "string" && (ARCHETYPES as readonly string[]).includes(value)
}
