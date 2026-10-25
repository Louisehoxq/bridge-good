/** The four community roles that practice the philosophy. */
export const ROLES = ["student", "mentor", "ambassador", "partner"] as const

export type CommunityRole = (typeof ROLES)[number]

/** BRIDGEGOOD staff. The steward reviews feedback and is the only role that changes the official wording. */
export const STAFF_ROLES = ["steward"] as const

export const ALL_ROLES = [...ROLES, ...STAFF_ROLES] as const

export type Role = (typeof ALL_ROLES)[number]

/** Two kinds of ambassador share the `ambassador` role key; the session stores which one. */
export const AMBASSADOR_KINDS = ["chapter-lead", "company-host"] as const

export type AmbassadorKind = (typeof AMBASSADOR_KINDS)[number]

export const SESSION_COOKIE = "bgx-session"

export type NavItem = { label: string; href: string }

/** A labeled block of sidebar links. The first group (no label) holds the overview. */
export type NavGroup = { label?: string; items: NavItem[] }

export type DemoAccount = { name: string; detail: string }

type RoleInfo = {
  label: string
  plural: string
  summary: string
  home: string
  /** Their part in the problem → support → design → feedback loop. */
  loopRole: string
  /** Synthetic demo account used by the "Log in as…" screen. */
  demoAccount: DemoAccount
  sidebar: NavGroup[]
}

export const ROLE_INFO: Record<Role, RoleInfo> = {
  student: {
    label: "Apprentice",
    plural: "Apprentices",
    summary: "Learn UI/UX and design thinking on real community problems, and build a portfolio that shows your impact.",
    home: "/student",
    loopRole: "Design with the community and build a portfolio from real work",
    demoAccount: { name: "Ari Santos", detail: "Apprentice, Chicago chapter (synthetic)" },
    sidebar: [
      {
        label: "Your path",
        items: [
          { label: "Your path", href: "/student" },
          { label: "Practice", href: "/student/practice" },
          { label: "Choose a project", href: "/student/projects" },
          { label: "Submissions & feedback", href: "/student/submissions" },
          { label: "Reflection companion", href: "/student/reflection" },
        ],
      },
      {
        label: "Your people",
        items: [
          { label: "My mentor", href: "/student/mentor" },
          { label: "Community of practice", href: "/student/community" },
        ],
      },
    ],
  },
  mentor: {
    label: "Mentor",
    plural: "Mentors",
    summary: "Guide students with care, give feedback that starts from their own reflection, and share what industry really looks like.",
    home: "/mentor",
    loopRole: "Guide students, give feedback, and model the care the philosophy asks for",
    demoAccount: { name: "Jordan Lee", detail: "Product designer and BRIDGEGOOD alum, volunteer mentor (synthetic)" },
    sidebar: [
      { items: [{ label: "Overview", href: "/mentor" }] },
      {
        label: "Your path",
        items: [
          { label: "Prepare", href: "/mentor/prepare" },
          { label: "Growth conversations", href: "/mentor/conversations" },
        ],
      },
      { label: "Your people", items: [{ label: "My mentee", href: "/mentor/mentee" }] },
    ],
  },
  ambassador: {
    label: "Ambassador",
    plural: "Ambassadors",
    summary: "Carry the philosophy to your city or organization, and rally funding, mentors and resources around real problems.",
    home: "/ambassador",
    loopRole: "Bring together the mentors, funding and resources that make the work possible",
    demoAccount: { name: "Priya Raman", detail: "Chapter lead, Chicago chapter (synthetic)" },
    sidebar: [
      { items: [{ label: "Overview", href: "/ambassador" }] },
      {
        label: "Your path",
        items: [
          { label: "Playbook", href: "/ambassador/playbook" },
          { label: "Matching & milestones", href: "/ambassador/matching" },
        ],
      },
      { label: "Your people", items: [{ label: "Partner pipeline", href: "/ambassador/projects" }] },
      { label: "Resources", items: [{ label: "Outreach & partner toolkits", href: "/ambassador/toolkits" }] },
    ],
  },
  partner: {
    label: "Community partner",
    plural: "Community partners",
    summary: "Nonprofits and community organizations share a design problem and work with students and mentors to solve it.",
    home: "/partner",
    loopRole: "Bring the problem and your community's voice, and stay a partner throughout",
    demoAccount: { name: "Eastside Tenants Network", detail: "Tenant advocacy nonprofit, Chicago (synthetic)" },
    sidebar: [
      { items: [{ label: "Overview", href: "/partner" }] },
      {
        label: "Your path",
        items: [
          { label: "Submit a problem", href: "/partner/submit" },
          { label: "My project and team", href: "/partner/project" },
        ],
      },
      {
        label: "Resources",
        items: [
          { label: "Project gallery", href: "/partner/gallery" },
          { label: "Toolkit & FAQs", href: "/partner/toolkit" },
        ],
      },
    ],
  },
  // Milestone 3 (feedback loop): BRIDGEGOOD staff.
  steward: {
    label: "BRIDGEGOOD steward",
    plural: "BRIDGEGOOD stewards",
    summary: "Read every piece of feedback in one inbox, decide with a reason, and keep the framework's official wording and changelog.",
    home: "/steward",
    loopRole: "Listen to everyone using the philosophy, decide what changes, and credit where each change came from",
    demoAccount: { name: "Morgan Ellis", detail: "Program staff, keeps the Design for Social Good framework (synthetic)" },
    sidebar: [
      { items: [{ label: "Inbox", href: "/steward" }] },
      {
        label: "The framework",
        items: [
          { label: "Versions and wording", href: "/steward/framework" },
          { label: "Public changelog", href: "/learn/changelog" },
        ],
      },
      { label: "Community", items: [{ label: "Community events", href: "/events" }] },
    ],
  },
}

/** The two ambassador demo accounts. They share the ambassador area and color; the overview and playbook differ. */
export const AMBASSADOR_KIND_INFO: Record<AmbassadorKind, { label: string; summary: string; demoAccount: DemoAccount }> = {
  "chapter-lead": {
    label: "Chapter lead",
    summary: "Run a local chapter: adapt the philosophy for your community, find partners and mentors, and match teams to projects.",
    demoAccount: ROLE_INFO.ambassador.demoAccount,
  },
  "company-host": {
    label: "Company host",
    summary: "Bring your company in: host mentors, sponsor partner projects, and use the approach in your own product work.",
    demoAccount: { name: "Dana Whitfield", detail: "Company host, design manager at a fintech company (synthetic)" },
  },
}

/** The demo session: a role, plus which kind of ambassador when the role is ambassador. */
export type Session = { role: Role; ambassadorKind?: AmbassadorKind }

/** Label and synthetic account for whoever is signed in. */
export function accountFor(session: Session) {
  if (session.role === "ambassador") {
    const kind = AMBASSADOR_KIND_INFO[session.ambassadorKind ?? "chapter-lead"]
    return { label: kind.label, ...kind.demoAccount }
  }
  return { label: ROLE_INFO[session.role].label, ...ROLE_INFO[session.role].demoAccount }
}

export const PUBLIC_NAV: NavItem[] = [
  { label: "Welcome", href: "/" },
  { label: "Library", href: "/learn" },
  { label: "Events", href: "/events" },
  { label: "Chapters", href: "/chapters" },
]

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ALL_ROLES as readonly string[]).includes(value)
}

export function isAmbassadorKind(value: unknown): value is AmbassadorKind {
  return typeof value === "string" && (AMBASSADOR_KINDS as readonly string[]).includes(value)
}
